import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeVocabularyData } from '../src/data.js';
import { FlashcardDeck, shuffleArray } from '../src/deck.js';

const SAMPLE_RAW = {
  book: 'Test Book',
  chapters: [
    {
      chapter: 1,
      title: 'Chapter 1',
      words: [
        { kana: 'わたし', kanji: '私', english: 'I' },
        { kana: 'がくせい', kanji: '学生', english: 'student' },
        { kana: 'せんせい', kanji: '先生', english: 'teacher' }
      ]
    },
    {
      chapter: 2,
      title: 'Chapter 2',
      words: [
        { kana: 'ほん', kanji: '本', english: 'book' },
        { kana: 'コーヒー', english: 'coffee' }
      ]
    }
  ]
};

const { words: SAMPLE_WORDS } = normalizeVocabularyData(SAMPLE_RAW);

test('shuffleArray returns a permutation without mutating original array', () => {
  const original = [1, 2, 3, 4, 5, 6];
  const copyBefore = [...original];
  const shuffled = shuffleArray(original);

  assert.deepEqual(original, copyBefore, 'Original array must not be mutated');
  assert.deepEqual([...shuffled].sort((a, b) => a - b), original, 'Shuffled array must contain identical elements');
});

test('FlashcardDeck filters by chapter and tracks progress', () => {
  const deck = new FlashcardDeck(SAMPLE_WORDS, { chapter: 'all', direction: 'jp-en' });
  assert.deepEqual(deck.getProgress(), { current: 1, total: 5 });

  deck.setChapter(1);
  assert.deepEqual(deck.getProgress(), { current: 1, total: 3 });
  assert.ok(deck.cards.every((c) => c.chapter === 1));

  deck.setChapter('2');
  assert.deepEqual(deck.getProgress(), { current: 1, total: 2 });
  assert.ok(deck.cards.every((c) => c.chapter === 2));
});

test('FlashcardDeck reveal, next, prev, and wraparound reshuffle behavior', () => {
  const deck = new FlashcardDeck(SAMPLE_WORDS, { chapter: 1, direction: 'jp-en' });

  assert.equal(deck.isRevealed, false);
  deck.toggleReveal();
  assert.equal(deck.isRevealed, true);

  // Advancing resets reveal state
  deck.next();
  assert.equal(deck.isRevealed, false);
  assert.deepEqual(deck.getProgress(), { current: 2, total: 3 });

  // Stepping back resets reveal state and decrements index
  deck.reveal();
  deck.prev();
  assert.equal(deck.isRevealed, false);
  assert.deepEqual(deck.getProgress(), { current: 1, total: 3 });

  // Stepping back from first card wraps to end of current pass
  deck.prev();
  assert.deepEqual(deck.getProgress(), { current: 3, total: 3 });

  // Advancing past final card wraps to 1/3 with a fresh shuffle and avoids immediate repeat
  const lastCardBeforeWrap = deck.getCurrentCard();
  const firstCardAfterWrap = deck.next();
  assert.deepEqual(deck.getProgress(), { current: 1, total: 3 });
  assert.notEqual(firstCardAfterWrap.id, lastCardBeforeWrap.id);
});

test('FlashcardDeck switches between jp-en and en-jp directions cleanly', () => {
  const deck = new FlashcardDeck(SAMPLE_WORDS, { chapter: 'all', direction: 'jp-en' });
  assert.equal(deck.direction, 'jp-en');

  deck.reveal();
  deck.setDirection('en-jp');
  assert.equal(deck.direction, 'en-jp');
  assert.equal(deck.isRevealed, false, 'Switching direction resets reveal and reshuffles');
  assert.equal(deck.getProgress().current, 1);
});
