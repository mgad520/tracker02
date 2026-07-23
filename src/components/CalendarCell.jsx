import PhaseBadge from './PhaseBadge';
import { getPhaseLabel } from '../utils/cycleLogic';

function CalendarCell({ item, selected, currentCycleDay, onSelect }) {
  const isCurrentDay = item.day === currentCycleDay;
  const isPeriodDay = item.day >= 1 && item.day <= 6;
  const isFertileWindow = item.day >= 11 && item.day <= 16;
  const phaseLabel = getPhaseLabel(item.phase);

  return (
    <button
      type="button"
      className={`calendar-cell ${selected ? 'selected' : ''} ${isCurrentDay ? 'current-day' : ''} ${item.isOvulationDay ? 'ovulation-day' : ''} ${isFertileWindow ? 'fertile-window' : ''} ${isPeriodDay ? 'period-day' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="calendar-cell-top">
        <span className="calendar-day-number">{item.day}</span>
        <PhaseBadge label={phaseLabel} compact />
      </div>
      <div className="calendar-date">{item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      <div className="calendar-weekday">{item.weekday.slice(0, 3)}</div>
      <div className="calendar-phase-name">{phaseLabel}</div>
    </button>
  );
}

export default CalendarCell;
