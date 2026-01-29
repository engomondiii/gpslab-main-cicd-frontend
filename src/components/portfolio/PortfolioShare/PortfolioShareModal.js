/**
 * GPS Lab Platform - PortfolioShareModal Component
 * 
 * Modal for sharing portfolio with various options
 * including direct link, social media, and embed code.
 * 
 * @module components/portfolio/PortfolioShare/PortfolioShareModal
 */

import React, { useState, useCallback } from 'react';
import './PortfolioShareModal.css';

/**
 * Social share platforms
 */
const SHARE_PLATFORMS = [
  { 
    id: 'twitter', 
    name: 'Twitter/X', 
    icon: '🐦',
    getUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: '💼',
    getUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: '📘',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: '💬',
    getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`
  },
  { 
    id: 'email', 
    name: 'Email', 
    icon: '📧',
    getUrl: (url, title, desc) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${desc}\n\n${url}`)}`
  }
];

/**
 * PortfolioShareModal Component
 */
const PortfolioShareModal = ({
  isOpen = false,
  onClose,
  portfolioUrl = '',
  portfolioTitle = 'My GPS Lab Portfolio',
  portfolioDescription = 'Check out my portfolio on GPS Lab!',
  username = '',
  showEmbed = true,
  className = '',
  ...props
}) => {
  const [copied, setCopied] = useState(null);
  const [embedSize, setEmbedSize] = useState('medium');
  
  // Generate full URL
  const fullUrl = portfolioUrl || `https://gpslab.app/portfolio/${username}`;
  
  // Generate embed code
  const getEmbedCode = useCallback(() => {
    const sizes = {
      small: { width: 400, height: 300 },
      medium: { width: 600, height: 400 },
      large: { width: 800, height: 500 }
    };
    const size = sizes[embedSize];
    return `<iframe src="${fullUrl}/embed" width="${size.width}" height="${size.height}" frameborder="0" style="border-radius: 12px;"></iframe>`;
  }, [fullUrl, embedSize]);
  
  // Copy to clipboard
  const copyToClipboard = useCallback(async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);
  
  // Handle social share
  const handleSocialShare = useCallback((platform) => {
    const url = platform.getUrl(fullUrl, portfolioTitle, portfolioDescription);
    window.open(url, '_blank', 'width=600,height=400');
  }, [fullUrl, portfolioTitle, portfolioDescription]);
  
  if (!isOpen) return null;
  
  const classNames = [
    'portfolio-share-modal',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="portfolio-share-modal__overlay" onClick={onClose}>
      <div className={classNames} onClick={(e) => e.stopPropagation()} {...props}>
        {/* Header */}
        <header className="portfolio-share-modal__header">
          <h2 className="portfolio-share-modal__title">
            <span className="portfolio-share-modal__title-icon">🔗</span>
            Share Portfolio
          </h2>
          <button
            type="button"
            className="portfolio-share-modal__close"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        
        {/* Direct Link */}
        <section className="portfolio-share-modal__section">
          <h3 className="portfolio-share-modal__section-title">Direct Link</h3>
          <div className="portfolio-share-modal__link-container">
            <input
              type="text"
              value={fullUrl}
              readOnly
              className="portfolio-share-modal__link-input"
            />
            <button
              type="button"
              className={`portfolio-share-modal__copy-btn ${copied === 'link' ? 'portfolio-share-modal__copy-btn--copied' : ''}`}
              onClick={() => copyToClipboard(fullUrl, 'link')}
            >
              {copied === 'link' ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </section>
        
        {/* Social Share */}
        <section className="portfolio-share-modal__section">
          <h3 className="portfolio-share-modal__section-title">Share on Social</h3>
          <div className="portfolio-share-modal__social-grid">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                className={`portfolio-share-modal__social-btn portfolio-share-modal__social-btn--${platform.id}`}
                onClick={() => handleSocialShare(platform)}
              >
                <span className="portfolio-share-modal__social-icon">
                  {platform.icon}
                </span>
                <span className="portfolio-share-modal__social-name">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </section>
        
        {/* Embed Code */}
        {showEmbed && (
          <section className="portfolio-share-modal__section">
            <h3 className="portfolio-share-modal__section-title">Embed on Website</h3>
            
            {/* Size Selector */}
            <div className="portfolio-share-modal__embed-sizes">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`portfolio-share-modal__size-btn ${embedSize === size ? 'portfolio-share-modal__size-btn--active' : ''}`}
                  onClick={() => setEmbedSize(size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Embed Code */}
            <div className="portfolio-share-modal__embed-container">
              <textarea
                value={getEmbedCode()}
                readOnly
                className="portfolio-share-modal__embed-code"
                rows={3}
              />
              <button
                type="button"
                className={`portfolio-share-modal__copy-btn ${copied === 'embed' ? 'portfolio-share-modal__copy-btn--copied' : ''}`}
                onClick={() => copyToClipboard(getEmbedCode(), 'embed')}
              >
                {copied === 'embed' ? '✓ Copied!' : '📋 Copy Code'}
              </button>
            </div>
          </section>
        )}
        
        {/* QR Code Placeholder */}
        <section className="portfolio-share-modal__section portfolio-share-modal__section--qr">
          <div className="portfolio-share-modal__qr-placeholder">
            <span className="portfolio-share-modal__qr-icon">📱</span>
            <span className="portfolio-share-modal__qr-text">
              Scan QR code to view on mobile
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export { SHARE_PLATFORMS };
export default PortfolioShareModal;