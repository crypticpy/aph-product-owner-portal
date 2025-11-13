# SPFx Rebuild Guide
## APH Product Owner Portal - Step-by-Step Implementation

This guide provides detailed instructions for rebuilding the APH Product Owner Portal using SharePoint Framework (SPFx) for GCC deployment.

> **Prerequisites**: Review `SHAREPOINT_MIGRATION_GUIDE.md` and `SHAREPOINT_GCC_REQUIREMENTS.md` before starting.

---

## Table of Contents

1. [Environment Setup](#1-environment-setup)
2. [SPFx Project Scaffolding](#2-spfx-project-scaffolding)
3. [SharePoint Lists Creation](#3-sharepoint-lists-creation)
4. [Component Rebuild: Assessment](#4-component-rebuild-assessment)
5. [Component Rebuild: Dashboard](#5-component-rebuild-dashboard)
6. [Component Rebuild: ModuleView](#6-component-rebuild-moduleview)
7. [Data Layer: SharePointService](#7-data-layer-sharepointservice)
8. [Styling & Theming](#8-styling--theming)
9. [Testing & Deployment](#9-testing--deployment)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Environment Setup

### 1.1 Install Required Software

```bash
# Install Node.js 22 LTS
# Download from: https://nodejs.org/
node --version  # Should show v22.x.x

# Install Yeoman and SPFx generator globally
npm install -g yo @microsoft/generator-sharepoint@1.21.1

# Verify installation
yo --version  # Should show 4.x.x or higher
yo @microsoft/sharepoint --version  # Should show 1.21.1
```

### 1.2 Verify GCC Tenant Access

```bash
# Test SharePoint access (replace with your tenant)
# Example: https://aphgov.sharepoint.us

# Ask your SharePoint admin for:
# - Tenant URL
# - App Catalog access
# - Site collection permissions
# - User Profile Service status
```

### 1.3 Clone Current React App for Reference

```bash
# Clone the existing repository
git clone <repository-url> aph-portal-reference
cd aph-portal-reference/aph-product-owner-portal

# Review current implementation
# - src/App.tsx (state management)
# - src/components/* (component structure)
# - src/moduleData.ts (content)
# - src/types.ts (TypeScript interfaces)
```

---

## 2. SPFx Project Scaffolding

### 2.1 Create New SPFx Solution

```bash
# Create project directory
mkdir aph-product-owner-portal-spfx
cd aph-product-owner-portal-spfx

# Run Yeoman generator
yo @microsoft/sharepoint
```

**Generator prompts:**
```
? What is your solution name? aph-product-owner-portal-spfx
? Which type of client-side component to create? WebPart
? What is your Web part name? ProductOwnerPortal
? Which template would you like to use? React
? Do you want to allow the tenant admin to deploy the solution to all sites immediately? Yes
? Will the components in the solution require permissions to access web APIs? Yes
? Which framework would you like to use? React
```

### 2.2 Install Additional Dependencies

```bash
# Install PnP JS for SharePoint operations
npm install @pnp/sp @pnp/common --save

# Install Fluent UI components
npm install office-ui-fabric-react@8.120.8 --save

# Install Fluent UI charting (optional - if not using custom SVG)
npm install @fluentui/react-charting --save

# Install markdown renderer
npm install markdown-to-jsx --save

# Install type definitions
npm install @types/react@17.0.2 @types/react-dom@17.0.2 --save-dev
```

### 2.3 Project Structure Overview

```
aph-product-owner-portal-spfx/
├── config/
│   ├── config.json                 # Solution configuration
│   ├── package-solution.json       # .sppkg package config
│   ├── serve.json                  # Dev server config
│   └── write-manifests.json
├── src/
│   └── webparts/
│       └── productOwnerPortal/
│           ├── ProductOwnerPortalWebPart.ts        # Web part entry point
│           ├── ProductOwnerPortalWebPart.module.scss
│           ├── components/
│           │   ├── ProductOwnerPortal.tsx          # Main container (like App.tsx)
│           │   ├── ProductOwnerPortal.module.scss
│           │   ├── Assessment/
│           │   │   ├── Assessment.tsx
│           │   │   └── Assessment.module.scss
│           │   ├── Dashboard/
│           │   │   ├── Dashboard.tsx
│           │   │   ├── ProgressRing.tsx
│           │   │   └── Dashboard.module.scss
│           │   ├── ModuleView/
│           │   │   ├── ModuleView.tsx
│           │   │   ├── QuizQuestion.tsx
│           │   │   └── ModuleView.module.scss
│           │   └── shared/
│           │       ├── ModuleCard.tsx
│           │       └── NavigationButtons.tsx
│           ├── services/
│           │   ├── SharePointService.ts            # Replaces storage.ts
│           │   └── ModuleDataService.ts            # Module content
│           ├── models/
│           │   └── types.ts                        # Copy from React app
│           └── loc/
│               ├── en-us.js
│               └── mystrings.d.ts
├── sharepoint/
│   └── assets/
│       └── elements.xml
├── teams/
├── package.json
├── tsconfig.json
└── gulpfile.js
```

### 2.4 Update package-solution.json for GCC

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "aph-product-owner-portal-spfx-client-side-solution",
    "id": "YOUR-GUID-HERE",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": false,
    "isDomainIsolated": false,
    "developer": {
      "name": "Austin Public Health",
      "websiteUrl": "",
      "privacyUrl": "",
      "termsOfUseUrl": "",
      "mpnId": "Undefined-1.21.1"
    },
    "metadata": {
      "shortDescription": {
        "default": "APH Product Owner micro-learning portal"
      },
      "longDescription": {
        "default": "Adaptive micro-learning experience for APH Product Owners with personalized learning paths"
      },
      "screenshotPaths": [],
      "videoUrl": "",
      "categories": []
    },
    "features": [
      {
        "title": "aph-product-owner-portal-spfx Feature",
        "description": "The feature that activates elements of the aph-product-owner-portal-spfx solution.",
        "id": "YOUR-FEATURE-GUID-HERE",
        "version": "1.0.0.0"
      }
    ]
  },
  "paths": {
    "zippedPackage": "solution/aph-product-owner-portal-spfx.sppkg"
  }
}
```

---

## 3. SharePoint Lists Creation

### 3.1 Create Lists via SharePoint UI

Navigate to your SharePoint site and create these lists:

#### List 1: UserProfiles

```
List Name: UserProfiles
Template: Custom List

Columns:
- Title (default) - rename to "UserEmail"
- ExperienceLevel (Choice): new, somewhat, experienced
- GovernanceTier (Choice): tier1-2, tier3-4, not-sure
- TimeCommitment (Choice): less-than-1, 1-to-3, more-than-3
- LearningPath (Choice): express, standard, comprehensive
- AssessmentDate (Date and Time)
- LastVisit (Date and Time)

Settings:
- Enable versioning: No
- Require content approval: No
- Create views: Default view only
```

#### List 2: UserProgress

```
List Name: UserProgress
Template: Custom List

Columns:
- Title (default) - auto-generated
- UserEmail (Single line of text)
- CompletedModules (Multiple lines of text, plain text)
- BookmarkedModules (Multiple lines of text, plain text)
- CurrentModule (Single line of text)
- LastVisited (Date and Time)
- TotalTimeSpent (Number, 0 decimals)

Settings:
- Enable versioning: No
- Require content approval: No
```

### 3.2 Set List Permissions

```bash
# Navigate to List Settings > Permissions

# Remove inheritance
# "Stop Inheriting Permissions"

# Create new permission level: "Own Items Only"
# Grant permissions:
# - Read - View items, Open items
# - Add Items - Add items
# - Edit Items - Edit items (own items only)
# - Delete Items - Delete items (own items only)

# Apply to both UserProfiles and UserProgress lists
```

### 3.3 PnP PowerShell Provisioning Script (Alternative)

```powershell
# Save as: provision-lists.ps1

Connect-PnPOnline -Url "https://your-tenant.sharepoint.us/sites/aph-product-owner-program" -UseWebLogin

# Create UserProfiles list
$listUserProfiles = New-PnPList -Title "UserProfiles" -Template GenericList -OnQuickLaunch

Add-PnPField -List "UserProfiles" -DisplayName "ExperienceLevel" -InternalName "ExperienceLevel" -Type Choice -Choices @("new", "somewhat", "experienced") -Required
Add-PnPField -List "UserProfiles" -DisplayName "GovernanceTier" -InternalName "GovernanceTier" -Type Choice -Choices @("tier1-2", "tier3-4", "not-sure") -Required
Add-PnPField -List "UserProfiles" -DisplayName "TimeCommitment" -InternalName "TimeCommitment" -Type Choice -Choices @("less-than-1", "1-to-3", "more-than-3") -Required
Add-PnPField -List "UserProfiles" -DisplayName "LearningPath" -InternalName "LearningPath" -Type Choice -Choices @("express", "standard", "comprehensive") -Required
Add-PnPField -List "UserProfiles" -DisplayName "AssessmentDate" -InternalName "AssessmentDate" -Type DateTime -Required
Add-PnPField -List "UserProfiles" -DisplayName "LastVisit" -InternalName "LastVisit" -Type DateTime

# Create UserProgress list
$listUserProgress = New-PnPList -Title "UserProgress" -Template GenericList -OnQuickLaunch

Add-PnPField -List "UserProgress" -DisplayName "UserEmail" -InternalName "UserEmail" -Type Text -Required
Add-PnPField -List "UserProgress" -DisplayName "CompletedModules" -InternalName "CompletedModules" -Type Note
Add-PnPField -List "UserProgress" -DisplayName "BookmarkedModules" -InternalName "BookmarkedModules" -Type Note
Add-PnPField -List "UserProgress" -DisplayName "CurrentModule" -InternalName "CurrentModule" -Type Text
Add-PnPField -List "UserProgress" -DisplayName "LastVisited" -InternalName "LastVisited" -Type DateTime
Add-PnPField -List "UserProgress" -DisplayName "TotalTimeSpent" -InternalName "TotalTimeSpent" -Type Number

Write-Host "Lists created successfully!" -ForegroundColor Green
```

---

## 4. Component Rebuild: Assessment

### 4.1 Copy Types from React App

```typescript
// src/webparts/productOwnerPortal/models/types.ts

export type ExperienceLevel = 'new' | 'somewhat' | 'experienced';
export type GovernanceTier = 'tier1-2' | 'tier3-4' | 'not-sure';
export type TimeCommitment = 'less-than-1' | '1-to-3' | 'more-than-3';
export type LearningPath = 'express' | 'standard' | 'comprehensive';

export interface UserProfile {
  experienceLevel: ExperienceLevel;
  governanceTier: GovernanceTier;
  timeCommitment: TimeCommitment;
  learningPath: LearningPath;
  completedAt: Date;
}

export interface UserProgress {
  completedModules: string[];
  bookmarkedModules: string[];
  currentModule: string | null;
  lastVisited: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'day1' | 'week1' | 'week2' | 'week3-4' | 'resources';
  priority: 'high' | 'medium' | 'low';
  learningPaths: LearningPath[];
  content: string;
  checkQuestion?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}
```

### 4.2 Create Assessment Component

```typescript
// src/webparts/productOwnerPortal/components/Assessment/Assessment.tsx

import * as React from 'react';
import { useState } from 'react';
import { Stack, ChoiceGroup, IChoiceGroupOption, PrimaryButton, Text, Icon } from 'office-ui-fabric-react';
import { ExperienceLevel, GovernanceTier, TimeCommitment } from '../../models/types';
import styles from './Assessment.module.scss';

export interface IAssessmentProps {
  onComplete: (experience: ExperienceLevel, governance: GovernanceTier, time: TimeCommitment) => void;
}

export const Assessment: React.FC<IAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [governanceTier, setGovernanceTier] = useState<GovernanceTier | null>(null);
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(null);

  const experienceOptions: IChoiceGroupOption[] = [
    {
      key: 'new',
      text: "I'm brand new to being a Product Owner",
      iconProps: { iconName: 'Contact' },
    },
    {
      key: 'somewhat',
      text: 'I have some experience',
      iconProps: { iconName: 'ProgressRingDots' },
    },
    {
      key: 'experienced',
      text: "I'm an experienced Product Owner",
      iconProps: { iconName: 'Trophy2' },
    },
  ];

  const governanceOptions: IChoiceGroupOption[] = [
    {
      key: 'tier1-2',
      text: 'Tier 1 or 2 (simple product)',
      iconProps: { iconName: 'Lightbulb' },
    },
    {
      key: 'tier3-4',
      text: 'Tier 3 or 4 (complex product)',
      iconProps: { iconName: 'Settings' },
    },
    {
      key: 'not-sure',
      text: "I'm not sure",
      iconProps: { iconName: 'Unknown' },
    },
  ];

  const timeOptions: IChoiceGroupOption[] = [
    {
      key: 'less-than-1',
      text: 'Less than 1 hour per week',
      iconProps: { iconName: 'Clock' },
    },
    {
      key: '1-to-3',
      text: '1-3 hours per week',
      iconProps: { iconName: 'DateTime' },
    },
    {
      key: 'more-than-3',
      text: 'More than 3 hours per week',
      iconProps: { iconName: 'Calendar' },
    },
  ];

  const handleNext = () => {
    if (currentQuestion < 2) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(experienceLevel!, governanceTier!, timeCommitment!);
    }
  };

  const isNextDisabled = (): boolean => {
    if (currentQuestion === 0) return !experienceLevel;
    if (currentQuestion === 1) return !governanceTier;
    if (currentQuestion === 2) return !timeCommitment;
    return false;
  };

  const questions = [
    {
      title: 'What\'s your experience level?',
      subtitle: 'This helps us customize your learning path',
      options: experienceOptions,
      value: experienceLevel,
      onChange: (ev?: React.FormEvent, option?: IChoiceGroupOption) =>
        setExperienceLevel(option?.key as ExperienceLevel),
    },
    {
      title: 'What\'s your product\'s governance tier?',
      subtitle: 'Determines the complexity of your role',
      options: governanceOptions,
      value: governanceTier,
      onChange: (ev?: React.FormEvent, option?: IChoiceGroupOption) =>
        setGovernanceTier(option?.key as GovernanceTier),
    },
    {
      title: 'How much time can you dedicate?',
      subtitle: 'We\'ll adjust the pace to fit your schedule',
      options: timeOptions,
      value: timeCommitment,
      onChange: (ev?: React.FormEvent, option?: IChoiceGroupOption) =>
        setTimeCommitment(option?.key as TimeCommitment),
    },
  ];

  const currentQ = questions[currentQuestion];

  return (
    <div className={styles.assessmentContainer}>
      <Stack tokens={{ childrenGap: 32 }}>
        {/* Progress Dots */}
        <Stack horizontal tokens={{ childrenGap: 8 }} horizontalAlign="center">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`${styles.progressDot} ${idx <= currentQuestion ? styles.active : ''}`}
            />
          ))}
        </Stack>

        {/* Question Card */}
        <div className={styles.questionCard}>
          <Text variant="xxLarge" className={styles.questionTitle}>
            {currentQ.title}
          </Text>
          <Text variant="medium" className={styles.questionSubtitle}>
            {currentQ.subtitle}
          </Text>

          <ChoiceGroup
            options={currentQ.options}
            selectedKey={currentQ.value}
            onChange={currentQ.onChange}
            className={styles.choiceGroup}
          />

          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 16 }}>
            {currentQuestion > 0 && (
              <PrimaryButton
                text="Back"
                iconProps={{ iconName: 'ChevronLeft' }}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                styles={{
                  root: { backgroundColor: 'transparent', border: '2px solid #44499C', color: '#44499C' }
                }}
              />
            )}
            <PrimaryButton
              text={currentQuestion === 2 ? 'Get Started' : 'Next'}
              iconProps={{ iconName: 'ChevronRight' }}
              onClick={handleNext}
              disabled={isNextDisabled()}
            />
          </Stack>
        </div>
      </Stack>
    </div>
  );
};
```

### 4.3 Assessment Styles

```scss
// src/webparts/productOwnerPortal/components/Assessment/Assessment.module.scss

