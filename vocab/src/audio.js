/**
 * Native Japanese pronunciation helper via Web Speech API (ja-JP).
 */

/**
 * Clean textbook notation (such as wave dashes "～") before passing text to speech synthesis.
 * @param {string} rawText
 * @returns {string}
 */
export function formatSpeechText(rawText) {
  if (typeof rawText !== 'string') return '';
  return rawText.replace(/[～〜~]/g, '').trim();
}

/**
 * Speak Japanese vocabulary text using browser speech synthesis.
 * @param {string} text
 */
export function speakJapanese(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const cleaned = formatSpeechText(text);
  if (!cleaned) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
