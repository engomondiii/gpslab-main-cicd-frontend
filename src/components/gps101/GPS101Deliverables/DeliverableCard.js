/**
 * Deliverable Card Component
 * 
 * Individual deliverable card with preview and actions.
 */

import React from 'react';
import { formatDeliverableName } from '../../../utils/formatters/gps101.formatter';
import './DeliverableCard.css';

const DeliverableCard = ({ deliverable, status, data, onEdit }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'submitted':
        return '✓';
      case 'draft':
        return '📝';
      case 'in-progress':
        return '⏳';
      default:
        return '○';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'draft':
        return 'Draft Saved';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'submitted':
        return 'status-completed';
      case 'draft':
        return 'status-draft';
      case 'in-progress':
        return 'status-progress';
      default:
        return 'status-not-started';
    }
  };

  const getPreview = () => {
    if (!data) return null;

    if (deliverable.type === 'text' || deliverable.type === 'narrative') {
      return data.content?.substring(0, 150) + '...';
    }

    if (deliverable.type === 'list') {
      return `${data.items?.length || 0} items`;
    }

    if (deliverable.type === 'project') {
      return data.title || 'Untitled project';
    }

    return 'Data saved';
  };

  return (
    <div className={`deliverable-card ${getStatusClass()}`}>
      {/* Stage Badge */}
      <div className="deliverable-stage-badge">
        Stage {deliverable.stage}
      </div>

      {/* Status Badge */}
      <div className={`deliverable-status ${getStatusClass()}`}>
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-text">{getStatusText()}</span>
      </div>

      {/* Content */}
      <div className="deliverable-content">
        <h3 className="deliverable-name">
          {formatDeliverableName(deliverable.id)}
        </h3>
        <p className="deliverable-description">
          {deliverable.description}
        </p>

        {/* Preview */}
        {data && (
          <div className="deliverable-preview">
            <div className="preview-label">Preview:</div>
            <p className="preview-text">{getPreview()}</p>
          </div>
        )}

        {/* Metadata */}
        {data?.updatedAt && (
          <div className="deliverable-metadata">
            <span className="metadata-label">Last updated:</span>
            <span className="metadata-value">
              {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="deliverable-actions">
        <button 
          className="edit-button"
          onClick={onEdit}
        >
          {status === 'not-started' ? 'Start' : 'Edit'}
        </button>
        
        {status === 'submitted' && (
          <button className="view-button" onClick={onEdit}>
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliverableCard;