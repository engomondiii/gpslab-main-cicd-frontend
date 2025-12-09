/**
 * GPS Lab Platform - I18n Context
 * 
 * Provides internationalization support across the application.
 * 
 * @module contexts/I18nContext
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const I18nContext = createContext(null);

export const LANGUAGES = {
  EN: 'en',
  KO: 'ko',
  ES: 'es',
  FR: 'fr',
  ZH: 'zh',
  AR: 'ar'
};

export const LANGUAGE_NAMES = {
  en: 'English',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
  ar: 'العربية'
};

// Simple translation store (would be loaded from files in production)
const translations = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      submit: 'Submit'
    },
    auth: {
      login: 'Sign In',
      register: 'Create Account',
      logout: 'Sign Out',
      forgotPassword: 'Forgot Password?'
    },
    nav: {
      dashboard: 'Dashboard',
      missions: 'Missions',
      projects: 'Projects',
      profile: 'Profile',
      settings: 'Settings'
    }
  }
};

export const I18nProvider = ({ children, language = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTranslations, setCurrentTranslations] = useState(translations[language] || translations.en);
  
  const changeLanguage = useCallback((lang) => {
    setCurrentLanguage(lang);
    setCurrentTranslations(translations[lang] || translations.en);
    localStorage.setItem('gps_language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Set RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, []);
  
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = currentTranslations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }
    
    // Replace params
    return value.replace(/\{\{(\w+)\}\}/g, (_, param) => params[param] || '');
  }, [currentTranslations]);
  
  const value = useMemo(() => ({
    language: currentLanguage,
    languages: LANGUAGES,
    languageNames: LANGUAGE_NAMES,
    setLanguage: changeLanguage,
    t,
    isRTL: currentLanguage === 'ar'
  }), [currentLanguage, changeLanguage, t]);
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t } = useI18n();
  return { t };
};

export default I18nContext;