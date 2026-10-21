/**
 * Japanese Kana Dataset (Hiragana & Katakana)
 * Organized into categories: Basic (Gojūon), Dakuten (Voiced), Handakuten (Semi-voiced), and Yōon (Combinations).
 */

export const HIRAGANA_CATEGORIES = [
  { id: 'basic', name: 'Basic (Gojūon)', description: 'Standard 46 core characters' },
  { id: 'dakuten', name: 'Dakuten (Voiced)', description: 'Voiced consonant rows (G, Z, D, B)' },
  { id: 'handakuten', name: 'Handakuten (Semi-voiced)', description: 'P-row characters' },
  { id: 'yoon', name: 'Yōon (Combinations)', description: 'Contracted sounds (Kya, Sha, Cha, etc.)' }
];

export const HIRAGANA_ROWS = [
  // --- BASIC (46 CHARACTERS) ---
  {
    id: 'a',
    name: 'A-row',
    category: 'basic',
    characters: [
      { kana: 'あ', romaji: 'a' },
      { kana: 'い', romaji: 'i' },
      { kana: 'う', romaji: 'u' },
      { kana: 'え', romaji: 'e' },
      { kana: 'お', romaji: 'o' }
    ]
  },
  {
    id: 'ka',
    name: 'Ka-row',
    category: 'basic',
    characters: [
      { kana: 'か', romaji: 'ka' },
      { kana: 'き', romaji: 'ki' },
      { kana: 'く', romaji: 'ku' },
      { kana: 'け', romaji: 'ke' },
      { kana: 'こ', romaji: 'ko' }
    ]
  },
  {
    id: 'sa',
    name: 'Sa-row',
    category: 'basic',
    characters: [
      { kana: 'さ', romaji: 'sa' },
      { kana: 'し', romaji: 'shi' },
      { kana: 'す', romaji: 'su' },
      { kana: 'せ', romaji: 'se' },
      { kana: 'そ', romaji: 'so' }
    ]
  },
  {
    id: 'ta',
    name: 'Ta-row',
    category: 'basic',
    characters: [
      { kana: 'た', romaji: 'ta' },
      { kana: 'ち', romaji: 'chi' },
      { kana: 'つ', romaji: 'tsu' },
      { kana: 'て', romaji: 'te' },
      { kana: 'と', romaji: 'to' }
    ]
  },
  {
    id: 'na',
    name: 'Na-row',
    category: 'basic',
    characters: [
      { kana: 'な', romaji: 'na' },
      { kana: 'に', romaji: 'ni' },
      { kana: 'ぬ', romaji: 'nu' },
      { kana: 'ね', romaji: 'ne' },
      { kana: 'の', romaji: 'no' }
    ]
  },
  {
    id: 'ha',
    name: 'Ha-row',
    category: 'basic',
    characters: [
      { kana: 'は', romaji: 'ha' },
      { kana: 'ひ', romaji: 'hi' },
      { kana: 'ふ', romaji: 'fu' },
      { kana: 'へ', romaji: 'he' },
      { kana: 'ほ', romaji: 'ho' }
    ]
  },
  {
    id: 'ma',
    name: 'Ma-row',
    category: 'basic',
    characters: [
      { kana: 'ま', romaji: 'ma' },
      { kana: 'み', romaji: 'mi' },
      { kana: 'む', romaji: 'mu' },
      { kana: 'め', romaji: 'me' },
      { kana: 'も', romaji: 'mo' }
    ]
  },
  {
    id: 'ya',
    name: 'Ya-row',
    category: 'basic',
    characters: [
      { kana: 'や', romaji: 'ya' },
      { kana: 'ゆ', romaji: 'yu' },
      { kana: 'よ', romaji: 'yo' }
    ]
  },
  {
    id: 'ra',
    name: 'Ra-row',
    category: 'basic',
    characters: [
      { kana: 'ら', romaji: 'ra' },
      { kana: 'り', romaji: 'ri' },
      { kana: 'る', romaji: 'ru' },
      { kana: 'れ', romaji: 're' },
      { kana: 'ろ', romaji: 'ro' }
    ]
  },
  {
    id: 'wa',
    name: 'Wa-row',
    category: 'basic',
    characters: [
      { kana: 'わ', romaji: 'wa' },
      { kana: 'を', romaji: 'wo' },
      { kana: 'ん', romaji: 'n' }
    ]
  },

  // --- DAKUTEN (VOICED) ---
  {
    id: 'ga',
    name: 'Ga-row',
    category: 'dakuten',
    characters: [
      { kana: 'が', romaji: 'ga' },
      { kana: 'ぎ', romaji: 'gi' },
      { kana: 'ぐ', romaji: 'gu' },
      { kana: 'げ', romaji: 'ge' },
      { kana: 'ご', romaji: 'go' }
    ]
  },
  {
    id: 'za',
    name: 'Za-row',
    category: 'dakuten',
    characters: [
      { kana: 'ざ', romaji: 'za' },
      { kana: 'じ', romaji: 'ji' },
      { kana: 'ず', romaji: 'zu' },
      { kana: 'ぜ', romaji: 'ze' },
      { kana: 'ぞ', romaji: 'zo' }
    ]
  },
  {
    id: 'da',
    name: 'Da-row',
    category: 'dakuten',
    characters: [
      { kana: 'だ', romaji: 'da' },
      { kana: 'ぢ', romaji: 'ji (di)' },
      { kana: 'づ', romaji: 'zu (du)' },
      { kana: 'で', romaji: 'de' },
      { kana: 'ど', romaji: 'do' }
    ]
  },
  {
    id: 'ba',
    name: 'Ba-row',
    category: 'dakuten',
    characters: [
      { kana: 'ば', romaji: 'ba' },
      { kana: 'び', romaji: 'bi' },
      { kana: 'ぶ', romaji: 'bu' },
      { kana: 'べ', romaji: 'be' },
      { kana: 'ぼ', romaji: 'bo' }
    ]
  },

  // --- HANDAKUTEN (SEMI-VOICED) ---
  {
    id: 'pa',
    name: 'Pa-row',
    category: 'handakuten',
    characters: [
      { kana: 'ぱ', romaji: 'pa' },
      { kana: 'ぴ', romaji: 'pi' },
      { kana: 'ぷ', romaji: 'pu' },
      { kana: 'ぺ', romaji: 'pe' },
      { kana: 'ぽ', romaji: 'po' }
    ]
  },

  // --- YOON (COMBINATIONS) ---
  {
    id: 'kya',
    name: 'Kya-row',
    category: 'yoon',
    characters: [
      { kana: 'きゃ', romaji: 'kya' },
      { kana: 'きゅ', romaji: 'kyu' },
      { kana: 'きょ', romaji: 'kyo' }
    ]
  },
  {
    id: 'sha',
    name: 'Sha-row',
    category: 'yoon',
    characters: [
      { kana: 'しゃ', romaji: 'sha' },
      { kana: 'しゅ', romaji: 'shu' },
      { kana: 'しょ', romaji: 'sho' }
    ]
  },
  {
    id: 'cha',
    name: 'Cha-row',
    category: 'yoon',
    characters: [
      { kana: 'ちゃ', romaji: 'cha' },
      { kana: 'ちゅ', romaji: 'chu' },
      { kana: 'ちょ', romaji: 'cho' }
    ]
  },
  {
    id: 'nya',
    name: 'Nya-row',
    category: 'yoon',
    characters: [
      { kana: 'にゃ', romaji: 'nya' },
      { kana: 'にゅ', romaji: 'nyu' },
      { kana: 'にょ', romaji: 'nyo' }
    ]
  },
  {
    id: 'hya',
    name: 'Hya-row',
    category: 'yoon',
    characters: [
      { kana: 'ひゃ', romaji: 'hya' },
      { kana: 'ひゅ', romaji: 'hyu' },
      { kana: 'ひょ', romaji: 'hyo' }
    ]
  },
  {
    id: 'mya',
    name: 'Mya-row',
    category: 'yoon',
    characters: [
      { kana: 'みゃ', romaji: 'mya' },
      { kana: 'みゅ', romaji: 'myu' },
      { kana: 'みょ', romaji: 'myo' }
    ]
  },
  {
    id: 'rya',
    name: 'Rya-row',
    category: 'yoon',
    characters: [
      { kana: 'りゃ', romaji: 'rya' },
      { kana: 'りゅ', romaji: 'ryu' },
      { kana: 'りょ', romaji: 'ryo' }
    ]
  },
  {
    id: 'gya',
    name: 'Gya-row',
    category: 'yoon',
    characters: [
      { kana: 'ぎゃ', romaji: 'gya' },
      { kana: 'ぎゅ', romaji: 'gyu' },
      { kana: 'ぎょ', romaji: 'gyo' }
    ]
  },
  {
    id: 'ja',
    name: 'Ja-row',
    category: 'yoon',
    characters: [
      { kana: 'じゃ', romaji: 'ja' },
      { kana: 'じゅ', romaji: 'ju' },
      { kana: 'じょ', romaji: 'jo' }
    ]
  },
  {
    id: 'bya',
    name: 'Bya-row',
    category: 'yoon',
    characters: [
      { kana: 'びゃ', romaji: 'bya' },
      { kana: 'びゅ', romaji: 'byu' },
      { kana: 'びょ', romaji: 'byo' }
    ]
  },
  {
    id: 'pya',
    name: 'Pya-row',
    category: 'yoon',
    characters: [
      { kana: 'ぴゃ', romaji: 'pya' },
      { kana: 'ぴゅ', romaji: 'pyu' },
      { kana: 'ぴょ', romaji: 'pyo' }
    ]
  }
];

