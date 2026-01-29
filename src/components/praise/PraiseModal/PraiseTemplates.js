/**
 * GPS Lab Platform - PraiseTemplates Component
 * 
 * Pre-written culturally-appropriate praise message templates
 * supporting English, Korean, and Swahili.
 * 
 * @module components/praise/PraiseModal/PraiseTemplates
 */

import React, { useState, useCallback } from 'react';
import './PraiseTemplates.css';

/**
 * Praise template categories and messages
 */
const PRAISE_TEMPLATES = {
  en: {
    encouragement: [
      { id: 'en-enc-1', emoji: '💪', text: 'Keep pushing forward! You\'re doing amazing!' },
      { id: 'en-enc-2', emoji: '🌟', text: 'Your dedication is truly inspiring!' },
      { id: 'en-enc-3', emoji: '🔥', text: 'You\'re on fire! Keep that momentum going!' },
      { id: 'en-enc-4', emoji: '🚀', text: 'Sky\'s the limit for you! Keep reaching higher!' }
    ],
    achievement: [
      { id: 'en-ach-1', emoji: '🏆', text: 'Congratulations on this amazing achievement!' },
      { id: 'en-ach-2', emoji: '🎯', text: 'You nailed it! Well deserved success!' },
      { id: 'en-ach-3', emoji: '⭐', text: 'Outstanding work! You should be proud!' },
      { id: 'en-ach-4', emoji: '🎉', text: 'What an incredible accomplishment!' }
    ],
    teamwork: [
      { id: 'en-team-1', emoji: '🤝', text: 'You\'re an amazing team player!' },
      { id: 'en-team-2', emoji: '👥', text: 'Your collaboration skills are exceptional!' },
      { id: 'en-team-3', emoji: '💫', text: 'The team is lucky to have you!' },
      { id: 'en-team-4', emoji: '🌈', text: 'You make working together a joy!' }
    ],
    character: [
      { id: 'en-char-1', emoji: '❤️', text: 'Your kindness makes a real difference!' },
      { id: 'en-char-2', emoji: '🙏', text: 'Your integrity shines through in everything you do!' },
      { id: 'en-char-3', emoji: '💎', text: 'Your humility is truly admirable!' },
      { id: 'en-char-4', emoji: '🦁', text: 'Your courage inspires us all!' }
    ]
  },
  ko: {
    encouragement: [
      { id: 'ko-enc-1', emoji: '💪', text: '계속 앞으로 나아가세요! 정말 대단해요!' },
      { id: 'ko-enc-2', emoji: '🌟', text: '당신의 헌신이 정말 감동적이에요!' },
      { id: 'ko-enc-3', emoji: '🔥', text: '열정이 대단해요! 그 기세를 유지하세요!' },
      { id: 'ko-enc-4', emoji: '🚀', text: '무한한 가능성을 가진 당신! 더 높이 날아오르세요!' }
    ],
    achievement: [
      { id: 'ko-ach-1', emoji: '🏆', text: '이 놀라운 성취를 축하합니다!' },
      { id: 'ko-ach-2', emoji: '🎯', text: '완벽하게 해내셨어요! 당연한 성공이에요!' },
      { id: 'ko-ach-3', emoji: '⭐', text: '탁월한 성과예요! 자랑스러워 하셔도 돼요!' },
      { id: 'ko-ach-4', emoji: '🎉', text: '정말 대단한 성과예요!' }
    ],
    teamwork: [
      { id: 'ko-team-1', emoji: '🤝', text: '훌륭한 팀 플레이어예요!' },
      { id: 'ko-team-2', emoji: '👥', text: '협업 능력이 정말 뛰어나세요!' },
      { id: 'ko-team-3', emoji: '💫', text: '팀이 당신을 만나서 행운이에요!' },
      { id: 'ko-team-4', emoji: '🌈', text: '함께 일하는 게 즐거워요!' }
    ],
    character: [
      { id: 'ko-char-1', emoji: '❤️', text: '당신의 친절함이 큰 변화를 만들어요!' },
      { id: 'ko-char-2', emoji: '🙏', text: '모든 일에서 진실성이 빛나요!' },
      { id: 'ko-char-3', emoji: '💎', text: '당신의 겸손함은 정말 존경스러워요!' },
      { id: 'ko-char-4', emoji: '🦁', text: '당신의 용기가 우리 모두를 감동시켜요!' }
    ]
  },
  sw: {
    encouragement: [
      { id: 'sw-enc-1', emoji: '💪', text: 'Endelea mbele! Unafanya vizuri sana!' },
      { id: 'sw-enc-2', emoji: '🌟', text: 'Kujitolea kwako kunawapa moyo!' },
      { id: 'sw-enc-3', emoji: '🔥', text: 'Uko moto! Endelea hivyo hivyo!' },
      { id: 'sw-enc-4', emoji: '🚀', text: 'Hakuna kikomo kwako! Endelea kupanda!' }
    ],
    achievement: [
      { id: 'sw-ach-1', emoji: '🏆', text: 'Hongera kwa mafanikio haya mazuri!' },
      { id: 'sw-ach-2', emoji: '🎯', text: 'Umefanikiwa! Unastahili!' },
      { id: 'sw-ach-3', emoji: '⭐', text: 'Kazi bora! Jivunie!' },
      { id: 'sw-ach-4', emoji: '🎉', text: 'Mafanikio ya ajabu!' }
    ],
    teamwork: [
      { id: 'sw-team-1', emoji: '🤝', text: 'Wewe ni mchezaji bora wa timu!' },
      { id: 'sw-team-2', emoji: '👥', text: 'Ujuzi wako wa kushirikiana ni wa kipekee!' },
      { id: 'sw-team-3', emoji: '💫', text: 'Timu ina bahati kukuwa nawe!' },
      { id: 'sw-team-4', emoji: '🌈', text: 'Kufanya kazi nawe ni furaha!' }
    ],
    character: [
      { id: 'sw-char-1', emoji: '❤️', text: 'Upole wako unaleta mabadiliko!' },
      { id: 'sw-char-2', emoji: '🙏', text: 'Uaminifu wako unaonekana kila mahali!' },
      { id: 'sw-char-3', emoji: '💎', text: 'Unyenyekevu wako unaheshimika!' },
      { id: 'sw-char-4', emoji: '🦁', text: 'Ujasiri wako unatutia moyo!' }
    ]
  }
};