.assessmentContainer {
  min-height: 100vh;
  background: linear-gradient(135deg, #44499C 0%, #2d3276 100%);
  padding: 64px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progressDot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;

  &.active {
    background: #009F4D;
    box-shadow: 0 0 12px rgba(0, 159, 77, 0.6);
  }
}

.questionCard {
  background: white;
  border-radius: 16px;
  padding: 48px;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
}

.questionTitle {
  color: #22254E;
  margin-bottom: 12px;
  font-weight: 600;
}

.questionSubtitle {
  color: #666;
  margin-bottom: 32px;
}

.choiceGroup {
  margin-bottom: 32px;

  :global {
    .ms-ChoiceField {
      margin-bottom: 16px;
      padding: 20px;
      border: 2px solid #E0E0E0;
      border-radius: 12px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border-color: #009F4D;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 159, 77, 0.2);
      }

      &.is-checked {
        border-color: #009F4D;
        background: #DFF0E3;
      }

      .ms-ChoiceFieldLabel {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 16px;
        font-weight: 500;
      }

      i {
        font-size: 32px;
        color: #44499C;
      }
    }
  }
}
```

---

## 5. Component Rebuild: Dashboard

### 5.1 Custom SVG Progress Ring Component

```typescript
// src/webparts/productOwnerPortal/components/Dashboard/ProgressRing.tsx

