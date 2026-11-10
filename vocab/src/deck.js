/**
 * Flashcard deck management: chapter filtering, Fisher-Yates randomization,
 * bidirectional mode ('jp-en' | 'en-jp'), reveal toggling, and navigation.
 */

import { filterWords } from './data.js';

/**
 * Return a new Fisher-Yates shuffled copy of an array.
 * @template T
 * @param {Array<T>} items
 * @param {() => number} [rng]
 * @returns {Array<T>}
 */
export function shuffleArray(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export class FlashcardDeck {
  /**
   * @param {Array<object>} allWords
   * @param {{ chapter?: string | number, direction?: 'jp-en' | 'en-jp', rng?: () => number }} [options]
   */
  constructor(allWords = [], { chapter = 'all', direction = 'jp-en', rng = Math.random } = {}) {
    this.allWords = Array.isArray(allWords) ? allWords : [];
    this.chapter = chapter === 'all' ? 'all' : Number(chapter);
    this.direction = direction === 'en-jp' ? 'en-jp' : 'jp-en';
    this.rng = rng;
    this.cards = [];
    this.index = 0;
    this.isRevealed = false;

    this.reshuffle();
  }

  /**
   * Rebuild and randomize the active deck for the current chapter selection.
   * Ensures that when wrapping/reshuffling multi-card decks, we avoid repeating
   * the exact card that was just displayed if possible.
   * @param {string | null} [avoidFirstId]
   */
  reshuffle(avoidFirstId = null) {
    const filtered = filterWords(this.allWords, { chapter: this.chapter });
    const shuffled = shuffleArray(filtered, this.rng);

    if (avoidFirstId && shuffled.length > 1 && shuffled[0].id === avoidFirstId) {
      const swapIdx = 1 + Math.floor(this.rng() * (shuffled.length - 1));
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }

    this.cards = shuffled;
    this.index = 0;
    this.isRevealed = false;
    return this.getCurrentCard();
  }

  /**
   * Update chapter filter ('all' or chapter number) and randomize deck.
   * @param {string | number} chapter
   */
  setChapter(chapter) {
    const normalized = chapter === 'all' ? 'all' : Number(chapter);
    this.chapter = normalized;
    return this.reshuffle();
  }

  /**
   * Update card direction ('jp-en' | 'en-jp') and randomize deck.
   * @param {'jp-en' | 'en-jp'} direction
   */
  setDirection(direction) {
    if (direction !== 'jp-en' && direction !== 'en-jp') return this.getCurrentCard();
    if (this.direction === direction) return this.getCurrentCard();
    this.direction = direction;
    return this.reshuffle();
  }

  /**
   * Get the currently active vocabulary item, or null if deck is empty.
   */
  getCurrentCard() {
    if (this.cards.length === 0) return null;
    return this.cards[this.index] || null;
  }

  /**
   * Get deck progress metadata ({ current, total }).
   */
  getProgress() {
    if (this.cards.length === 0) {
      return { current: 0, total: 0 };
    }
    return {
      current: this.index + 1,
      total: this.cards.length
    };
  }

  /**
   * Reveal the answer on the current card.
   */
  reveal() {
    if (this.cards.length === 0) return false;
    this.isRevealed = true;
    return this.isRevealed;
  }

  /**
   * Toggle the reveal state on the current card.
   */
  toggleReveal() {
    if (this.cards.length === 0) return false;
    this.isRevealed = !this.isRevealed;
    return this.isRevealed;
  }

  /**
   * Advance to the next card. If at the end of the deck, reshuffles automatically
   * so continuous flashcard study remains freshly randomized.
   */
  next() {
    if (this.cards.length === 0) return null;

    if (this.index + 1 < this.cards.length) {
      this.index += 1;
      this.isRevealed = false;
      return this.getCurrentCard();
    }

    const lastId = this.cards[this.index]?.id || null;
    return this.reshuffle(lastId);
  }

  /**
   * Navigate back to the previous card in the current shuffled pass.
   */
  prev() {
    if (this.cards.length === 0) return null;

    if (this.index > 0) {
      this.index -= 1;
    } else {
      this.index = this.cards.length - 1;
    }
    this.isRevealed = false;
    return this.getCurrentCard();
  }
}
