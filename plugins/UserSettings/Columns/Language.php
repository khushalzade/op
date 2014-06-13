<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\UserSettings\Columns;

use Piwik\Piwik;
use Piwik\Plugin\VisitDimension;
use Piwik\Tracker\Action;
use Piwik\Tracker\Request;

class Language extends VisitDimension
{
    protected $fieldName = 'location_browser_lang';
    protected $fieldType = 'VARCHAR(20) NOT NULL';

    public function getName()
    {
        return Piwik::translate('General_Language');
    }

    /**
     * @param Request $request
     * @param array   $visit
     * @param Action|null $action
     * @return int
     */
    public function onNewVisit(Request $request, $visit, $action)
    {
        return substr($request->getBrowserLanguage(), 0, 20);
    }
}