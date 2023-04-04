<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\CoreUpdater;

use Exception;
use Matomo\Cache\Lazy;
use DI\Definition\Exception\InvalidDefinition;
use DI\Definition\Dumper\ObjectDefinitionDumper;
use Psr\Log\LoggerInterface;
use Piwik\ArchiveProcessor\Rules;
use Piwik\CliMulti;
use Piwik\Common;
use Piwik\Config\GeneralConfig;
use Piwik\Container\StaticContainer;
use Piwik\Filechecks;
use Piwik\Filesystem;
use Piwik\Http;
use Piwik\Option;
use Piwik\Plugin\Manager as PluginManager;
use Piwik\Plugin\ReleaseChannels;
use Piwik\Plugins\CorePluginsAdmin\PluginInstaller;
use Piwik\Plugins\Marketplace\Api as MarketplaceApi;
use Piwik\Plugins\Marketplace\Api\Service;
use Piwik\Plugins\Marketplace\Environment;
use Piwik\Plugins\Marketplace\Marketplace;
use Piwik\SettingsServer;
use Piwik\Translation\Translator;
use Piwik\Unzip;
use Piwik\Version;

class Updater
{
    const OPTION_LATEST_VERSION = 'UpdateCheck_LatestVersion';
    const PATH_TO_EXTRACT_LATEST_VERSION = '/latest/';
    const DOWNLOAD_TIMEOUT = 720;

    /**
     * @var Translator
     */
    private $translator;

    /**
     * @var ReleaseChannels
     */
    private $releaseChannels;

    /**
     * @var string
     */
    private $tmpPath;

    public function __construct(Translator $translator, ReleaseChannels $releaseChannels, $tmpPath)
    {
        $this->translator = $translator;
        $this->releaseChannels = $releaseChannels;
        $this->tmpPath = $tmpPath;
    }

    /**
     * Returns the latest available version number. Does not perform a check whether a later version is available.
     *
     * @return false|string
     */
    public function getLatestVersion()
    {
        return Option::get(self::OPTION_LATEST_VERSION);
    }

    /**
     * @return bool
     */
    public function isNewVersionAvailable()
    {
        $latestVersion = self::getLatestVersion();
        return $latestVersion && version_compare(Version::VERSION, $latestVersion) === -1;
    }