export const KATAKANA_ROWS = [
  // --- BASIC (46 CHARACTERS) ---
  {
    id: 'a',
    name: 'A-row',
    category: 'basic',
    characters: [
      { kana: 'ア', romaji: 'a' },
      { kana: 'イ', romaji: 'i' },
      { kana: 'ウ', romaji: 'u' },
      { kana: 'エ', romaji: 'e' },
      { kana: 'オ', romaji: 'o' }
    ]
  },
  {
    id: 'ka',
    name: 'Ka-row',
    category: 'basic',
    characters: [
      { kana: 'カ', romaji: 'ka' },
      { kana: 'キ', romaji: 'ki' },
      { kana: 'ク', romaji: 'ku' },
      { kana: 'ケ', romaji: 'ke' },
      { kana: 'コ', romaji: 'ko' }
    ]
  },
  {
    id: 'sa',
    name: 'Sa-row',
    category: 'basic',
    characters: [
      { kana: 'サ', romaji: 'sa' },
      { kana: 'シ', romaji: 'shi' },
      { kana: 'ス', romaji: 'su' },
      { kana: 'セ', romaji: 'se' },
      { kana: 'ソ', romaji: 'so' }
    ]
  },
  {
    id: 'ta',
    name: 'Ta-row',
    category: 'basic',
    characters: [
      { kana: 'タ', romaji: 'ta' },
      { kana: 'チ', romaji: 'chi' },
      { kana: 'ツ', romaji: 'tsu' },
      { kana: 'テ', romaji: 'te' },
      { kana: 'ト', romaji: 'to' }
    ]
  },
  {
    id: 'na',
    name: 'Na-row',
    category: 'basic',
    characters: [
      { kana: 'ナ', romaji: 'na' },
      { kana: 'ニ', romaji: 'ni' },
      { kana: 'ヌ', romaji: 'nu' },
      { kana: 'ネ', romaji: 'ne' },
      { kana: 'ノ', romaji: 'no' }
    ]
  },
  {
    id: 'ha',
    name: 'Ha-row',
    category: 'basic',
    characters: [
      { kana: 'ハ', romaji: 'ha' },
      { kana: 'ヒ', romaji: 'hi' },
      { kana: 'フ', romaji: 'fu' },
      { kana: 'ヘ', romaji: 'he' },
      { kana: 'ホ', romaji: 'ho' }
    ]
  },
  {
    id: 'ma',
    name: 'Ma-row',
    category: 'basic',
    characters: [
      { kana: 'マ', romaji: 'ma' },
      { kana: 'ミ', romaji: 'mi' },
      { kana: 'ム', romaji: 'mu' },
      { kana: 'メ', romaji: 'me' },
      { kana: 'モ', romaji: 'mo' }
    ]
  },
  {
    id: 'ya',
    name: 'Ya-row',
    category: 'basic',
    characters: [
      { kana: 'ヤ', romaji: 'ya' },
      { kana: 'ユ', romaji: 'yu' },
      { kana: 'ヨ', romaji: 'yo' }
    ]
  },
  {
    id: 'ra',
    name: 'Ra-row',
    category: 'basic',
    characters: [
      { kana: 'ラ', romaji: 'ra' },
      { kana: 'リ', romaji: 'ri' },
      { kana: 'ル', romaji: 'ru' },
      { kana: 'レ', romaji: 're' },
      { kana: 'ロ', romaji: 'ro' }
    ]
  },
  {
    id: 'wa',
    name: 'Wa-row',
    category: 'basic',
    characters: [
      { kana: 'ワ', romaji: 'wa' },
      { kana: 'ヲ', romaji: 'wo' },
      { kana: 'ン', romaji: 'n' }
    ]
  },

  // --- DAKUTEN (VOICED) ---
  {
    id: 'ga',
    name: 'Ga-row',
    category: 'dakuten',
    characters: [
      { kana: 'ガ', romaji: 'ga' },
      { kana: 'ギ', romaji: 'gi' },
      { kana: 'グ', romaji: 'gu' },
      { kana: 'ゲ', romaji: 'ge' },
      { kana: 'ゴ', romaji: 'go' }
    ]
  },
  {
    id: 'za',
    name: 'Za-row',
    category: 'dakuten',
    characters: [
      { kana: 'ザ', romaji: 'za' },
      { kana: 'ジ', romaji: 'ji' },
      { kana: 'ズ', romaji: 'zu' },
      { kana: 'ゼ', romaji: 'ze' },
      { kana: 'ゾ', romaji: 'zo' }
    ]
  },
  {
    id: 'da',
    name: 'Da-row',
    category: 'dakuten',
    characters: [
      { kana: 'ダ', romaji: 'da' },
      { kana: 'ヂ', romaji: 'ji (di)' },
      { kana: 'ヅ', romaji: 'zu (du)' },
      { kana: 'デ', romaji: 'de' },
      { kana: 'ド', romaji: 'do' }
    ]
  },
  {
    id: 'ba',
    name: 'Ba-row',
    category: 'dakuten',
    characters: [
      { kana: 'バ', romaji: 'ba' },
      { kana: 'ビ', romaji: 'bi' },
      { kana: 'ブ', romaji: 'bu' },
      { kana: 'ベ', romaji: 'be' },
      { kana: 'ボ', romaji: 'bo' }
    ]
  },

  // --- HANDAKUTEN (SEMI-VOICED) ---
  {
    id: 'pa',
    name: 'Pa-row',
    category: 'handakuten',
    characters: [
      { kana: 'パ', romaji: 'pa' },
      { kana: 'ピ', romaji: 'pi' },
      { kana: 'プ', romaji: 'pu' },
      { kana: 'ペ', romaji: 'pe' },
      { kana: 'ポ', romaji: 'po' }
    ]
  },

  // --- YOON (COMBINATIONS) ---
  {
    id: 'kya',
    name: 'Kya-row',
    category: 'yoon',
    characters: [
      { kana: 'キャ', romaji: 'kya' },
      { kana: 'キュ', romaji: 'kyu' },
      { kana: 'キョ', romaji: 'kyo' }
    ]
  },
  {
    id: 'sha',
    name: 'Sha-row',
    category: 'yoon',
    characters: [
      { kana: 'シャ', romaji: 'sha' },
      { kana: 'シュ', romaji: 'shu' },
      { kana: 'ショ', romaji: 'sho' }
    ]
  },
  {
    id: 'cha',
    name: 'Cha-row',
    category: 'yoon',
    characters: [
      { kana: 'チャ', romaji: 'cha' },
      { kana: 'チュ', romaji: 'chu' },
      { kana: 'チョ', romaji: 'cho' }
    ]
  },
  {
    id: 'nya',
    name: 'Nya-row',
    category: 'yoon',
    characters: [
      { kana: 'ニャ', romaji: 'nya' },
      { kana: 'ニュ', romaji: 'nyu' },
      { kana: 'ニョ', romaji: 'nyo' }
    ]
  },
  {
    id: 'hya',
    name: 'Hya-row',
    category: 'yoon',
    characters: [
      { kana: 'ヒャ', romaji: 'hya' },
      { kana: 'ヒュ', romaji: 'hyu' },
      { kana: 'ヒョ', romaji: 'hyo' }
    ]
  },
  {
    id: 'mya',
    name: 'Mya-row',
    category: 'yoon',
    characters: [
      { kana: 'ミャ', romaji: 'mya' },
      { kana: 'ミュ', romaji: 'myu' },
      { kana: 'ミョ', romaji: 'myo' }
    ]
  },
  {
    id: 'rya',
    name: 'Rya-row',
    category: 'yoon',
    characters: [
      { kana: 'リャ', romaji: 'rya' },
      { kana: 'リュ', romaji: 'ryu' },
      { kana: 'リョ', romaji: 'ryo' }
    ]
  },
  {
    id: 'gya',
    name: 'Gya-row',
    category: 'yoon',
    characters: [
      { kana: 'ギャ', romaji: 'gya' },
      { kana: 'ギュ', romaji: 'gyu' },
      { kana: 'ギョ', romaji: 'gyo' }
    ]
  },
  {
    id: 'ja',
    name: 'Ja-row',
    category: 'yoon',
    characters: [
      { kana: 'ジャ', romaji: 'ja' },
      { kana: 'ジュ', romaji: 'ju' },
      { kana: 'ジョ', romaji: 'jo' }
    ]
  },
  {
    id: 'bya',
    name: 'Bya-row',
    category: 'yoon',
    characters: [
      { kana: 'ビャ', romaji: 'bya' },
      { kana: 'ビュ', romaji: 'byu' },
      { kana: 'ビョ', romaji: 'byo' }
    ]
  },
  {
    id: 'pya',
    name: 'Pya-row',
    category: 'yoon',
    characters: [
      { kana: 'ピャ', romaji: 'pya' },
      { kana: 'ピュ', romaji: 'pyu' },
      { kana: 'ピョ', romaji: 'pyo' }
    ]
  }
];

