/**
 * GPS Lab Platform - BiteNotes Component
 * 
 * Notes and progress journal for task execution.
 * 
 * @module components/bite/BiteExecution/BiteNotes
 */

import React, { useState, useCallback } from 'react';
import './BiteNotes.css';

/**
 * BiteNotes Component
 */
const BiteNotes = ({
  notes = [],
  onAdd,
  onUpdate,
  onDelete,
  isEditable = true,
  className = '',
  ...props
}) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const handleAdd = useCallback(() => {
    if (newNote.trim() && onAdd) {
      onAdd({
        content: newNote.trim(),
        createdAt: new Date().toISOString()
      });
      setNewNote('');
    }
  }, [newNote, onAdd]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAdd();
    }
  };
  
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };
  
  const saveEdit = (id) => {
    if (editContent.trim() && onUpdate) {
      onUpdate(id, { content: editContent.trim() });
    }
    setEditingId(null);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };
  
  const classNames = ['bite-notes', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-notes__header">
        <h3 className="bite-notes__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
          </svg>
          Work Notes
        </h3>
        <span className="bite-notes__count">{notes.length}</span>
      </div>
      
      {/* Add Note */}
      {isEditable && onAdd && (
        <div className="bite-notes__add">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note about your progress... (Ctrl+Enter to save)"
            className="bite-notes__add-input"
            rows={3}
          />
          <div className="bite-notes__add-actions">
            <span className="bite-notes__hint">Ctrl+Enter to save</span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newNote.trim()}
              className="bite-notes__add-btn"
            >
              Add Note
            </button>
          </div>
        </div>
      )}
      
      {/* Notes List */}
      <div className="bite-notes__content">
        {notes.length > 0 ? (
          <div className="bite-notes__list">
            {notes.map((note) => (
              <div key={note.id} className="bite-notes__item">
                {editingId === note.id ? (
                  <div className="bite-notes__edit">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bite-notes__edit-input"
                      rows={3}
                      autoFocus
                    />
                    <div className="bite-notes__edit-actions">
                      <button type="button" onClick={cancelEdit} className="bite-notes__edit-cancel">
                        Cancel
                      </button>
                      <button type="button" onClick={() => saveEdit(note.id)} className="bite-notes__edit-save">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bite-notes__item-header">
                      <span className="bite-notes__item-time">{formatDate(note.createdAt)}</span>
                      {isEditable && (
                        <div className="bite-notes__item-actions">
                          <button
                            type="button"
                            onClick={() => startEditing(note)}
                            className="bite-notes__item-btn"
                            aria-label="Edit note"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
                            </svg>
                          </button>
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(note.id)}
                              className="bite-notes__item-btn bite-notes__item-btn--delete"
                              aria-label="Delete note"
                            >
                              <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="bite-notes__item-content">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="bite-notes__empty">
            No notes yet. Document your progress and thoughts as you work.
          </p>
        )}
      </div>
    </div>
  );
};

export default BiteNotes;