/**
 * GPS Lab Platform - i18n Service
 * 
 * Internationalization service for multi-language support
 * including translations, formatting, and locale management.
 * 
 * @module services/i18n/i18n.service
 * @version 1.0.0
 */

import { getLocale, setLocale, subscribeToKey } from '../storage/localStorage.service';

// =============================================================================
// CONFIGURATION
// =============================================================================

const I18N_CONFIG = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  supportedLocales: ['en', 'ko', 'sw'],
  loadPath: '/locales/{{locale}}/{{namespace}}.json'
};

// =============================================================================
// LOCALE CONSTANTS
// =============================================================================

export const LOCALES = {
  EN: 'en',
  KO: 'ko',
  SW: 'sw'
};

export const LOCALE_INFO = {
  [LOCALES.EN]: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  [LOCALES.KO]: {
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    flag: '🇰🇷'
  },
  [LOCALES.SW]: {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    direction: 'ltr',
    flag: '🇰🇪'
  }
};

export const NAMESPACES = {
  COMMON: 'common',
  AUTH: 'auth',
  MISSIONS: 'missions',
  BITES: 'bites',
  BARAKA: 'baraka',
  PRAISE: 'praise',
  PARTY: 'party',
  SETTINGS: 'settings',
  ERRORS: 'errors'
};

// =============================================================================
// I18N SERVICE CLASS
// =============================================================================

