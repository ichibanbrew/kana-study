import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultState, StateManager } from '../src/state.js';

test('getDefaultState returns valid initial state with Hiragana default and per-script row selections', () => {
  const state = getDefaultState();
  assert.equal(state.script, 'hiragana', 'Default script should be hiragana');
  assert.ok(Array.isArray(state.selectedRowIds));
  assert.equal(state.selectedRowIds.length, 10, 'Default has 10 basic rows selected');
  assert.equal(state.selectedRowsByScript.hiragana.length, 10);
  assert.equal(state.selectedRowsByScript.katakana.length, 10);
  assert.equal(state.stats.answered, 0);
  assert.equal(state.stats.correct, 0);
  assert.equal(state.stats.currentStreak, 0);
  assert.equal(state.stats.bestStreak, 0);
  assert.equal(typeof state.mistakes, 'object');
  assert.equal(state.settings.showRowHint, false, 'Default showRowHint should be false');
});

test('StateManager maintains independent row selections when switching between Hiragana and Katakana', () => {
  const sm = new StateManager();
  assert.equal(sm.getScript(), 'hiragana');

  // Customize Hiragana rows to only ['a', 'ka']
  sm.setSelectedRowIds(['a', 'ka']);
  assert.deepEqual(sm.getSelectedRowIds(), ['a', 'ka']);

  // Switch to Katakana -> should still have the 10 basic rows
  sm.setScript('katakana');
  assert.equal(sm.getScript(), 'katakana');
  assert.equal(sm.getSelectedRowIds().length, 10);

  // Customize Katakana rows to only ['sa']
  sm.setSelectedRowIds(['sa']);
  assert.deepEqual(sm.getSelectedRowIds(), ['sa']);

  // Switch back to Hiragana -> should remember ['a', 'ka']
  sm.setScript('hiragana');
  assert.equal(sm.getScript(), 'hiragana');
  assert.deepEqual(sm.getSelectedRowIds(), ['a', 'ka']);
});
