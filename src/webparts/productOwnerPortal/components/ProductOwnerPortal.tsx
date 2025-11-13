import * as React from 'react';
import { useState, useEffect } from 'react';
import './index.css';
import { ThemeProvider, createTheme, Spinner, SpinnerSize } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Assessment } from './Assessment';
import { Dashboard } from './Dashboard';
import { ModuleView } from './ModuleView';
import { ResetButton } from './ResetButton';
import { IProductOwnerPortalProps } from './IProductOwnerPortalProps';
import { UserProfile, UserProgress } from '../types';
import { getModulesForPath } from '../moduleData';
import { SharePointService } from '../services/SharePointService';

// APH Brand Theme for Fluent UI (SharePoint-compatible)
const aphTheme = createTheme({
  palette: {
    themePrimary: '#009F4D',        // APH Green
    themeLighterAlt: '#f0faf4',
    themeLighter: '#ccf0dc',
    themeLight: '#a3e4c1',
    themeTertiary: '#55ca8b',
    themeSecondary: '#1ab15e',
    themeDarkAlt: '#008f45',
    themeDark: '#00783a',
    themeDarker: '#00582b',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralSecondaryAlt: '#8a8886',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#22254E',      // APH Dark Blue
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
  fonts: {
    small: { fontSize: '14px' },
    medium: { fontSize: '16px' },
    mediumPlus: { fontSize: '18px' },
    large: { fontSize: '20px' },
    xLarge: { fontSize: '24px' },
    xxLarge: { fontSize: '32px' },
  },
});

type ViewMode = 'assessment' | 'dashboard' | 'module' | 'resources';

const ProductOwnerPortal: React.FC<IProductOwnerPortalProps> = (props) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('assessment');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sharePointService] = useState(() => new SharePointService(props.context));

  // Load data from SharePoint on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const savedProfile = await sharePointService.getUserProfile();
        const savedProgress = await sharePointService.getUserProgress();

        if (savedProfile) {
          setUserProfile(savedProfile);
          setUserProgress(savedProgress);
          setViewMode('dashboard');
        } else {
          setUserProgress(sharePointService.initializeUserProgress());
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setUserProgress(sharePointService.initializeUserProgress());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sharePointService]);

  // Get modules for current path
  const pathModules = userProfile ? getModulesForPath(userProfile.learningPath) : [];

  // Find first incomplete module
  const getNextIncompleteModuleIndex = (): number => {
    if (!userProgress) return 0;
    const index = pathModules.findIndex(m => !userProgress.completedModules.includes(m.id));
    return index === -1 ? 0 : index;
  };

  // Handle assessment completion
  const handleAssessmentComplete = async (profile: UserProfile) => {
    try {
      setUserProfile(profile);
      await sharePointService.saveUserProfile(profile);

      const progress = sharePointService.initializeUserProgress();
      setUserProgress(progress);
      await sharePointService.saveUserProgress(progress);

      setViewMode('dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  // Handle start learning from dashboard
  const handleStartLearning = async () => {
    const nextIndex = getNextIncompleteModuleIndex();
    setCurrentModuleIndex(nextIndex);
    await sharePointService.updateCurrentModule(pathModules[nextIndex]?.id || null);
    setViewMode('module');
  };

  // Handle module completion
  const handleModuleComplete = async () => {
    const currentModule = pathModules[currentModuleIndex];
    if (!currentModule || !userProgress) return;

    try {
      await sharePointService.updateCompletedModule(currentModule.id);
      const updatedProgress = await sharePointService.getUserProgress();
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };

  // Handle skip module
  const handleSkipModule = async () => {
    if (currentModuleIndex < pathModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      await sharePointService.updateCurrentModule(pathModules[currentModuleIndex + 1]?.id || null);
    } else {
      setViewMode('dashboard');
    }
  };

  // Handle bookmark toggle
  const handleToggleBookmark = async () => {
    const currentModule = pathModules[currentModuleIndex];
    if (!currentModule || !userProgress) return;

    try {
      await sharePointService.toggleBookmark(currentModule.id);
      const updatedProgress = await sharePointService.getUserProgress();
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Handle next module
  const handleNextModule = async () => {
    if (currentModuleIndex < pathModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      await sharePointService.updateCurrentModule(pathModules[currentModuleIndex + 1]?.id || null);
    } else {
      // All modules completed, go back to dashboard
      setViewMode('dashboard');
    }
  };

  // Handle previous module
  const handlePreviousModule = async () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      await sharePointService.updateCurrentModule(pathModules[currentModuleIndex - 1]?.id || null);
    }
  };

  // Handle reset profile (from dashboard settings)
  const handleResetProfile = async () => {
    if (confirm('Are you sure you want to reset your progress and retake the assessment? This cannot be undone.')) {
      try {
        await sharePointService.clearAllData();
        setUserProfile(null);
        setUserProgress(sharePointService.initializeUserProgress());
        setViewMode('assessment');
        setCurrentModuleIndex(0);
      } catch (error) {
        console.error('Error resetting profile:', error);
      }
    }
  };

  // Handle demo reset (from FAB button)
  const handleDemoReset = async () => {
    try {
      await sharePointService.clearAllData();
      setUserProfile(null);
      setUserProgress(sharePointService.initializeUserProgress());
      setViewMode('assessment');
      setCurrentModuleIndex(0);
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider theme={aphTheme}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spinner size={SpinnerSize.large} label="Loading your learning portal..." />
        </div>
      </ThemeProvider>
    );
  }

  // Render based on view mode
  if (viewMode === 'assessment') {
    return (
      <ThemeProvider theme={aphTheme}>
        <Assessment onComplete={handleAssessmentComplete} />
      </ThemeProvider>
    );
  }

  if (viewMode === 'module' && userProfile && pathModules[currentModuleIndex] && userProgress) {
    const currentModule = pathModules[currentModuleIndex];

    return (
      <ThemeProvider theme={aphTheme}>
        <ModuleView
          module={currentModule}
          moduleNumber={currentModuleIndex + 1}
          totalModules={pathModules.length}
          isCompleted={userProgress.completedModules.includes(currentModule.id)}
          isBookmarked={userProgress.bookmarkedModules.includes(currentModule.id)}
          onComplete={handleModuleComplete}
          onSkip={handleSkipModule}
          onBookmark={handleToggleBookmark}
          onNext={handleNextModule}
          onPrevious={handlePreviousModule}
          onBackToDashboard={() => setViewMode('dashboard')}
          hasPrevious={currentModuleIndex > 0}
          hasNext={currentModuleIndex < pathModules.length - 1}
        />
        <ResetButton onReset={handleDemoReset} />
      </ThemeProvider>
    );
  }

  if (viewMode === 'dashboard' && userProfile && userProgress) {
    return (
      <ThemeProvider theme={aphTheme}>
        <div className="demo-banner">
          <Icon iconName="SharepointLogo" style={{ fontSize: '16px' }} aria-hidden="true" />
          SharePoint Mode - Your progress is saved to SharePoint Lists
        </div>

        <header className="site-header">
          <div className="header-content">
            <a href="#" onClick={() => setViewMode('dashboard')} className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={`${props.context.pageContext.web.absoluteUrl}/SiteAssets/coa-icon.png`}
                alt="City of Austin"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'white',
                  padding: '4px'
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>Austin Public Health</span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
              <button className="nav-link" onClick={() => setViewMode('dashboard')}>
                <Icon iconName="Home" aria-hidden="true" />
                Dashboard
              </button>
              <button className="nav-link" onClick={handleStartLearning}>
                <Icon iconName="Education" aria-hidden="true" />
                Continue Learning
              </button>
              <a href="#resources" className="nav-link">Resources</a>
              <a href="#support" className="nav-link">Support</a>
            </nav>
          </div>
        </header>

        <Dashboard
          userProfile={userProfile}
          userProgress={userProgress}
          onStartLearning={handleStartLearning}
          onResetProfile={handleResetProfile}
        />

        {/* Resources Section */}
        <section id="resources" className="section" style={{ background: 'white' }}>
          <div className="section-content">
            <h2 id="resources-heading" className="h2">Essential Resources</h2>
            <p>Templates, training, and guidelines to support your product ownership journey</p>

            <div className="grid grid--3">
              {/* Complete Template Pack */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="DocumentSet" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Complete Template Pack</h3>
                    <div className="card__meta">All templates bundled</div>
                  </div>
                </div>
                <div className="card__body">
                  <p><strong>What's included:</strong></p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-2) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Product Roadmap Template</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• User Story Template</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Sprint Planning Guide</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Retrospective Template</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary" onClick={() => alert('This feature would download the complete template pack from SharePoint document library.')} aria-label="Download complete template pack">Download Pack</button>
                </div>
              </article>

              {/* Core Training */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="Education" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Core Training</h3>
                    <div className="card__meta">Essential skills only</div>
                  </div>
                </div>
                <div className="card__body">
                  <p><strong>Essential modules:</strong></p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-2) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Product Management Fundamentals</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• User Experience Design</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Data-Driven Decision Making</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary" onClick={() => alert('This feature would provide access to core training materials.')} aria-label="Access core training materials">Access Training</button>
                </div>
              </article>

              {/* Compliance & Guidelines */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="ComplianceAudit" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Compliance & Guidelines</h3>
                    <div className="card__meta">Streamlined documentation</div>
                  </div>
                </div>
                <div className="card__body">
                  <p><strong>Essential policies:</strong></p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-2) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Product Governance Policy</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Compliance & Accessibility Standards</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Procurement Procedures</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary" onClick={() => alert('This feature would provide access to compliance guidelines and policies.')} aria-label="Read compliance and guidelines">Read Guidelines</button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="section">
          <div className="section-content">
            <h2 id="support-heading" className="h2">Support & Community</h2>
            <p>Get help when you need it and connect with fellow Product Owners</p>

            <div className="grid grid--3">
              {/* Direct Support */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="ContactCard" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Direct Support</h3>
                    <div className="card__meta">Available 9 AM - 5 PM</div>
                  </div>
                </div>
                <div className="card__body">
                  <p>Get immediate assistance from the Product Governance team</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>Email:</strong> governance@aph.gov</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>Phone:</strong> (512) 555-0123</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>Chat:</strong> Available in portal</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <a className="btn btn--primary" href="mailto:governance@aph.gov" aria-label="Email Product Governance team">Contact Support</a>
                </div>
              </article>

              {/* Office Hours */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="Group" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Office Hours</h3>
                    <div className="card__meta">Weekly Sessions</div>
                  </div>
                </div>
                <div className="card__body">
                  <p>Join our weekly office hours for Q&A and best practice sharing</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>When:</strong> Tuesdays 2-3 PM</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>Format:</strong> Virtual & In-Person</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}><strong>Capacity:</strong> 20 participants</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary" onClick={() => alert('This feature would allow you to register for weekly office hours.')} aria-label="Register for office hours">Register Now</button>
                </div>
              </article>

              {/* Community */}
              <article className="card">
                <div className="card__header">
                  <Icon iconName="MessageFill" className="icon" aria-hidden="true" />
                  <div>
                    <h3 className="h3">Product Owner Community</h3>
                    <div className="card__meta">Collaborative Network</div>
                  </div>
                </div>
                <div className="card__body">
                  <p>Connect with fellow Product Owners for peer support and collaboration</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0 0' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Monthly roundtables</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Shared Slack workspace</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Resource sharing library</li>
                  </ul>
                </div>
                <div className="card__actions">
                  <button className="btn btn--primary" onClick={() => alert('This feature would allow you to join the Product Owner community.')} aria-label="Join Product Owner community">Join Community</button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <ResetButton onReset={handleDemoReset} />
      </ThemeProvider>
    );
  }

  // Fallback
  return (
    <ThemeProvider theme={aphTheme}>
      <Assessment onComplete={handleAssessmentComplete} />
    </ThemeProvider>
  );
};

export default ProductOwnerPortal;