class I18nService {
  constructor() {
    this.currentLocale = I18N_CONFIG.defaultLocale;
    this.translations = new Map();
    this.loadedNamespaces = new Set();
    this.listeners = new Set();
    this.initialized = false;
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initializes i18n service
   * @param {Object} options - Init options
   */
  async initialize(options = {}) {
    if (this.initialized) return;
    
    // Get stored locale or detect from browser
    const storedLocale = getLocale();
    const browserLocale = this.detectBrowserLocale();
    
    this.currentLocale = storedLocale || browserLocale || I18N_CONFIG.defaultLocale;
    
    // Load common namespace
    await this.loadNamespace(NAMESPACES.COMMON);
    
    // Listen for locale changes across tabs
    subscribeToKey('gps_locale', (newLocale) => {
      if (newLocale && newLocale !== this.currentLocale) {
        this.changeLocale(newLocale, false);
      }
    });
    
    this.initialized = true;
  }
  
  /**
   * Detects browser locale
   * @returns {string|null} Detected locale
   */
  detectBrowserLocale() {
    const browserLang = navigator.language?.split('-')[0];
    
    if (I18N_CONFIG.supportedLocales.includes(browserLang)) {
      return browserLang;
    }
    
    return null;
  }
  
  // ===========================================================================
  // TRANSLATION LOADING
  // ===========================================================================
  
  /**
   * Loads translations for a namespace
   * @param {string} namespace - Namespace to load
   * @param {string} locale - Locale to load for
   */
  async loadNamespace(namespace, locale = this.currentLocale) {
    const cacheKey = `${locale}:${namespace}`;
    
    if (this.loadedNamespaces.has(cacheKey)) {
      return;
    }
    
    try {
      const path = I18N_CONFIG.loadPath
        .replace('{{locale}}', locale)
        .replace('{{namespace}}', namespace);
      
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${path}`);
      }
      
      const translations = await response.json();
      
      // Store translations
      if (!this.translations.has(locale)) {
        this.translations.set(locale, new Map());
      }
      
      this.translations.get(locale).set(namespace, translations);
      this.loadedNamespaces.add(cacheKey);
    } catch (error) {
      console.error(`Error loading translations for ${namespace}:`, error);
      
      // Try fallback locale
      if (locale !== I18N_CONFIG.fallbackLocale) {
        await this.loadNamespace(namespace, I18N_CONFIG.fallbackLocale);
      }
    }
  }
  
  /**
   * Loads multiple namespaces
   * @param {Array<string>} namespaces - Namespaces to load
   */
  async loadNamespaces(namespaces) {
    await Promise.all(namespaces.map(ns => this.loadNamespace(ns)));
  }
  
  // ===========================================================================
  // TRANSLATION
  // ===========================================================================
  
  /**
   * Translates a key
   * @param {string} key - Translation key (namespace:key.path)
   * @param {Object} params - Interpolation params
   * @returns {string} Translated string
   */
  t(key, params = {}) {
    const [namespace, path] = this.parseKey(key);
    
    // Try current locale
    let translation = this.getTranslation(this.currentLocale, namespace, path);
    
    // Fallback to default locale
    if (!translation && this.currentLocale !== I18N_CONFIG.fallbackLocale) {
      translation = this.getTranslation(I18N_CONFIG.fallbackLocale, namespace, path);
    }
    
    // Return key if no translation found
    if (!translation) {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
    
    // Interpolate params
    return this.interpolate(translation, params);
  }
  
  /**
   * Parses translation key
   * @param {string} key - Key to parse
   * @returns {Array} [namespace, path]
   */
  parseKey(key) {
    const colonIndex = key.indexOf(':');
    
    if (colonIndex === -1) {
      return [NAMESPACES.COMMON, key];
    }
    
    return [key.slice(0, colonIndex), key.slice(colonIndex + 1)];
  }
  
  /**
   * Gets translation from cache
   * @param {string} locale - Locale
   * @param {string} namespace - Namespace
   * @param {string} path - Key path
   * @returns {string|null} Translation
   */
  getTranslation(locale, namespace, path) {
    const localeTranslations = this.translations.get(locale);
    if (!localeTranslations) return null;
    
    const nsTranslations = localeTranslations.get(namespace);
    if (!nsTranslations) return null;
    
    // Navigate nested path
    const keys = path.split('.');
    let value = nsTranslations;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return typeof value === 'string' ? value : null;
  }
  
  /**
   * Interpolates params into translation
   * @param {string} template - Translation template
   * @param {Object} params - Params to interpolate
   * @returns {string} Interpolated string
   */
  interpolate(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }
  
  // ===========================================================================
  // LOCALE MANAGEMENT
  // ===========================================================================
  
  /**
   * Changes current locale
   * @param {string} locale - New locale
   * @param {boolean} persist - Whether to persist to storage
   */
  async changeLocale(locale, persist = true) {
    if (!I18N_CONFIG.supportedLocales.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`);
      return;
    }
    
    // Load common namespace for new locale
    await this.loadNamespace(NAMESPACES.COMMON, locale);
    
    // Reload currently loaded namespaces
    const namespacesToReload = Array.from(this.loadedNamespaces)
      .filter(key => key.startsWith(`${this.currentLocale}:`))
      .map(key => key.split(':')[1]);
    
    for (const ns of namespacesToReload) {
      await this.loadNamespace(ns, locale);
    }
    
    this.currentLocale = locale;
    
    if (persist) {
      setLocale(locale);
    }
    
    // Update document
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_INFO[locale]?.direction || 'ltr';
    
    // Notify listeners
    this.notifyListeners();
  }
  
  /**
   * Gets current locale
   * @returns {string} Current locale
   */
  getLocale() {
    return this.currentLocale;
  }
  
  /**
   * Gets locale info
   * @param {string} locale - Locale code
   * @returns {Object} Locale info
   */
  getLocaleInfo(locale = this.currentLocale) {
    return LOCALE_INFO[locale] || LOCALE_INFO[I18N_CONFIG.defaultLocale];
  }
  
  /**
   * Gets all supported locales
   * @returns {Array} Supported locales with info
   */
  getSupportedLocales() {
    return I18N_CONFIG.supportedLocales.map(locale => ({
      code: locale,
      ...LOCALE_INFO[locale]
    }));
  }
  
  // ===========================================================================
  // FORMATTING
  // ===========================================================================
  
  /**
   * Formats number according to locale
   * @param {number} value - Number to format
   * @param {Object} options - Intl.NumberFormat options
   * @returns {string} Formatted number
   */
  formatNumber(value, options = {}) {
    return new Intl.NumberFormat(this.currentLocale, options).format(value);
  }
  