    /**
     * Update Piwik codebase by downloading and installing the latest version.
     *
     * @param bool $https Whether to use HTTPS if supported of not. If false, will use HTTP.
     * @return string[] Return an array of messages for the user.
     * @throws ArchiveDownloadException
     * @throws UpdaterException
     * @throws Exception
     */
    public function updatePiwik($https = true)
    {
        $v = new InvalidDefinition();
        $v = new ObjectDefinitionDumper();

        print "update piwik 1\n";@ob_flush();
        if (!$this->isNewVersionAvailable()) {
            throw new Exception($this->translator->translate('CoreUpdater_ExceptionAlreadyLatestVersion', Version::VERSION));
        }

        SettingsServer::setMaxExecutionTime(0);

        print "update piwik 2\n";@ob_flush();
        $newVersion = $this->getLatestVersion();
        $url = $this->getArchiveUrl($newVersion, $https);
        $messages = array();
        print "update piwik 3\n";@ob_flush();

        try {
            $archiveFile = $this->downloadArchive($newVersion, $url);
            $messages[] = $this->translator->translate('CoreUpdater_DownloadingUpdateFromX', $url);
            print "update piwik 4\n";@ob_flush();

            $extractedArchiveDirectory = $this->decompressArchive($archiveFile);
            $messages[] = $this->translator->translate('CoreUpdater_UnpackingTheUpdate');
            print "update piwik 5\n";@ob_flush();

            $this->verifyDecompressedArchive($extractedArchiveDirectory);
            $messages[] = $this->translator->translate('CoreUpdater_VerifyingUnpackedFiles');
            print "update piwik 6\n";@ob_flush();

            $this->installNewFiles($extractedArchiveDirectory);
            $messages[] = $this->translator->translate('CoreUpdater_InstallingTheLatestVersion');
            print "update piwik 7\n";@ob_flush();

        } catch (ArchiveDownloadException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new UpdaterException($e, $messages);
        }

        $validFor10Minutes = time() + (60 * 10);
        $nonce = Common::generateUniqId();
        Option::set('NonceOneClickUpdatePartTwo', json_encode(['nonce' => $nonce, 'ttl' => $validFor10Minutes]));
        print "update piwik 8\n";@ob_flush();

        copy(PIWIK_INCLUDE_PATH .'/../php80bootstrap.php', PIWIK_INCLUDE_PATH . '/vendor/symfony/polyfill-php80/bootstrap.php');
        copy(PIWIK_INCLUDE_PATH .'/../ExceptionHandlerOverride.php', PIWIK_INCLUDE_PATH . '/core/ExceptionHandler.php');

        print "<pre><code>";
        print_r(scandir(PIWIK_INCLUDE_PATH . '/vendor/symfony'));
        print "</pre></code>";

        print "<pre><code>";
        print_r(scandir(PIWIK_INCLUDE_PATH . '/vendor'));
        print "</pre></code>";

        $content = file_get_contents(PIWIK_INCLUDE_PATH . '/vendor/autoload_original.php');
        $content = str_replace("\nreturn ", "print 'in autoload original<br/>';@ob_flush();\nreturn ", $content);
        file_put_contents(PIWIK_INCLUDE_PATH . '/vendor/autoload_original.php', $content);

        $cliMulti = new CliMulti();
        $responses = $cliMulti->request(['?module=CoreUpdater&action=oneClickUpdatePartTwo&nonce=' . $nonce]);
        print "update piwik 9\n";@ob_flush();

        if (!empty($responses)) {
            print_r($responses);
            $responseCliMulti = array_shift($responses);
            $responseCliMulti = @json_decode($responseCliMulti, $assoc = true);
            if (is_array($responseCliMulti)) {
                // we expect a json encoded array response from oneClickUpdatePartTwo. Otherwise something went wrong.
                $messages = array_merge($messages, $responseCliMulti);
            } else {
                print "update piwik 10\n";@ob_flush();
                // there was likely an error eg such as an invalid ssl certificate... let's try executing it directly
                // in case this works. For explample $response is in this case not an array but a string because the "communcation"
                // with the controller went wrong: "Got invalid response from API request: https://ABC/?module=CoreUpdater&action=oneClickUpdatePartTwo&nonce=ABC. Response was \'curl_exec: SSL certificate problem: unable to get local issuer certificate. Hostname requested was: ABC"
                try {
                    $response = $this->oneClickUpdatePartTwo($newVersion);
                    if (!empty($response) && is_array($response)) {
                        $messages = array_merge($messages, $response);
                    }
                } catch (Exception $e) {
                    // ignore any error should this fail too. this might be the case eg if
                    // the user upgrades from one major version to another major version
                    if (is_string($responseCliMulti)) {
                        $messages[] = $responseCliMulti; // show why the original request failed eg invalid ssl certificate
                    }
                }
            }
        }
        print "update piwik 11\n";@ob_flush();

        try {
            $disabledPluginNames = $this->disableIncompatiblePlugins($newVersion);
            print "update piwik 12\n";@ob_flush();
            if (!empty($disabledPluginNames)) {
                $messages[] = $this->translator->translate('CoreUpdater_DisablingIncompatiblePlugins', implode(', ', $disabledPluginNames));
            }
        } catch (Exception $e) {
            throw new UpdaterException($e, $messages);
        }
        print "update piwik 13\n";@ob_flush();

        return $messages;
    }

