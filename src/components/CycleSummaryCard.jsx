import PhaseBadge from './PhaseBadge';
import { getPhaseLabel } from '../utils/cycleLogic';

function CycleSummaryCard({ currentDayEntry, progressPercent, nextPhaseCountdown, nextPeriodCountdown }) {
  const phaseLabel = getPhaseLabel(currentDayEntry.phase);

  return (
    <section className="summary-card">
      <div className="summary-card-top">
        <div>
          <p className="eyebrow">Current cycle</p>
          <h2>Day {currentDayEntry.day}</h2>
          <p className="summary-date">{currentDayEntry.weekday}, {currentDayEntry.month} {currentDayEntry.date.getDate()}</p>
        </div>
        <PhaseBadge label={phaseLabel} />
      </div>

      <div className="summary-progress">
        <div className="progress-meta">
          <span>Progress</span>
          <span>{currentDayEntry.day} / 30</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="summary-stats">
        <div className="summary-stat">
          <span className="summary-label">Current phase</span>
          <strong>{currentDayEntry.phase}</strong>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Next phase</span>
          <strong>{nextPhaseCountdown} day{nextPhaseCountdown === 1 ? '' : 's'}</strong>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Next period</span>
          <strong>{nextPeriodCountdown} day{nextPeriodCountdown === 1 ? '' : 's'}</strong>
        </div>
      </div>
    </section>
  );
}

export default CycleSummaryCard;
