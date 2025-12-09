/**
 * GPS Lab Platform - LanguageSelector Component
 * 
 * Language/locale selector dropdown.
 * 
 * @module components/layout/Header/LanguageSelector
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';

// =============================================================================
// CONSTANTS
// =============================================================================

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * LanguageSelector component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.currentLanguage='en'] - Current language code
 * @param {Function} [props.onChange] - Language change handler
 * @param {string} [props.className] - Additional CSS classes
 */
const LanguageSelector = ({
  currentLanguage = 'en',
  onChange,
  className = '',
  ...props
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);
  
  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Close on Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  const handleSelect = (lang) => {
    setIsOpen(false);
    if (lang.code !== currentLanguage) {
      onChange?.(lang.code);
    }
  };
  
  const classNames = [
    'language-selector',
    isOpen && 'language-selector--open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} ref={selectorRef} {...props}>
      <button
        type="button"
        className="language-selector__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentLang.name}`}
      >
        <span className="language-selector__flag">{currentLang.flag}</span>
        <span className="language-selector__code">{currentLang.code.toUpperCase()}</span>
        <span className="language-selector__arrow">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="language-selector__dropdown" role="listbox">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              className={`language-selector__option ${lang.code === currentLanguage ? 'language-selector__option--selected' : ''}`}
              onClick={() => handleSelect(lang)}
              role="option"
              aria-selected={lang.code === currentLanguage}
            >
              <span className="language-selector__option-flag">{lang.flag}</span>
              <span className="language-selector__option-name">{lang.name}</span>
              {lang.code === currentLanguage && (
                <span className="language-selector__option-check">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Export languages for reuse
export { LANGUAGES };

// =============================================================================
// EXPORTS
// =============================================================================

export default LanguageSelector;