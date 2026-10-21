import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HIRAGANA_ROWS,
  KATAKANA_ROWS,
  HIRAGANA_CATEGORIES,
  getAllCharacters,
  getBasicRowIds,
  getCharactersByRowIds,
  getRowsByScript
} from '../src/data/hiragana.js';
import { generateQuestion, evaluateAnswer } from '../src/quiz-engine.js';

test('Hiragana dataset completeness and structure', () => {
  assert.ok(Array.isArray(HIRAGANA_ROWS));
  assert.equal(HIRAGANA_ROWS.length, 26, 'Should have 26 total Hiragana rows');

  const basicIds = getBasicRowIds();
  assert.equal(basicIds.length, 10, 'Should have 10 basic Gojūon rows (a, ka, sa, ta, na, ha, ma, ya, ra, wa)');

  const basicChars = getCharactersByRowIds(basicIds);
  assert.equal(basicChars.length, 46, 'Basic Gojūon should contain exactly 46 characters');

  const allChars = getAllCharacters();
  assert.equal(allChars.length, 104, 'Total Hiragana characters should be 104');

  allChars.forEach(char => {
    assert.ok(char.kana, 'Character must have kana');
    assert.ok(char.romaji, 'Character must have romaji');
    assert.ok(char.rowId, 'Character must have rowId');
    assert.ok(char.category, 'Character must have category');
  });
});

test('Katakana dataset completeness and structure', () => {
  assert.ok(Array.isArray(KATAKANA_ROWS));
  assert.equal(KATAKANA_ROWS.length, 26, 'Should have 26 total Katakana rows');
  assert.deepEqual(getRowsByScript('katakana'), KATAKANA_ROWS);
  assert.deepEqual(getRowsByScript('hiragana'), HIRAGANA_ROWS);

  const basicIds = getBasicRowIds();
  const basicKataChars = getCharactersByRowIds(basicIds, 'katakana');
  assert.equal(basicKataChars.length, 46, 'Basic Katakana Gojūon should contain exactly 46 characters');
  assert.equal(basicKataChars[0].kana, 'ア');
  assert.equal(basicKataChars[0].romaji, 'a');

  const allKataChars = getAllCharacters('katakana');
  assert.equal(allKataChars.length, 104, 'Total Katakana characters should be 104');

  allKataChars.forEach(char => {
    assert.ok(char.kana, 'Character must have kana');
    assert.ok(char.romaji, 'Character must have romaji');
    assert.ok(char.rowId, 'Character must have rowId');
    assert.ok(char.category, 'Character must have category');
  });
});

test('generateQuestion generates Katakana questions when script is katakana', () => {
  const yaRowIds = ['ya'];
  for (let i = 0; i < 20; i++) {
    const q = generateQuestion(yaRowIds, null, 'katakana');
    assert.ok(['ヤ', 'ユ', 'ヨ'].includes(q.target.kana), 'Target must be Katakana from Ya-row');
    assert.equal(q.options.length, 5, 'Must provide 5 options');
    assert.equal(new Set(q.options).size, 5, 'All 5 options must be unique');
    assert.equal(q.options[q.correctIndex], q.target.romaji);
  }
});

test('generateQuestion generates 5 unique options with correct answer included', () => {
  const basicRowIds = getBasicRowIds();

  for (let i = 0; i < 50; i++) {
    const q = generateQuestion(basicRowIds);

    assert.ok(q.target, 'Question must have target');
    assert.ok(q.target.kana, 'Target must have kana');
    assert.ok(q.target.romaji, 'Target must have romaji');

    assert.equal(q.options.length, 5, 'Must provide exactly 5 options');

    const uniqueOptions = new Set(q.options);
    assert.equal(uniqueOptions.size, 5, 'All 5 options must be unique');

    assert.ok(q.options.includes(q.target.romaji), 'Options must include target romaji');
    assert.equal(q.options[q.correctIndex], q.target.romaji, 'correctIndex must point to target romaji');
  }
});

test('generateQuestion handles edge case of row with fewer than 5 characters (Ya-row)', () => {
  // Ya-row has only 3 characters: ya, yu, yo
  const yaRowIds = ['ya'];

  for (let i = 0; i < 20; i++) {
    const q = generateQuestion(yaRowIds);

    assert.ok(['や', 'ゆ', 'よ'].includes(q.target.kana), 'Target must be from Ya-row');
    assert.equal(q.options.length, 5, 'Must still provide exactly 5 options');

    const uniqueOptions = new Set(q.options);
    assert.equal(uniqueOptions.size, 5, 'All 5 options must be unique even with small pool');
    assert.equal(q.options[q.correctIndex], q.target.romaji);
  }
});

test('generateQuestion avoids repeating previous character when pool > 1', () => {
  const basicRowIds = getBasicRowIds();
  let prevKana = 'あ';

  for (let i = 0; i < 30; i++) {
    const q = generateQuestion(basicRowIds, prevKana);
    assert.notEqual(q.target.kana, prevKana, 'Should not repeat previous kana');
    prevKana = q.target.kana;
  }
});

test('generateQuestion throws when selected rows produce empty pool', () => {
  assert.throws(() => {
    generateQuestion([]);
  }, /No Hiragana characters available/);
});

test('evaluateAnswer accurately checks correctness', () => {
  const q = {
    target: { kana: 'か', romaji: 'ka' },
    options: ['ka', 'ki', 'ku', 'ke', 'ko'],
    correctIndex: 0,
    correctRomaji: 'ka'
  };

  const correctRes = evaluateAnswer(q, 'ka');
  assert.equal(correctRes.isCorrect, true);
  assert.equal(correctRes.correctAnswer, 'ka');

  const wrongRes = evaluateAnswer(q, 'ki');
  assert.equal(wrongRes.isCorrect, false);
  assert.equal(wrongRes.correctAnswer, 'ka');
  assert.equal(wrongRes.chosenAnswer, 'ki');
});
