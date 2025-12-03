/**
 * GPS Lab Platform - Currency Formatter Utilities
 * 
 * Comprehensive currency formatting functions for the GPS Lab MMORPG educational platform.
 * Handles Baraka currency, PSB (Project-Specific Baraka), and fiat currencies (USD, KRW).
 * Supports multi-language formatting (EN, KO, SW) and covenant economy calculations.
 * 
 * @module utils/formatters/currency.formatter
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
 * Currency codes and symbols
 */
export const CURRENCIES = {
  // GPS Lab currencies
  BARAKA: {
    code: 'BARAKA',
    symbol: '₿',
    name: 'Baraka',
    names: {
      'en-US': 'Baraka',
      'ko-KR': '바라카',
      'sw-KE': 'Baraka'
    },
    decimals: 0,
    isDigital: true
  },
  PSB: {
    code: 'PSB',
    symbol: '◈',
    name: 'Project-Specific Baraka',
    names: {
      'en-US': 'Project-Specific Baraka',
      'ko-KR': '프로젝트 바라카',
      'sw-KE': 'Baraka ya Mradi'
    },
    decimals: 0,
    isDigital: true
  },
  
  // Fiat currencies
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    names: {
      'en-US': 'US Dollar',
      'ko-KR': '미국 달러',
      'sw-KE': 'Dola ya Marekani'
    },
    decimals: 2,
    position: 'before',
    isDigital: false
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'Korean Won',
    names: {
      'en-US': 'Korean Won',
      'ko-KR': '원',
      'sw-KE': 'Won ya Korea'
    },
    decimals: 0,
    position: 'before',
    isDigital: false
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    names: {
      'en-US': 'Kenyan Shilling',
      'ko-KR': '케냐 실링',
      'sw-KE': 'Shilingi ya Kenya'
    },
    decimals: 2,
    position: 'before',
    isDigital: false
  }
};

/**
 * Subscription tier pricing (monthly)
 */
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    price: 0,
    returnAmount: 0,
    name: {
      'en-US': 'Free',
      'ko-KR': '무료',
      'sw-KE': 'Bure'
    }
  },
  CONTENDER: {
    id: 'contender',
    price: 19,
    returnAmount: 9.50,
    returnRate: 0.50,
    name: {
      'en-US': 'Contender',
      'ko-KR': '컨텐더',
      'sw-KE': 'Mshindani'
    }
  },
  PATHFINDER: {
    id: 'pathfinder',
    price: 49,
    returnAmount: 24.50,
    returnRate: 0.50,
    name: {
      'en-US': 'Pathfinder',
      'ko-KR': '패스파인더',
      'sw-KE': 'Mpitia Njia'
    }
  },
  NAVIGATORS_CIRCLE: {
    id: 'navigators-circle',
    price: 149,
    returnAmount: 74.50,
    returnRate: 0.50,
    name: {
      'en-US': "Navigator's Circle",
      'ko-KR': '네비게이터 서클',
      'sw-KE': 'Duara la Navigator'
    }
  }
};

/**
 * Adventure pricing (one-time payments)
 */
export const ADVENTURE_PRICING = {
  ADVENTURE_4: {
    id: 'adventure-4',
    stage: '16-20',
    price: 5000,
    returnAmount: 2500,
    returnRate: 0.50,
    name: {
      'en-US': 'GPS Capstone 1 (MVP)',
      'ko-KR': 'GPS 캡스톤 1 (MVP)',
      'sw-KE': 'GPS Capstone 1 (MVP)'
    }
  },
  ADVENTURE_5: {
    id: 'adventure-5',
    stage: '21-25',
    price: 10000,
    returnAmount: 5000,
    returnRate: 0.50,
    name: {
      'en-US': 'GPS Capstone 2 (Company)',
      'ko-KR': 'GPS 캡스톤 2 (회사설립)',
      'sw-KE': 'GPS Capstone 2 (Kampuni)'
    }
  },
  ADVENTURE_6: {
    id: 'adventure-6',
    stage: '26-30',
    price: 15000,
    returnAmount: 7500,
    returnRate: 0.50,
    name: {
      'en-US': 'Venture Acceleration',
      'ko-KR': '벤처 액셀러레이션',
      'sw-KE': 'Kuongeza Kasi ya Biashara'
    }
  },
  ADVENTURE_7: {
    id: 'adventure-7',
    stage: '31-35',
    price: 20000,
    returnAmount: 10000,
    returnRate: 0.50,
    name: {
      'en-US': 'Venture Capitalization',
      'ko-KR': '벤처 캐피탈라이제이션',
      'sw-KE': 'Uwekezaji wa Biashara'
    }
  }
};

