/**
 * GPS Lab Platform - PraiseTemplates Component
 * GPS 101 INTEGRATION: GPS 101-specific praise templates for milestone achievements
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
    ],
    // NEW: GPS 101 praise templates
    gps101: [
      { id: 'en-gps101-1', emoji: '🎓', text: 'Your purpose discovery journey is inspiring to watch!', isGPS101: true },
      { id: 'en-gps101-2', emoji: '💫', text: 'The depth of your self-reflection is remarkable!', isGPS101: true },
      { id: 'en-gps101-3', emoji: '🌟', text: 'Your authentic identity statement moved me!', isGPS101: true },
      { id: 'en-gps101-4', emoji: '❤️', text: 'The problem you chose shows such compassion!', isGPS101: true },
      { id: 'en-gps101-5', emoji: '🎯', text: 'Your purpose statement is powerful and clear!', isGPS101: true },
      { id: 'en-gps101-6', emoji: '🟠', text: 'Congrats on unlocking the Orange Beacon! Well deserved!', isGPS101: true },
      { id: 'en-gps101-7', emoji: '🚀', text: 'Your purpose-driven project idea is brilliant!', isGPS101: true },
      { id: 'en-gps101-8', emoji: '💡', text: 'The way you connected identity to purpose is beautiful!', isGPS101: true }
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
    ],
    // NEW: GPS 101 praise templates (Korean)
    gps101: [
      { id: 'ko-gps101-1', emoji: '🎓', text: '당신의 목적 발견 여정이 정말 감동적이에요!', isGPS101: true },
      { id: 'ko-gps101-2', emoji: '💫', text: '자기 성찰의 깊이가 놀라워요!', isGPS101: true },
      { id: 'ko-gps101-3', emoji: '🌟', text: '진정성 있는 정체성 선언문에 감동받았어요!', isGPS101: true },
      { id: 'ko-gps101-4', emoji: '❤️', text: '선택하신 문제에서 큰 연민이 느껴져요!', isGPS101: true },
      { id: 'ko-gps101-5', emoji: '🎯', text: '목적 선언문이 강력하고 명확해요!', isGPS101: true },
      { id: 'ko-gps101-6', emoji: '🟠', text: '오렌지 비콘 획득을 축하합니다! 정말 자격이 있어요!', isGPS101: true },
      { id: 'ko-gps101-7', emoji: '🚀', text: '목적 중심 프로젝트 아이디어가 훌륭해요!', isGPS101: true },
      { id: 'ko-gps101-8', emoji: '💡', text: '정체성과 목적을 연결한 방식이 아름다워요!', isGPS101: true }
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
    ],
    // NEW: GPS 101 praise templates (Swahili)
    gps101: [
      { id: 'sw-gps101-1', emoji: '🎓', text: 'Safari yako ya kugundua kusudi ni ya kuvutia!', isGPS101: true },
      { id: 'sw-gps101-2', emoji: '💫', text: 'Kina cha mawazo yako ni cha ajabu!', isGPS101: true },
      { id: 'sw-gps101-3', emoji: '🌟', text: 'Tamko lako la utambulisho ni la kweli!', isGPS101: true },
      { id: 'sw-gps101-4', emoji: '❤️', text: 'Tatizo ulilochagua linaonyesha huruma kubwa!', isGPS101: true },
      { id: 'sw-gps101-5', emoji: '🎯', text: 'Tamko la kusudi lako ni lenye nguvu na wazi!', isGPS101: true },
      { id: 'sw-gps101-6', emoji: '🟠', text: 'Hongera kwa kufungua Orange Beacon! Unastahili!', isGPS101: true },
      { id: 'sw-gps101-7', emoji: '🚀', text: 'Wazo lako la mradi ni bora sana!', isGPS101: true },
      { id: 'sw-gps101-8', emoji: '💡', text: 'Jinsi ulivyounganisha utambulisho na kusudi ni nzuri!', isGPS101: true }
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
    character: 'Character',
    gps101: 'GPS 101' // NEW
  },
  ko: {
    encouragement: '격려',
    achievement: '성취',
    teamwork: '팀워크',
    character: '인격',
    gps101: 'GPS 101' // NEW
  },
  sw: {
    encouragement: 'Motisha',
    achievement: 'Mafanikio',
    teamwork: 'Timu',
    character: 'Tabia',
    gps101: 'GPS 101' // NEW
  }
};

/**
 * Category icons
 */
const CATEGORY_ICONS = {
  encouragement: '💪',
  achievement: '🏆',
  teamwork: '🤝',
  character: '❤️',
  gps101: '🎓' // NEW
};

/**
 * PraiseTemplates Component
 */
const PraiseTemplates = ({
  language = 'en',
  selectedTemplate = null,
  onSelectTemplate,
  // NEW: GPS 101 props
  showGPS101Category = false,
  isGPS101Context = false,
  defaultCategory = null,
  className = '',
  ...props
}) => {
  const [activeCategory, setActiveCategory] = useState(
    defaultCategory || (isGPS101Context ? 'gps101' : 'encouragement')
  );
  
  const templates = PRAISE_TEMPLATES[language] || PRAISE_TEMPLATES.en;
  const categoryLabels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;
  
  // Filter categories based on showGPS101Category
  const availableCategories = React.useMemo(() => {
    const categories = Object.keys(templates);
    if (!showGPS101Category) {
      return categories.filter(cat => cat !== 'gps101');
    }
    return categories;
  }, [templates, showGPS101Category]);
  
  const handleSelectTemplate = useCallback((template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  }, [onSelectTemplate]);
  
  const classNames = [
    'praise-templates',
    isGPS101Context && 'praise-templates--gps101-context',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Category Tabs */}
      <div className="praise-templates__categories">
        {availableCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={`praise-templates__category ${activeCategory === category ? 'praise-templates__category--active' : ''} ${category === 'gps101' ? 'praise-templates__category--gps101' : ''}`}
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
      
      {/* NEW: GPS 101 Category Header */}
      {activeCategory === 'gps101' && (
        <div className="praise-templates__gps101-header">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
          </svg>
          <div>
            <h4 className="praise-templates__gps101-title">Purpose Discovery Praise</h4>
            <p className="praise-templates__gps101-subtitle">
              Celebrate GPS 101 milestones and achievements
            </p>
          </div>
        </div>
      )}
      
      {/* Templates List */}
      <div className="praise-templates__list">
        {templates[activeCategory]?.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`praise-templates__item ${selectedTemplate?.id === template.id ? 'praise-templates__item--selected' : ''} ${template.isGPS101 ? 'praise-templates__item--gps101' : ''}`}
            onClick={() => handleSelectTemplate(template)}
          >
            <span className="praise-templates__item-emoji">{template.emoji}</span>
            <span className="praise-templates__item-text">{template.text}</span>
            {selectedTemplate?.id === template.id && (
              <span className="praise-templates__item-check">✓</span>
            )}
            {template.isGPS101 && (
              <span className="praise-templates__item-gps101-badge">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export { PRAISE_TEMPLATES, CATEGORY_LABELS };
export default PraiseTemplates;