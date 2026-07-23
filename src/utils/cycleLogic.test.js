import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextPhaseCountdown, getNextPeriodCountdown } from './cycleLogic.js';

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