/**
 * PSB issuance caps by adventure
 */
export const PSB_ISSUANCE_CAPS = {
  ADVENTURE_4: { newIssue: 100000, authorizedTotal: 100000 },
  ADVENTURE_5: { newIssue: 200000, authorizedTotal: 300000 },
  ADVENTURE_6: { newIssue: 300000, authorizedTotal: 600000 },
  ADVENTURE_7: { newIssue: 400000, authorizedTotal: 1000000 }
};

/**
 * Baraka issuance schedule by adventure
 */
export const BARAKA_ISSUANCE = {
  GPS_101: { newIssue: 5000, authorizedTotal: 5000 },
  GPS_PREP: { newIssue: 15000, authorizedTotal: 20000 },
  GPS_SIMULATION: { newIssue: 80000, authorizedTotal: 100000 },
  GPS_CAPSTONE_1: { newIssue: 250000, authorizedTotal: 350000 },
  GPS_CAPSTONE_2: { newIssue: 250000, authorizedTotal: 600000 },
  VENTURE_ACCELERATION: { newIssue: 200000, authorizedTotal: 800000 },
  VENTURE_CAPITALIZATION: { newIssue: 200000, authorizedTotal: 1000000 }
};

/**
 * Covenant return percentage (50% return policy)
 */
export const COVENANT_RETURN_RATE = 0.50;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates if a value is a valid number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

/**
 * Converts value to number safely
 * @param {*} value - Value to convert
 * @param {number} fallback - Fallback value if conversion fails
 * @returns {number} Converted number or fallback
 */
