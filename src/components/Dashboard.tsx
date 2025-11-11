import React from 'react';
import { UserProfile, UserProgress, LearningPath } from '../types';
import { getModulesForPath, calculatePathDuration } from '../moduleData';

interface DashboardProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  onStartLearning: () => void;
  onResetProfile: () => void;
}

export function Dashboard({ userProfile, userProgress, onStartLearning, onResetProfile }: DashboardProps) {
  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const pathModules = getModulesForPath(userProfile.learningPath);
  const totalModules = pathModules.length;
  const completedCount = userProgress.completedModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);

  // Calculate remaining time
  const remainingModules = pathModules.filter(m => !userProgress.completedModules.includes(m.id));
  const remainingMinutes = remainingModules.reduce((sum, m) => sum + m.duration, 0);
  const remainingHours = Math.round(remainingMinutes / 60 * 10) / 10;

  const totalDuration = calculatePathDuration(userProfile.learningPath);
  const completedDuration = pathModules
    .filter(m => userProgress.completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.duration, 0);

  const nextModules = pathModules.filter(m => !userProgress.completedModules.includes(m.id)).slice(0, 3);
  const bookmarkedModules = pathModules.filter(m => userProgress.bookmarkedModules.includes(m.id));

  const pathInfo: Record<LearningPath, { name: string; icon: string; color: string }> = {
    express: { name: 'Express Track', icon: 'bolt', color: '#FF8F00' },
    standard: { name: 'Standard Track', icon: 'school', color: '#009F4D' },
    comprehensive: { name: 'Comprehensive Track', icon: 'workspace_premium', color: '#44499C' }
  };

  const currentPath = pathInfo[userProfile.learningPath];

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <section className="dashboard-hero">
        <div className="hero-content-dash">
          <h1 className="h1">{getGreeting()}! 👋</h1>
          <p className="lead-dash">
            {completedCount === 0
              ? "Ready to start your product owner journey? Let's dive in!"
              : completedCount === totalModules
              ? "🎉 Congratulations on completing your learning path!"
              : `You're ${progressPercentage}% through your ${currentPath.name}. Keep going!`}
          </p>
          {remainingHours > 0 && completedCount < totalModules && (
            <p className="lead-dash" style={{ fontSize: 'var(--step-0)', opacity: 0.8, marginTop: 'var(--space-2)' }}>
              ⏱️ About {remainingHours} hours remaining
            </p>
          )}
        </div>
      </section>

      <div className="dashboard-content">
        {/* Progress Overview Card */}
        <div className="dashboard-card progress-card">
          <div className="card-header-dash">
            <div>
              <h2 className="h3">Your Progress</h2>
              <p className="card-subtitle">{currentPath.name}</p>
            </div>
            <span className="material-symbols-rounded path-icon" style={{ color: currentPath.color }} aria-hidden="true">
              {currentPath.icon}
            </span>
          </div>

          {/* Progress Ring */}
          <div className="progress-ring-container">
            <svg
              className={`progress-ring ${progressPercentage === 100 ? 'progress-complete' : ''}`}
              width="180"
              height="180"
              style={{ overflow: 'visible' }}
            >
              <circle
                className="progress-ring-bg"
                stroke="#E0E0E0"
                strokeWidth="12"
                fill="transparent"
                r="80"
                cx="90"
                cy="90"
              />
              <circle
                className="progress-ring-fill"
                stroke={currentPath.color}
                strokeWidth="12"
                fill="transparent"
                r="80"
                cx="90"
                cy="90"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                transform="rotate(-90 90 90)"
                strokeLinecap="round"
              />
            </svg>
            <div className="progress-ring-text">
              <span className="progress-percentage">{progressPercentage}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-item" title="Total modules you've completed in your learning path">
              <span className="material-symbols-rounded" aria-hidden="true">check_circle</span>
              <div>
                <strong>{completedCount}</strong>
                <span>of {totalModules} modules</span>
              </div>
            </div>
            <div className="stat-item" title="Total time invested in learning">
              <span className="material-symbols-rounded" aria-hidden="true">schedule</span>
              <div>
                <strong>{Math.round(completedDuration / 60)}h</strong>
                <span>of {Math.round(totalDuration / 60)}h completed</span>
              </div>
            </div>
            <div className="stat-item" title="Modules saved for quick reference later">
              <span className="material-symbols-rounded" aria-hidden="true">bookmark</span>
              <div>
                <strong>{userProgress.bookmarkedModules.length}</strong>
                <span>bookmarked</span>
              </div>
            </div>
          </div>

          <button className="btn btn--primary btn-block" onClick={onStartLearning}>
            {completedCount === 0 ? 'Start Learning' : 'Continue Learning'}
            <span className="material-symbols-rounded" style={{ fontSize: '20px' }} aria-hidden="true">arrow_forward</span>
          </button>
        </div>

        {/* Up Next Section */}
        {nextModules.length > 0 && (
          <div className="dashboard-card">
            <div className="card-header-dash">
              <h2 className="h3">Up Next</h2>
              <span className="card-subtitle">{nextModules.length} modules remaining</span>
            </div>

            <div className="module-list">
              {nextModules.map((module, index) => (
                <button
                  key={module.id}
                  className="module-item module-item-clickable"
                  onClick={onStartLearning}
                  aria-label={`Start module: ${module.title}`}
                >
                  <div className="module-number">{completedCount + index + 1}</div>
                  <div className="module-info">
                    <h4>{module.title}</h4>
                    <p>{module.description}</p>
                    <div className="module-meta-row">
                      <span className="meta-badge">
                        <span className="material-symbols-rounded" aria-hidden="true">schedule</span>
                        {module.duration} min
                      </span>
                      <span className={`meta-badge priority-${module.priority}`}>
                        {module.priority === 'high' ? '🔥 High' : module.priority === 'medium' ? '⚡ Medium' : '📚 Low'}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-rounded" style={{ fontSize: '24px', color: 'var(--color-primary)', marginLeft: 'auto' }} aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked Modules */}
        {bookmarkedModules.length > 0 ? (
          <div className="dashboard-card">
            <div className="card-header-dash">
              <h2 className="h3">
                <span className="material-symbols-rounded" aria-hidden="true">bookmark</span>
                Bookmarked for Later
              </h2>
              <span className="card-subtitle">{bookmarkedModules.length} saved</span>
            </div>

            <div className="module-list">
              {bookmarkedModules.map(module => (
                <div key={module.id} className="module-item">
                  <span className="material-symbols-rounded bookmark-icon" aria-hidden="true">bookmark</span>
                  <div className="module-info">
                    <h4>{module.title}</h4>
                    <p>{module.description}</p>
                    <div className="module-meta-row">
                      <span className="meta-badge">
                        <span className="material-symbols-rounded" aria-hidden="true">schedule</span>
                        {module.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : completedCount > 0 && (
          <div className="dashboard-card empty-state-card">
            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--color-muted)', marginBottom: 'var(--space-3)' }} aria-hidden="true">
                bookmark_border
              </span>
              <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>No bookmarks yet</h3>
              <p style={{ color: 'var(--color-text)', opacity: 0.7, maxWidth: '400px', margin: '0 auto' }}>
                Use the 🔖 bookmark button to save modules for quick reference later. Great for templates and checklists you'll use often!
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h2 className="h3">Quick Actions</h2>

          <div className="action-links">
            <a href="#resources" className="action-link">
              <span className="material-symbols-rounded" aria-hidden="true">folder_open</span>
              <div>
                <strong>Browse Resources</strong>
                <span>Templates, guides, and documentation</span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">arrow_forward</span>
            </a>

            <a href="#support" className="action-link">
              <span className="material-symbols-rounded" aria-hidden="true">support_agent</span>
              <div>
                <strong>Get Support</strong>
                <span>Office hours and community</span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">arrow_forward</span>
            </a>

            <button className="action-link" onClick={onResetProfile}>
              <span className="material-symbols-rounded" aria-hidden="true">refresh</span>
              <div>
                <strong>Change Learning Path</strong>
                <span>Retake the assessment</span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Achievements (if completed) */}
        {completedCount === totalModules && (
          <div className="dashboard-card achievement-card">
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-rounded achievement-icon" aria-hidden="true">
                emoji_events
              </span>
              <h2 className="h2">Congratulations! 🎉</h2>
              <p className="lead-dash">
                You've completed your {currentPath.name}! You're now ready to excel as an APH Product Owner.
              </p>
              <div className="achievement-actions">
                <a href="#resources" className="btn btn--primary">
                  Explore Advanced Resources
                  <span className="material-symbols-rounded" style={{ fontSize: '20px' }} aria-hidden="true">arrow_forward</span>
                </a>
                <a href="#support" className="btn btn--secondary">
                  Join the Community
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--color-bg);
        }

        .dashboard-hero {
          background: linear-gradient(135deg, var(--color-brand-blue) 0%, #2d3276 100%);
          color: white;
          padding: var(--space-8) var(--space-6);
        }

        .hero-content-dash {
          max-width: 1200px;
          margin: 0 auto;
        }

        .lead-dash {
          font-size: var(--step-1);
          opacity: 0.95;
          margin: var(--space-3) 0 0;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-6);
          display: grid;
          gap: var(--space-6);
        }

        .dashboard-card {
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          padding: var(--space-6);
        }

        .progress-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-7);
        }

        .card-header-dash {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-5);
          width: 100%;
        }

        .card-subtitle {
          font-size: var(--step--1);
          opacity: 0.7;
          margin-top: var(--space-1);
        }

        .path-icon {
          font-size: 48px;
        }

        .progress-ring-container {
          position: relative;
          margin: var(--space-6) 0;
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        .progress-ring-fill {
          transition: stroke-dashoffset 1s ease;
        }

        .progress-ring.progress-complete .progress-ring-fill {
          filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 4px currentColor);
          animation: progressGlow 2s ease-in-out infinite;
        }

        @keyframes progressGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 4px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 16px currentColor)
                    drop-shadow(0 0 24px currentColor)
                    drop-shadow(0 0 12px currentColor);
          }
        }

        .progress-ring-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .progress-percentage {
          font-size: 48px;
          font-weight: 600;
          color: var(--color-text);
        }

        .progress-label {
          font-size: var(--step--1);
          opacity: 0.7;
          margin-top: var(--space-1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-4);
          width: 100%;
          margin: var(--space-6) 0;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--color-bg);
          border-radius: var(--radius-sm);
        }

        .stat-item .material-symbols-rounded {
          font-size: 32px;
          color: var(--color-primary);
        }

        .stat-item div {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .stat-item strong {
          font-size: var(--step-1);
          color: var(--color-text);
        }

        .stat-item span {
          font-size: var(--step--1);
          opacity: 0.7;
        }

        .btn-block {
          width: 100%;
          justify-content: center;
        }

        .module-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .module-item {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--color-bg);
          border-radius: var(--radius-sm);
          border-left: 4px solid var(--color-primary);
          transition: all 0.2s;
        }

        .module-item-clickable {
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
          align-items: center;
        }

        .module-item-clickable:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background: white;
        }

        .module-item:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .module-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          font-weight: 600;
          flex-shrink: 0;
        }

        .bookmark-icon {
          font-size: 32px;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .module-info {
          flex: 1;
        }

        .module-info h4 {
          font-size: var(--step-1);
          font-weight: 600;
          margin: 0 0 var(--space-2) 0;
          color: var(--color-text);
        }

        .module-info p {
          font-size: var(--step--1);
          opacity: 0.7;
          margin: 0 0 var(--space-3) 0;
        }

        .module-meta-row {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .meta-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          background: white;
          border-radius: var(--radius-sm);
          font-size: var(--step--1);
          font-weight: 500;
        }

        .meta-badge .material-symbols-rounded {
          font-size: 14px;
        }

        .meta-badge.priority-high {
          background: #FEE;
          color: #C00;
        }

        .meta-badge.priority-medium {
          background: #FFC;
          color: #860;
        }

        .meta-badge.priority-low {
          background: #EEF;
          color: #558;
        }

        .action-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .action-link {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--color-bg);
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          text-decoration: none;
          color: var(--color-text);
          transition: all 0.2s;
          cursor: pointer;
          width: 100%;
        }

        .action-link:hover {
          border-color: var(--color-primary);
          transform: translateX(4px);
        }

        .action-link > .material-symbols-rounded:first-child {
          font-size: 32px;
          color: var(--color-brand-blue);
          flex-shrink: 0;
        }

        .action-link > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .action-link strong {
          font-size: var(--step-0);
        }

        .action-link span:not(.material-symbols-rounded) {
          font-size: var(--step--1);
          opacity: 0.7;
        }

        .action-link .arrow {
          color: var(--color-muted);
          transition: transform 0.2s;
        }

        .action-link:hover .arrow {
          transform: translateX(4px);
        }

        .achievement-card {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-dark) 100%);
          color: white;
          text-align: center;
          padding: var(--space-8);
        }

        .achievement-icon {
          font-size: 80px;
          color: #FFD700;
          margin-bottom: var(--space-4);
        }

        .achievement-card .h2 {
          color: white;
          margin-bottom: var(--space-3);
        }

        .achievement-card .lead-dash {
          margin-bottom: var(--space-6);
        }

        .achievement-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: var(--space-4);
            gap: var(--space-4);
          }

          .dashboard-card {
            padding: var(--space-5);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .achievement-actions {
            flex-direction: column;
          }

          .achievement-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
