/**
 * GPS Lab Platform - PartyInviteForm Component
 * 
 * Form for inviting members to a party via username, email,
 * or shareable invite link.
 * 
 * @module components/party/PartyCreation/PartyInviteForm
 */

import React, { useState, useCallback } from 'react';
import './PartyInviteForm.css';

/**
 * PartyInviteForm Component
 */
const PartyInviteForm = ({
  partyId,
  partyName,
  inviteLink,
  onInvite,
  onCopyLink,
  onClose,
  maxInvites = 10,
  currentInvites = 0,
  className = '',
  ...props
}) => {
  const [inviteMethod, setInviteMethod] = useState('username'); // username, email, link
  const [inputValue, setInputValue] = useState('');
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const remainingInvites = maxInvites - currentInvites - invites.length;
  
  const validateInput = useCallback((value, method) => {
    if (!value.trim()) return 'Please enter a value';
    
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (method === 'username') {
      if (value.length < 3) {
        return 'Username must be at least 3 characters';
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
    }
    
    return null;
  }, []);
  
  const handleAddInvite = useCallback(() => {
    const validationError = validateInput(inputValue, inviteMethod);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (invites.some(i => i.value.toLowerCase() === inputValue.toLowerCase())) {
      setError('This person is already in your invite list');
      return;
    }
    
    if (remainingInvites <= 0) {
      setError('Maximum invites reached');
      return;
    }
    
    setInvites(prev => [...prev, { type: inviteMethod, value: inputValue.trim() }]);
    setInputValue('');
    setError('');
  }, [inputValue, inviteMethod, invites, remainingInvites, validateInput]);
  
  const handleRemoveInvite = useCallback((index) => {
    setInvites(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleCopyLink = useCallback(async () => {
    if (inviteLink) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        if (onCopyLink) {
          onCopyLink();
        }
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  }, [inviteLink, onCopyLink]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (invites.length === 0 && inviteMethod !== 'link') {
      setError('Please add at least one person to invite');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (onInvite) {
        await onInvite({
          partyId,
          invites,
          message
        });
      }
      
      // Reset form on success
      setInvites([]);
      setMessage('');
      setInputValue('');
    } catch (err) {
      setError(err.message || 'Failed to send invites');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInvite();
    }
  };
  
  const classNames = [
    'party-invite-form',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="party-invite-form__header">
        <div className="party-invite-form__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="party-invite-form__title-section">
          <h3 className="party-invite-form__title">Invite Members</h3>
          <p className="party-invite-form__subtitle">
            Invite others to join <strong>{partyName}</strong>
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="party-invite-form__close"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Method Tabs */}
      <div className="party-invite-form__methods">
        <button
          type="button"
          className={`party-invite-form__method ${inviteMethod === 'username' ? 'party-invite-form__method--active' : ''}`}
          onClick={() => setInviteMethod('username')}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
          Username
        </button>
        <button
          type="button"
          className={`party-invite-form__method ${inviteMethod === 'email' ? 'party-invite-form__method--active' : ''}`}
          onClick={() => setInviteMethod('email')}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          Email
        </button>
        <button
          type="button"
          className={`party-invite-form__method ${inviteMethod === 'link' ? 'party-invite-form__method--active' : ''}`}
          onClick={() => setInviteMethod('link')}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
          </svg>
          Invite Link
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="party-invite-form__form">
        {/* Link Method */}
        {inviteMethod === 'link' && (
          <div className="party-invite-form__link-section">
            <div className="party-invite-form__link-box">
              <input
                type="text"
                value={inviteLink || 'Generating invite link...'}
                readOnly
                className="party-invite-form__link-input"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="party-invite-form__copy-btn"
                disabled={!inviteLink}
              >
                {linkCopied ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="party-invite-form__link-note">
              Anyone with this link can request to join the party
            </p>
          </div>
        )}
        
        {/* Username/Email Method */}
        {inviteMethod !== 'link' && (
          <>
            <div className="party-invite-form__input-section">
              <label className="party-invite-form__label">
                {inviteMethod === 'username' ? 'Enter username' : 'Enter email address'}
              </label>
              <div className="party-invite-form__input-row">
                <input
                  type={inviteMethod === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={inviteMethod === 'username' ? 'username' : 'email@example.com'}
                  className="party-invite-form__input"
                />
                <button
                  type="button"
                  onClick={handleAddInvite}
                  className="party-invite-form__add-btn"
                  disabled={remainingInvites <= 0}
                >
                  Add
                </button>
              </div>
              <span className="party-invite-form__remaining">
                {remainingInvites} invites remaining
              </span>
            </div>
            
            {/* Invite List */}
            {invites.length > 0 && (
              <div className="party-invite-form__invites">
                <label className="party-invite-form__label">Inviting ({invites.length})</label>
                <div className="party-invite-form__invite-list">
                  {invites.map((invite, index) => (
                    <div key={index} className="party-invite-form__invite-item">
                      <span className="party-invite-form__invite-icon">
                        {invite.type === 'email' ? '✉️' : '👤'}
                      </span>
                      <span className="party-invite-form__invite-value">{invite.value}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInvite(index)}
                        className="party-invite-form__invite-remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Optional Message */}
            <div className="party-invite-form__message-section">
              <label className="party-invite-form__label">
                Personal message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your invite..."
                className="party-invite-form__textarea"
                maxLength={500}
              />
              <span className="party-invite-form__char-count">{message.length}/500</span>
            </div>
          </>
        )}
        
        {/* Error */}
        {error && (
          <div className="party-invite-form__error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
        
        {/* Actions */}
        {inviteMethod !== 'link' && (
          <div className="party-invite-form__actions">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="party-invite-form__cancel-btn"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="party-invite-form__submit-btn"
              disabled={isSubmitting || invites.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="party-invite-form__spinner" />
                  Sending...
                </>
              ) : (
                `Send ${invites.length} Invite${invites.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PartyInviteForm;