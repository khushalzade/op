<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Updates;

use Piwik\Common;
use Piwik\Config;
use Piwik\Db;
use Piwik\Updater;
use Piwik\Updates;

class Updates_5_2_0_b2 extends Updates
{
    public function doUpdate(Updater $updater)
    {
        $config = Config::getInstance();
        $dbConfig = $config->database;

        if (!empty($dbConfig['collation'])) {
            // config already set, nothing to do
            return;
        }

        if (!is_writable(Config::getLocalConfigPath())) {
            // rely on the system check if config is not writable
            return;
        }

        try {
            $db = Db::get();
            $userTable = Common::prefixTable('user');
            $userTableStatus = $db->fetchRow('SHOW TABLE STATUS WHERE Name = ?', [$userTable]);
            $connectionCollation = $db->fetchOne('SELECT @@collation_connection');

            if (
                empty($userTableStatus['Collation'])
                || empty($connectionCollation)
                || $userTableStatus['Collation'] !== $connectionCollation
            ) {
                // skip config update if user table and connection have different collations
                return;
            }

            $dbConfig['collation'] = $connectionCollation;
            $config->database = $dbConfig;
            $config->forceSave();
        } catch (\Exception $e) {
            // rely on the system check if detection failed
        }
    }
}