import * as React from 'react';
import styles from './Dashboard.module.scss';

export interface IProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<IProgressRingProps> = ({
  percentage,
  size = 180,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className={styles.progressRing}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#009F4D"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />

      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className={styles.progressText}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};
```

### 5.2 Dashboard Component

```typescript
// src/webparts/productOwnerPortal/components/Dashboard/Dashboard.tsx

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Stack, Text, PrimaryButton, Icon, DocumentCard, DocumentCardDetails } from 'office-ui-fabric-react';
import { ProgressRing } from './ProgressRing';
import { UserProfile, UserProgress, Module } from '../../models/types';
import { SharePointService } from '../../services/SharePointService';
import { ModuleDataService } from '../../services/ModuleDataService';
import styles from './Dashboard.module.scss';

export interface IDashboardProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  spService: SharePointService;
  onStartModule: (moduleId: string) => void;
  onResetProgress: () => void;
}

export const Dashboard: React.FC<IDashboardProps> = ({
  userProfile,
  userProgress,
  spService,
  onStartModule,
  onResetProgress,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [nextModule, setNextModule] = useState<Module | null>(null);

  useEffect(() => {
    // Load modules for user's learning path
    const userModules = ModuleDataService.getModulesForPath(userProfile.learningPath);
    setModules(userModules);

    // Find next incomplete module
    const incomplete = userModules.find(
      (m) => !userProgress.completedModules.includes(m.id)
    );
    setNextModule(incomplete || null);
  }, [userProfile, userProgress]);

  const completedCount = userProgress.completedModules.length;
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  const estimatedHours = Math.floor((completedCount * 5) / 60);

  return (
    <div className={styles.dashboardContainer}>
      <Stack tokens={{ childrenGap: 32 }}>
        {/* Header */}
        <div className={styles.header}>
          <Text variant="xxLarge" className={styles.title}>
            Welcome back!
          </Text>
          <Text variant="medium" className={styles.subtitle}>
            Your learning path: <strong>{userProfile.learningPath}</strong>
          </Text>
        </div>

        {/* Progress Card */}
        <div className={styles.progressCard}>
          <Stack horizontal tokens={{ childrenGap: 48 }} wrap>
            <Stack.Item>
              <ProgressRing percentage={progressPercentage} />
            </Stack.Item>

            <Stack.Item grow>
              <Text variant="large" className={styles.statsTitle}>
                Your Progress
              </Text>

              <Stack tokens={{ childrenGap: 16 }} className={styles.stats}>
                <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
                  <Icon iconName="CheckMark" className={styles.statIcon} />
                  <Text>
                    <strong>{completedCount}</strong> of <strong>{totalModules}</strong> modules completed
                  </Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
                  <Icon iconName="Clock" className={styles.statIcon} />
                  <Text>
                    <strong>{estimatedHours}h</strong> of learning completed
                  </Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
                  <Icon iconName="FavoriteStar" className={styles.statIcon} />
                  <Text>
                    <strong>{userProgress.bookmarkedModules.length}</strong> bookmarked modules
                  </Text>
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
        </div>

        {/* Up Next Card */}
        {nextModule && (
          <div className={styles.upNextCard}>
            <Text variant="large" className={styles.cardTitle}>
              Up Next
            </Text>

            <DocumentCard className={styles.moduleCard}>
              <DocumentCardDetails>
                <Text variant="mediumPlus" className={styles.moduleTitle}>
                  {nextModule.title}
                </Text>
                <Text variant="small" className={styles.moduleDescription}>
                  {nextModule.description}
                </Text>

                <Stack horizontal tokens={{ childrenGap: 12 }} className={styles.moduleMeta}>
                  <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                    <Icon iconName="Clock" />
                    <Text variant="small">{nextModule.duration} min</Text>
                  </Stack>

                  {nextModule.priority === 'high' && (
                    <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                      <Icon iconName="Important" style={{ color: '#C00' }} />
                      <Text variant="small" style={{ color: '#C00' }}>High Priority</Text>
                    </Stack>
                  )}
                </Stack>

                <PrimaryButton
                  text="Continue Learning"
                  iconProps={{ iconName: 'ChevronRight' }}
                  onClick={() => onStartModule(nextModule.id)}
                  className={styles.continueButton}
                />
              </DocumentCardDetails>
            </DocumentCard>
          </div>
        )}

        {/* Completed State */}
        {!nextModule && completedCount > 0 && (
          <div className={styles.completedCard}>
            <Icon iconName="Trophy2" className={styles.trophyIcon} />
            <Text variant="xxLarge">Congratulations!</Text>
            <Text variant="medium">
              You've completed all modules in the {userProfile.learningPath} learning path.
            </Text>
          </div>
        )}

        {/* Actions */}
        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <PrimaryButton
            text="Reset Progress"
            iconProps={{ iconName: 'RevToggleKey' }}
            onClick={onResetProgress}
            styles={{
              root: { backgroundColor: 'transparent', border: '2px solid #C00', color: '#C00' }
            }}
          />
        </Stack>
      </Stack>
    </div>
  );
};
```

### 5.3 Dashboard Styles

```scss
// src/webparts/productOwnerPortal/components/Dashboard/Dashboard.module.scss

.dashboardContainer {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 16px;
}

.title {
  color: #22254E;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
}

.progressCard {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progressRing {
  display: block;
}

.progressText {
  font-size: 32px;
  font-weight: 600;
  fill: #22254E;
}

.statsTitle {
  font-weight: 600;
  color: #22254E;
  margin-bottom: 24px;
}

.stats {
  margin-top: 16px;
}

.statIcon {
  color: #009F4D;
  font-size: 20px;
}

.upNextCard {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cardTitle {
  font-weight: 600;
  color: #22254E;
  margin-bottom: 20px;
}

.moduleCard {
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;

  &:hover {
    border-color: #009F4D;
    box-shadow: 0 4px 12px rgba(0, 159, 77, 0.2);
  }
}

.moduleTitle {
  font-weight: 600;
  color: #22254E;
  margin-bottom: 8px;
}

.moduleDescription {
  color: #666;
  margin-bottom: 16px;
}

.moduleMeta {
  margin-bottom: 20px;
  color: #666;
}

.continueButton {
  background-color: #009F4D !important;
  border-color: #009F4D !important;

  &:hover {
    background-color: #008743 !important;
  }
}

.completedCard {
  background: linear-gradient(135deg, #DFF0E3 0%, #F7F6F5 100%);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
}

.trophyIcon {
  font-size: 64px;
  color: #FFD700;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .dashboardContainer {
    padding: 24px 16px;
  }

  .progressCard {
    padding: 24px;
  }
}
```

---

## 6. Component Rebuild: ModuleView

### 6.1 ModuleView Component

```typescript
// src/webparts/productOwnerPortal/components/ModuleView/ModuleView.tsx

import * as React from 'react';
import { useState } from 'react';
import { Stack, Text, PrimaryButton, DefaultButton, IconButton, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import Markdown from 'markdown-to-jsx';
import { Module } from '../../models/types';
import { QuizQuestion } from './QuizQuestion';
import styles from './ModuleView.module.scss';

export interface IModuleViewProps {
  module: Module;
  isCompleted: boolean;
  isBookmarked: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onBookmark: () => void;
  onBackToDashboard: () => void;
}

export const ModuleView: React.FC<IModuleViewProps> = ({
  module,
  isCompleted,
  isBookmarked,
  hasPrevious,
  hasNext,
  onComplete,
  onPrevious,
  onNext,
  onBookmark,
  onBackToDashboard,
}) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const handleComplete = () => {
    onComplete();
    setShowCompletionMessage(true);
    setTimeout(() => setShowCompletionMessage(false), 3000);
  };

  return (
    <div className={styles.moduleViewContainer}>
      <Stack tokens={{ childrenGap: 24 }}>
        {/* Header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" wrap>
          <DefaultButton
            text="Back to Dashboard"
            iconProps={{ iconName: 'ChevronLeft' }}
            onClick={onBackToDashboard}
          />

          <IconButton
            iconProps={{ iconName: isBookmarked ? 'FavoriteStarFill' : 'FavoriteStar' }}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this module'}
            onClick={onBookmark}
            className={styles.bookmarkButton}
            styles={{
              icon: { color: isBookmarked ? '#FFD700' : '#666', fontSize: 20 }
            }}
          />
        </Stack>

        {/* Completion Message */}
        {showCompletionMessage && (
          <MessageBar messageBarType={MessageBarType.success}>
            Module marked as complete!
          </MessageBar>
        )}

        {/* Module Content */}
        <div className={styles.moduleCard}>
          <div className={styles.moduleHeader}>
            <Text variant="xxLarge" className={styles.moduleTitle}>
              {module.title}
            </Text>

            <Stack horizontal tokens={{ childrenGap: 12 }} className={styles.moduleMeta}>
              <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                <span className={styles.icon}>⏱️</span>
                <Text variant="small">{module.duration} min</Text>
              </Stack>

              {module.priority === 'high' && (
                <span className={`${styles.badge} ${styles.highPriority}`}>
                  🔥 High Priority
                </span>
              )}

              {module.priority === 'medium' && (
                <span className={`${styles.badge} ${styles.mediumPriority}`}>
                  ⚡ Medium Priority
                </span>
              )}
            </Stack>
          </div>

          {/* Markdown Content */}
          <div className={styles.moduleContent}>
            <Markdown
              options={{
                overrides: {
                  h1: { props: { className: styles.h1 } },
                  h2: { props: { className: styles.h2 } },
                  h3: { props: { className: styles.h3 } },
                  p: { props: { className: styles.paragraph } },
                  ul: { props: { className: styles.unorderedList } },
                  ol: { props: { className: styles.orderedList } },
                  code: { props: { className: styles.codeBlock } },
                },
              }}
            >
              {module.content}
            </Markdown>
          </div>

          {/* Quiz */}
          {module.checkQuestion && !quizAnswered && (
            <QuizQuestion
              question={module.checkQuestion.question}
              options={module.checkQuestion.options}
              correctAnswer={module.checkQuestion.correctAnswer}
              onAnswered={() => setQuizAnswered(true)}
            />
          )}

          {/* Navigation */}
          <div className={styles.navigationButtons}>
            <Stack horizontal tokens={{ childrenGap: 16 }} horizontalAlign="space-between" wrap>
              <DefaultButton
                text="Previous"
                iconProps={{ iconName: 'ChevronLeft' }}
                onClick={onPrevious}
                disabled={!hasPrevious}
              />

              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <PrimaryButton
                  text={isCompleted ? 'Completed' : 'Mark Complete'}
                  iconProps={{ iconName: 'CheckMark' }}
                  onClick={handleComplete}
                  disabled={isCompleted}
                  styles={{
                    root: {
                      backgroundColor: isCompleted ? '#666' : '#009F4D',
                    }
                  }}
                />

                {hasNext ? (
                  <PrimaryButton
                    text="Next"
                    iconProps={{ iconName: 'ChevronRight' }}
                    onClick={onNext}
                  />
                ) : (
                  <PrimaryButton
                    text="Back to Dashboard"
                    iconProps={{ iconName: 'Home' }}
                    onClick={onBackToDashboard}
                  />
                )}
              </Stack>
            </Stack>
          </div>
        </div>
      </Stack>
    </div>
  );
};
```

### 6.2 QuizQuestion Component

```typescript
// src/webparts/productOwnerPortal/components/ModuleView/QuizQuestion.tsx

import * as React from 'react';
import { useState } from 'react';
import { Stack, Text, ChoiceGroup, IChoiceGroupOption, PrimaryButton, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import styles from './ModuleView.module.scss';

export interface IQuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswered: () => void;
}

export const QuizQuestion: React.FC<IQuizQuestionProps> = ({
  question,
  options,
  correctAnswer,
  onAnswered,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const choiceOptions: IChoiceGroupOption[] = options.map((opt, idx) => ({
    key: idx.toString(),
    text: opt,
  }));

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      onAnswered();
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  return (
    <div className={styles.quizContainer}>
      <Text variant="large" className={styles.quizTitle}>
        Quick Check
      </Text>

      <Text variant="medium" className={styles.quizQuestion}>
        {question}
      </Text>

      <ChoiceGroup
        options={choiceOptions}
        selectedKey={selectedAnswer?.toString()}
        onChange={(ev, option) => setSelectedAnswer(parseInt(option?.key || '-1'))}
        disabled={submitted && isCorrect}
      />

      {!submitted && (
        <PrimaryButton
          text="Submit Answer"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        />
      )}

      {submitted && isCorrect && (
        <MessageBar messageBarType={MessageBarType.success}>
          ✓ Correct! Great job!
        </MessageBar>
      )}

      {submitted && !isCorrect && (
        <Stack tokens={{ childrenGap: 12 }}>
          <MessageBar messageBarType={MessageBarType.error}>
            Not quite. Try again!
          </MessageBar>
          <DefaultButton text="Try Again" onClick={handleTryAgain} />
        </Stack>
      )}
    </div>
  );
};
```

---

## 7. Data Layer: SharePointService

### 7.1 SharePointService Implementation

```typescript
// src/webparts/productOwnerPortal/services/SharePointService.ts

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { PnPClientStorage } from '@pnp/common';
import { UserProfile, UserProgress, ExperienceLevel, GovernanceTier, TimeCommitment } from '../models/types';

export class SharePointService {
  private userEmail: string;
  private storage: PnPClientStorage;

  constructor(context: WebPartContext) {
    // Setup PnP JS
    sp.setup({
      spfxContext: context
    });

    this.userEmail = context.pageContext.user.email || context.pageContext.user.loginName;
    this.storage = new PnPClientStorage();
  }

  // User Profile Methods
  public async getUserProfile(): Promise<UserProfile | null> {
    // Check cache first (60 min expiration)
    const cacheKey = `profile_${this.userEmail}`;
    const cached = this.storage.local.get<UserProfile>(cacheKey);
    if (cached) return cached;

    try {
      const items = await sp.web.lists
        .getByTitle('UserProfiles')
        .items
        .filter(`Title eq '${this.userEmail}'`)
        .top(1)
        .get();

      if (items.length === 0) return null;

      const item = items[0];
      const profile: UserProfile = {
        experienceLevel: item.ExperienceLevel as ExperienceLevel,
        governanceTier: item.GovernanceTier as GovernanceTier,
        timeCommitment: item.TimeCommitment as TimeCommitment,
        learningPath: item.LearningPath,
        completedAt: new Date(item.AssessmentDate),
      };

      // Cache for 60 minutes
      this.storage.local.put(cacheKey, profile, new Date(Date.now() + 60 * 60 * 1000));
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const existingItems = await sp.web.lists
        .getByTitle('UserProfiles')
        .items
        .filter(`Title eq '${this.userEmail}'`)
        .get();

      const profileData = {
        Title: this.userEmail,
        ExperienceLevel: profile.experienceLevel,
        GovernanceTier: profile.governanceTier,
        TimeCommitment: profile.timeCommitment,
        LearningPath: profile.learningPath,
        AssessmentDate: profile.completedAt.toISOString(),
        LastVisit: new Date().toISOString(),
      };

      if (existingItems.length > 0) {
        // Update existing
        await sp.web.lists
          .getByTitle('UserProfiles')
          .items
          .getById(existingItems[0].Id)
          .update(profileData);
      } else {
        // Create new
        await sp.web.lists
          .getByTitle('UserProfiles')
          .items
          .add(profileData);
      }

      // Update cache
      const cacheKey = `profile_${this.userEmail}`;
      this.storage.local.put(cacheKey, profile, new Date(Date.now() + 60 * 60 * 1000));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // User Progress Methods
  public async getUserProgress(): Promise<UserProgress> {
    // Check cache first (10 min expiration - shorter since progress changes frequently)
    const cacheKey = `progress_${this.userEmail}`;
    const cached = this.storage.local.get<UserProgress>(cacheKey);
    if (cached) return cached;

    try {
      const items = await sp.web.lists
        .getByTitle('UserProgress')
        .items
        .filter(`UserEmail eq '${this.userEmail}'`)
        .top(1)
        .get();

      if (items.length === 0) {
        return this.initializeUserProgress();
      }

      const item = items[0];
      const progress: UserProgress = {
        completedModules: item.CompletedModules ? JSON.parse(item.CompletedModules) : [],
        bookmarkedModules: item.BookmarkedModules ? JSON.parse(item.BookmarkedModules) : [],
        currentModule: item.CurrentModule || null,
        lastVisited: new Date(item.LastVisited),
      };

      // Cache for 10 minutes
      this.storage.local.put(cacheKey, progress, new Date(Date.now() + 10 * 60 * 1000));
      return progress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return this.initializeUserProgress();
    }
  }

  public async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const existingItems = await sp.web.lists
        .getByTitle('UserProgress')
        .items
        .filter(`UserEmail eq '${this.userEmail}'`)
        .get();

      const progressData = {
        UserEmail: this.userEmail,
        CompletedModules: JSON.stringify(progress.completedModules),
        BookmarkedModules: JSON.stringify(progress.bookmarkedModules),
        CurrentModule: progress.currentModule,
        LastVisited: new Date().toISOString(),
        TotalTimeSpent: progress.completedModules.length * 5, // Estimate
      };

      if (existingItems.length > 0) {
        // Update existing
        await sp.web.lists
          .getByTitle('UserProgress')
          .items
          .getById(existingItems[0].Id)
          .update(progressData);
      } else {
        // Create new
        await sp.web.lists
          .getByTitle('UserProgress')
          .items
          .add({ Title: `${this.userEmail}-progress`, ...progressData });
      }

      // Update cache
      const cacheKey = `progress_${this.userEmail}`;
      this.storage.local.put(cacheKey, progress, new Date(Date.now() + 10 * 60 * 1000));
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  public async updateCompletedModule(moduleId: string): Promise<void> {
    const progress = await this.getUserProgress();
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      await this.saveUserProgress(progress);
    }
  }

  public async toggleBookmark(moduleId: string): Promise<void> {
    const progress = await this.getUserProgress();
    const index = progress.bookmarkedModules.indexOf(moduleId);

    if (index > -1) {
      progress.bookmarkedModules.splice(index, 1);
    } else {
      progress.bookmarkedModules.push(moduleId);
    }

    await this.saveUserProgress(progress);
  }

  public async clearAllData(): Promise<void> {
    try {
      // Delete user profile
      const profileItems = await sp.web.lists
        .getByTitle('UserProfiles')
        .items
        .filter(`Title eq '${this.userEmail}'`)
        .get();

      for (const item of profileItems) {
        await sp.web.lists
          .getByTitle('UserProfiles')
          .items
          .getById(item.Id)
          .delete();
      }

      // Delete user progress
      const progressItems = await sp.web.lists
        .getByTitle('UserProgress')
        .items
        .filter(`UserEmail eq '${this.userEmail}'`)
        .get();

      for (const item of progressItems) {
        await sp.web.lists
          .getByTitle('UserProgress')
          .items
          .getById(item.Id)
          .delete();
      }

      // Clear cache
      this.storage.local.delete(`profile_${this.userEmail}`);
      this.storage.local.delete(`progress_${this.userEmail}`);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  private initializeUserProgress(): UserProgress {
    return {
      completedModules: [],
      bookmarkedModules: [],
      currentModule: null,
      lastVisited: new Date(),
    };
  }
}
```

---

## 8. Styling & Theming

### 8.1 Create Fluent UI Theme

```typescript
// src/webparts/productOwnerPortal/ProductOwnerPortalWebPart.ts

import { createTheme, ITheme } from 'office-ui-fabric-react';

// APH Brand Theme
const aphTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#009F4D',          // APH Green
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
    neutralPrimary: '#22254E',         // APH Dark Blue
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

// Use in web part render:
// <ThemeProvider theme={aphTheme}>
//   <ProductOwnerPortal {...props} />
// </ThemeProvider>
```

### 8.2 Self-Host Fonts (GCC Requirement)

```css
/* Upload fonts to: /sites/aph-product-owner-program/SiteAssets/fonts/ */

/* Then reference in SCSS: */
@font-face {
  font-family: 'Inter';
  src: url('/sites/aph-product-owner-program/SiteAssets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/sites/aph-product-owner-program/SiteAssets/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

:global {
  body {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
}
```

---

## 9. Testing & Deployment

### 9.1 Local Testing

```bash
# Start local workbench
gulp serve

# Test in browser:
# https://localhost:4321/temp/workbench.html

# Test with real SharePoint data:
# https://your-tenant.sharepoint.us/sites/test-site/_layouts/15/workbench.aspx
```

### 9.2 Build for Production

```bash
# Clean previous builds
gulp clean

# Bundle for production
gulp bundle --ship

# Package solution
gulp package-solution --ship

# Output: sharepoint/solution/aph-product-owner-portal-spfx.sppkg
```

### 9.3 Deploy to App Catalog

1. Navigate to SharePoint Admin Center
2. Go to **More features** → **Apps** → **App Catalog**
3. Upload `.sppkg` file
4. Check **"Make this solution available to all sites"**
5. Click **Deploy**

### 9.4 Add Web Part to Page

1. Navigate to SharePoint site
2. Create new page or edit existing
3. Click **+ Add a web part**
4. Search for "Product Owner Portal"
5. Add to page
6. Publish page

---

## 10. Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@pnp/sp'"

**Solution:**
```bash
npm install @pnp/sp @pnp/common --save
gulp clean
gulp serve
```

#### Issue: External CDN blocked in GCC

**Solution:**
- Check Network tab in browser DevTools
- Ensure all fonts/icons are self-hosted
- No references to `fonts.googleapis.com` or other external CDNs

#### Issue: SharePoint List permission errors

**Solution:**
```typescript
// Check web part permissions in package-solution.json
"webApiPermissionRequests": [
  {
    "resource": "SharePoint",
    "scope": "Web.All"
  }
]
```

Then approve in SharePoint Admin Center:
- API access → Pending approvals → Approve

#### Issue: React 18 features not working

**Solution:**
- SPFx uses React 17.0.2
- Avoid: `useId`, `useTransition`, `useDeferredValue`, Suspense for data fetching
- Use compatible patterns only

---

## Next Steps

1. Complete all components following this guide
2. Test thoroughly in GCC environment
3. Conduct accessibility audit
4. Train content editors
5. Deploy to production

For questions or issues, contact: APH Product Governance Team

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Related Documents**:
- `SHAREPOINT_MIGRATION_GUIDE.md` - Overview and planning
- `SHAREPOINT_GCC_REQUIREMENTS.md` - Compliance documentation
