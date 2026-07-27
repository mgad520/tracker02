import test from 'node:test';
import assert from 'node:assert/strict';
import { getActivePhases, getCurrentCycleDay, getDefaultStartDate, getNextPhaseCountdown, getNextPeriodCountdown } from './cycleLogic.js';

test('counts down to the next phase from the current day', () => {
  assert.equal(getNextPhaseCountdown(14, 'Follicular Phase / Fertile Window'), 2);
  assert.equal(getNextPhaseCountdown(16, 'Ovulation'), 1);
  assert.equal(getNextPhaseCountdown(30, 'Luteal Phase'), 1);
});

test('counts down to the next period from the current day', () => {
  assert.equal(getNextPeriodCountdown(1), 0);
  assert.equal(getNextPeriodCountdown(6), 0);
  assert.equal(getNextPeriodCountdown(14), 17);
  assert.equal(getNextPeriodCountdown(30), 1);
});

test('supports a custom period length', () => {
  assert.deepEqual(getActivePhases(4, 4).map((phase) => phase.label), ['Menstrual Phase']);
  assert.equal(getNextPeriodCountdown(4, 30, 4), 0);
  assert.equal(getNextPeriodCountdown(5, 30, 4), 26);
});

test('derives the current cycle day from the current date', () => {
  const startDate = new Date('2026-07-23T00:00:00');

  assert.equal(getCurrentCycleDay(new Date('2026-07-23T00:00:00'), startDate), 1);
  assert.equal(getCurrentCycleDay(new Date('2026-07-27T00:00:00'), startDate), 5);
  assert.equal(getCurrentCycleDay(new Date('2026-08-22T00:00:00'), startDate), 30);
  assert.equal(getCurrentCycleDay(new Date('2026-07-27T00:00:00')), 5);
});

test('derives a default start date that keeps today aligned with day 5', () => {
  assert.equal(getDefaultStartDate(new Date('2026-07-27T00:00:00')), '2026-07-23');
});
