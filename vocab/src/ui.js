import { loadVocabulary, filterWords, groupWordsByChapter } from './data.js';
import { FlashcardDeck } from './deck.js';
import { speakJapanese } from './audio.js';

const SETTINGS_STORAGE_KEY = 'vocab_study_settings_v1';

export class VocabUI {
  constructor() {
    this.vocabData = null;
    this.deck = null;
    this.activeView = 'flashcards'; // 'flashcards' | 'vocabulary'
    this.settings = this.loadSettings();

    this.elements = {
      statusBanner: document.getElementById('status-banner'),
      navFlashcards: document.getElementById('nav-flashcards'),
      navVocabulary: document.getElementById('nav-vocabulary'),
      btnToggleTheme: document.getElementById('btn-toggle-theme'),

      // Views
      viewFlashcards: document.getElementById('view-flashcards'),
      viewVocabulary: document.getElementById('view-vocabulary'),

      // Flashcard View Controls
      btnDirJpEn: document.getElementById('btn-dir-jp-en'),
      btnDirEnJp: document.getElementById('btn-dir-en-jp'),
      flashcardChapterSelect: document.getElementById('flashcard-chapter-select'),
      btnShuffle: document.getElementById('btn-shuffle'),

      // Flashcard Surface
      flashcardSurface: document.getElementById('flashcard-surface'),
      cardChapterBadge: document.getElementById('card-chapter-badge'),
      cardProgress: document.getElementById('card-progress'),
      btnCardSpeak: document.getElementById('btn-card-speak'),
      cardPrompt: document.getElementById('card-prompt'),
      cardAnswerWrap: document.getElementById('card-answer-wrap'),
      cardAnswer: document.getElementById('card-answer'),
      cardTapHint: document.getElementById('card-tap-hint'),

      // Flashcard Footer Actions
      btnPrevCard: document.getElementById('btn-prev-card'),
      btnRevealCard: document.getElementById('btn-reveal-card'),
      btnNextCard: document.getElementById('btn-next-card'),

      // Vocabulary List View Controls
      listChapterSelect: document.getElementById('list-chapter-select'),
      listSearchInput: document.getElementById('list-search-input'),
      listWordCount: document.getElementById('list-word-count'),
      vocabularyChaptersContainer: document.getElementById('vocabulary-chapters-container')
    };
  }