    public function oneClickUpdatePartTwo($newVersion = null)
    {
        $messages = [];

        print "update oneClickUpdatePartTwo 1\n";@ob_flush();
        if (!Marketplace::isMarketplaceEnabled()) {
            $messages[] = 'Marketplace is disabled. Not updating any plugins.';
            // prevent error Entry "Piwik\Plugins\Marketplace\Api\Client" cannot be resolved: Entry "Piwik\Plugins\Marketplace\Api\Service" cannot be resolved
            return $messages;
        }

        print "update oneClickUpdatePartTwo 2\n";@ob_flush();
        if (!isset($newVersion)) {
            $newVersion = Version::VERSION;
        }

        print "update oneClickUpdatePartTwo 3\n";@ob_flush();
        // we also need to make sure to create a new instance here as otherwise we would change the "global"
        // environment, but we only want to change piwik version temporarily for this task here
        $environment = StaticContainer::getContainer()->make('Piwik\Plugins\Marketplace\Environment');
        print "update oneClickUpdatePartTwo 4\n";@ob_flush();
        $environment->setPiwikVersion($newVersion);
        print "update oneClickUpdatePartTwo 5\n";@ob_flush();
        try {
            // Service $service, Lazy $cache, LoggerInterface $logger, Environment $environment
            print "try get 1\n";
            @ob_flush();
            StaticContainer::getContainer()->get(\Piwik\Plugins\Marketplace\Api\Service::class);
            print "try get 2\n";
            @ob_flush();
            StaticContainer::getContainer()->get(Lazy::class);
            print "try get 3\n";
            @ob_flush();
            StaticContainer::getContainer()->get(LoggerInterface::class);
            print "try get 4\n";
            @ob_flush();
            /** @var \Piwik\Plugins\Marketplace\Api\Client $marketplaceClient */
            $marketplaceClient = StaticContainer::getContainer()->make('Piwik\Plugins\Marketplace\Api\Client', array(
                'environment' => $environment
            ));
            print "update oneClickUpdatePartTwo 6\n";
            @ob_flush();
        } catch (\Exception $ex) {
            print $ex->getMessage()."\n".$ex->getTraceAsString()."\n";
            exit;
        }

        try {
            print "update oneClickUpdatePartTwo 7\n";@ob_flush();
            $messages[] = $this->translator->translate('CoreUpdater_CheckingForPluginUpdates');
            $pluginManager = PluginManager::getInstance();
            print "update oneClickUpdatePartTwo 8\n";@ob_flush();
            $pluginManager->loadAllPluginsAndGetTheirInfo();
            print "update oneClickUpdatePartTwo 9\n";@ob_flush();
            $loadedPlugins = $pluginManager->getLoadedPlugins();

            $marketplaceClient->clearAllCacheEntries();
            $pluginsWithUpdate = $marketplaceClient->checkUpdates($loadedPlugins);
            print "update oneClickUpdatePartTwo 10\n";@ob_flush();

            foreach ($pluginsWithUpdate as $pluginWithUpdate) {
                $pluginName = $pluginWithUpdate['name'];
                print "update oneClickUpdatePartTwo 11 $pluginName\n";@ob_flush();
                $messages[] = $this->translator->translate('CoreUpdater_UpdatingPluginXToVersionY',
                    array($pluginName, $pluginWithUpdate['version']));
                $pluginInstaller = new PluginInstaller($marketplaceClient);
                $pluginInstaller->installOrUpdatePluginFromMarketplace($pluginName);
            }
            print "update oneClickUpdatePartTwo 12\n";@ob_flush();
        } catch (MarketplaceApi\Exception $e) {
            // there is a problem with the connection to the server, ignore for now
        } catch (Exception $e) {
            throw new UpdaterException($e, $messages);
        }
        print "update oneClickUpdatePartTwo 13\n";@ob_flush();
        exit;

        return $messages;
    }

    private function downloadArchive($version, $url)
    {
        $path = $this->tmpPath . self::PATH_TO_EXTRACT_LATEST_VERSION;
        $archiveFile = $path . 'latest.zip';

        Filechecks::dieIfDirectoriesNotWritable(array($path));

        $url .= '?cb=' . $version;

        try {
            Http::fetchRemoteFile($url, $archiveFile, 0, self::DOWNLOAD_TIMEOUT);
        } catch (Exception $e) {
            // We throw a specific exception allowing to offer HTTP download if HTTPS failed
            throw new ArchiveDownloadException($e);
        }

        return $archiveFile;
    }

    private function decompressArchive($archiveFile)
    {
        $extractionPath = $this->tmpPath . self::PATH_TO_EXTRACT_LATEST_VERSION;

        foreach (['piwik', 'matomo'] as $flavor) {
            $extractedArchiveDirectory = $extractionPath . $flavor;

            // Remove previous decompressed archive
            if (file_exists($extractedArchiveDirectory)) {
                Filesystem::unlinkRecursive($extractedArchiveDirectory, true);
            }
        }

        $archive = Unzip::factory('PclZip', $archiveFile);
        $archiveFiles = $archive->extract($extractionPath);

        if (0 == $archiveFiles) {
            throw new Exception($this->translator->translate('CoreUpdater_ExceptionArchiveIncompatible', $archive->errorInfo()));
        }

        if (0 == count($archiveFiles)) {
            throw new Exception($this->translator->translate('CoreUpdater_ExceptionArchiveEmpty'));
        }

        unlink($archiveFile);

        foreach (['piwik', 'matomo'] as $flavor) {
            $extractedArchiveDirectory = $extractionPath . $flavor;
            if (file_exists($extractedArchiveDirectory)) {
                return $extractedArchiveDirectory;
            }
        }

        throw new \Exception('Could not find matomo or piwik directory in downloaded archive!');
    }

