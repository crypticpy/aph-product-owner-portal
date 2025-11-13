import React, { useState } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { ExperienceLevel, GovernanceTier, TimeCommitment, LearningPath, UserProfile } from '../types';
import { calculatePathDuration } from '../moduleData';

interface AssessmentProps {
  onComplete: (profile: UserProfile) => void;
}

export function Assessment({ onComplete }: AssessmentProps) {
  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [governanceTier, setGovernanceTier] = useState<GovernanceTier | null>(null);
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(null);

  const determineLearningPath = (): LearningPath => {
    // Express path: experienced PO with simple product
    if (experienceLevel === 'experienced' && (governanceTier === 'tier3-4' || governanceTier === 'not-sure')) {
      return 'express';
    }

    // Comprehensive path: new PO with complex product or lots of time
    if (experienceLevel === 'new' && (governanceTier === 'tier1-2' || timeCommitment === 'more-than-3')) {
      return 'comprehensive';
    }

    // Standard path: everyone else (most common)
    return 'standard';
  };

  const handleComplete = () => {
    if (!experienceLevel || !governanceTier || !timeCommitment) return;

    const learningPath = determineLearningPath();
    const profile: UserProfile = {
      experienceLevel,
      governanceTier,
      timeCommitment,
      learningPath,
      completedAt: new Date().toISOString(),
    };

    onComplete(profile);
  };

  const pathInfo = {
    express: {
      name: 'Express Track',
      duration: calculatePathDuration('express'),
      modules: 8,
      description: 'Quick setup for experienced Product Owners',
      icon: 'LightningBolt'
    },
    standard: {
      name: 'Standard Track',
      duration: calculatePathDuration('standard'),
      modules: 20,
      description: 'Comprehensive onboarding for new Product Owners',
      icon: 'Education'
    },
    comprehensive: {
      name: 'Comprehensive Track',
      duration: calculatePathDuration('comprehensive'),
      modules: 34,
      description: 'Deep-dive training for complex products',
      icon: 'Certificate'
    }
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header">
          <Icon iconName="Brain" style={{ fontSize: '48px', color: 'var(--color-primary)' }} aria-hidden="true" />
          <h1 className="h2" style={{ marginTop: 'var(--space-3)' }}>Welcome to APH Product Owner Program!</h1>
          <p className="lead" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
            Let's personalize your learning experience
          </p>
          <div className="progress-dots">
            <span className={step >= 1 ? 'dot active' : 'dot'}></span>
            <span className={step >= 2 ? 'dot active' : 'dot'}></span>
            <span className={step >= 3 ? 'dot active' : 'dot'}></span>
          </div>
        </div>

        <div className="assessment-body">
          {/* Step 1: Experience Level */}
          {step === 1 && (
            <div className="assessment-step">
              <h2 className="h3">Have you been a Product Owner before?</h2>
              <p style={{ marginBottom: 'var(--space-5)', opacity: 0.8 }}>
                This helps us show you the right level of detail.
              </p>

              <div className="option-grid">
                <button
                  className={`option-card ${experienceLevel === 'new' ? 'selected' : ''}`}
                  onClick={() => setExperienceLevel('new')}
                >
                  <Icon iconName="Contact" aria-hidden="true" />
                  <strong>I'm brand new</strong>
                  <span className="option-description">First time as a Product Owner</span>
                </button>

                <button
                  className={`option-card ${experienceLevel === 'somewhat' ? 'selected' : ''}`}
                  onClick={() => setExperienceLevel('somewhat')}
                >
                  <Icon iconName="ProgressRingDots" aria-hidden="true" />
                  <strong>I have some experience</strong>
                  <span className="option-description">I've done similar work before</span>
                </button>

                <button
                  className={`option-card ${experienceLevel === 'experienced' ? 'selected' : ''}`}
                  onClick={() => setExperienceLevel('experienced')}
                >
                  <Icon iconName="Trophy2" aria-hidden="true" />
                  <strong>I'm experienced</strong>
                  <span className="option-description">I've been a PO at other organizations</span>
                </button>
              </div>

              <button
                className="btn btn--primary"
                style={{ marginTop: 'var(--space-6)' }}
                onClick={() => setStep(2)}
                disabled={!experienceLevel}
              >
                Continue
                <Icon iconName="ChevronRight" style={{ fontSize: '20px' }} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Step 2: Governance Tier */}
          {step === 2 && (
            <div className="assessment-step">
              <h2 className="h3">What's your product's governance tier?</h2>
              <p style={{ marginBottom: 'var(--space-5)', opacity: 0.8 }}>
                This determines your compliance requirements. Don't worry if you're not sure!
              </p>

              <div className="option-grid">
                <button
                  className={`option-card ${governanceTier === 'tier1-2' ? 'selected' : ''}`}
                  onClick={() => setGovernanceTier('tier1-2')}
                >
                  <Icon iconName="Shield" aria-hidden="true" />
                  <strong>Tier 1-2 (High Risk)</strong>
                  <span className="option-description">Handles PHI/PII or mission-critical</span>
                </button>

                <button
                  className={`option-card ${governanceTier === 'tier3-4' ? 'selected' : ''}`}
                  onClick={() => setGovernanceTier('tier3-4')}
                >
                  <Icon iconName="SkypeCircleCheck" aria-hidden="true" />
                  <strong>Tier 3-4 (Standard)</strong>
                  <span className="option-description">Internal tools, low-risk systems</span>
                </button>

                <button
                  className={`option-card ${governanceTier === 'not-sure' ? 'selected' : ''}`}
                  onClick={() => setGovernanceTier('not-sure')}
                >
                  <Icon iconName="Unknown" aria-hidden="true" />
                  <strong>Not sure yet</strong>
                  <span className="option-description">We'll help you figure it out</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button
                  className="btn btn--secondary"
                  onClick={() => setStep(1)}
                >
                  <Icon iconName="ChevronLeft" style={{ fontSize: '20px' }} aria-hidden="true" />
                  Back
                </button>
                <button
                  className="btn btn--primary"
                  onClick={() => setStep(3)}
                  disabled={!governanceTier}
                  style={{ flex: 1 }}
                >
                  Continue
                  <Icon iconName="ChevronRight" style={{ fontSize: '20px' }} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Time Commitment & Results */}
          {step === 3 && (
            <div className="assessment-step">
              <h2 className="h3">How much time can you dedicate this week?</h2>
              <p style={{ marginBottom: 'var(--space-5)', opacity: 0.8 }}>
                We'll prioritize the most important content for you.
              </p>

              <div className="option-grid">
                <button
                  className={`option-card ${timeCommitment === 'less-than-1' ? 'selected' : ''}`}
                  onClick={() => setTimeCommitment('less-than-1')}
                >
                  <Icon iconName="Clock" aria-hidden="true" />
                  <strong>Less than 1 hour</strong>
                  <span className="option-description">Just the essentials</span>
                </button>

                <button
                  className={`option-card ${timeCommitment === '1-to-3' ? 'selected' : ''}`}
                  onClick={() => setTimeCommitment('1-to-3')}
                >
                  <Icon iconName="Calendar" aria-hidden="true" />
                  <strong>1-3 hours</strong>
                  <span className="option-description">Standard onboarding pace</span>
                </button>

                <button
                  className={`option-card ${timeCommitment === 'more-than-3' ? 'selected' : ''}`}
                  onClick={() => setTimeCommitment('more-than-3')}
                >
                  <Icon iconName="CalendarDay" aria-hidden="true" />
                  <strong>3+ hours</strong>
                  <span className="option-description">Deep dive into everything</span>
                </button>
              </div>

              {timeCommitment && experienceLevel && governanceTier && (
                <div className="path-preview">
                  <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                    <Icon iconName={pathInfo[determineLearningPath()].icon} style={{ fontSize: '64px', color: 'var(--color-primary)' }} aria-hidden="true" />
                    <h3 className="h3" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      Your Personalized Path: {pathInfo[determineLearningPath()].name}
                    </h3>
                    <p style={{ fontSize: 'var(--step-0)', opacity: 0.8 }}>
                      {pathInfo[determineLearningPath()].description}
                    </p>
                  </div>

                  <div className="path-stats">
                    <div className="stat">
                      <Icon iconName="GridViewMedium" aria-hidden="true" />
                      <div>
                        <strong>{pathInfo[determineLearningPath()].modules} modules</strong>
                        <span>Bite-sized lessons</span>
                      </div>
                    </div>
                    <div className="stat">
                      <Icon iconName="Clock" aria-hidden="true" />
                      <div>
                        <strong>~{Math.round(pathInfo[determineLearningPath()].duration / 60)} hours</strong>
                        <span>Total time investment</span>
                      </div>
                    </div>
                    <div className="stat">
                      <Icon iconName="TrendingUp" aria-hidden="true" />
                      <div>
                        <strong>Track progress</strong>
                        <span>See your achievements</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button
                  className="btn btn--secondary"
                  onClick={() => setStep(2)}
                >
                  <Icon iconName="ChevronLeft" style={{ fontSize: '20px' }} aria-hidden="true" />
                  Back
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleComplete}
                  disabled={!timeCommitment}
                  style={{ flex: 1 }}
                >
                  Start My Journey
                  <Icon iconName="Rocket" style={{ fontSize: '20px' }} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .assessment-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-brand-blue) 0%, #2d3276 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
        }

        .assessment-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 700px;
          width: 100%;
        }

        .assessment-header {
          text-align: center;
          padding: var(--space-7) var(--space-6) var(--space-5);
          border-bottom: 1px solid var(--color-muted);
        }

        .progress-dots {
          display: flex;
          gap: var(--space-2);
          justify-content: center;
          margin-top: var(--space-4);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-muted);
          transition: all 0.3s;
        }

        .dot.active {
          width: 24px;
          border-radius: 4px;
          background: var(--color-primary);
        }

        .assessment-body {
          padding: var(--space-6);
        }

        .assessment-step {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .option-grid {
          display: grid;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .option-card {
          background: white;
          border: 2px solid var(--color-muted);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-2);
          position: relative;
          overflow: hidden;
        }

        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 159, 77, 0.1), transparent);
          transition: left 0.5s;
        }

        .option-card:hover::before {
          left: 100%;
        }

        .option-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 159, 77, 0.2);
        }

        .option-card.selected {
          border-color: var(--color-primary);
          background: var(--color-light-green);
          border-width: 3px;
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 159, 77, 0.25);
        }

        .option-card .material-symbols-rounded {
          font-size: 40px;
          color: var(--color-brand-blue);
        }

        .option-card.selected .material-symbols-rounded {
          color: var(--color-primary);
        }

        .option-card strong {
          font-size: var(--step-1);
          color: var(--color-text);
        }

        .option-description {
          font-size: var(--step--1);
          opacity: 0.7;
          color: var(--color-text);
        }

        .path-preview {
          background: linear-gradient(135deg, var(--color-light-green) 0%, var(--color-light-blue) 100%);
          border-radius: var(--radius-md);
          padding: var(--space-6);
          margin-top: var(--space-5);
          border: 3px solid var(--color-primary);
          box-shadow: 0 8px 24px rgba(0, 159, 77, 0.2);
          animation: slideInUp 0.5s ease;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .path-stats {
          display: grid;
          gap: var(--space-4);
          margin-top: var(--space-5);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: white;
          border-radius: var(--radius-sm);
        }

        .stat .material-symbols-rounded {
          font-size: 32px;
          color: var(--color-primary);
        }

        .stat div {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .stat strong {
          font-size: var(--step-0);
          color: var(--color-text);
        }

        .stat span {
          font-size: var(--step--1);
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .assessment-container {
            padding: var(--space-4);
          }

          .assessment-header {
            padding: var(--space-5) var(--space-4);
          }

          .assessment-body {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
