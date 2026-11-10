/**
 * Vocabulary data normalization, validation, and filtering helpers.
 */

/**
 * Normalize and validate raw JSON data from data/vocabulary.json.
 * @param {object} rawData
 * @returns {{ book: string, chapters: Array<{ chapter: number, title: string, words: Array<object> }>, words: Array<object> }}
 */
export function normalizeVocabularyData(rawData) {
  if (!rawData || typeof rawData !== 'object' || !Array.isArray(rawData.chapters)) {
    throw new Error('Invalid vocabulary data: expected an object with a "chapters" array.');
  }

  const book = typeof rawData.book === 'string' && rawData.book.trim()
    ? rawData.book.trim()
    : 'Minna no Nihongo';

  const chapters = [];
  const allWords = [];

  const sortedRawChapters = [...rawData.chapters].sort((a, b) => Number(a.chapter) - Number(b.chapter));

  for (const rawChapter of sortedRawChapters) {
    const chapterNum = Number(rawChapter.chapter);
    if (!Number.isInteger(chapterNum) || chapterNum <= 0) {
      throw new Error(`Invalid chapter number: ${JSON.stringify(rawChapter.chapter)}`);
    }

    if (!Array.isArray(rawChapter.words)) {
      throw new Error(`Chapter ${chapterNum} is missing a "words" array.`);
    }

    const title = typeof rawChapter.title === 'string' && rawChapter.title.trim()
      ? rawChapter.title.trim()
      : `Chapter ${chapterNum}`;

    const chapterWords = rawChapter.words.map((entry, index) => {
      if (!entry || typeof entry !== 'object') {
        throw new Error(`Invalid word entry at Chapter ${chapterNum}, index ${index}.`);
      }

      const kana = typeof entry.kana === 'string' ? entry.kana.trim() : '';
      const english = typeof entry.english === 'string' ? entry.english.trim() : '';
      const kanji = typeof entry.kanji === 'string' ? entry.kanji.trim() : '';
      const note = typeof entry.note === 'string' ? entry.note.trim() : '';

      if (!kana) {
        throw new Error(`Missing "kana" at Chapter ${chapterNum}, index ${index}.`);
      }
      if (!english) {
        throw new Error(`Missing "english" for "${kana}" at Chapter ${chapterNum}, index ${index}.`);
      }

      return {
        id: `ch${chapterNum}-${index}`,
        chapter: chapterNum,
        chapterTitle: title,
        kana,
        kanji: kanji && kanji !== kana ? kanji : '',
        english,
        note
      };
    });

    chapters.push({
      chapter: chapterNum,
      title,
      words: chapterWords
    });

    allWords.push(...chapterWords);
  }

  return {
    book,
    chapters,
    words: allWords
  };
}

/**
 * Filter normalized words by chapter ('all' or chapter number/string) and optional search query.
 * @param {Array<object>} words
 * @param {{ chapter?: string | number, query?: string }} [options]
 * @returns {Array<object>}
 */
export function filterWords(words, { chapter = 'all', query = '' } = {}) {
  if (!Array.isArray(words)) return [];

  const targetChapter = chapter === 'all' || chapter === '' || chapter === null || chapter === undefined
    ? 'all'
    : Number(chapter);

  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';

  return words.filter((word) => {
    if (targetChapter !== 'all' && word.chapter !== targetChapter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      word.kana.toLowerCase().includes(normalizedQuery) ||
      word.kanji.toLowerCase().includes(normalizedQuery) ||
      word.english.toLowerCase().includes(normalizedQuery) ||
      word.note.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Group filtered words by chapter in ascending chapter order.
 * @param {Array<object>} words
 * @returns {Array<{ chapter: number, title: string, words: Array<object> }>}
 */
export function groupWordsByChapter(words) {
  const map = new Map();

  for (const word of words) {
    if (!map.has(word.chapter)) {
      map.set(word.chapter, {
        chapter: word.chapter,
        title: word.chapterTitle || `Chapter ${word.chapter}`,
        words: []
      });
    }
    map.get(word.chapter).words.push(word);
  }

  return Array.from(map.values()).sort((a, b) => a.chapter - b.chapter);
}

/**
 * Fetch and normalize vocabulary JSON in the browser.
 * @param {string} [url]
 */
export async function loadVocabulary(url = './data/vocabulary.json') {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load vocabulary (${response.status} ${response.statusText})`);
  }
  const rawData = await response.json();
  return normalizeVocabularyData(rawData);
}
