/**
 * GPS Lab Platform - Text Formatter Utilities
 * 
 * Comprehensive text formatting functions for the GPS Lab MMORPG educational platform.
 * Handles string manipulation, truncation, case conversion, slugification,
 * praise message formatting, and multi-language text processing.
 * 
 * @module utils/formatters/text.formatter
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Supported locales for the GPS Lab Platform
 */
export const SUPPORTED_LOCALES = {
  EN: 'en-US',
  KO: 'ko-KR',
  SW: 'sw-KE'
};

/**
 * Default locale fallback
 */
export const DEFAULT_LOCALE = SUPPORTED_LOCALES.EN;

/**
 * Common abbreviations that should maintain specific casing
 */
export const PRESERVED_ABBREVIATIONS = [
  'GPS', 'GPO', 'PSB', 'MVP', 'TA', 'AI', 'XP', 'LQ', 'R2R', 'pR2R',
  'SDG', 'SDGs', 'PMC', 'API', 'URL', 'ID', 'USA', 'UK', 'KR', 'KE'
];

/**
 * Words that should remain lowercase in titles (English)
 */
export const LOWERCASE_WORDS_EN = [
  'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'is', 'it'
];

/**
 * Praise message templates by type and locale
 */
export const PRAISE_TEMPLATES = {
  identity: {
    'en-US': [
      'You are uniquely designed for this mission, {name}.',
      '{name}, your presence here matters more than you know.',
      'No one else can bring what you bring, {name}.'
    ],
    'ko-KR': [
      '{name}님, 당신은 이 미션을 위해 특별히 만들어졌습니다.',
      '{name}님의 존재는 당신이 아는 것 이상으로 소중합니다.',
      '{name}님만이 가져올 수 있는 것이 있습니다.'
    ],
    'sw-KE': [
      '{name}, umeundwa kipekee kwa misheni hii.',
      'Uwepo wako hapa una maana zaidi ya unavyojua, {name}.',
      'Hakuna mtu mwingine anayeweza kuleta unachokwambia, {name}.'
    ]
  },
  effort: {
    'en-US': [
      'Your dedication shows, {name}. Keep pushing forward!',
      'Every step you take builds something meaningful, {name}.',
      '{name}, your hard work is creating real change.'
    ],
    'ko-KR': [
      '{name}님의 헌신이 보입니다. 계속 전진하세요!',
      '{name}님이 걷는 모든 발걸음이 의미 있는 것을 만들고 있습니다.',
      '{name}님의 노력이 진정한 변화를 만들고 있습니다.'
    ],
    'sw-KE': [
      'Kujitolea kwako kunaonekana, {name}. Endelea kusonga mbele!',
      'Kila hatua unayochukua inajenga kitu chenye maana, {name}.',
      '{name}, kazi yako ngumu inaleta mabadiliko ya kweli.'
    ]
  },
  resilience: {
    'en-US': [
      'Failure is not your identity, {name}. This only reveals where you will shine next.',
      '{name}, you did not let failure define you. That takes rare strength.',
      'You took the longer road, {name}. That shows true courage.'
    ],
    'ko-KR': [
      '{name}님, 실패는 당신의 정체성이 아닙니다. 이것은 다음에 빛날 곳을 보여줄 뿐입니다.',
      '{name}님은 실패가 당신을 정의하도록 두지 않았습니다. 그것은 드문 강인함입니다.',
      '{name}님은 더 긴 길을 선택했습니다. 그것이 진정한 용기입니다.'
    ],
    'sw-KE': [
      'Kushindwa si utambulisho wako, {name}. Hii inaonyesha tu utakapoangaza ijayo.',
      '{name}, haukuruhusu kushindwa kukufafanua. Hiyo inahitaji nguvu ya kipekee.',
      'Ulichukua njia ndefu zaidi, {name}. Hiyo inaonyesha ujasiri wa kweli.'
    ]
  },
  growth: {
    'en-US': [
      'Your growth is undeniable, {name}. You refined the world today.',
      '{name}, look how far you\'ve come on this journey.',
      'Every challenge you\'ve overcome has shaped you, {name}.'
    ],
    'ko-KR': [
      '{name}님의 성장은 부인할 수 없습니다. 오늘 세상을 더 나아지게 했습니다.',
      '{name}님, 이 여정에서 얼마나 멀리 왔는지 보세요.',
      '{name}님이 극복한 모든 도전이 당신을 만들었습니다.'
    ],
    'sw-KE': [
      'Ukuaji wako hauwezi kukanushwa, {name}. Umeboresha ulimwengu leo.',
      '{name}, angalia umefika mbali kiasi gani katika safari hii.',
      'Kila changamoto uliyoshinda imekuunda, {name}.'
    ]
  },
  loveInAction: {
    'en-US': [
      '{name}, your work is love made visible.',
      'Through your actions, {name}, you\'re blessing others.',
      'You are a true Global Problem Solver, {name}.'
    ],
    'ko-KR': [
      '{name}님의 일은 눈에 보이는 사랑입니다.',
      '{name}님의 행동을 통해 다른 사람들을 축복하고 있습니다.',
      '{name}님은 진정한 글로벌 문제 해결사입니다.'
    ],
    'sw-KE': [
      '{name}, kazi yako ni upendo unaoonekana.',
      'Kupitia vitendo vyako, {name}, unabariki wengine.',
      'Wewe ni Mtatuzi wa Matatizo wa Ulimwengu wa kweli, {name}.'
    ]
  }
};

