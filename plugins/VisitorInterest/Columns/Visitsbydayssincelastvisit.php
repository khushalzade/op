<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\VisitorInterest\Columns;

use Piwik\Piwik;
use Piwik\Plugin\VisitDimension;
use Piwik\Tracker\Action;
use Piwik\Tracker\Request;

class Visitsbydayssincelastvisit extends VisitDimension
{
    protected $fieldName = 'visitor_days_since_last';
    protected $fieldType = 'SMALLINT(5) UNSIGNED NOT NULL';

    public function getName()
    {
        return Piwik::translate('VisitorInterest_VisitsByDaysSinceLast');
    }

    /**
     * @param Request $request
     * @param array   $visit
     * @param Action|null $action
     * @return int
     */
    public function onNewVisit(Request $request, $visit, $action)
    {
        return $request->getDaysSinceLastVisit();
    }

}