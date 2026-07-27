import { useEffect, useState } from 'react';
import './App.css';
import CycleCalendar from './components/CycleCalendar';
import CycleSummaryCard from './components/CycleSummaryCard';
import DayDetailsModal from './components/DayDetailsModal';
import {
  CYCLE_LENGTH,
  DISPLAY_START_DATE,
  generateCycleTimeline,
  getCurrentCycleDay,
  getNextPeriodCountdown,
  getNextPhaseCountdown
} from './utils/cycleLogic';

function App() {
  const [currentCycleDay, setCurrentCycleDay] = useState(() => getCurrentCycleDay());
  const cycleTimeline = generateCycleTimeline(DISPLAY_START_DATE, CYCLE_LENGTH, currentCycleDay);
  const [selectedDay, setSelectedDay] = useState(null);
  const progressPercent = Math.round((currentCycleDay / CYCLE_LENGTH) * 100);
  const currentDayEntry = cycleTimeline.find((item) => item.day === currentCycleDay) ?? cycleTimeline[0];
  const selectedDayEntry = selectedDay
    ? cycleTimeline.find((item) => item.day === selectedDay.day) ?? currentDayEntry
    : currentDayEntry;

  useEffect(() => {
    const updateCurrentDay = () => {
      setCurrentCycleDay(getCurrentCycleDay());
    };

    updateCurrentDay();

    const timer = window.setInterval(updateCurrentDay, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const nextPhaseCountdown = getNextPhaseCountdown(currentDayEntry.day, currentDayEntry.phase);
  const nextPeriodCountdown = getNextPeriodCountdown(currentDayEntry.day);

  return (
    <div className="app">
      <div className="app-shell">
        <header className="app-header">
          <div className="hero-copy">
            <p className="eyebrow">Menstrual cycle overview</p>
            <h1>30-day cycle tracker</h1>
            <p className="hero-subtitle">A calm, compact view of your cycle with highlights for your current day, fertile window, and ovulation.</p>
          </div>

          <div className="current-day-summary">
            <p className="eyebrow">Cycle current day</p>
            <strong>Day {currentDayEntry.day} • {currentDayEntry.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} • {currentDayEntry.weekday}</strong>
          </div>
        </header>

        <CycleSummaryCard
          currentDayEntry={currentDayEntry}
          progressPercent={progressPercent}
          nextPhaseCountdown={nextPhaseCountdown}
          nextPeriodCountdown={nextPeriodCountdown}
        />

        <CycleCalendar
          timeline={cycleTimeline}
          selectedDay={selectedDay}
          onSelectDay={(item) => {
            setSelectedDay(item);
          }}
          currentCycleDay={currentCycleDay}
        />

        <section className="insight-card">
          <div>
            <p className="eyebrow">{selectedDay ? 'Selected day' : 'Current day'}</p>
            <h3>Day {selectedDayEntry.day} • {selectedDayEntry.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} • {selectedDayEntry.weekday}</h3>
          </div>
          <div className="insight-details">
            <div>
              <span className="summary-label">Phase</span>
              <strong>{selectedDayEntry.phase}</strong>
            </div>
            <div>
              <span className="summary-label">Fertility</span>
              <strong>{selectedDayEntry.fertility}</strong>
            </div>
            <div>
              <span className="summary-label">Current day</span>
              <strong>{selectedDayEntry.isCurrentDay ? 'Yes' : 'No'}</strong>
            </div>
          </div>
        </section>
      </div>

      <DayDetailsModal
        item={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}

export default App;
