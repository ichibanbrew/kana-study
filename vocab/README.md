# Minna no Nihongo Vocabulary Study App

A zero-dependency web application for studying Japanese textbook vocabulary (*Minna no Nihongo*), featuring bidirectional flashcards (`JP → EN` and `EN → JP`) and a filterable chapter-by-chapter vocabulary browser.

## ✨ Features

- **Flashcard Page (`#flashcards`)**:
  - **Bidirectional Study**: Switch between **Japanese → English** (shows Kana + Kanji on the front, reveals English) and **English → Japanese** (shows English on the front, reveals Kana + Kanji).
  - **Chapter Filtering**: Study **All Chapters** or focus on a specific chapter (`Chapter 1`, `Chapter 2`, etc.).
  - **Automatic Randomization**: Vocabulary order is freshly randomized whenever you open the flashcard view, switch chapters/direction, wrap past the end of the deck, or click **Shuffle**.
  - **Keyboard & Click Navigation**:
    - Click the card, press **Reveal Meaning**, or hit `Space` / `Enter` / `↑` / `↓` to reveal or hide the answer.
    - Press `→` / `←` (or **Next** / **Prev**) to skip directly between cards without needing to reveal first.
    - Press `S` to reshuffle anytime.
  - **Audio Pronunciation**: Built-in `ja-JP` speech synthesis via the Web Speech API (`🔊`).
- **All Vocabulary Page (`#vocabulary`)**:
  - View **All Chapters** grouped by lesson or filter down to a single chapter.
  - Instant search across Kana, Kanji, English meaning, and notes.
  - Responsive semantic tables that stack cleanly on mobile screens.
- **Dark & Light Themes**: Remembers your theme and filter preferences in `localStorage`.

## 🚀 How to Run

### Option 1: Standalone Vocab Server
```sh
cd vocab
npm start
```
Open [http://localhost:3001](http://localhost:3001).

### Option 2: From Repository Root Server
```sh
# From repo root:
npm start
```
Open [http://localhost:3000/vocab/](http://localhost:3000/vocab/).

## 📝 Updating Vocabulary (`data/vocabulary.json`)

All vocabulary lives in `vocab/data/vocabulary.json` (no backend required). To add a new chapter—either manually or via an AI agent—append a chapter object to the `"chapters"` array:

```json
{
  "chapter": 3,
  "title": "Chapter 3",
  "words": [
    { "kana": "ここ", "english": "here, this place" },
    { "kana": "きょうしつ", "kanji": "教室", "english": "classroom" },
    { "kana": "エレベーター", "english": "elevator" },
    { "kana": "おてあらい", "kanji": "お手洗い", "english": "restroom, lavatory", "note": "Polite word for トイレ" }
  ]
}
```

### Field Reference
- `kana` *(required, string)*: Hiragana or Katakana reading of the word (e.g., `"がくせい"`, `"コーヒー"`, `"～さん"`).
- `kanji` *(optional, string)*: Kanji or mixed-script writing when applicable (e.g., `"学生"`, `"あの人"`). Omit for pure hiragana or katakana words.
- `english` *(required, string)*: English meaning.
- `note` *(optional, string)*: Brief usage hint shown after reveal on flashcards and beneath the English meaning in the word list.

### Validating Updates
After editing `data/vocabulary.json`, run the automated schema and unit tests:

```sh
node --test vocab/tests/*.test.js
```