  /**
   * Formats currency
   * @param {number} value - Value to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency
   */
  formatCurrency(value, currency = 'USD') {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency
    }).format(value);
  }
  
  /**
   * Formats date
   * @param {Date|string|number} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  formatDate(date, options = {}) {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(this.currentLocale, options).format(dateObj);
  }
  
  /**
   * Formats relative time
   * @param {number} value - Value
   * @param {string} unit - Unit (seconds, minutes, hours, days, etc.)
   * @returns {string} Formatted relative time
   */
  formatRelativeTime(value, unit) {
    return new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: 'auto'
    }).format(value, unit);
  }
  
  /**
   * Formats list
   * @param {Array} items - Items to format
   * @param {Object} options - Intl.ListFormat options
   * @returns {string} Formatted list
   */
  formatList(items, options = { type: 'conjunction' }) {
    return new Intl.ListFormat(this.currentLocale, options).format(items);
  }
  
  // ===========================================================================
  // PLURALIZATION
  // ===========================================================================
  
  /**
   * Gets plural form of translation
   * @param {string} key - Translation key
   * @param {number} count - Count for pluralization
   * @param {Object} params - Additional params
   * @returns {string} Pluralized translation
   */
  plural(key, count, params = {}) {
    const pluralRules = new Intl.PluralRules(this.currentLocale);
    const pluralForm = pluralRules.select(count);
    
    // Try specific plural form (e.g., key_one, key_other)
    let translation = this.t(`${key}_${pluralForm}`, { ...params, count });
    
    // Fallback to base key
    if (translation === `${key}_${pluralForm}`) {
      translation = this.t(key, { ...params, count });
    }
    
    return translation;
  }
  
  // ===========================================================================
  // LISTENERS
  // ===========================================================================
  
  /**
   * Adds locale change listener
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onLocaleChange(callback) {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  /**
   * Notifies all listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentLocale);
      } catch (error) {
        console.error('Error in locale change listener:', error);
      }
    });
  }
  
  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  
  /**
   * Checks if key exists
   * @param {string} key - Translation key
   * @returns {boolean} True if exists
   */
  exists(key) {
    const [namespace, path] = this.parseKey(key);
    return this.getTranslation(this.currentLocale, namespace, path) !== null;
  }
  
  /**
   * Gets direction for current locale
   * @returns {string} 'ltr' or 'rtl'
   */
  getDirection() {
    return LOCALE_INFO[this.currentLocale]?.direction || 'ltr';
  }
  
  /**
   * Checks if current locale is RTL
   * @returns {boolean} True if RTL
   */
  isRTL() {
    return this.getDirection() === 'rtl';
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

const i18nService = new I18nService();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export const initialize = (options) => i18nService.initialize(options);
export const t = (key, params) => i18nService.t(key, params);
export const plural = (key, count, params) => i18nService.plural(key, count, params);
export const changeLocale = (locale) => i18nService.changeLocale(locale);
export const getLocale = () => i18nService.getLocale();
export const getLocaleInfo = (locale) => i18nService.getLocaleInfo(locale);
export const getSupportedLocales = () => i18nService.getSupportedLocales();
export const loadNamespace = (ns) => i18nService.loadNamespace(ns);
export const loadNamespaces = (ns) => i18nService.loadNamespaces(ns);
export const formatNumber = (value, options) => i18nService.formatNumber(value, options);
export const formatCurrency = (value, currency) => i18nService.formatCurrency(value, currency);
export const formatDate = (date, options) => i18nService.formatDate(date, options);
export const formatRelativeTime = (value, unit) => i18nService.formatRelativeTime(value, unit);
export const formatList = (items, options) => i18nService.formatList(items, options);
export const onLocaleChange = (callback) => i18nService.onLocaleChange(callback);
export const exists = (key) => i18nService.exists(key);
export const getDirection = () => i18nService.getDirection();
export const isRTL = () => i18nService.isRTL();

// =============================================================================
// EXPORTS
// =============================================================================

export { i18nService as default, LOCALES, LOCALE_INFO, NAMESPACES };