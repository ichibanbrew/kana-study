import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  normalizeVocabularyData,
  filterWords,
  groupWordsByChapter
} from '../src/data.js';
import { formatSpeechText } from '../src/audio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VOCAB_JSON_PATH = path.join(__dirname, '..', 'data', 'vocabulary.json');

const rawJsonText = fs.readFileSync(VOCAB_JSON_PATH, 'utf8');
const rawVocabData = JSON.parse(rawJsonText);

test('vocabulary.json parses cleanly and satisfies required schema', () => {
  const normalized = normalizeVocabularyData(rawVocabData);

  assert.ok(normalized.book.length > 0, 'Book title must be non-empty');
  assert.ok(normalized.chapters.length >= 2, 'Should contain at least Chapters 1 and 2');
  assert.ok(normalized.words.length >= 70, 'Chapters 1 & 2 should contain comprehensive vocabulary');

  const seenChapters = new Set();
  for (const ch of normalized.chapters) {
    assert.ok(Number.isInteger(ch.chapter) && ch.chapter > 0, 'Chapter number must be positive integer');
    assert.ok(!seenChapters.has(ch.chapter), `Duplicate chapter number ${ch.chapter}`);
    seenChapters.add(ch.chapter);
    assert.ok(ch.words.length > 0, `Chapter ${ch.chapter} must contain words`);

    const seenKeys = new Set();
    for (const word of ch.words) {
      assert.ok(word.kana.length > 0, 'Word must have non-empty kana');
      assert.ok(word.english.length > 0, 'Word must have non-empty english');
      assert.equal(typeof word.kanji, 'string');
      assert.equal(typeof word.note, 'string');
      assert.notEqual(word.kanji, word.kana, 'Redundant kanji identical to kana should be normalized out');

      const compositeKey = `${word.kana}|${word.kanji}`;
      assert.ok(!seenKeys.has(compositeKey), `Duplicate word "${compositeKey}" in Chapter ${ch.chapter}`);
      seenKeys.add(compositeKey);
    }
  }

  assert.ok(seenChapters.has(1), 'Chapter 1 must exist');
  assert.ok(seenChapters.has(2), 'Chapter 2 must exist');
  assert.ok(seenChapters.has(3), 'Chapter 3 must exist');
});

test('normalizeVocabularyData rejects malformed input', () => {
  assert.throws(() => normalizeVocabularyData(null), /Invalid vocabulary data/);
  assert.throws(() => normalizeVocabularyData({ chapters: [{ chapter: 0, words: [] }] }), /Invalid chapter number/);
  assert.throws(
    () => normalizeVocabularyData({ chapters: [{ chapter: 1, words: [{ kana: '', english: 'I' }] }] }),
    /Missing "kana"/
  );
  assert.throws(
    () => normalizeVocabularyData({ chapters: [{ chapter: 1, words: [{ kana: 'わたし', english: '' }] }] }),
    /Missing "english"/
  );
});

test('filterWords filters by chapter and search query across kana, kanji, and english', () => {
  const { words, chapters } = normalizeVocabularyData(rawVocabData);
  const ch1ExpectedCount = chapters.find((c) => c.chapter === 1).words.length;
  const ch2ExpectedCount = chapters.find((c) => c.chapter === 2).words.length;

  assert.equal(filterWords(words, { chapter: 'all' }).length, words.length);
  assert.equal(filterWords(words, { chapter: 1 }).length, ch1ExpectedCount);
  assert.equal(filterWords(words, { chapter: '2' }).length, ch2ExpectedCount);

  const studentMatches = filterWords(words, { chapter: 'all', query: 'student' });
  assert.ok(studentMatches.some((w) => w.kana === 'がくせい' && w.kanji === '学生'));

  const kanjiMatches = filterWords(words, { chapter: 'all', query: '辞書' });
  assert.equal(kanjiMatches.length, 1);
  assert.equal(kanjiMatches[0].kana, 'じしょ');

  const ch1Coffee = filterWords(words, { chapter: 1, query: 'コーヒー' });
  assert.equal(ch1Coffee.length, 0, 'コーヒー is in Chapter 2, not Chapter 1');
});

test('groupWordsByChapter groups words in ascending chapter order', () => {
  const { words, chapters } = normalizeVocabularyData(rawVocabData);
  const grouped = groupWordsByChapter(words);

  assert.equal(grouped.length, chapters.length);
  for (let i = 1; i < grouped.length; i += 1) {
    assert.ok(grouped[i].chapter > grouped[i - 1].chapter, 'Chapters must be sorted ascending');
  }
});

test('formatSpeechText strips textbook wave-dash placeholders cleanly', () => {
  assert.equal(formatSpeechText('～さん'), 'さん');
  assert.equal(formatSpeechText('～からきました'), 'からきました');
  assert.equal(formatSpeechText('がくせい'), 'がくせい');
});

test('vocab/index.html contains every DOM element ID referenced by VocabUI', () => {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const uiJsPath = path.join(__dirname, '..', 'src', 'ui.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const uiJs = fs.readFileSync(uiJsPath, 'utf8');

  const idLookups = [...uiJs.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);
  assert.ok(idLookups.length >= 20, 'Should discover all VocabUI getElementById lookups');

  for (const id of idLookups) {
    assert.ok(
      html.includes(`id="${id}"`),
      `Expected vocab/index.html to contain element with id="${id}"`
    );
  }
});

test('vocab/styles/main.css uses :where() for table cell resets so .cell-audio width/alignment are not overridden', () => {
  const cssPath = path.join(__dirname, '..', 'styles', 'main.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.ok(
    css.includes('.vocab-table :where(tbody, tr, th, td)'),
    'Stacked container query should use :where() so .cell-audio width: auto is not overridden'
  );
  assert.ok(
    !css.includes('.vocab-table td {\n    display: block;\n    width: 100%;'),
    'Must not use high-specificity .vocab-table td width: 100% reset'
  );
});
