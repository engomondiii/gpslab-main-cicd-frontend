/**
 * GPS Lab Platform - Footer Component
 * @module components/layout/Footer/Footer
 */

import React from 'react';
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';
import './Footer.css';

const Footer = ({ variant = 'default', showNewsletter = true, className = '', ...props }) => {
  const currentYear = new Date().getFullYear();
  
  const classNames = ['footer', `footer--${variant}`, className].filter(Boolean).join(' ');
  
  return (
    <footer className={classNames} {...props}>
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__main">
          {/* Brand Section */}
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              <div className="footer__logo-icon">
                <svg viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
                </svg>
              </div>
              <span className="footer__logo-text">
                <span className="footer__logo-gps">GPS</span>
                <span className="footer__logo-lab">Lab</span>
              </span>
            </a>
            <p className="footer__tagline">
              Empowering the next generation of problem solvers through gamified learning and real-world impact.
            </p>
            <SocialLinks />
          </div>
          
          {/* Links Sections */}
          <FooterLinks />
          
          {/* Newsletter */}
          {showNewsletter && (
            <div className="footer__newsletter">
              <h4 className="footer__newsletter-title">Stay Updated</h4>
              <p className="footer__newsletter-text">
                Get the latest updates on new stages, features, and community events.
              </p>
              <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="footer__newsletter-input"
                />
                <button type="submit" className="footer__newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} GPS Lab Platform. All rights reserved.
          </div>
          <div className="footer__legal">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;