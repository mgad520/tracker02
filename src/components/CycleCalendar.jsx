import CalendarCell from './CalendarCell';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CycleCalendar({ timeline, selectedDay, onSelectDay, currentCycleDay, periodLength }) {
  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <div>
          <p className="eyebrow">Cycle calendar</p>
          <h2>30-day view</h2>
        </div>
        <div className="legend" aria-label="Phase legend">
          <span><span className="legend-swatch menstrual" />Menstrual</span>
          <span><span className="legend-swatch follicular" />Follicular</span>
          <span><span className="legend-swatch fertile" />Fertile</span>
          <span><span className="legend-swatch ovulation" />Ovulation</span>
          <span><span className="legend-swatch luteal" />Luteal</span>
        </div>
      </div>

      <div className="calendar-grid">
        {WEEKDAY_LABELS.map((label) => (
          <div className="weekday-label" key={label}>
            {label}
          </div>
        ))}
        {timeline.map((item) => (
          <CalendarCell
            key={item.day}
            item={item}
            selected={selectedDay?.day === item.day}
            currentCycleDay={currentCycleDay}
            onSelect={onSelectDay}
            periodLength={periodLength}
          />
        ))}
      </div>
    </section>
  );
}

export default CycleCalendar;
