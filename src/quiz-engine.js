import { getAllCharacters, getCharactersByRowIds } from './data/hiragana.js';

/**
 * Utility: Shuffle array in-place (Fisher-Yates) and return it
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a single quiz question based on active row IDs.
 * Always produces exactly 5 distinct options: 1 correct reading + 4 distractors.
 *
 * @param {string[]|Set<string>} selectedRowIds - IDs of rows selected by user
 * @param {string|null} previousKana - Kana of the last question to prevent immediate repetition
 * @param {'hiragana'|'katakana'} script - Active script ('hiragana' or 'katakana')
 * @returns {object} Question object containing target character, 5 options, and correct index
 */
export function generateQuestion(selectedRowIds, previousKana = null, script = 'hiragana') {
  const activePool = getCharactersByRowIds(selectedRowIds, script);

  if (!activePool || activePool.length === 0) {
    const scriptLabel = script === 'katakana' ? 'Katakana' : 'Hiragana';
    throw new Error(`Cannot generate question: No ${scriptLabel} characters available for the selected rows.`);
  }

  // Pick target character. Avoid repeating immediately if pool has more than 1 character.
  let eligibleTargets = activePool;
  if (activePool.length > 1 && previousKana) {
    const filtered = activePool.filter(c => c.kana !== previousKana);
    if (filtered.length > 0) {
      eligibleTargets = filtered;
    }
  }

  const targetIndex = Math.floor(Math.random() * eligibleTargets.length);
  const target = eligibleTargets[targetIndex];

  // Pick 4 distractors (distinct from target and from each other)
  const targetRomaji = target.romaji;

  // Primary distractor candidates: other characters in active pool
  const poolCandidates = activePool
    .filter(c => c.romaji !== targetRomaji)
    .map(c => c.romaji);
  const uniquePoolDistractors = Array.from(new Set(poolCandidates));

  // Shuffle candidate distractors from pool
  const shuffledPoolDistractors = shuffle(uniquePoolDistractors);
  const chosenDistractors = [];

  // Take as many as possible (up to 4) from the active pool
  for (const romaji of shuffledPoolDistractors) {
    if (chosenDistractors.length >= 4) break;
    chosenDistractors.push(romaji);
  }

  // If pool has fewer than 4 distractors, supplement from global characters
  if (chosenDistractors.length < 4) {
    const allChars = getAllCharacters(script);
    const globalDistractors = allChars
      .filter(c => c.romaji !== targetRomaji && !chosenDistractors.includes(c.romaji))
      .map(c => c.romaji);
    const uniqueGlobalDistractors = shuffle(Array.from(new Set(globalDistractors)));

    for (const romaji of uniqueGlobalDistractors) {
      if (chosenDistractors.length >= 4) break;
      chosenDistractors.push(romaji);
    }
  }

  // Combine target + 4 distractors and shuffle
  const allOptions = shuffle([targetRomaji, ...chosenDistractors]);
  const correctIndex = allOptions.indexOf(targetRomaji);

  return {
    target,
    options: allOptions,
    correctIndex,
    correctRomaji: targetRomaji
  };
}

/**
 * Evaluate the user's selected answer against the question
 *
 * @param {object} question
 * @param {string} chosenRomaji
 * @returns {object} { isCorrect: boolean, correctAnswer: string, chosenAnswer: string }
 */
export function evaluateAnswer(question, chosenRomaji) {
  const isCorrect = chosenRomaji === question.correctRomaji;
  return {
    isCorrect,
    correctAnswer: question.correctRomaji,
    chosenAnswer: chosenRomaji
  };
}