/**
 * Category labels
 */
const CATEGORY_LABELS = {
  en: {
    encouragement: 'Encouragement',
    achievement: 'Achievement',
    teamwork: 'Teamwork',
    character: 'Character'
  },
  ko: {
    encouragement: '격려',
    achievement: '성취',
    teamwork: '팀워크',
    character: '인격'
  },
  sw: {
    encouragement: 'Motisha',
    achievement: 'Mafanikio',
    teamwork: 'Timu',
    character: 'Tabia'
  }
};

/**
 * Category icons
 */
const CATEGORY_ICONS = {
  encouragement: '💪',
  achievement: '🏆',
  teamwork: '🤝',
  character: '❤️'
};

/**
 * PraiseTemplates Component
 */
const PraiseTemplates = ({
  language = 'en',
  selectedTemplate = null,
  onSelectTemplate,
  className = '',
  ...props
}) => {
  const [activeCategory, setActiveCategory] = useState('encouragement');
  
  const templates = PRAISE_TEMPLATES[language] || PRAISE_TEMPLATES.en;
  const categoryLabels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;
  
  const handleSelectTemplate = useCallback((template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  }, [onSelectTemplate]);
  
  const classNames = [
    'praise-templates',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Category Tabs */}
      <div className="praise-templates__categories">
        {Object.keys(templates).map((category) => (
          <button
            key={category}
            type="button"
            className={`praise-templates__category ${activeCategory === category ? 'praise-templates__category--active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className="praise-templates__category-icon">
              {CATEGORY_ICONS[category]}
            </span>
            <span className="praise-templates__category-label">
              {categoryLabels[category]}
            </span>
          </button>
        ))}
      </div>
      
      {/* Templates List */}
      <div className="praise-templates__list">
        {templates[activeCategory]?.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`praise-templates__item ${selectedTemplate?.id === template.id ? 'praise-templates__item--selected' : ''}`}
            onClick={() => handleSelectTemplate(template)}
          >
            <span className="praise-templates__item-emoji">{template.emoji}</span>
            <span className="praise-templates__item-text">{template.text}</span>
            {selectedTemplate?.id === template.id && (
              <span className="praise-templates__item-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export { PRAISE_TEMPLATES, CATEGORY_LABELS };
export default PraiseTemplates;