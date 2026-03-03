/**
 * GPS 101 Deliverables Component
 * 
 * Display and manage GPS 101 deliverables.
 */

import React, { useState } from 'react';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import DeliverableCard from './DeliverableCard';
import DeliverableEditor from './DeliverableEditor';
import './GPS101Deliverables.css';

const GPS101Deliverables = ({ deliverables, onSave, onUpdate }) => {
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (deliverableId) => {
    setSelectedDeliverable(deliverableId);
    setIsEditing(true);
  };

  const handleSave = (deliverableId, data) => {
    if (deliverables[deliverableId]) {
      onUpdate(deliverableId, data);
    } else {
      onSave(deliverableId, data);
    }
    setIsEditing(false);
    setSelectedDeliverable(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDeliverable(null);
  };

  const getDeliverableStatus = (deliverableId) => {
    const data = deliverables[deliverableId];
    if (!data) return 'not-started';
    if (data.submitted) return 'submitted';
    if (data.draft) return 'draft';
    return 'in-progress';
  };

  return (
    <div className="gps101-deliverables">
      <div className="deliverables-header">
        <h2>GPS 101 Deliverables</h2>
        <p className="deliverables-subtitle">
          Your journey artifacts - evidence of your purpose discovery
        </p>
      </div>

      {!isEditing ? (
        <div className="deliverables-grid">
          {GPS_101_CONFIG.DELIVERABLES.map((deliverable) => {
            const status = getDeliverableStatus(deliverable.id);
            const data = deliverables[deliverable.id];

            return (
              <DeliverableCard
                key={deliverable.id}
                deliverable={deliverable}
                status={status}
                data={data}
                onEdit={() => handleEdit(deliverable.id)}
              />
            );
          })}
        </div>
      ) : (
        <DeliverableEditor
          deliverableId={selectedDeliverable}
          initialData={deliverables[selectedDeliverable]}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Completion Summary */}
      <div className="completion-summary">
        <div className="summary-stat">
          <span className="stat-label">Completed Deliverables</span>
          <span className="stat-value">
            {Object.values(deliverables).filter(d => d?.submitted).length}/
            {GPS_101_CONFIG.DELIVERABLES.length}
          </span>
        </div>
        <div className="summary-progress">
          <div className="summary-progress-bar">
            <div 
              className="summary-progress-fill"
              style={{ 
                width: `${(Object.values(deliverables).filter(d => d?.submitted).length / GPS_101_CONFIG.DELIVERABLES.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPS101Deliverables;