export const toNumber = (value, fallback = 0) => {
  if (!isValidNumber(value)) return fallback;
  return Number(value);
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

/**
 * Gets currency configuration
 * @param {string} currencyCode - Currency code
 * @returns {Object} Currency configuration
 */
export const getCurrencyConfig = (currencyCode) => {
  const code = currencyCode?.toUpperCase();
  return CURRENCIES[code] || CURRENCIES.USD;
};

// =============================================================================
// CORE CURRENCY FORMATTING
// =============================================================================

/**
 * Formats a fiat currency amount
 * @param {number|string} amount - Amount to format
 * @param {string} currencyCode - Currency code (USD, KRW, KES)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatFiatCurrency = (amount, currencyCode = 'USD', options = {}) => {
  const num = toNumber(amount);
  const currency = getCurrencyConfig(currencyCode);
  
  const {
    locale = DEFAULT_LOCALE,
    showSymbol = true,
    showCode = false,
    minimumFractionDigits = currency.decimals,
    maximumFractionDigits = currency.decimals
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  try {
    const formatted = num.toLocaleString(normalizedLocale, {
      minimumFractionDigits,
      maximumFractionDigits
    });
    
    if (!showSymbol && !showCode) return formatted;
    
    const symbol = showSymbol ? currency.symbol : '';
    const code = showCode ? ` ${currency.code}` : '';
    
    return `${symbol}${formatted}${code}`;
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency.symbol}${num.toFixed(currency.decimals)}`;
  }
};

/**
 * Formats USD currency
 * @param {number|string} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted USD string
 */
export const formatUSD = (amount, options = {}) => {
  return formatFiatCurrency(amount, 'USD', options);
};

/**
 * Formats KRW currency
 * @param {number|string} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted KRW string
 */
export const formatKRW = (amount, options = {}) => {
  return formatFiatCurrency(amount, 'KRW', options);
};

/**
 * Formats KES currency
 * @param {number|string} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted KES string
 */
export const formatKES = (amount, options = {}) => {
  return formatFiatCurrency(amount, 'KES', options);
};

// =============================================================================
// BARAKA CURRENCY FORMATTING
// =============================================================================

/**
 * Formats Baraka amount
 * @param {number|string} amount - Baraka amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted Baraka string
 */
export const formatBaraka = (amount, options = {}) => {
  const num = toNumber(amount);
  const currency = CURRENCIES.BARAKA;
  
  const {
    locale = DEFAULT_LOCALE,
    showSymbol = true,
    showName = false,
    compact = false
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  let formatted;
  if (compact && Math.abs(num) >= 1000) {
    formatted = formatCompactNumber(num, normalizedLocale);
  } else {
    formatted = num.toLocaleString(normalizedLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  if (!showSymbol && !showName) return formatted;
  
  const symbol = showSymbol ? currency.symbol : '';
  const name = showName ? ` ${currency.names[normalizedLocale] || currency.name}` : '';
  
  return `${symbol}${formatted}${name}`;
};

/**
 * Formats Baraka change with sign
 * @param {number|string} amount - Change amount
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted change with metadata
 */
export const formatBarakaChange = (amount, options = {}) => {
  const num = toNumber(amount);
  const isPositive = num >= 0;
  const prefix = isPositive ? '+' : '';
  
  const formatted = formatBaraka(num, options);
  
  return {
    text: `${prefix}${formatted}`,
    value: num,
    isPositive,
    isNegative: num < 0,
    isZero: num === 0,
    cssClass: isPositive ? 'currency-positive' : (num < 0 ? 'currency-negative' : 'currency-neutral')
  };
};

/**
 * Formats Baraka balance with additional metadata
 * @param {number|string} balance - Current balance
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted balance with display info
 */
export const formatBarakaBalance = (balance, options = {}) => {
  const num = toNumber(balance);
  const { locale = DEFAULT_LOCALE } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  return {
    formatted: formatBaraka(num, options),
    compact: formatBaraka(num, { ...options, compact: true }),
    value: num,
    symbol: CURRENCIES.BARAKA.symbol,
    name: CURRENCIES.BARAKA.names[normalizedLocale] || CURRENCIES.BARAKA.name,
    isEmpty: num === 0,
    tier: getBarakaTier(num)
  };
};

/**
 * Gets Baraka tier based on balance
 * @param {number} balance - Baraka balance
 * @returns {Object} Tier information
 */
export const getBarakaTier = (balance) => {
  const num = toNumber(balance);
  
  if (num >= 1000000) {
    return { id: 'legendary', name: 'Legendary', color: '#FFD700', minBalance: 1000000 };
  }
  if (num >= 500000) {
    return { id: 'master', name: 'Master', color: '#A855F7', minBalance: 500000 };
  }
  if (num >= 100000) {
    return { id: 'expert', name: 'Expert', color: '#3B82F6', minBalance: 100000 };
  }
  if (num >= 50000) {
    return { id: 'advanced', name: 'Advanced', color: '#22C55E', minBalance: 50000 };
  }
  if (num >= 10000) {
    return { id: 'intermediate', name: 'Intermediate', color: '#EAB308', minBalance: 10000 };
  }
  if (num >= 1000) {
    return { id: 'beginner', name: 'Beginner', color: '#F97316', minBalance: 1000 };
  }
  return { id: 'starter', name: 'Starter', color: '#6B7280', minBalance: 0 };
};

// =============================================================================
// PSB (PROJECT-SPECIFIC BARAKA) FORMATTING
// =============================================================================

/**
 * Formats PSB amount
 * @param {number|string} amount - PSB amount
 * @param {string} projectCode - Project identifier
 * @param {Object} options - Formatting options
 * @returns {string} Formatted PSB string
 */
export const formatPSB = (amount, projectCode = '', options = {}) => {
  const num = toNumber(amount);
  const currency = CURRENCIES.PSB;
  
  const {
    locale = DEFAULT_LOCALE,
    showSymbol = true,
    showCode = true,
    compact = false
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  let formatted;
  if (compact && Math.abs(num) >= 1000) {
    formatted = formatCompactNumber(num, normalizedLocale);
  } else {
    formatted = num.toLocaleString(normalizedLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  const symbol = showSymbol ? currency.symbol : '';
  const code = showCode && projectCode ? `[${projectCode}]` : '';
  
  return `${symbol}${formatted} ${code}PSB`.trim();
};

/**
 * Formats PSB issuance cap information
 * @param {string} adventureKey - Adventure key (ADVENTURE_4, ADVENTURE_5, etc.)
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted issuance info
 */
export const formatPSBIssuanceCap = (adventureKey, options = {}) => {
  const cap = PSB_ISSUANCE_CAPS[adventureKey];
  if (!cap) return null;
  
  const { locale = DEFAULT_LOCALE } = options;
  
  return {
    newIssue: formatPSB(cap.newIssue, '', { ...options, showCode: false }),
    authorizedTotal: formatPSB(cap.authorizedTotal, '', { ...options, showCode: false }),
    values: {
      newIssue: cap.newIssue,
      authorizedTotal: cap.authorizedTotal
    }
  };
};

// =============================================================================
// COVENANT ECONOMY FORMATTING
// =============================================================================

/**
 * Calculates and formats covenant return
 * @param {number|string} totalAmount - Total payment amount
 * @param {number} returnRate - Return rate (default 50%)
 * @param {Object} options - Formatting options
 * @returns {Object} Covenant return breakdown
 */
export const formatCovenantReturn = (totalAmount, returnRate = COVENANT_RETURN_RATE, options = {}) => {
  const total = toNumber(totalAmount);
  const rate = toNumber(returnRate, COVENANT_RETURN_RATE);
  
  const returnAmount = total * rate;
  const netPayment = total - returnAmount;
  
  const { locale = DEFAULT_LOCALE, currencyCode = 'USD' } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const formatOptions = { locale: normalizedLocale };
  
  return {
    total: formatFiatCurrency(total, currencyCode, formatOptions),
    returnAmount: formatFiatCurrency(returnAmount, currencyCode, formatOptions),
    netPayment: formatFiatCurrency(netPayment, currencyCode, formatOptions),
    returnPercentage: `${Math.round(rate * 100)}%`,
    values: {
      total,
      returnAmount,
      netPayment,
      returnRate: rate
    },
    breakdown: {
      taSupport: formatFiatCurrency(returnAmount * 0.3, currencyCode, formatOptions),
      dataSubsidy: formatFiatCurrency(returnAmount * 0.2, currencyCode, formatOptions),
      deviceSubsidy: formatFiatCurrency(returnAmount * 0.2, currencyCode, formatOptions),
      missionCredits: formatFiatCurrency(returnAmount * 0.3, currencyCode, formatOptions)
    }
  };
};

/**
 * Formats subscription tier pricing
 * @param {string} tierKey - Tier key (CONTENDER, PATHFINDER, NAVIGATORS_CIRCLE)
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted tier pricing
 */
export const formatSubscriptionTier = (tierKey, options = {}) => {
  const tier = SUBSCRIPTION_TIERS[tierKey?.toUpperCase()];
  if (!tier) return null;
  
  const { locale = DEFAULT_LOCALE, currencyCode = 'USD', billingPeriod = 'monthly' } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const formatOptions = { locale: normalizedLocale };
  
  // Calculate annual pricing
  const annualPrice = tier.price * 12;
  const annualReturn = tier.returnAmount * 12;
  
  const periodLabels = {
    monthly: {
      'en-US': '/month',
      'ko-KR': '/월',
      'sw-KE': '/mwezi'
    },
    annual: {
      'en-US': '/year',
      'ko-KR': '/년',
      'sw-KE': '/mwaka'
    }
  };
  
  const periodLabel = periodLabels[billingPeriod]?.[normalizedLocale] || periodLabels[billingPeriod]?.['en-US'];
  
  return {
    id: tier.id,
    name: tier.name[normalizedLocale] || tier.name['en-US'],
    price: formatFiatCurrency(tier.price, currencyCode, formatOptions),
    priceWithPeriod: `${formatFiatCurrency(tier.price, currencyCode, formatOptions)}${periodLabel}`,
    returnAmount: formatFiatCurrency(tier.returnAmount, currencyCode, formatOptions),
    annual: {
      price: formatFiatCurrency(annualPrice, currencyCode, formatOptions),
      returnAmount: formatFiatCurrency(annualReturn, currencyCode, formatOptions)
    },
    values: {
      price: tier.price,
      returnAmount: tier.returnAmount,
      returnRate: tier.returnRate,
      annualPrice,
      annualReturn
    }
  };
};

/**
 * Formats adventure pricing
 * @param {string} adventureKey - Adventure key
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted adventure pricing
 */
export const formatAdventurePricing = (adventureKey, options = {}) => {
  const adventure = ADVENTURE_PRICING[adventureKey?.toUpperCase()];
  if (!adventure) return null;
  
  const { locale = DEFAULT_LOCALE, currencyCode = 'USD' } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  const formatOptions = { locale: normalizedLocale };
  
  return {
    id: adventure.id,
    name: adventure.name[normalizedLocale] || adventure.name['en-US'],
    stage: adventure.stage,
    price: formatFiatCurrency(adventure.price, currencyCode, formatOptions),
    returnAmount: formatFiatCurrency(adventure.returnAmount, currencyCode, formatOptions),
    netCost: formatFiatCurrency(adventure.price - adventure.returnAmount, currencyCode, formatOptions),
    returnPercentage: `${Math.round(adventure.returnRate * 100)}%`,
    values: {
      price: adventure.price,
      returnAmount: adventure.returnAmount,
      netCost: adventure.price - adventure.returnAmount,
      returnRate: adventure.returnRate
    }
  };
};

/**
 * Formats Baraka issuance schedule
 * @param {string} adventureKey - Adventure key
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted issuance info
 */
export const formatBarakaIssuance = (adventureKey, options = {}) => {
  const issuance = BARAKA_ISSUANCE[adventureKey?.toUpperCase()];
  if (!issuance) return null;
  
  return {
    newIssue: formatBaraka(issuance.newIssue, options),
    authorizedTotal: formatBaraka(issuance.authorizedTotal, options),
    values: {
      newIssue: issuance.newIssue,
      authorizedTotal: issuance.authorizedTotal
    }
  };
};

// =============================================================================
// CURRENCY CONVERSION
// =============================================================================

/**
 * Exchange rates (simplified - in production, use real-time rates)
 */
const EXCHANGE_RATES = {
  USD: {
    KRW: 1300,
    KES: 150,
    USD: 1
  },
  KRW: {
    USD: 1/1300,
    KES: 150/1300,
    KRW: 1
  },
  KES: {
    USD: 1/150,
    KRW: 1300/150,
    KES: 1
  }
};

/**
 * Converts between fiat currencies
 * @param {number|string} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} options - Formatting options
 * @returns {Object} Converted amount with metadata
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, options = {}) => {
  const num = toNumber(amount);
  const from = fromCurrency?.toUpperCase() || 'USD';
  const to = toCurrency?.toUpperCase() || 'USD';
  
  const rate = EXCHANGE_RATES[from]?.[to] || 1;
  const convertedAmount = num * rate;
  
  return {
    original: formatFiatCurrency(num, from, options),
    converted: formatFiatCurrency(convertedAmount, to, options),
    rate: rate.toFixed(4),
    values: {
      original: num,
      converted: convertedAmount,
      rate
    }
  };
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats a number in compact notation
 * @param {number} num - Number to format
 * @param {string} locale - Locale code
 * @returns {string} Compact formatted number
 */
const formatCompactNumber = (num, locale = DEFAULT_LOCALE) => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  // Korean uses different magnitude system
  if (locale === 'ko-KR') {
    if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(1)}조`;
    if (absNum >= 1e8) return `${sign}${(absNum / 1e8).toFixed(1)}억`;
    if (absNum >= 1e4) return `${sign}${(absNum / 1e4).toFixed(1)}만`;
    if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(1)}천`;
    return num.toString();
  }
  
  // Standard K/M/B notation
  if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(1)}T`;
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(1)}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(1)}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(1)}K`;
  
  return num.toString();
};

/**
 * Parses a currency string to number
 * @param {string} currencyString - Formatted currency string
 * @returns {number} Parsed number
 */
export const parseCurrencyString = (currencyString) => {
  if (!currencyString || typeof currencyString !== 'string') return 0;
  
  // Remove currency symbols and formatting
  const cleaned = currencyString
    .replace(/[₿◈$₩KSh]/g, '')
    .replace(/[,\s]/g, '')
    .replace(/[KMB조억만천]/gi, (match) => {
      const multipliers = {
        'K': '000',
        'M': '000000',
        'B': '000000000',
        '조': '000000000000',
        '억': '00000000',
        '만': '0000',
        '천': '000'
      };
      return multipliers[match] || '';
    });
  
  return toNumber(cleaned);
};

/**
 * Validates currency amount
 * @param {number|string} amount - Amount to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateCurrencyAmount = (amount, options = {}) => {
  const num = toNumber(amount);
  const { min = 0, max = Infinity, currencyCode = 'BARAKA' } = options;
  
  const isValid = isValidNumber(amount) && num >= min && num <= max;
  
  return {
    isValid,
    value: num,
    errors: {
      isInvalid: !isValidNumber(amount),
      isBelowMin: num < min,
      isAboveMax: num > max
    },
    message: !isValid 
      ? (num < min ? `Minimum amount is ${min}` : (num > max ? `Maximum amount is ${max}` : 'Invalid amount'))
      : null
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  CURRENCIES,
  SUBSCRIPTION_TIERS,
  ADVENTURE_PRICING,
  PSB_ISSUANCE_CAPS,
  BARAKA_ISSUANCE,
  COVENANT_RETURN_RATE,
  
  // Helpers
  isValidNumber,
  toNumber,
  normalizeLocale,
  getCurrencyConfig,
  
  // Fiat currency
  formatFiatCurrency,
  formatUSD,
  formatKRW,
  formatKES,
  
  // Baraka
  formatBaraka,
  formatBarakaChange,
  formatBarakaBalance,
  getBarakaTier,
  
  // PSB
  formatPSB,
  formatPSBIssuanceCap,
  
  // Covenant economy
  formatCovenantReturn,
  formatSubscriptionTier,
  formatAdventurePricing,
  formatBarakaIssuance,
  
  // Conversion
  convertCurrency,
  parseCurrencyString,
  validateCurrencyAmount
};