  loadSettings() {
    const defaults = {
      theme: 'dark',
      direction: 'jp-en',
      flashcardChapter: 'all',
      listChapter: 'all'
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            theme: parsed.theme === 'light' ? 'light' : 'dark',
            direction: parsed.direction === 'en-jp' ? 'en-jp' : 'jp-en',
            flashcardChapter: parsed.flashcardChapter || 'all',
            listChapter: parsed.listChapter || 'all'
          };
        }
      }
    } catch (err) {
      console.warn('Could not read settings from localStorage:', err);
    }

    return defaults;
  }

  saveSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      }
    } catch (err) {
      console.warn('Could not save settings to localStorage:', err);
    }
  }

  async init() {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      document.documentElement.setAttribute('data-touch', 'true');
    }

    this.applyTheme(this.settings.theme);
    this.bindEvents();

    try {
      this.vocabData = await loadVocabulary('./data/vocabulary.json');
      this.populateChapterDropdowns();

      // Validate saved chapter still exists in vocabulary.json
      const availableChapters = new Set(this.vocabData.chapters.map((c) => String(c.chapter)));
      const initialFlashChapter = availableChapters.has(String(this.settings.flashcardChapter))
        ? this.settings.flashcardChapter
        : 'all';
      const initialListChapter = availableChapters.has(String(this.settings.listChapter))
        ? this.settings.listChapter
        : 'all';

      this.elements.flashcardChapterSelect.value = String(initialFlashChapter);
      this.elements.listChapterSelect.value = String(initialListChapter);

      this.deck = new FlashcardDeck(this.vocabData.words, {
        chapter: initialFlashChapter,
        direction: this.settings.direction
      });

      this.updateDirectionButtons();
      this.syncRouteFromHash({ initialLoad: true });
      this.renderVocabularyList();
    } catch (err) {
      this.showError(
        `Unable to load vocabulary data (${err.message}). Make sure you are serving the app over HTTP (e.g., npm start).`
      );
    }
  }

  showError(message) {
    if (!this.elements.statusBanner) return;
    this.elements.statusBanner.textContent = message;
    this.elements.statusBanner.hidden = false;
  }

  applyTheme(theme) {
    const normalized = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', normalized);
    if (this.elements.btnToggleTheme) {
      this.elements.btnToggleTheme.textContent = normalized === 'dark' ? '☀️' : '🌙';
    }
  }

  populateChapterDropdowns() {
    if (!this.vocabData) return;

    const totalCount = this.vocabData.words.length;
    const buildOptions = () => {
      const frag = document.createDocumentFragment();

      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = `All Chapters (${totalCount})`;
      frag.appendChild(allOption);

      for (const ch of this.vocabData.chapters) {
        const opt = document.createElement('option');
        opt.value = String(ch.chapter);
        opt.textContent = `${ch.title} (${ch.words.length})`;
        frag.appendChild(opt);
      }

      return frag;
    };

    this.elements.flashcardChapterSelect.replaceChildren(buildOptions());
    this.elements.listChapterSelect.replaceChildren(buildOptions());
  }

  syncRouteFromHash({ initialLoad = false } = {}) {
    const hash = window.location.hash.toLowerCase();
    const nextView = hash === '#vocabulary' || hash === '#words' ? 'vocabulary' : 'flashcards';
    const switchedToFlashcards = !initialLoad && this.activeView !== 'flashcards' && nextView === 'flashcards';

    this.activeView = nextView;

    const isFlashcards = nextView === 'flashcards';
    this.elements.viewFlashcards.hidden = !isFlashcards;
    this.elements.viewVocabulary.hidden = isFlashcards;

    this.elements.navFlashcards.classList.toggle('active', isFlashcards);
    if (isFlashcards) {
      this.elements.navFlashcards.setAttribute('aria-current', 'page');
      this.elements.navVocabulary.removeAttribute('aria-current');
    } else {
      this.elements.navVocabulary.setAttribute('aria-current', 'page');
      this.elements.navFlashcards.removeAttribute('aria-current');
    }
    this.elements.navVocabulary.classList.toggle('active', !isFlashcards);

    if (this.deck) {
      if (switchedToFlashcards) {
        // Re-randomize vocabulary each time user enters the flashcard page
        this.deck.reshuffle();
      }
      if (isFlashcards) {
        this.renderFlashcard();
      }
    }
  }

  blurOnTouch(el) {
    if (document.documentElement.getAttribute('data-touch') === 'true' && el && typeof el.blur === 'function') {
      el.blur();
    }
  }

  bindEvents() {
    window.addEventListener('hashchange', () => {
      this.syncRouteFromHash();
    });

    // Theme toggle
    this.elements.btnToggleTheme.addEventListener('click', () => {
      const next = this.settings.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      this.saveSettings({ theme: next });
      this.blurOnTouch(this.elements.btnToggleTheme);
    });

    // Direction switcher
    this.elements.btnDirJpEn.addEventListener('click', () => {
      this.setDirection('jp-en');
      this.blurOnTouch(this.elements.btnDirJpEn);
    });

    this.elements.btnDirEnJp.addEventListener('click', () => {
      this.setDirection('en-jp');
      this.blurOnTouch(this.elements.btnDirEnJp);
    });

    // Flashcard chapter filter
    this.elements.flashcardChapterSelect.addEventListener('change', (event) => {
      const chapter = event.target.value;
      this.saveSettings({ flashcardChapter: chapter });
      if (this.deck) {
        this.deck.setChapter(chapter);
        this.renderFlashcard();
      }
    });

    // Shuffle button
    this.elements.btnShuffle.addEventListener('click', () => {
      if (this.deck) {
        const currentId = this.deck.getCurrentCard()?.id || null;
        this.deck.reshuffle(currentId);
        this.renderFlashcard();
      }
      this.blurOnTouch(this.elements.btnShuffle);
    });

    // Click anywhere on flashcard surface (except audio button) to toggle reveal
    this.elements.flashcardSurface.addEventListener('click', (event) => {
      if (event.target.closest('#btn-card-speak')) return;
      this.toggleReveal();
    });

    // Audio pronunciation on flashcard
    this.elements.btnCardSpeak.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = this.deck?.getCurrentCard();
      if (card) {
        speakJapanese(card.kana);
      }
      this.blurOnTouch(this.elements.btnCardSpeak);
    });

    // Prev / Reveal / Next buttons
    this.elements.btnRevealCard.addEventListener('click', () => {
      this.toggleReveal();
      this.blurOnTouch(this.elements.btnRevealCard);
    });

    this.elements.btnPrevCard.addEventListener('click', () => {
      this.prevCard();
      this.blurOnTouch(this.elements.btnPrevCard);
    });

    this.elements.btnNextCard.addEventListener('click', () => {
      this.nextCard();
      this.blurOnTouch(this.elements.btnNextCard);
    });

    // Vocabulary list filters
    this.elements.listChapterSelect.addEventListener('change', (event) => {
      const chapter = event.target.value;
      this.saveSettings({ listChapter: chapter });
      this.renderVocabularyList();
    });

    this.elements.listSearchInput.addEventListener('input', () => {
      this.renderVocabularyList();
    });

    // Delegated audio button clicks in Vocabulary List
    this.elements.vocabularyChaptersContainer.addEventListener('click', (event) => {
      const btn = event.target.closest('.row-audio-btn');
      if (!btn) return;
      const kana = btn.dataset.kana;
      if (kana) {
        speakJapanese(kana);
      }
      this.blurOnTouch(btn);
    });

    // Keyboard navigation on Flashcards view
    document.addEventListener('keydown', (event) => {
      if (this.activeView !== 'flashcards' || !this.deck) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.nextCard();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.prevCard();
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.toggleReveal();
        return;
      }

      if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        const currentId = this.deck.getCurrentCard()?.id || null;
        this.deck.reshuffle(currentId);
        this.renderFlashcard();
        return;
      }

      // Space or Enter reveals card when focus is not already on an interactive button/link
      if (event.key === ' ' || event.key === 'Enter') {
        const isInteractiveControl = tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY';
        if (!isInteractiveControl) {
          event.preventDefault();
          this.toggleReveal();
        }
      }
    });
  }

  setDirection(direction) {
    if (direction !== 'jp-en' && direction !== 'en-jp') return;
    if (this.settings.direction === direction) return;

    this.saveSettings({ direction });
    this.updateDirectionButtons();

    if (this.deck) {
      this.deck.setDirection(direction);
      this.renderFlashcard();
    }
  }

  updateDirectionButtons() {
    const isJpEn = this.settings.direction === 'jp-en';
    this.elements.btnDirJpEn.classList.toggle('active', isJpEn);
    this.elements.btnDirJpEn.setAttribute('aria-pressed', String(isJpEn));
    this.elements.btnDirEnJp.classList.toggle('active', !isJpEn);
    this.elements.btnDirEnJp.setAttribute('aria-pressed', String(!isJpEn));
  }

  toggleReveal() {
    if (!this.deck) return;
    this.deck.toggleReveal();
    this.renderFlashcard();
  }

  nextCard() {
    if (!this.deck) return;
    this.deck.next();
    this.renderFlashcard();
  }

  prevCard() {
    if (!this.deck) return;
    this.deck.prev();
    this.renderFlashcard();
  }

  renderFlashcard() {
    if (!this.deck) return;
    const card = this.deck.getCurrentCard();
    const { current, total } = this.deck.getProgress();

    if (!card) {
      this.elements.cardChapterBadge.textContent = 'No words';
      this.elements.cardProgress.textContent = '0 / 0';
      this.elements.btnCardSpeak.hidden = true;
      this.elements.cardPrompt.replaceChildren();
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'en-prompt-main';
      emptyMsg.textContent = 'No vocabulary items found for this chapter.';
      this.elements.cardPrompt.appendChild(emptyMsg);
      this.elements.cardAnswerWrap.hidden = true;
      this.elements.cardTapHint.hidden = true;
      return;
    }

    const isJpEn = this.deck.direction === 'jp-en';
    const isRevealed = this.deck.isRevealed;

    this.elements.cardChapterBadge.textContent = card.chapterTitle;
    this.elements.cardProgress.textContent = `${current} / ${total}`;
    this.elements.flashcardSurface.classList.toggle('revealed', isRevealed);

    // Show audio button immediately on JP->EN, or once revealed on EN->JP
    this.elements.btnCardSpeak.hidden = !isJpEn && !isRevealed;

    // Render Prompt (Front)
    const promptFrag = document.createDocumentFragment();
    if (isJpEn) {
      if (card.kanji) {
        const kanjiEl = document.createElement('div');
        kanjiEl.className = 'jp-kanji-main';
        kanjiEl.lang = 'ja';
        kanjiEl.textContent = card.kanji;

        const kanaEl = document.createElement('div');
        kanaEl.className = 'jp-kana-sub';
        kanaEl.lang = 'ja';
        kanaEl.textContent = card.kana;

        promptFrag.append(kanjiEl, kanaEl);
      } else {
        const kanaMain = document.createElement('div');
        kanaMain.className = 'jp-kana-main';
        kanaMain.lang = 'ja';
        kanaMain.textContent = card.kana;
        promptFrag.appendChild(kanaMain);
      }
    } else {
      const enMain = document.createElement('div');
      enMain.className = 'en-prompt-main';
      enMain.textContent = card.english;
      promptFrag.appendChild(enMain);
    }
    this.elements.cardPrompt.replaceChildren(promptFrag);

    // Render Answer (Revealed Area)
    if (isRevealed) {
      const answerFrag = document.createDocumentFragment();
      if (isJpEn) {
        const enAns = document.createElement('div');
        enAns.className = 'en-answer-main';
        enAns.textContent = card.english;
        answerFrag.appendChild(enAns);
      } else {
        if (card.kanji) {
          const kanjiAns = document.createElement('div');
          kanjiAns.className = 'jp-answer-kanji';
          kanjiAns.lang = 'ja';
          kanjiAns.textContent = card.kanji;
          answerFrag.appendChild(kanjiAns);
        }
        const kanaAns = document.createElement('div');
        kanaAns.className = 'jp-answer-kana';
        kanaAns.lang = 'ja';
        kanaAns.textContent = card.kana;
        answerFrag.appendChild(kanaAns);
      }

      if (card.note) {
        const noteEl = document.createElement('div');
        noteEl.className = 'card-note';
        noteEl.textContent = card.note;
        answerFrag.appendChild(noteEl);
      }

      this.elements.cardAnswer.replaceChildren(answerFrag);
      this.elements.cardAnswerWrap.hidden = false;
      this.elements.cardTapHint.textContent = 'Click card or press Space to hide';
      this.elements.btnRevealCard.textContent = 'Hide Meaning';
      this.elements.btnRevealCard.setAttribute('aria-expanded', 'true');
    } else {
      this.elements.cardAnswer.replaceChildren();
      this.elements.cardAnswerWrap.hidden = true;
      this.elements.cardTapHint.hidden = false;
      this.elements.cardTapHint.textContent = isJpEn
        ? 'Click card or press Space to reveal meaning'
        : 'Click card or press Space to reveal Japanese';
      this.elements.btnRevealCard.textContent = isJpEn ? 'Reveal Meaning' : 'Reveal Japanese';
      this.elements.btnRevealCard.setAttribute('aria-expanded', 'false');
    }
  }

  renderVocabularyList() {
    if (!this.vocabData) return;

    const chapter = this.elements.listChapterSelect.value || 'all';
    const query = this.elements.listSearchInput.value || '';

    const filtered = filterWords(this.vocabData.words, { chapter, query });
    const countLabel = filtered.length === 1 ? '1 word' : `${filtered.length} words`;
    this.elements.listWordCount.textContent = countLabel;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-list-state';
      empty.textContent = 'No vocabulary items match your filter.';
      this.elements.vocabularyChaptersContainer.replaceChildren(empty);
      return;
    }

    const grouped = groupWordsByChapter(filtered);
    const containerFrag = document.createDocumentFragment();

    for (const group of grouped) {
      const section = document.createElement('section');
      section.className = 'chapter-section';

      const headingId = `vocab-chapter-heading-${group.chapter}`;

      const header = document.createElement('div');
      header.className = 'chapter-section-header';

      const h2 = document.createElement('h2');
      h2.id = headingId;
      h2.textContent = group.title;

      const badge = document.createElement('span');
      badge.className = 'chapter-word-count';
      badge.textContent = group.words.length === 1 ? '1 word' : `${group.words.length} words`;

      header.append(h2, badge);

      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-labelledby', headingId);
      wrapper.tabIndex = 0;

      const table = document.createElement('table');
      table.className = 'vocab-table';

      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');

      const thKana = document.createElement('th');
      thKana.scope = 'col';
      thKana.textContent = 'Kana';

      const thKanji = document.createElement('th');
      thKanji.scope = 'col';
      thKanji.textContent = 'Kanji';

      const thEnglish = document.createElement('th');
      thEnglish.scope = 'col';
      thEnglish.textContent = 'English Meaning';

      const thAudio = document.createElement('th');
      thAudio.scope = 'col';
      thAudio.className = 'col-audio';
      thAudio.textContent = 'Audio';

      headRow.append(thKana, thKanji, thEnglish, thAudio);
      thead.appendChild(headRow);

      const tbody = document.createElement('tbody');

      for (const word of group.words) {
        const tr = document.createElement('tr');
        if (!word.kanji) {
          tr.dataset.emptyKanji = 'true';
        }

        const cellKana = document.createElement('th');
        cellKana.scope = 'row';
        cellKana.className = 'cell-kana';
        cellKana.lang = 'ja';
        cellKana.textContent = word.kana;

        const cellKanji = document.createElement('td');
        cellKanji.className = 'cell-kanji';
        if (word.kanji) {
          cellKanji.lang = 'ja';
          cellKanji.textContent = word.kanji;
        } else {
          const dash = document.createElement('span');
          dash.className = 'kanji-empty';
          dash.setAttribute('aria-label', 'None');
          dash.textContent = '—';
          cellKanji.appendChild(dash);
        }

        const cellEnglish = document.createElement('td');
        cellEnglish.className = 'cell-english';
        cellEnglish.appendChild(document.createTextNode(word.english));
        if (word.note) {
          const noteSpan = document.createElement('span');
          noteSpan.className = 'cell-note';
          noteSpan.textContent = word.note;
          cellEnglish.appendChild(noteSpan);
        }

        const cellAudio = document.createElement('td');
        cellAudio.className = 'cell-audio';

        const audioBtn = document.createElement('button');
        audioBtn.type = 'button';
        audioBtn.className = 'row-audio-btn';
        audioBtn.dataset.kana = word.kana;
        audioBtn.title = `Pronounce ${word.kana}`;
        audioBtn.setAttribute('aria-label', `Pronounce ${word.kana}`);
        audioBtn.textContent = '🔊';

        cellAudio.appendChild(audioBtn);

        tr.append(cellKana, cellKanji, cellEnglish, cellAudio);
        tbody.appendChild(tr);
      }

      table.append(thead, tbody);
      wrapper.appendChild(table);
      section.append(header, wrapper);
      containerFrag.appendChild(section);
    }

    this.elements.vocabularyChaptersContainer.replaceChildren(containerFrag);
  }
}