/**
 * Praise styles available for users
 */
export const PRAISE_STYLES = {
  motivational: 'motivational',
  gentle: 'gentle',
  epic: 'epic',
  humorous: 'humorous',
  mentor: 'mentor'
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates if a value is a non-empty string
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid string
 */
export const isValidString = (value) => {
  return typeof value === 'string' && value.length > 0;
};

/**
 * Safely converts a value to string
 * @param {*} value - Value to convert
 * @param {string} fallback - Fallback value
 * @returns {string} String value
 */
export const toString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

/**
 * Gets the normalized locale string
 * @param {string} locale - Locale code
 * @returns {string} Normalized locale
 */
export const normalizeLocale = (locale) => {
  if (!locale) return DEFAULT_LOCALE;
  
  const localeMap = {
    'en': SUPPORTED_LOCALES.EN,
    'ko': SUPPORTED_LOCALES.KO,
    'sw': SUPPORTED_LOCALES.SW
  };
  
  const shortCode = locale.split('-')[0].toLowerCase();
  return localeMap[shortCode] || locale || DEFAULT_LOCALE;
};

// =============================================================================
// CASE CONVERSION FUNCTIONS
// =============================================================================

/**
 * Converts string to lowercase
 * @param {string} str - Input string
 * @returns {string} Lowercase string
 */
export const toLowerCase = (str) => {
  return toString(str).toLowerCase();
};

/**
 * Converts string to uppercase
 * @param {string} str - Input string
 * @returns {string} Uppercase string
 */
export const toUpperCase = (str) => {
  return toString(str).toUpperCase();
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  const s = toString(str);
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/**
 * Capitalizes the first letter, keeping rest unchanged
 * @param {string} str - Input string
 * @returns {string} String with first letter capitalized
 */
export const capitalizeFirst = (str) => {
  const s = toString(str);
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Converts string to title case with smart handling
 * @param {string} str - Input string
 * @param {Object} options - Options
 * @param {string} options.locale - Locale for language-specific rules
 * @param {boolean} options.preserveAbbreviations - Keep abbreviations uppercase
 * @returns {string} Title case string
 */
export const toTitleCase = (str, options = {}) => {
  const s = toString(str);
  if (s.length === 0) return s;
  
  const { locale = DEFAULT_LOCALE, preserveAbbreviations = true } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  // Korean doesn't use title case in the same way
  if (normalizedLocale === 'ko-KR') {
    return s;
  }
  
  const words = s.split(/\s+/);
  
  return words.map((word, index) => {
    // Check if it's a preserved abbreviation
    if (preserveAbbreviations) {
      const upperWord = word.toUpperCase();
      if (PRESERVED_ABBREVIATIONS.includes(upperWord)) {
        return upperWord;
      }
    }
    
    // Keep lowercase words lowercase (except at start)
    if (index > 0 && LOWERCASE_WORDS_EN.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    
    return capitalize(word);
  }).join(' ');
};

/**
 * Converts string to sentence case
 * @param {string} str - Input string
 * @returns {string} Sentence case string
 */
export const toSentenceCase = (str) => {
  const s = toString(str).toLowerCase();
  if (s.length === 0) return s;
  
  // Capitalize first letter of each sentence
  return s.replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
};

/**
 * Converts string to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
export const toCamelCase = (str) => {
  const s = toString(str);
  if (s.length === 0) return s;
  
  return s
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
};

/**
 * Converts string to PascalCase
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 */
export const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return capitalizeFirst(camel);
};

/**
 * Converts string to snake_case
 * @param {string} str - Input string
 * @returns {string} snake_case string
 */
export const toSnakeCase = (str) => {
  const s = toString(str);
  if (s.length === 0) return s;
  
  return s
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
};

/**
 * Converts string to kebab-case
 * @param {string} str - Input string
 * @returns {string} kebab-case string
 */
export const toKebabCase = (str) => {
  const s = toString(str);
  if (s.length === 0) return s;
  
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

/**
 * Converts string to CONSTANT_CASE
 * @param {string} str - Input string
 * @returns {string} CONSTANT_CASE string
 */
export const toConstantCase = (str) => {
  return toSnakeCase(str).toUpperCase();
};

// =============================================================================
// TRUNCATION AND ELLIPSIS
// =============================================================================

/**
 * Truncates a string to specified length with ellipsis
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {Object} options - Options
 * @param {string} options.ellipsis - Ellipsis string
 * @param {boolean} options.wordBoundary - Break at word boundary
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength, options = {}) => {
  const s = toString(str);
  if (s.length <= maxLength) return s;
  
  const { ellipsis = '...', wordBoundary = true } = options;
  const truncateAt = maxLength - ellipsis.length;
  
  if (truncateAt <= 0) return ellipsis;
  
  let truncated = s.slice(0, truncateAt);
  
  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > truncateAt * 0.5) {
      truncated = truncated.slice(0, lastSpace);
    }
  }
  
  return truncated.trimEnd() + ellipsis;
};

/**
 * Truncates from the middle of a string
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Middle separator
 * @returns {string} Truncated string
 */
export const truncateMiddle = (str, maxLength, separator = '...') => {
  const s = toString(str);
  if (s.length <= maxLength) return s;
  
  const sepLength = separator.length;
  const charsToShow = maxLength - sepLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  return s.slice(0, frontChars) + separator + s.slice(-backChars);
};

/**
 * Truncates text to word count
 * @param {string} str - Input string
 * @param {number} wordCount - Maximum words
 * @param {string} ellipsis - Ellipsis string
 * @returns {string} Truncated string
 */
export const truncateWords = (str, wordCount, ellipsis = '...') => {
  const s = toString(str);
  const words = s.split(/\s+/);
  
  if (words.length <= wordCount) return s;
  
  return words.slice(0, wordCount).join(' ') + ellipsis;
};

// =============================================================================
// SLUG AND URL UTILITIES
// =============================================================================

/**
 * Converts string to URL-safe slug
 * @param {string} str - Input string
 * @param {Object} options - Options
 * @param {string} options.separator - Word separator
 * @param {boolean} options.lowercase - Convert to lowercase
 * @returns {string} Slug string
 */
export const slugify = (str, options = {}) => {
  const s = toString(str);
  if (s.length === 0) return s;
  
  const { separator = '-', lowercase = true } = options;
  
  let slug = s
    // Replace Korean characters with romanization (simplified)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace non-alphanumeric with separator
    .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+/g, separator)
    // Remove leading/trailing separators
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
    // Remove consecutive separators
    .replace(new RegExp(`${separator}+`, 'g'), separator);
  
  return lowercase ? slug.toLowerCase() : slug;
};

/**
 * Generates a unique ID slug from text
 * @param {string} str - Input string
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique slug
 */
export const generateSlugId = (str, prefix = '') => {
  const slug = slugify(str);
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  
  const parts = [prefix, slug, timestamp, random].filter(Boolean);
  return parts.join('-');
};

/**
 * Extracts initials from a name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum initials to return
 * @returns {string} Initials
 */
export const getInitials = (name, maxInitials = 2) => {
  const s = toString(name).trim();
  if (s.length === 0) return '';
  
  const words = s.split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials;
};

// =============================================================================
// TEXT CLEANING AND SANITIZATION
// =============================================================================

/**
 * Removes extra whitespace from string
 * @param {string} str - Input string
 * @returns {string} Cleaned string
 */
export const normalizeWhitespace = (str) => {
  return toString(str)
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Removes all HTML tags from string
 * @param {string} str - Input string
 * @returns {string} Plain text string
 */
export const stripHtml = (str) => {
  return toString(str)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

/**
 * Escapes HTML special characters
 * @param {string} str - Input string
 * @returns {string} Escaped string
 */
export const escapeHtml = (str) => {
  const s = toString(str);
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return s.replace(/[&<>"']/g, (char) => htmlEntities[char]);
};

/**
 * Removes special characters, keeping alphanumeric and spaces
 * @param {string} str - Input string
 * @param {string} allowedChars - Additional allowed characters
 * @returns {string} Cleaned string
 */
export const removeSpecialChars = (str, allowedChars = '') => {
  const s = toString(str);
  const regex = new RegExp(`[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\s${escapeRegex(allowedChars)}]`, 'g');
  return s.replace(regex, '');
};

/**
 * Escapes special regex characters
 * @param {string} str - Input string
 * @returns {string} Escaped string
 */
export const escapeRegex = (str) => {
  return toString(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// =============================================================================
// SEARCH AND HIGHLIGHT
// =============================================================================

/**
 * Highlights search terms in text
 * @param {string} text - Text to search in
 * @param {string} searchTerm - Term to highlight
 * @param {Object} options - Options
 * @param {string} options.highlightTag - HTML tag for highlighting
 * @param {string} options.highlightClass - CSS class for highlight
 * @param {boolean} options.caseSensitive - Case sensitive search
 * @returns {string} Text with highlighted terms
 */
export const highlightText = (text, searchTerm, options = {}) => {
  const t = toString(text);
  const term = toString(searchTerm);
  
  if (term.length === 0) return t;
  
  const {
    highlightTag = 'mark',
    highlightClass = 'text-highlight',
    caseSensitive = false
  } = options;
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${escapeRegex(term)})`, flags);
  
  return t.replace(regex, `<${highlightTag} class="${highlightClass}">$1</${highlightTag}>`);
};

/**
 * Checks if text contains search term
 * @param {string} text - Text to search in
 * @param {string} searchTerm - Term to find
 * @param {boolean} caseSensitive - Case sensitive search
 * @returns {boolean} True if found
 */
export const containsText = (text, searchTerm, caseSensitive = false) => {
  const t = toString(text);
  const term = toString(searchTerm);
  
  if (caseSensitive) {
    return t.includes(term);
  }
  
  return t.toLowerCase().includes(term.toLowerCase());
};

// =============================================================================
// GPS LAB SPECIFIC FORMATTERS
// =============================================================================

/**
 * Formats a mission title with stage prefix
 * @param {number} stageNumber - Stage number
 * @param {number} missionNumber - Mission number within stage
 * @param {string} title - Mission title
 * @param {Object} options - Formatting options
 * @returns {string} Formatted mission title
 */
export const formatMissionTitle = (stageNumber, missionNumber, title, options = {}) => {
  const { locale = DEFAULT_LOCALE, includeStage = true } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const stageLabel = includeStage ? `S${stageNumber}` : '';
  const missionLabel = `M${missionNumber}`;
  const prefix = includeStage ? `${stageLabel}.${missionLabel}` : missionLabel;
  
  const labels = {
    'en-US': `${prefix}: ${title}`,
    'ko-KR': `${prefix}: ${title}`,
    'sw-KE': `${prefix}: ${title}`
  };
  
  return labels[normalizedLocale] || labels['en-US'];
};

/**
 * Formats a sub-mission (bite) title
 * @param {number} biteNumber - Bite number within mission
 * @param {string} title - Bite title
 * @param {Object} options - Formatting options
 * @returns {string} Formatted bite title
 */
export const formatBiteTitle = (biteNumber, title, options = {}) => {
  const { locale = DEFAULT_LOCALE } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const labels = {
    'en-US': `Bite ${biteNumber}: ${title}`,
    'ko-KR': `바이트 ${biteNumber}: ${title}`,
    'sw-KE': `Bite ${biteNumber}: ${title}`
  };
  
  return labels[normalizedLocale] || labels['en-US'];
};

/**
 * Formats checkpoint completion text
 * @param {number} completed - Completed checkpoints
 * @param {number} total - Total checkpoints
 * @param {Object} options - Formatting options
 * @returns {string} Formatted checkpoint text
 */
export const formatCheckpointText = (completed, total, options = {}) => {
  const { locale = DEFAULT_LOCALE } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const templates = {
    'en-US': `${completed} of ${total} checkpoints completed`,
    'ko-KR': `${total}개 체크포인트 중 ${completed}개 완료`,
    'sw-KE': `Vituo ${completed} kati ya ${total} vimekamilika`
  };
  
  return templates[normalizedLocale] || templates['en-US'];
};

/**
 * Generates a praise message
 * @param {string} name - User's name
 * @param {string} type - Praise type (identity, effort, resilience, growth, loveInAction)
 * @param {Object} options - Options
 * @param {string} options.locale - Locale code
 * @param {string} options.style - Praise style
 * @returns {string} Praise message
 */
export const generatePraise = (name, type = 'effort', options = {}) => {
  const { locale = DEFAULT_LOCALE, style = PRAISE_STYLES.motivational } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const templates = PRAISE_TEMPLATES[type]?.[normalizedLocale] || 
                    PRAISE_TEMPLATES.effort[normalizedLocale] ||
                    PRAISE_TEMPLATES.effort['en-US'];
  
  // Select random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Apply style modifications
  let message = template.replace(/{name}/g, name || 'GPS');
  
  if (style === PRAISE_STYLES.epic) {
    message = message.toUpperCase().replace(/\./g, '!');
  } else if (style === PRAISE_STYLES.gentle) {
    message = message.replace(/!/g, '.');
  }
  
  return message;
};

/**
 * Formats a user's display name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {Object} options - Options
 * @param {string} options.locale - Locale code
 * @param {string} options.format - Format type (full, firstOnly, initials)
 * @returns {string} Formatted name
 */
export const formatDisplayName = (firstName, lastName, options = {}) => {
  const { locale = DEFAULT_LOCALE, format = 'full' } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const first = toString(firstName).trim();
  const last = toString(lastName).trim();
  
  if (!first && !last) return 'Anonymous GPS';
  
  switch (format) {
    case 'firstOnly':
      return first || last;
    case 'initials':
      return getInitials(`${first} ${last}`.trim());
    case 'full':
    default:
      // Korean names: Last First
      if (normalizedLocale === 'ko-KR' && last && first) {
        return `${last}${first}`;
      }
      // Western names: First Last
      return `${first} ${last}`.trim();
  }
};

/**
 * Formats adventure name
 * @param {number} adventureNumber - Adventure number (1-7)
 * @param {Object} options - Options
 * @returns {string} Formatted adventure name
 */
export const formatAdventureName = (adventureNumber, options = {}) => {
  const { locale = DEFAULT_LOCALE, includeNumber = true } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const adventureNames = {
    0: { 'en-US': 'GPO Call', 'ko-KR': 'GPO 콜', 'sw-KE': 'Wito wa GPO' },
    1: { 'en-US': 'GPS 101', 'ko-KR': 'GPS 101', 'sw-KE': 'GPS 101' },
    2: { 'en-US': 'GPS Prep', 'ko-KR': 'GPS 준비', 'sw-KE': 'GPS Maandalizi' },
    3: { 'en-US': 'GPS Simulation', 'ko-KR': 'GPS 시뮬레이션', 'sw-KE': 'GPS Simulizi' },
    4: { 'en-US': 'GPS Capstone 1', 'ko-KR': 'GPS 캡스톤 1', 'sw-KE': 'GPS Capstone 1' },
    5: { 'en-US': 'GPS Capstone 2', 'ko-KR': 'GPS 캡스톤 2', 'sw-KE': 'GPS Capstone 2' },
    6: { 'en-US': 'Venture Acceleration', 'ko-KR': '벤처 액셀러레이션', 'sw-KE': 'Kuongeza Kasi' },
    7: { 'en-US': 'Venture Capitalization', 'ko-KR': '벤처 캐피탈라이제이션', 'sw-KE': 'Uwekezaji' }
  };
  
  const name = adventureNames[adventureNumber]?.[normalizedLocale] || 
               adventureNames[adventureNumber]?.['en-US'] || 
               'Unknown Adventure';
  
  if (includeNumber && adventureNumber > 0) {
    return `Adventure ${adventureNumber}: ${name}`;
  }
  
  return name;
};

/**
 * Formats problem statement text
 * @param {string} problem - Problem text
 * @param {Object} options - Options
 * @returns {string} Formatted problem statement
 */
export const formatProblemStatement = (problem, options = {}) => {
  const { maxLength = 200, locale = DEFAULT_LOCALE } = options;
  
  let formatted = normalizeWhitespace(toString(problem));
  
  if (formatted.length > maxLength) {
    formatted = truncate(formatted, maxLength, { wordBoundary: true });
  }
  
  return formatted;
};

// =============================================================================
// PLURALIZATION
// =============================================================================

/**
 * Pluralizes a word based on count
 * @param {number} count - Count value
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @param {Object} options - Options
 * @returns {string} Pluralized string with count
 */
export const pluralize = (count, singular, plural, options = {}) => {
  const { includeCount = true, locale = DEFAULT_LOCALE } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  // Korean doesn't typically pluralize
  if (normalizedLocale === 'ko-KR') {
    return includeCount ? `${count}${singular}` : singular;
  }
  
  const word = count === 1 ? singular : plural;
  return includeCount ? `${count} ${word}` : word;
};

/**
 * Common GPS Lab pluralizations
 */
export const pluralizeGPS = {
  mission: (count, options) => pluralize(count, 'mission', 'missions', options),
  bite: (count, options) => pluralize(count, 'bite', 'bites', options),
  checkpoint: (count, options) => pluralize(count, 'checkpoint', 'checkpoints', options),
  stage: (count, options) => pluralize(count, 'stage', 'stages', options),
  adventure: (count, options) => pluralize(count, 'adventure', 'adventures', options),
  baraka: (count, options) => pluralize(count, 'Baraka', 'Baraka', options), // Baraka doesn't pluralize
  member: (count, options) => pluralize(count, 'member', 'members', options),
  project: (count, options) => pluralize(count, 'project', 'projects', options)
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  PRESERVED_ABBREVIATIONS,
  LOWERCASE_WORDS_EN,
  PRAISE_TEMPLATES,
  PRAISE_STYLES,
  
  // Helpers
  isValidString,
  toString,
  normalizeLocale,
  
  // Case conversion
  toLowerCase,
  toUpperCase,
  capitalize,
  capitalizeFirst,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  
  // Truncation
  truncate,
  truncateMiddle,
  truncateWords,
  
  // Slug and URL
  slugify,
  generateSlugId,
  getInitials,
  
  // Cleaning
  normalizeWhitespace,
  stripHtml,
  escapeHtml,
  removeSpecialChars,
  escapeRegex,
  
  // Search
  highlightText,
  containsText,
  
  // GPS Lab specific
  formatMissionTitle,
  formatBiteTitle,
  formatCheckpointText,
  generatePraise,
  formatDisplayName,
  formatAdventureName,
  formatProblemStatement,
  
  // Pluralization
  pluralize,
  pluralizeGPS
};