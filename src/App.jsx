import { useEffect, useState } from 'react';
import './App.css';
import CycleCalendar from './components/CycleCalendar';
import CycleSummaryCard from './components/CycleSummaryCard';
import DayDetailsModal from './components/DayDetailsModal';
import {
  CYCLE_LENGTH,
  PERIOD_LENGTH,
  generateCycleTimeline,
  getCurrentCycleDay,
  getDefaultStartDate,
  getNextPeriodCountdown,
  getNextPhaseCountdown,
  normalizeCycleSetting
} from './utils/cycleLogic';

const DEFAULT_CYCLE_CONFIG = {
  startDate: getDefaultStartDate(),
  cycleLength: String(CYCLE_LENGTH),
  periodLength: String(PERIOD_LENGTH)
};

const loadCycleConfig = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_CYCLE_CONFIG;
  }

  try {
    const savedConfig = window.localStorage.getItem('cycle-config');
    if (!savedConfig) {
      return DEFAULT_CYCLE_CONFIG;
    }

    const parsedConfig = JSON.parse(savedConfig);
    return {
      startDate: parsedConfig?.startDate || DEFAULT_CYCLE_CONFIG.startDate,
      cycleLength: String(parsedConfig?.cycleLength ?? DEFAULT_CYCLE_CONFIG.cycleLength),
      periodLength: String(parsedConfig?.periodLength ?? DEFAULT_CYCLE_CONFIG.periodLength)
    };
  } catch {
    return DEFAULT_CYCLE_CONFIG;
  }
};

function App() {
  const [cycleConfig, setCycleConfig] = useState(loadCycleConfig);
  const [currentCycleDay, setCurrentCycleDay] = useState(() => {
    const savedConfig = loadCycleConfig();
    const startDate = new Date(`${savedConfig.startDate}T00:00:00`);
    const cycleLength = normalizeCycleSetting(savedConfig.cycleLength, CYCLE_LENGTH, 21, 45);
    return getCurrentCycleDay(new Date(), startDate, cycleLength);
  });
  const cycleStartDate = new Date(`${cycleConfig.startDate}T00:00:00`);
  const cycleLength = normalizeCycleSetting(cycleConfig.cycleLength, CYCLE_LENGTH, 21, 45);
  const periodLength = normalizeCycleSetting(cycleConfig.periodLength, PERIOD_LENGTH, 1, 14);
  const cycleTimeline = generateCycleTimeline(cycleStartDate, cycleLength, currentCycleDay, periodLength);
  const [selectedDay, setSelectedDay] = useState(null);
  const progressPercent = Math.round((currentCycleDay / cycleLength) * 100);
  const currentDayEntry = cycleTimeline.find((item) => item.day === currentCycleDay) ?? cycleTimeline[0];
  const selectedDayEntry = selectedDay
    ? cycleTimeline.find((item) => item.day === selectedDay.day) ?? currentDayEntry
    : currentDayEntry;

  useEffect(() => {
    const updateCurrentDay = () => {
      const startDate = new Date(`${cycleConfig.startDate}T00:00:00`);
      setCurrentCycleDay(getCurrentCycleDay(new Date(), startDate, cycleLength));
    };

    updateCurrentDay();

    const timer = window.setInterval(updateCurrentDay, 60_000);
    return () => window.clearInterval(timer);
  }, [cycleConfig.startDate, cycleLength]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cycle-config', JSON.stringify(cycleConfig));
    }
  }, [cycleConfig]);

  const nextPhaseCountdown = getNextPhaseCountdown(currentDayEntry.day, currentDayEntry.phase, cycleLength, periodLength);
  const nextPeriodCountdown = getNextPeriodCountdown(currentDayEntry.day, cycleLength, periodLength);

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

        <section className="customization-card">
          <div className="customization-header">
            <div>
              <p className="eyebrow">Customization</p>
              <h2>Cycle settings</h2>
            </div>
            <p className="customization-hint">Enter how many days your period usually lasts, and adjust the rest of the cycle if needed.</p>
          </div>

          <div className="customization-summary" aria-label="Current cycle summary">
            <div>
              <span className="summary-label">Recent info</span>
              <strong>Day {currentDayEntry.day} • {currentDayEntry.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</strong>
            </div>
            <div>
              <span className="summary-label">Saved settings</span>
              <strong>{new Date(`${cycleConfig.startDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {cycleConfig.cycleLength} days • {cycleConfig.periodLength} day period</strong>
            </div>
          </div>

          <div className="customization-controls">
            <label className="customization-field">
              <span>Cycle start date</span>
              <input
                type="date"
                value={cycleConfig.startDate}
                onChange={(event) => setCycleConfig((currentConfig) => ({ ...currentConfig, startDate: event.target.value }))}
              />
            </label>

            <label className="customization-field">
              <span>Cycle length</span>
              <input
                type="number"
                min="21"
                max="45"
                value={cycleConfig.cycleLength}
                onChange={(event) => setCycleConfig((currentConfig) => ({ ...currentConfig, cycleLength: event.target.value }))}
                onBlur={() => setCycleConfig((currentConfig) => ({ ...currentConfig, cycleLength: String(normalizeCycleSetting(currentConfig.cycleLength, CYCLE_LENGTH, 21, 45)) }))}
              />
            </label>

            <label className="customization-field">
              <span>Period lasts (days)</span>
              <input
                type="number"
                min="1"
                max="14"
                value={cycleConfig.periodLength}
                onChange={(event) => setCycleConfig((currentConfig) => ({ ...currentConfig, periodLength: event.target.value }))}
                onBlur={() => setCycleConfig((currentConfig) => ({ ...currentConfig, periodLength: String(normalizeCycleSetting(currentConfig.periodLength, PERIOD_LENGTH, 1, 14)) }))}
              />
            </label>
          </div>
        </section>

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
