/**
 * GPS Lab Platform - FooterLinks Component
 * @module components/layout/Footer/FooterLinks
 */

import React from 'react';
import './FooterLinks.css';

const FOOTER_SECTIONS = [
  {
    id: 'platform',
    title: 'Platform',
    links: [
      { label: 'Training', href: '/training' },
      { label: 'Projects', href: '/projects' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Community', href: '/community' },
      { label: 'Leaderboard', href: '/leaderboard' }
    ]
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Help Center', href: '/help' },
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' }
    ]
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Partners', href: '/partners' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' }
    ]
  }
];

const FooterLinks = ({ sections = FOOTER_SECTIONS, className = '' }) => {
  return (
    <div className={`footer-links ${className}`}>
      {sections.map(section => (
        <div key={section.id} className="footer-links__section">
          <h4 className="footer-links__title">{section.title}</h4>
          <ul className="footer-links__list">
            {section.links.map(link => (
              <li key={link.href} className="footer-links__item">
                <a href={link.href} className="footer-links__link">
                  {link.label}
                  {link.badge && (
                    <span className="footer-links__badge">{link.badge}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export { FOOTER_SECTIONS };
export default FooterLinks;