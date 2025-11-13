import React, { useState, useEffect } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmation) {
        setShowConfirmation(false);
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showConfirmation]);

  const handleReset = () => {
    onReset();
    setShowConfirmation(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        className="reset-fab"
        onClick={() => setShowConfirmation(true)}
        title="Reset Demo Session"
        aria-label="Reset progress and start over"
      >
        <Icon iconName="RevToggleKey" aria-hidden="true" />
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-backdrop" onClick={() => setShowConfirmation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Icon iconName="Warning" style={{ fontSize: '48px', color: 'var(--color-warning)' }} aria-hidden="true" />
              <h2 className="h3">Reset All Progress?</h2>
            </div>
            <p>This will clear all your progress and return you to the welcome screen. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn--secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleReset} style={{ background: 'var(--color-danger)' }}>
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reset-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-brand-blue);
          border: 2px solid var(--color-brand-blue);
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(68, 73, 156, 0.3);
          transition: all 0.2s;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reset-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(68, 73, 156, 0.4);
        }

        .reset-fab:active {
          transform: scale(0.95);
        }

        .reset-fab:focus-visible {
          outline: 3px solid var(--color-info);
          outline-offset: 2px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }

        .modal-content {
          background: white;
          border-radius: var(--radius-md);
          padding: var(--space-6);
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.2s;
        }

        .modal-header {
          text-align: center;
          margin-bottom: var(--space-4);
        }

        .modal-header h2 {
          margin-top: var(--space-3);
          color: var(--color-text);
        }

        .modal-content p {
          text-align: center;
          margin: var(--space-4) 0;
          color: var(--color-text);
        }

        .modal-actions {
          display: flex;
          gap: var(--space-3);
          margin-top: var(--space-5);
        }

        .modal-actions button {
          flex: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 600px) {
          .reset-fab {
            width: 48px;
            height: 48px;
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  );
}
