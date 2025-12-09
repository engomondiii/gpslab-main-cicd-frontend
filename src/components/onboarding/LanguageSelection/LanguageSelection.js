/**
 * GPS Lab Platform - LanguageSelection Component
 * 
 * Language selection step in onboarding flow.
 * 
 * @module components/onboarding/LanguageSelection
 */

import React, { useState, useCallback } from 'react';
import './LanguageSelection.css';

/**
 * Available languages with metadata
 */
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

/**
 * LanguageSelection Component
 */
const LanguageSelection = ({
  initialLanguage = 'en',
  onSelect,
  onContinue,
  onBack,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  
  /**
   * Filter languages by search
   */
  const filteredLanguages = LANGUAGES.filter(lang => {
    const query = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  });
  
  /**
   * Handle language selection
   */
  const handleSelect = useCallback((langCode) => {
    setSelectedLanguage(langCode);
    onSelect?.(langCode);
  }, [onSelect]);
  
  /**
   * Handle continue
   */
  const handleContinue = useCallback(() => {
    onContinue?.(selectedLanguage);
  }, [selectedLanguage, onContinue]);
  
  const classNames = ['language-selection', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="language-selection__header">
        <div className="language-selection__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
          </svg>
        </div>
        <h2 className="language-selection__title">Choose Your Language</h2>
        <p className="language-selection__description">
          Select your preferred language for the GPS Lab experience. 
          You can change this anytime in settings.
        </p>
      </div>
      
      {/* Search */}
      <div className="language-selection__search">
        <svg viewBox="0 0 20 20" fill="currentColor" className="language-selection__search-icon">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
        <input
          type="text"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="language-selection__search-input"
        />
      </div>
      
      {/* Languages Grid */}
      <div className="language-selection__grid">
        {filteredLanguages.map(lang => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelect(lang.code)}
            className={`language-selection__option ${selectedLanguage === lang.code ? 'language-selection__option--selected' : ''}`}
          >
            <span className="language-selection__flag">{lang.flag}</span>
            <div className="language-selection__option-text">
              <span className="language-selection__option-native">{lang.nativeName}</span>
              <span className="language-selection__option-name">{lang.name}</span>
            </div>
            {selectedLanguage === lang.code && (
              <svg viewBox="0 0 20 20" fill="currentColor" className="language-selection__check">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        ))}
        
        {filteredLanguages.length === 0 && (
          <div className="language-selection__empty">
            <p>No languages found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="language-selection__actions">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="language-selection__btn language-selection__btn--back"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back
          </button>
        )}
        
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading}
          className="language-selection__btn language-selection__btn--continue"
        >
          {isLoading ? (
            <>
              <span className="language-selection__spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export { LANGUAGES };
export default LanguageSelection;