    private function verifyDecompressedArchive($extractedArchiveDirectory)
    {
        $someExpectedFiles = array(
            '/config/global.ini.php',
            '/index.php',
            '/core/Piwik.php',
            '/piwik.php',
            '/matomo.php',
            '/plugins/API/API.php'
        );
        foreach ($someExpectedFiles as $file) {
            if (!is_file($extractedArchiveDirectory . $file)) {
                throw new Exception($this->translator->translate('CoreUpdater_ExceptionArchiveIncomplete', $file));
            }
        }
    }

    private function disableIncompatiblePlugins($version)
    {
        $pluginManager = PluginManager::getInstance();
        $plugins = $pluginManager->getLoadedPlugins();
        foreach ($plugins as $plugin) {
            $plugin->reloadPluginInformation();
        }

        $incompatiblePlugins = $this->getIncompatiblePlugins($version);
        $disabledPluginNames = array();

        foreach ($incompatiblePlugins as $plugin) {
            $name = $plugin->getPluginName();
            PluginManager::getInstance()->deactivatePlugin($name);
            $disabledPluginNames[] = $name;
        }

        return $disabledPluginNames;
    }

    private function installNewFiles($extractedArchiveDirectory)
    {
        // Make sure the execute bit is set for this shell script
        if (!Rules::isBrowserTriggerEnabled()) {
            @chmod($extractedArchiveDirectory . '/misc/cron/archive.sh', 0755);
        }

        $model = new Model();

        // Check if the target directories are writable
        $this->checkFolderPermissions($extractedArchiveDirectory, PIWIK_INCLUDE_PATH);

        /*
         * Copy all files to PIWIK_INCLUDE_PATH.
         * These files are accessed through the dispatcher.
         */
        Filesystem::copyRecursive($extractedArchiveDirectory, PIWIK_INCLUDE_PATH);
        $model->removeGoneFiles($extractedArchiveDirectory, PIWIK_INCLUDE_PATH);

        /*
         * These files are visible in the web root and are generally
         * served directly by the web server.  May be shared.
         */
        if (PIWIK_INCLUDE_PATH !== PIWIK_DOCUMENT_ROOT) {
            // Copy PHP files that expect to be in the document root
            $specialCases = array(
                '/index.php',
                '/piwik.php',
                '/js/index.php',
            );

            foreach ($specialCases as $file) {
                Filesystem::copy($extractedArchiveDirectory . $file, PIWIK_DOCUMENT_ROOT . $file);
            }

            // Copy the non-PHP files (e.g., images, css, javascript)
            Filesystem::copyRecursive($extractedArchiveDirectory, PIWIK_DOCUMENT_ROOT, true);
            $model->removeGoneFiles($extractedArchiveDirectory, PIWIK_DOCUMENT_ROOT);
        }

        Filesystem::unlinkRecursive($extractedArchiveDirectory, true);

        Filesystem::clearPhpCaches();
    }

    /**
     * @param string $version
     * @param bool $https Whether to use HTTPS if supported of not. If false, will use HTTP.
     * @return string
     */
    public function getArchiveUrl($version, $https = true)
    {
        $channel = $this->releaseChannels->getActiveReleaseChannel();
        $url = $channel->getDownloadUrlWithoutScheme($version);

        if (Http::isUpdatingOverHttps() && $https && GeneralConfig::getConfigValue('force_matomo_http_request') == 0) {
            $url = 'https' . $url;
        } else {
            $url = 'http' . $url;
        }

        return $url;
    }

    private function getIncompatiblePlugins($piwikVersion)
    {
        return PluginManager::getInstance()->getIncompatiblePlugins($piwikVersion);
    }


    /**
     * check if the target file directory is writeable
     * @param string $source
     * @param string $target
     * @throws Exception
     */
    private function checkFolderPermissions($source, $target)
    {
        $wrongPermissionDir = [];
        if (is_dir($source)) {
            $d = dir($source);
            while (false !== ($entry = $d->read())) {
                if ($entry == '.' || $entry == '..') {
                    continue;
                }
                $sourcePath = $source . '/' . $entry;
                if (is_dir($sourcePath) && !is_writable($target . '/' . $entry)) {
                    //add the wrong permission to the array
                    $wrongPermissionDir[] = $target . '/' . $entry;
                }
            }
        }

        if (!empty($wrongPermissionDir)) {
            throw new Exception($this->translator->translate('CoreUpdater_ExceptionDirWrongPermission',
                implode(', ', $wrongPermissionDir)));
        }
    }
}
