/**
 * GPS Lab Platform - SkillsNeededSelector Component
 *
 * Select needed skills for Stage 0 — engineers, teachers, investors, etc.
 *
 * @module components/gpo/GPOStages/Stage0/SkillsNeededSelector
 */

import React, { useState, useCallback } from 'react';
import './SkillsNeededSelector.css';

const SKILL_CATEGORIES = [
  {
    category: 'Technical',
    icon: '⚙️',
    skills: [
      { id: 'software_eng', label: 'Software Engineer', icon: '💻' },
      { id: 'hardware_eng', label: 'Hardware Engineer', icon: '🔧' },
      { id: 'civil_eng', label: 'Civil Engineer', icon: '🏗️' },
      { id: 'environmental_eng', label: 'Environmental Engineer', icon: '🌿' },
      { id: 'water_eng', label: 'Water/Sanitation Engineer', icon: '💧' },
      { id: 'energy_eng', label: 'Energy Engineer', icon: '⚡' },
      { id: 'agri_tech', label: 'Agricultural Technologist', icon: '🌾' },
      { id: 'data_analyst', label: 'Data Analyst', icon: '📊' },
    ]
  },
  {
    category: 'Health & Social',
    icon: '🏥',
    skills: [
      { id: 'doctor', label: 'Medical Doctor', icon: '👨‍⚕️' },
      { id: 'nurse', label: 'Nurse/Healthcare', icon: '🩺' },
      { id: 'public_health', label: 'Public Health Expert', icon: '🏥' },
      { id: 'psychologist', label: 'Psychologist/Counselor', icon: '🧠' },
      { id: 'social_worker', label: 'Social Worker', icon: '🤲' },
      { id: 'nutritionist', label: 'Nutritionist/Dietician', icon: '🥗' },
    ]
  },
  {
    category: 'Education & Training',
    icon: '📚',
    skills: [
      { id: 'teacher', label: 'Teacher/Educator', icon: '👨‍🏫' },
      { id: 'curriculum', label: 'Curriculum Designer', icon: '📋' },
      { id: 'trainer', label: 'Vocational Trainer', icon: '🎓' },
      { id: 'literacy', label: 'Literacy Specialist', icon: '📖' },
    ]
  },
  {
    category: 'Business & Finance',
    icon: '💼',
    skills: [
      { id: 'investor', label: 'Investor/Funder', icon: '💰' },
      { id: 'business_dev', label: 'Business Developer', icon: '📈' },
      { id: 'accountant', label: 'Accountant/Finance', icon: '🧮' },
      { id: 'legal', label: 'Legal Expert/Lawyer', icon: '⚖️' },
      { id: 'fundraiser', label: 'Fundraiser/Grant Writer', icon: '✍️' },
      { id: 'marketing', label: 'Marketing/Communications', icon: '📣' },
    ]
  },
  {
    category: 'Research & Policy',
    icon: '🔬',
    skills: [
      { id: 'researcher', label: 'Researcher/Academic', icon: '🔬' },
      { id: 'policy', label: 'Policy Advisor', icon: '📜' },
      { id: 'journalist', label: 'Journalist/Storyteller', icon: '📰' },
      { id: 'videographer', label: 'Videographer/Filmmaker', icon: '🎬' },
    ]
  },
  {
    category: 'Community & Leadership',
    icon: '🌍',
    skills: [
      { id: 'community_org', label: 'Community Organizer', icon: '👥' },
      { id: 'project_mgr', label: 'Project Manager', icon: '📌' },
      { id: 'translator', label: 'Translator/Interpreter', icon: '🗣️' },
      { id: 'mentor', label: 'Mentor/Coach', icon: '🌟' },
    ]
  },
];

const SkillsNeededSelector = ({
  selected = [],
  onSelectionChange,
  error = null,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = useCallback((skillId) => {
    if (selected.includes(skillId)) {
      onSelectionChange?.(selected.filter(s => s !== skillId));
    } else {
      onSelectionChange?.([...selected, skillId]);
    }
  }, [selected, onSelectionChange]);

  const allSkills = SKILL_CATEGORIES.flatMap(c => c.skills);

  const filteredCategories = searchQuery
    ? [{ category: 'Search Results', icon: '🔍', skills: allSkills.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase())) }]
    : SKILL_CATEGORIES;

  const selectedSkillLabels = allSkills.filter(s => selected.includes(s.id));

  const classNames = ['skills-needed-selector', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="sns__header">
        <h3 className="sns__title">Select Skills Needed 🛠️</h3>
        <p className="sns__subtitle">
          Choose at least 3 types of Global Problem Solvers you want to attract.
          GPS will filter showcases by skills they have, so be specific!
        </p>
      </div>

      {/* Selected Preview */}
      {selected.length > 0 && (
        <div className="sns__selected">
          <div className="sns__selected-header">
            <span className="sns__selected-title">Selected ({selected.length})</span>
            <button type="button" onClick={() => onSelectionChange?.([])} className="sns__clear">Clear all</button>
          </div>
          <div className="sns__selected-tags">
            {selectedSkillLabels.map(skill => (
              <div key={skill.id} className="sns__tag">
                <span>{skill.icon} {skill.label}</span>
                <button type="button" onClick={() => handleToggle(skill.id)} className="sns__tag-remove" aria-label={`Remove ${skill.label}`}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="sns__search">
        <svg viewBox="0 0 20 20" fill="currentColor" className="sns__search-icon">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="sns__search-input"
        />
      </div>

      {/* Categories */}
      <div className="sns__categories">
        {filteredCategories.map(cat => (
          <div key={cat.category} className="sns__category">
            <div className="sns__category-header">
              <span className="sns__category-icon">{cat.icon}</span>
              <span className="sns__category-name">{cat.category}</span>
            </div>
            <div className="sns__skills">
              {cat.skills.map(skill => {
                const isSelected = selected.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleToggle(skill.id)}
                    className={`sns__skill ${isSelected ? 'sns__skill--selected' : ''}`}
                  >
                    <span className="sns__skill-icon">{skill.icon}</span>
                    <span className="sns__skill-label">{skill.label}</span>
                    {isSelected && (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="sns__skill-check">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="sns__counter">
        <div className="sns__counter-bar">
          <div className="sns__counter-fill" style={{ width: `${Math.min((selected.length / 3) * 100, 100)}%` }} />
        </div>
        <p className={`sns__counter-text ${selected.length < 3 ? 'sns__counter-text--warn' : ''}`}>
          {selected.length < 3
            ? `Select ${3 - selected.length} more skill${3 - selected.length !== 1 ? 's' : ''} (minimum 3 required)`
            : `✅ ${selected.length} skills selected — great!`
          }
        </p>
      </div>

      {error && <p className="sns__error">{error}</p>}
    </div>
  );
};

export default SkillsNeededSelector;