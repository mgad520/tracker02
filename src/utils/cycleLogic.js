export const CYCLE_LENGTH = 30;
export const START_DATE = new Date('2026-07-23T00:00:00');
export const CURRENT_CYCLE_DAY = 5;
export const OVULATION_DAY = 16;
export const DISPLAY_START_DATE = new Date(START_DATE);

export const PHASE_DEFINITIONS = {
  menstrual: { label: 'Menstrual Phase', start: 1, end: 6 },
  follicular: { label: 'Follicular Phase', start: 1, end: 16 },
  fertileWindow: { label: 'Fertile Window', start: 11, end: 16 },
  ovulation: { label: 'Ovulation', start: 16, end: 16 },
  luteal: { label: 'Luteal Phase', start: 17, end: 30 }
};

export const FERTILITY_LEVELS = {
  peak: 'Peak',
  high: 'High',
  low: 'Low',
  veryLow: 'Very Low'
};

export const DESCRIPTION_RULES = [
  { start: 1, end: 1, description: 'Period begins. The uterine lining is shed while new follicles begin developing.' },
  { start: 2, end: 6, description: 'Menstrual bleeding continues. Hormone levels remain low.' },
  { start: 7, end: 10, description: 'The follicular phase continues. Estrogen rises as the body prepares for ovulation.' },
  { start: 11, end: 15, description: 'Fertility increases as ovulation approaches.' },
  { start: 16, end: 16, description: 'The ovary releases an egg. This is the most fertile day of the cycle.' },
  { start: 17, end: 22, description: 'Progesterone rises to prepare the uterus for a possible pregnancy.' },
  { start: 23, end: 29, description: 'The luteal phase continues. If pregnancy has not occurred, the uterus readies for the next period.' },
  { start: 30, end: 30, description: 'The luteal phase ends. If pregnancy has not occurred, the next menstrual cycle is expected to begin tomorrow.' }
];

export const FERTILITY_RULES = [
  { start: 1, end: 6, fertility: FERTILITY_LEVELS.veryLow },
  { start: 7, end: 10, fertility: FERTILITY_LEVELS.low },
  { start: 11, end: 15, fertility: FERTILITY_LEVELS.high },
  { start: 16, end: 16, fertility: FERTILITY_LEVELS.peak },
  { start: 17, end: 22, fertility: FERTILITY_LEVELS.low },
  { start: 23, end: 30, fertility: FERTILITY_LEVELS.veryLow }
];

const formatLongDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

const formatMonth = (date) => date.toLocaleDateString('en-US', { month: 'long' });

export const getCurrentCycleDay = (today = new Date(), startDate = START_DATE, cycleLength = CYCLE_LENGTH) => {
  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

  const normalizedStartDate = new Date(startDate);
  normalizedStartDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((normalizedToday - normalizedStartDate) / 86400000);
  const cycleDay = diffInDays + 1;

  return Math.min(cycleLength, Math.max(1, cycleDay));
};

export const getActivePhases = (day) => {
  if (day === PHASE_DEFINITIONS.ovulation.start) {
    return [PHASE_DEFINITIONS.ovulation];
  }

  const phases = [];

  if (day >= PHASE_DEFINITIONS.menstrual.start && day <= PHASE_DEFINITIONS.menstrual.end) {
    phases.push(PHASE_DEFINITIONS.menstrual);
  }

  if (day >= PHASE_DEFINITIONS.follicular.start && day <= PHASE_DEFINITIONS.follicular.end) {
    phases.push(PHASE_DEFINITIONS.follicular);
  }

  if (day >= PHASE_DEFINITIONS.fertileWindow.start && day <= PHASE_DEFINITIONS.fertileWindow.end) {
    phases.push(PHASE_DEFINITIONS.fertileWindow);
  }

  if (day >= PHASE_DEFINITIONS.luteal.start && day <= PHASE_DEFINITIONS.luteal.end) {
    phases.push(PHASE_DEFINITIONS.luteal);
  }

  return phases;
};

export const getDescription = (day) => {
  const matchedRule = DESCRIPTION_RULES.find((rule) => day >= rule.start && day <= rule.end);

  return matchedRule ? matchedRule.description : 'The luteal phase ends. If pregnancy has not occurred, the next menstrual cycle is expected to begin tomorrow.';
};

export const getFertility = (day) => {
  const matchedRule = FERTILITY_RULES.find((rule) => day >= rule.start && day <= rule.end);

  return matchedRule ? matchedRule.fertility : FERTILITY_LEVELS.veryLow;
};

export const getPhaseLabel = (phase) => {
  const normalizedPhase = typeof phase === 'string' ? phase : '';

  if (normalizedPhase.includes('Ovulation')) {
    return 'Ovulation';
  }

  if (normalizedPhase.includes('Fertile Window')) {
    return 'Fertile Window';
  }

  if (normalizedPhase.includes('Menstrual')) {
    return 'Menstrual';
  }

  if (normalizedPhase.includes('Luteal')) {
    return 'Luteal';
  }

  return 'Follicular';
};

export const generateCycleTimeline = (startDate, cycleLength = CYCLE_LENGTH, currentCycleDay = getCurrentCycleDay()) =>
  Array.from({ length: cycleLength }, (_, index) => {
    const day = index + 1;
    const date = new Date(startDate.getTime());
    date.setDate(startDate.getDate() + index);

    const phases = getActivePhases(day);

    return {
      day,
      date,
      calendarDate: formatLongDate(date),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      month: formatMonth(date),
      phase: phases.map((phase) => phase.label).join(' / '),
      description: getDescription(day),
      fertility: getFertility(day),
      isCurrentDay: day === currentCycleDay,
      isOvulationDay: day === OVULATION_DAY
    };
  });

export const getNextPhaseCountdown = (currentDay, currentPhaseLabel, cycleLength = CYCLE_LENGTH) => {
  if (currentDay <= 0 || currentDay > cycleLength) {
    return 1;
  }

  const currentPhase = typeof currentPhaseLabel === 'string' ? currentPhaseLabel : '';
  const nextPhaseDay = Array.from({ length: cycleLength - currentDay }, (_, index) => currentDay + index + 1)
    .find((day) => {
      const nextPhaseLabel = getActivePhases(day).map((phase) => phase.label).join(' / ');
      return nextPhaseLabel !== currentPhase;
    });

  return nextPhaseDay ? nextPhaseDay - currentDay : 1;
};

export const getNextPeriodCountdown = (currentDay, cycleLength = CYCLE_LENGTH) => {
  if (currentDay <= 0 || currentDay > cycleLength) {
    return 1;
  }

  if (currentDay >= 1 && currentDay <= 6) {
    return 0;
  }

  return cycleLength - currentDay + 1;
};
