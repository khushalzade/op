<?php
/**
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\Referrers;

use Piwik\Common;
use Piwik\DataTable;
use Piwik\FrontController;
use Piwik\Piwik;
use Piwik\Plugins\CoreVisualizations\Visualizations\Sparklines;
use Piwik\SettingsPiwik;
use Piwik\Translation\Translator;

/**
 *
 */
class Controller extends \Piwik\Plugin\Controller
{
    /**
     * @var Translator
     */
    private $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;

        parent::__construct();
    }

    public function getSparklines()
    {
        $_GET['forceView'] = '1';
        $_GET['viewDataTable'] = Sparklines::ID;

        return FrontController::getInstance()->fetchDispatch('Referrers', 'get');
    }

    public function getEvolutionGraph($typeReferrer = false, array $columns = array(), array $defaultColumns = array())
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, 'Referrers.getReferrerType');

        $view->config->add_total_row = true;

        // configure displayed columns
        if (empty($columns)) {
            $columns = Common::getRequestVar('columns', false);
            if (false !== $columns) {
                $columns = Piwik::getArrayFromApiParameter($columns);
            }
        }
        if (false !== $columns) {
            $columns = !is_array($columns) ? array($columns) : $columns;
        }

        if (!empty($columns)) {
            $view->config->columns_to_display = $columns;
        } elseif (empty($view->config->columns_to_display) && !empty($defaultColumns)) {
            $view->config->columns_to_display = $defaultColumns;
        }

        // configure selectable columns
        $period = Common::getRequestVar('period', false);

        if (SettingsPiwik::isUniqueVisitorsEnabled($period)) {
            $selectable = array('nb_visits', 'nb_uniq_visitors', 'nb_users', 'nb_actions');
        } else {
            $selectable = array('nb_visits', 'nb_actions');
        }
        $view->config->selectable_columns = $selectable;

        // configure displayed rows
        $visibleRows = Common::getRequestVar('rows', false);
        if ($visibleRows !== false) {
            // this happens when the row picker has been used
            $visibleRows = Piwik::getArrayFromApiParameter($visibleRows);
            $visibleRows = array_map('urldecode', $visibleRows);

            // typeReferrer is redundant if rows are defined, so make sure it's not used
            $view->config->custom_parameters['typeReferrer'] = false;
        } else {
            // use $typeReferrer as default
            if ($typeReferrer === false) {
                $typeReferrer = Common::getRequestVar('typeReferrer', Common::REFERRER_TYPE_DIRECT_ENTRY);
            }

            if (!empty($view->config->rows_to_display)) {
                $visibleRows = $view->config->rows_to_display;
            } else {
                $visibleRows = array($typeReferrer, 'total');
            }

            $view->requestConfig->request_parameters_to_modify['rows'] = $typeReferrer . ',total';
        }

        // We need to configure a custom set of selectable rows
        // by default this would be generated using the label, but as the label is different in each language we use the
        // referrer_type metadata for identification instead. This is the same across languages.
        $view->config->filters[] = function ($dataTable) use ($view, $visibleRows) {
            /** @var DataTable $dataTable */

            foreach ($dataTable->getRows() as $row) {
                $rowLabel = $row->getColumn('label');
                $rowType = (string) $row->getMetadata('referrer_type'); // needs to be a string for comparison in javascript

                if (false === $rowLabel) {
                    continue;
                }

                // build config
                if (!isset($view->selectableRows[$rowLabel])) {
                    $view->selectableRows[$rowType] = [
                        'label'     => $rowLabel,
                        'matcher'   => $rowType,
                        'displayed' => in_array($rowType, $visibleRows)
                    ];
                }
            }

            $view->selectableRows['total'] = [
                'label'     => Piwik::translate('General_Total'),
                'matcher'   => 'total',
                'displayed' => in_array('total', $visibleRows)
            ];
        };

        $translatedRows = array_map(function($row) {
            if (is_numeric($row)) {
                return self::getTranslatedReferrerTypeLabel($row);
            } else if ($row === 'total') {
                return Piwik::translate('General_Total');
            }
            return $row;
        }, $visibleRows);

        $view->config->row_picker_match_rows_by = false;
        $view->config->rows_to_display = $translatedRows;

        $view->config->documentation = $this->translator->translate('Referrers_EvolutionDocumentation') . '<br />'
            . $this->translator->translate('General_BrokenDownReportDocumentation') . '<br />'
            . $this->translator->translate('Referrers_EvolutionDocumentationMoreInfo', '&quot;'
                . $this->translator->translate('Referrers_ReferrerTypes') . '&quot;');

        return $this->renderView($view);
    }

    public function getLastDistinctSearchEnginesGraph()
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, "Referrers.getNumberOfDistinctSearchEngines");
        $view->config->translations['Referrers_distinctSearchEngines'] = ucfirst($this->translator->translate('Referrers_DistinctSearchEngines'));
        $view->config->columns_to_display = array('Referrers_distinctSearchEngines');
        return $this->renderView($view);
    }

    public function getLastDistinctSocialNetworksGraph()
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, "Referrers.getNumberOfDistinctSocialNetworks");
        $view->config->translations['Referrers_distinctSocialNetworks'] = ucfirst($this->translator->translate('Referrers_DistinctSocialNetworks'));
        $view->config->columns_to_display = array('Referrers_distinctSocialNetworks');
        return $this->renderView($view);
    }

    public function getLastDistinctKeywordsGraph()
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, "Referrers.getNumberOfDistinctKeywords");
        $view->config->translations['Referrers_distinctKeywords'] = ucfirst($this->translator->translate('Referrers_DistinctKeywords'));
        $view->config->columns_to_display = array('Referrers_distinctKeywords');
        return $this->renderView($view);
    }

    public function getLastDistinctWebsitesGraph()
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, "Referrers.getNumberOfDistinctWebsites");
        $view->config->translations['Referrers_distinctWebsites'] = ucfirst($this->translator->translate('Referrers_DistinctWebsites'));
        $view->config->columns_to_display = array('Referrers_distinctWebsites');
        return $this->renderView($view);
    }

    public function getLastDistinctCampaignsGraph()
    {
        $view = $this->getLastUnitGraph($this->pluginName, __FUNCTION__, "Referrers.getNumberOfDistinctCampaigns");
        $view->config->translations['Referrers_distinctCampaigns'] = ucfirst($this->translator->translate('Referrers_DistinctCampaigns'));
        $view->config->columns_to_display = array('Referrers_distinctCampaigns');
        return $this->renderView($view);
    }

    /**
     * Returns the i18n-ized label for a referrer type.
     *
     * @param int $typeReferrer The referrer type. Referrer types are defined in Common class.
     * @return string The i18n-ized label.
     */
    public static function getTranslatedReferrerTypeLabel($typeReferrer)
    {
        $label = getReferrerTypeLabel($typeReferrer);
        return Piwik::translate($label);
    }

}
