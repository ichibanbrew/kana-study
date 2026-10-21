# Japanese Kana Study Web App (Hiragana & Katakana)

An interactive, responsive web application for studying Japanese **Hiragana** and **Katakana** with custom row filtering, 5-choice multiple choice quizzes, audio pronunciation, and persistent statistics.

## ✨ Features

- **Hiragana & Katakana Support**: Instant header switcher (`あ Hiragana | ア Katakana`) with independent row selection state remembered per script.
- **5-Choice Multiple Choice Quizzes**: For each displayed Kana character, choose the correct reading out of 5 options. Smart distractor selection guarantees 5 unique choices even if practicing small character pools (such as the Ya-row).
- **Customizable Row Selection**: Practice specific Hiragana or Katakana sets:
  - **Basic Gojūon (46 characters)**: A, Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa rows.
  - **Dakuten (Voiced - 20 characters)**: Ga, Za, Da, Ba rows.
  - **Handakuten (Semi-voiced - 5 characters)**: Pa row.
  - **Yōon (Combinations - 33 characters)**: Kya, Sha, Cha, Nya, Hya, Mya, Rya, Gya, Ja, Bya, Pya.
  - Quick filters: *Basic 46*, *Select All*, *Clear All*.
- **Instant Visual & Audio Feedback**:
  - Emerald green indicator on correct answers.
  - Crimson red indicator on wrong answers with immediate reveal of the correct answer.
  - Synthesized audio tones using Web Audio API (zero external assets).
  - Authentic Japanese pronunciation using native Web Speech API (`ja-JP`).
- **Keyboard Shortcuts**:
  - Keys `1` through `5`: Select answer options 1 to 5.
  - `Space` / `Enter`: Advance to next question (or repeat audio).
- **Study Stats & Streak Tracking**:
  - Current streak (🔥) & best streak (⭐).
  - Accuracy percentage and total answered counter.
  - Session mistakes tracker with quick audio review.
  - Automatic `localStorage` persistence across page reloads.
- **Light & Dark Themes**: Toggle between dark and light themes with preference saved.
- **Zero Dependencies**: Pure HTML5, CSS3, and ES6 Modules. Runs anywhere without `npm install`.

## 🚀 How to Run

### Option 1: Built-in Node Server (Recommended)
```sh
npm start
# Or: node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Option 2: Python HTTP Server
```sh
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Option 3: Direct File Open
You can also open `index.html` directly in any modern browser that allows ES modules or via a local static file server extension.

## 🧪 Running Automated Tests

Run the test suite using Node.js's native test runner:
```sh
npm test
# Or: node --test tests/*.test.js
```
All unit tests verify data completeness, question randomization, 5-option distinctness, edge cases (small row selection), and answer evaluation.
