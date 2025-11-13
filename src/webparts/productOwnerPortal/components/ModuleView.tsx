import React, { useState } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import Markdown from 'markdown-to-jsx';
import { Module } from '../types';

interface ModuleViewProps {
  module: Module;
  moduleNumber: number;
  totalModules: number;
  isCompleted: boolean;
  isBookmarked: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onBookmark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onBackToDashboard: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function ModuleView({
  module,
  moduleNumber,
  totalModules,
  isCompleted,
  isBookmarked,
  onComplete,
  onSkip,
  onBookmark,
  onNext,
  onPrevious,
  onBackToDashboard,
  hasPrevious,
  hasNext
}: ModuleViewProps) {
  const [showCheckQuestion, setShowCheckQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const handleMarkComplete = () => {
    if (module.checkQuestion && !showCheckQuestion) {
      setShowCheckQuestion(true);
    } else {
      onComplete();
      if (hasNext) {
        setTimeout(onNext, 500);
      }
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === module.checkQuestion!.correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      setTimeout(() => {
        onComplete();
        if (hasNext) {
          setTimeout(onNext, 500);
        }
      }, 1500);
    }
  };

  const progress = Math.round((moduleNumber / totalModules) * 100);

  return (
    <div className="module-view">
      {/* Header with progress */}
      <div className="module-header">
        <div className="module-header-content">
          <div className="module-header-top">
            <div className="module-breadcrumb">
              <button
                className="breadcrumb-link"
                onClick={onBackToDashboard}
                aria-label="Return to dashboard"
              >
                <Icon iconName="Home" style={{ fontSize: '18px' }} aria-hidden="true" />
              </button>
              <span>/</span>
              <span style={{ textTransform: 'capitalize' }}>{module.category.replace('-', ' ')}</span>
              <span>/</span>
              <span>Module {moduleNumber}</span>
            </div>

            <button
              className="btn btn--secondary-light"
              onClick={onBackToDashboard}
              aria-label="Return to dashboard"
            >
              <Icon iconName="Home" style={{ fontSize: '20px' }} aria-hidden="true" />
              Back to Dashboard
            </button>
          </div>

          <div className="module-progress">
            <div className="progress-label">
              <span>Your Progress: {moduleNumber} of {totalModules}</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module content */}
      <div className="module-content-card">
        <div className="module-meta">
          <div className="module-title-section">
            <h1 className="h2">{module.title}</h1>
            <p className="module-description">{module.description}</p>
          </div>

          <div className="module-tags">
            <span className="module-duration">
              <Icon iconName="Clock" style={{ fontSize: '16px' }} aria-hidden="true" />
              {module.duration} min
            </span>
            <span className={`priority-badge priority-${module.priority}`}>
              {module.priority === 'high' ? '🔥 High Priority' :
               module.priority === 'medium' ? '⚡ Medium Priority' :
               '📚 Nice to Know'}
            </span>
            {isCompleted && (
              <span className="completed-badge">
                <Icon iconName="CompletedSolid" style={{ fontSize: '16px' }} aria-hidden="true" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="module-markdown-content">
          <Markdown>{module.content}</Markdown>
        </div>

        {/* Check question */}
        {showCheckQuestion && module.checkQuestion && (
          <div className="check-question">
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Icon iconName="QuestionCircle" style={{ color: 'var(--color-brand-blue)' }} aria-hidden="true" />
              Quick Check
            </h3>
            <p style={{ marginBottom: 'var(--space-4)' }}>{module.checkQuestion.question}</p>

            <div className="answer-options">
              {module.checkQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`answer-option ${selectedAnswer === index ? 'selected' : ''} ${
                    isAnswerCorrect !== null
                      ? index === module.checkQuestion!.correctAnswer
                        ? 'correct'
                        : selectedAnswer === index
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => {
                    if (isAnswerCorrect === null) {
                      setSelectedAnswer(index);
                    }
                  }}
                  disabled={isAnswerCorrect !== null}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                  {isAnswerCorrect !== null && index === module.checkQuestion!.correctAnswer && (
                    <Icon iconName="CompletedSolid" className="check-icon" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  )}
                  {isAnswerCorrect !== null && selectedAnswer === index && index !== module.checkQuestion!.correctAnswer && (
                    <Icon iconName="StatusErrorFull" className="check-icon" style={{ color: 'var(--color-danger)' }} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>

            {isAnswerCorrect === false && (
              <div className="feedback-message error">
                <Icon iconName="Info" aria-hidden="true" />
                Not quite! Review the content and try again, or skip for now.
              </div>
            )}

            {isAnswerCorrect === true && (
              <div className="feedback-message success">
                <Icon iconName="Balloons" aria-hidden="true" />
                🎉 Excellent! You've got it! {hasNext ? 'Moving to next module...' : 'Module complete!'}
              </div>
            )}

            {isAnswerCorrect === null && (
              <button
                className="btn btn--primary"
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                style={{ marginTop: 'var(--space-4)' }}
              >
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="module-actions">
          <div className="action-buttons-left">
            <button
              className="btn btn--secondary-light"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <Icon iconName="ChevronLeft" style={{ fontSize: '20px' }} aria-hidden="true" />
              Previous
            </button>
          </div>

          <div className="action-buttons-right">
            <button
              className="btn btn--ghost"
              onClick={onBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
            >
              <Icon iconName={isBookmarked ? 'FavoriteStar' : 'FavoriteStarFill'} style={{ fontSize: '20px' }} aria-hidden="true" />
            </button>

            {!isCompleted && (
              <>
                <button
                  className="btn btn--secondary-light"
                  onClick={onSkip}
                >
                  Skip for Now
                </button>

                <button
                  className="btn btn--primary"
                  onClick={handleMarkComplete}
                >
                  {module.checkQuestion && !showCheckQuestion ? 'Take Quick Check' : 'Mark Complete'}
                  <Icon iconName="CheckMark" style={{ fontSize: '20px' }} aria-hidden="true" />
                </button>
              </>
            )}

            {isCompleted && hasNext && (
              <button
                className="btn btn--primary"
                onClick={onNext}
              >
                Next Module
                <Icon iconName="ChevronRight" style={{ fontSize: '20px' }} aria-hidden="true" />
              </button>
            )}

            {isCompleted && !hasNext && (
              <button
                className="btn btn--primary"
                onClick={onBackToDashboard}
              >
                Back to Dashboard
                <Icon iconName="Home" style={{ fontSize: '20px' }} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .module-view {
          min-height: 100vh;
          background: var(--color-bg);
          padding-bottom: var(--space-8);
        }

        .module-header {
          background: white;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--color-muted);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .module-header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .module-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .module-breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--step--1);
          color: var(--color-text);
          opacity: 0.7;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: inherit;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;
        }

        .breadcrumb-link:hover {
          opacity: 1;
          color: var(--color-primary);
        }

        .module-progress {
          width: 100%;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: var(--step--1);
          font-weight: 600;
          margin-bottom: var(--space-2);
          color: var(--color-text);
        }

        .progress-percentage {
          color: var(--color-primary);
        }

        .progress-bar-container {
          height: 8px;
          background: var(--color-light-green);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent-dark) 100%);
          transition: width 0.5s ease;
        }

        .module-content-card {
          max-width: 800px;
          margin: var(--space-6) auto;
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          padding: var(--space-7);
        }

        .module-meta {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-5);
          border-bottom: 2px solid var(--color-bg);
        }

        .module-title-section h1 {
          margin-bottom: var(--space-3);
        }

        .module-description {
          font-size: var(--step-1);
          opacity: 0.8;
          margin-bottom: var(--space-4);
        }

        .module-tags {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .module-duration {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-3);
          background: var(--color-light-blue);
          border-radius: var(--radius-sm);
          font-size: var(--step--1);
          font-weight: 600;
        }

        .priority-badge {
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          font-size: var(--step--1);
          font-weight: 600;
        }

        .priority-high {
          background: #FEE;
          color: #C00;
        }

        .priority-medium {
          background: #FFC;
          color: #860;
        }

        .priority-low {
          background: #EEF;
          color: #558;
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-3);
          background: var(--color-light-green);
          color: var(--color-primary);
          border-radius: var(--radius-sm);
          font-size: var(--step--1);
          font-weight: 600;
        }

        .module-markdown-content {
          font-size: var(--step-0);
          line-height: 1.7;
          color: var(--color-text);
          user-select: text;
        }

        .module-markdown-content h1 {
          font-size: var(--step-3);
          font-weight: 600;
          margin: var(--space-6) 0 var(--space-4);
          color: var(--color-brand-blue);
        }

        .module-markdown-content h2 {
          font-size: var(--step-2);
          font-weight: 600;
          margin: var(--space-5) 0 var(--space-3);
          color: var(--color-text);
        }

        .module-markdown-content h3 {
          font-size: var(--step-1);
          font-weight: 600;
          margin: var(--space-4) 0 var(--space-2);
        }

        .module-markdown-content p {
          margin: var(--space-3) 0;
        }

        .module-markdown-content ul, .module-markdown-content ol {
          margin: var(--space-3) 0;
          padding-left: var(--space-5);
        }

        .module-markdown-content li {
          margin: var(--space-2) 0;
        }

        .module-markdown-content strong {
          font-weight: 600;
          color: var(--color-text);
        }

        .module-markdown-content a {
          color: var(--color-primary);
          text-decoration: none;
          border-bottom: 1px solid var(--color-primary);
        }

        .module-markdown-content a:hover {
          border-bottom-width: 2px;
        }

        .check-question {
          background: var(--color-light-blue);
          padding: var(--space-6);
          border-radius: var(--radius-md);
          margin-top: var(--space-6);
          border: 2px solid var(--color-brand-blue);
        }

        .answer-options {
          display: grid;
          gap: var(--space-3);
        }

        .answer-option {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: white;
          border: 2px solid var(--color-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-size: var(--step-0);
        }

        .answer-option:hover:not(:disabled) {
          border-color: var(--color-brand-blue);
          transform: translateX(4px);
        }

        .answer-option.selected {
          border-color: var(--color-brand-blue);
          background: var(--color-light-blue);
        }

        .answer-option.correct {
          border-color: var(--color-primary);
          background: var(--color-light-green);
        }

        .answer-option.incorrect {
          border-color: var(--color-danger);
          background: #FEE;
        }

        .answer-letter {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          border-radius: 50%;
          font-weight: 600;
          flex-shrink: 0;
        }

        .answer-option.correct .answer-letter {
          background: var(--color-primary);
          color: white;
        }

        .answer-option.incorrect .answer-letter {
          background: var(--color-danger);
          color: white;
        }

        .check-icon {
          margin-left: auto;
          flex-shrink: 0;
        }

        .feedback-message {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          border-radius: var(--radius-sm);
          margin-top: var(--space-4);
          font-weight: 500;
        }

        .feedback-message.success {
          background: var(--color-light-green);
          color: var(--color-dark-green);
        }

        .feedback-message.error {
          background: #FEE;
          color: var(--color-danger);
        }

        .module-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          margin-top: var(--space-7);
          padding-top: var(--space-6);
          border-top: 2px solid var(--color-bg);
          flex-wrap: wrap;
        }

        .action-buttons-left, .action-buttons-right {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .btn--ghost {
          background: transparent;
          border: none;
          color: var(--color-text);
          padding: var(--space-2);
        }

        .btn--ghost:hover {
          background: var(--color-bg);
        }

        .btn--secondary-light {
          color: var(--color-text);
          background: white;
          border: 2px solid var(--color-muted);
        }

        .btn--secondary-light:hover {
          border-color: var(--color-primary);
          background: var(--color-light-green);
        }

        .btn--secondary-light:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .module-header {
            padding: var(--space-4);
          }

          .module-content-card {
            margin: var(--space-4);
            padding: var(--space-5);
          }

          .module-actions {
            flex-direction: column;
          }

          .action-buttons-left, .action-buttons-right {
            width: 100%;
            justify-content: stretch;
          }

          .action-buttons-right button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