// Attach row metadata to each character for easy lookup
HIRAGANA_ROWS.forEach(row => {
  row.characters.forEach(char => {
    char.rowId = row.id;
    char.rowName = row.name;
    char.category = row.category;
    char.script = 'hiragana';
  });
});

KATAKANA_ROWS.forEach(row => {
  row.characters.forEach(char => {
    char.rowId = row.id;
    char.rowName = row.name;
    char.category = row.category;
    char.script = 'katakana';
  });
});

/**
 * Get rows for a specific script ('hiragana' | 'katakana')
 */
export function getRowsByScript(script = 'hiragana') {
  return script === 'katakana' ? KATAKANA_ROWS : HIRAGANA_ROWS;
}

/**
 * Get all characters for a script flattened into a single list
 */
export function getAllCharacters(script = 'hiragana') {
  return getRowsByScript(script).flatMap(row => row.characters);
}

/**
 * Get all basic (Gojūon) row IDs
 */
export function getBasicRowIds() {
  return HIRAGANA_ROWS.filter(row => row.category === 'basic').map(row => row.id);
}

/**
 * Get characters filtered by an array or Set of selected row IDs for a given script
 */
export function getCharactersByRowIds(selectedRowIds, script = 'hiragana') {
  const rowIdSet = new Set(selectedRowIds);
  return getRowsByScript(script)
    .filter(row => rowIdSet.has(row.id))
    .flatMap(row => row.characters);
}
