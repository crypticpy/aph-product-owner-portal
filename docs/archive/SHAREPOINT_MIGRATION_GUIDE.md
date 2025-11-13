# SharePoint Migration Guide
## APH Product Owner Portal - Adaptive Micro-Learning Experience

This guide provides a comprehensive strategy for deploying the micro-learning portal to SharePoint Online with GCC (Government Community Cloud) compatibility.

> **⚠️ IMPORTANT RECOMMENDATION: REBUILD, DON'T MIGRATE**
>
> Due to GCC compliance requirements and incompatible dependencies in the current React app (Vite, React 18, Radix UI, external CDNs), we recommend **rebuilding** the application using SharePoint-native technologies rather than attempting direct migration. See "Rebuild vs. Migration Decision" section below.

---

## Executive Summary

### What We've Built (React Version)
- **Personalized assessment** that routes users to Express/Standard/Comprehensive learning paths
- **20-34 micro-learning modules** (5 minutes each)
- **Progress tracking** with localStorage
- **Interactive quizzes** and bookmarking
- **Responsive dashboard** with progress visualization
- **Mobile-optimized** design

### Rebuild vs. Migration Decision

**Current Tech Stack (NOT GCC-Compatible):**
- Vite 6.0.1 (build tool)
- React 18.3.1
- Radix UI (27+ components)
- Recharts for visualization
- Google Fonts CDN
- Material Symbols CDN
- GitHub Pages deployment

**GCC Compliance Issues:**
- ❌ External CDNs blocked (Google Fonts, Material Symbols)
- ❌ React 18 not officially supported in SPFx
- ❌ Vite build tool incompatible with SharePoint's Webpack
- ❌ Radix UI components untested in SharePoint context
- ❌ Large bundle size may exceed SharePoint limits

**Recommended Approach: SPFx Rebuild**

Use SharePoint Framework with a **GCC-compatible tech stack**:
1. **SPFx 1.21.1+** with Webpack build system
2. **React 17.0.2** (SPFx bundled version)
3. **Fluent UI v8** (office-ui-fabric-react) for components
4. **@fluentui/react-charting** for data visualization
5. **Self-hosted fonts** (no external CDNs)
6. **Fluent UI MDL2 icons** (no Material Symbols)
7. **SharePoint Lists** for data persistence (replaces localStorage)
8. **SharePoint App Catalog** deployment

**Timeline:** 12-14 weeks (vs. 10-12 weeks for migration attempt)
**Cost:** $60,000-$70,000 (vs. $44,000 estimated for migration)
**Risk:** Medium (vs. High for migration with unknown compatibility issues)

### Implementation Strategy
Use a **rebuild approach** that combines:
1. SharePoint pages for content and structure
2. SPFx (SharePoint Framework) web parts for interactivity
3. SharePoint lists for data storage
4. Fluent UI components (Microsoft's design system)
5. Self-hosted assets (fonts, icons) for GCC compliance

---

## Architecture Overview

### Current React Architecture
```
┌─────────────────────────────────────┐
│ App.tsx (Router)                    │
│  ├─ Assessment (personalization)    │
│  ├─ Dashboard (progress overview)   │
│  ├─ ModuleView (content + quiz)     │
│  └─ Resources/Support (static)      │
└─────────────────────────────────────┘
           ↓
   localStorage (progress data)
```

### Proposed SharePoint Architecture
```
┌─────────────────────────────────────────────────┐
│ SharePoint Hub Site                             │
│  ├─ Welcome Page (assessment form)              │
│  ├─ My Dashboard (SPFx web part)                │
│  ├─ Module Pages (SharePoint pages)             │
│  ├─ Resources Library (document library)        │
│  └─ Support Pages (standard SP pages)           │
└─────────────────────────────────────────────────┘
           ↓
   ┌──────────────────────────────┐
   │ SharePoint Lists             │
   │  ├─ User Profiles            │
   │  ├─ Module Progress          │
   │  ├─ Quiz Responses           │
   │  └─ Bookmarks                │
   └──────────────────────────────┘
```

---

## GCC (Government Community Cloud) Requirements

### Overview
GCC and GCC High enforce strict security and compliance requirements beyond standard SharePoint Online. All deployments must account for these constraints.

### Critical GCC Constraints

#### 1. External CDN Blocking
**Restriction:** GCC High blocks all external CDNs including:
- Google Fonts (`fonts.googleapis.com`)
- npm public CDN
- Public icon libraries
- Any external JavaScript/CSS resources

**Solution:**
- Bundle all fonts as base64 or upload to SharePoint CDN
- Self-host all assets in SharePoint Site Assets or Style Library
- Use Fluent UI icons (bundled with SPFx)
- No runtime external dependencies

#### 2. API Endpoint Differences
**GCC Endpoints:**
- Graph API: `https://graph.microsoft.us` (not `.com`)
- SharePoint API: `https://tenant.sharepoint.us`

**Impact:** All SPFx code must detect environment and use appropriate endpoints

#### 3. SPFx Version Requirements
**Minimum:** SPFx 1.21.1 (confirmed GCC-compatible)
**React Version:** 17.0.2 only (bundled with SPFx)
**Node.js:** v22 LTS

#### 4. Compliance Certifications
GCC High provides:
- FedRAMP High authorization
- CMMC Level 2 compliance
- ITAR compatibility
- DFARS 7012 compliance

**Impact:** All user data must remain within GCC boundary (SharePoint Lists = compliant ✅)

### GCC Deployment Checklist

Before deploying to GCC, verify:
- [ ] No external CDN references in code
- [ ] All fonts self-hosted or using system fonts
- [ ] All icons from Fluent UI MDL2 (no external icon fonts)
- [ ] API endpoints use `.us` domain
- [ ] Bundle size under SharePoint limits (10MB uncompressed)
- [ ] No public npm packages loaded at runtime
- [ ] SPFx solution package (.sppkg) includes all dependencies
- [ ] Content Security Policy (CSP) compliance tested
- [ ] User profile service available in GCC tenant
- [ ] App Catalog access confirmed

---

## Component Mapping: React → SPFx

### UI Component Library Migration

| Current (React App) | Replacement (SPFx) | Notes |
|---------------------|-------------------|-------|
| **Radix UI Accordion** | Fluent UI DetailsList | Different API, similar functionality |
| **Radix UI Dialog** | Fluent UI Dialog | Direct mapping |
| **Radix UI Select** | Fluent UI Dropdown | Direct mapping |
| **Radix UI RadioGroup** | Fluent UI ChoiceGroup | Direct mapping |
| **Radix UI Checkbox** | Fluent UI Checkbox | Direct mapping |
| **Radix UI Progress** | Fluent UI ProgressIndicator | Direct mapping |
| **Radix UI Tooltip** | Fluent UI TooltipHost | Direct mapping |
| **Custom Button** | Fluent UI PrimaryButton/DefaultButton | Direct mapping |

### Data Visualization

| Current | Replacement | Notes |
|---------|-------------|-------|
| **Recharts** (not used) | @fluentui/react-charting DonutChart | OR custom SVG (recommended) |
| **Custom SVG Progress Ring** | Keep as-is | No changes needed (0KB, works perfectly) |

### Icons

| Current | Replacement | Migration Tool |
|---------|-------------|---------------|
| **Material Symbols Rounded** (1000+ icons) | Fluent UI Icons MDL2 | [Icon mapping reference](https://uifabricicons.azurewebsites.net/) |
| `face` | `Contact` | - |
| `emoji_events` | `Trophy2` | - |
| `progress_activity` | `ProgressRingDots` | - |
| `home` | `Home` | - |
| `bookmark` | `FavoriteStar` / `FavoriteStarFill` | - |

### Forms & Validation

| Current | Replacement | Notes |
|---------|-------------|-------|
| **React Hook Form** | Manual useState + validation | Simpler for basic forms |
| **Zod validation** | Custom validation functions | or Yup if complex validation needed |

### Markdown Rendering

| Current | Replacement | Notes |
|---------|-------------|-------|
| **react-markdown 10.1.0** | markdown-to-jsx | Lighter, proven in SPFx projects |

### Data Persistence

| Current | Replacement | Benefits |
|---------|-------------|----------|
| **localStorage** | SharePoint Lists + PnPClientStorage cache | Cross-device sync, persistent, auditable |
| `aph_user_profile` | UserProfiles SharePoint List | - |
| `aph_user_progress` | UserProgress SharePoint List | - |

---

## Updated Cost Estimate

### Development Costs (Rebuild Approach)

| Phase | Hours | Rate | Cost | Notes |
|-------|-------|------|------|-------|
| **Environment Assessment** | 20 | $150/hr | $3,000 | NEW: GCC tenant config, CSP testing |
| Site setup & lists | 40 | $150/hr | $6,000 | Same |
| **SPFx development** | 160 | $150/hr | $24,000 | +40h for Radix→Fluent migration |
| **Build tool migration** | 40 | $150/hr | $6,000 | NEW: Vite→Webpack conversion |
| Content migration | 60 | $100/hr | $6,000 | -20h (simpler than expected) |
| Forms & automation | 20 | $150/hr | $3,000 | Same |
| Styling & branding | 50 | $125/hr | $6,250 | +10h for font self-hosting |
| **Integration testing** | 30 | $125/hr | $3,750 | NEW: GCC-specific testing |
| Testing & QA | 60 | $100/hr | $6,000 | +20h for thorough testing |
| **Total** | **480 hours** | | **$64,000** | +140 hours vs. original |

### Licensing Costs
- **SharePoint Online**: Included in Microsoft 365 E3/E5 or GCC equivalents
- **Power Automate**: 500 runs/month included
- **GCC High**: May require separate licensing (check with Microsoft)

**Total Project Cost:** $64,000 (development only)

---

## Phase 0: Pre-Implementation Assessment

### Week 1: GCC Environment Validation

**Objectives:**
- Confirm GCC or GCC High tier
- Document tenant CSP policies
- Test external resource loading
- Verify SharePoint Framework support

**Tasks:**
- [ ] Identify SharePoint Online tenant URL (`.sharepoint.us` for GCC)
- [ ] Contact SharePoint admin for tenant settings
- [ ] Document Content Security Policy configuration
- [ ] Test font loading from Style Library
- [ ] Verify User Profile Service availability
- [ ] Check App Catalog access and permissions
- [ ] Confirm SPFx version support (1.21.1+)
- [ ] Test web part deployment process

### Week 2: Dependency Audit & POC

**Objectives:**
- Test critical dependencies in GCC
- Build minimal proof-of-concept
- Validate technical approach

**Tasks:**
- [ ] Create minimal SPFx project
- [ ] Import one component (Assessment) with Fluent UI
- [ ] Test in GCC SharePoint Workbench
- [ ] Measure bundle size
- [ ] Test SharePoint List CRUD operations
- [ ] Verify Fluent UI theme integration
- [ ] Document any blockers or issues
- [ ] Get stakeholder approval to proceed

**Deliverable:** 1-page technical feasibility report

---

## Phase 1: SharePoint Site Structure

### Site Hierarchy

**Hub Site**: "APH Product Owner Program"
```
/sites/aph-product-owner-program/
├── /SitePages/
│   ├── Home.aspx (Welcome + Assessment)
│   ├── Dashboard.aspx (User progress dashboard)
│   ├── day1-registry-intro.aspx
│   ├── day1-registry-complete.aspx
│   ├── day1-roadmap-intro.aspx
│   ├── ... (all 34 module pages)
│   ├── Resources.aspx
│   └── Support.aspx
├── /Shared Documents/
│   ├── Templates/
│   ├── Training Materials/
│   └── Compliance Docs/
├── /Lists/
│   ├── User Profiles
│   ├── Module Progress
│   ├── Quiz Responses
│   └── Bookmarks
└── /Style Library/
    └── APH-Custom.css
```

---

## Phase 2: Data Model (SharePoint Lists)

### List 1: User Profiles
**Purpose**: Store user assessment results and learning path assignment

| Column Name | Type | Description |
|------------|------|-------------|
| Title | Single Line | User email/ID (automatic) |
| ExperienceLevel | Choice | New, Somewhat, Experienced |
| GovernanceTier | Choice | Tier1-2, Tier3-4, NotSure |
| TimeCommitment | Choice | LessThan1, 1To3, MoreThan3 |
| LearningPath | Choice | Express, Standard, Comprehensive |
| AssessmentDate | Date | When assessment was completed |
| LastVisit | Date | Last activity timestamp |

### List 2: Module Progress
**Purpose**: Track which modules each user has completed

| Column Name | Type | Description |
|------------|------|-------------|
| Title | Single Line | Auto-generated |
| UserEmail | Person | Current user |
| ModuleID | Single Line | e.g., "day1-registry-intro" |
| CompletedDate | Date | When marked complete |
| TimeSpent | Number | Minutes spent on module |
| QuizScore | Number | 0-100 (if quiz exists) |

### List 3: Quiz Responses
**Purpose**: Store user quiz answers for learning analytics

| Column Name | Type | Description |
|------------|------|-------------|
| Title | Single Line | Auto-generated |
| UserEmail | Person | Current user |
| ModuleID | Single Line | Associated module |
| QuestionText | Multiple Lines | The question asked |
| UserAnswer | Number | Index of selected answer |
| CorrectAnswer | Number | Index of correct answer |
| IsCorrect | Yes/No | Calculated field |
| ResponseDate | Date | Timestamp |

### List 4: Bookmarks
**Purpose**: Store bookmarked modules for later review

| Column Name | Type | Description |
|------------|------|-------------|
| Title | Single Line | Module title |
| UserEmail | Person | Current user |
| ModuleID | Single Line | Unique module identifier |
| BookmarkedDate | Date | When bookmarked |

---

## Phase 3: Page Templates & Components

### Template 1: Welcome Page (Home.aspx)

**Layout**: One-column, full-width

**Components**:
1. **Hero Section** (Text web part + Image)
   ```html
   <div class="aph-hero">
     <h1>Welcome to APH Product Owner Program!</h1>
     <p>Let's personalize your learning experience</p>
   </div>
   ```

2. **Assessment Form** (Microsoft Forms embedded OR Power Apps form)
   - **Option A**: Microsoft Forms (simpler, less customization)
     - Embed iframe
     - Use Power Automate to write results to "User Profiles" list

   - **Option B**: Power Apps form (more control)
     - Build canvas app
     - Embed in page via Power Apps web part
     - Write directly to SharePoint list

**Recommended**: Use Microsoft Forms for speed, Power Apps if you need conditional logic

### Template 2: Dashboard Page (Dashboard.aspx)

**Layout**: Two-column (70/30 split)

**Left Column**:
- **SPFx Web Part: "My Progress Dashboard"**
  - Fetches user data from lists
  - Displays circular progress chart (use Chart.js or Recharts)
  - Shows stats (modules completed, hours spent, bookmarks)
  - "Continue Learning" button

**Right Column**:
- **Quick Links** web part (Resources, Support, Community)
- **Upcoming Office Hours** (Events web part or custom SPFx)

**SPFx Web Part Code Structure**:
```typescript
// src/webparts/progressDashboard/ProgressDashboardWebPart.ts
export default class ProgressDashboardWebPart extends BaseClientSideWebPart<IProgressDashboardWebPartProps> {
  public render(): void {
    // 1. Get current user context
    const userEmail = this.context.pageContext.user.email;

    // 2. Fetch user profile from SharePoint list
    const profile = await this._getUserProfile(userEmail);

    // 3. Fetch module progress
    const progress = await this._getModuleProgress(userEmail);

    // 4. Render React component
    const element: React.ReactElement<IProgressDashboardProps> = React.createElement(
      ProgressDashboard,
      { userProfile: profile, userProgress: progress }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _getUserProfile(email: string): Promise<IUserProfile> {
    // Use @pnp/sp to query SharePoint list
    const items = await sp.web.lists.getByTitle("User Profiles")
      .items.filter(`Title eq '${email}'`)
      .get();
    return items[0];
  }

  private async _getModuleProgress(email: string): Promise<IModuleProgress[]> {
    // Use @pnp/sp to query progress list
    const items = await sp.web.lists.getByTitle("Module Progress")
      .items.filter(`UserEmail eq '${email}'`)
      .get();
    return items;
  }
}
```

### Template 3: Module Page (e.g., day1-registry-intro.aspx)

**Layout**: One-column, centered (max-width: 800px)

**Components**:

1. **Breadcrumb Navigation** (OOTB Breadcrumb web part)
   - Home > Day 1 Essentials > Module 1

2. **Progress Bar** (SPFx web part: "Module Progress Bar")
   - Shows "Module X of Y" and percentage complete
   - Sticky header

3. **Module Content** (Text web part with rich formatting)
   - Module title
   - Duration badge
   - Priority badge
   - Markdown-formatted content

4. **Quick Check Quiz** (SPFx web part: "Interactive Quiz")
   - Multiple choice options
   - Submit button
   - Immediate feedback
   - Writes to "Quiz Responses" list

5. **Navigation Buttons** (SPFx web part: "Module Navigation")
   - Previous / Next buttons
   - Mark Complete button
   - Bookmark button
   - Writes to "Module Progress" and "Bookmarks" lists

**Module Content Structure**:
```html
<div class="aph-module">
  <div class="aph-module-header">
    <h1>What is the Product Registry?</h1>
    <div class="aph-module-meta">
      <span class="duration"><span class="icon">⏱️</span> 2 min</span>
      <span class="priority high">🔥 High Priority</span>
    </div>
  </div>

  <div class="aph-module-content">
    <!-- Rich text content here -->
    <h2>What You'll Learn</h2>
    <p>The Product Registry is...</p>
    <!-- etc. -->
  </div>
</div>
```

---

## Phase 4: SPFx Web Parts to Build

### Web Part 1: Assessment Form Handler
**File**: `assessment-handler-webpart`

**Purpose**: Process Microsoft Forms submission and write to User Profiles list

**Functionality**:
- Listen for form completion (via Power Automate webhook)
- Calculate learning path based on answers
- Write to "User Profiles" list
- Redirect user to Dashboard

**Alternative**: Use Power Automate flow instead of SPFx

---

### Web Part 2: Progress Dashboard
**File**: `progress-dashboard-webpart`

**Purpose**: Display user's learning progress

**Dependencies**:
- `@pnp/sp` (SharePoint data access)
- `recharts` or `chart.js` (progress visualization)
- React (UI)

**Key Features**:
- Circular progress chart (% complete)
- Module count stats
- Time spent calculation
- Bookmarked modules list
- Next 3 modules preview
- "Continue Learning" CTA

**Data Sources**:
- User Profiles list (learning path)
- Module Progress list (completed modules)
- Bookmarks list (saved modules)

---

### Web Part 3: Module Progress Bar
**File**: `module-progress-bar-webpart`

**Purpose**: Sticky header showing current position in learning path

**Functionality**:
- Displays "Module X of Y" based on current page
- Shows progress percentage
- Sticky positioning (stays visible on scroll)
- Color-coded by learning path

---

### Web Part 4: Interactive Quiz
**File**: `interactive-quiz-webpart`

**Purpose**: Present multiple-choice questions and record responses

**Properties** (set in page edit mode):
- `moduleId`: string
- `question`: string
- `options`: string[] (JSON array)
- `correctAnswer`: number

**Functionality**:
- Display radio buttons for each option
- Submit button
- Immediate feedback (correct/incorrect)
- Write response to "Quiz Responses" list
- Disable after first correct answer

**UI States**:
1. **Initial**: Show question + options
2. **Selected**: Highlight selected answer
3. **Submitted - Correct**: Green checkmark, success message
4. **Submitted - Incorrect**: Red X, "try again" message
5. **Completed**: Show "Already answered correctly" state

---

### Web Part 5: Module Navigation
**File**: `module-navigation-webpart`

**Purpose**: Control module progression and bookmark modules

**Buttons**:
- **Previous**: Link to previous module page
- **Next**: Link to next module page (or Dashboard if last)
- **Mark Complete**: Write to Module Progress list
- **Bookmark**: Toggle bookmark (write to Bookmarks list)
- **Skip for Now**: Go to next module without marking complete

**Smart Features**:
- Auto-detect current module from page URL
- Load module metadata from JSON config file
- Determine next/previous based on learning path
- Show completed checkmark if already done

---

## Phase 5: Styling & Branding

### Custom CSS (Style Library/APH-Custom.css)

Apply APH brand colors and spacing to SharePoint pages:

```css
/* Import APH Design Tokens */
:root {
  --aph-primary: #009F4D;
  --aph-blue: #44499C;
  --aph-text: #22254E;
  --aph-bg: #F7F6F5;
  --aph-light-blue: #DCF2FD;
  --aph-light-green: #DFF0E3;
  --aph-radius: 8px;
  --aph-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Override SharePoint defaults */
.CanvasZone {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* APH Module Styles */
.aph-module {
  background: white;
  border-radius: var(--aph-radius);
  padding: 40px;
  box-shadow: var(--aph-shadow);
}

.aph-module-header {
  border-bottom: 2px solid var(--aph-bg);
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.aph-module-header h1 {
  color: var(--aph-text);
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
}

.aph-module-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.duration {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--aph-light-blue);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.priority {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.priority.high {
  background: #FEE;
  color: #C00;
}

.priority.medium {
  background: #FFC;
  color: #860;
}

/* Progress Bar Styling */
.aph-progress-bar {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #E0E0E0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.aph-progress-fill {
  height: 8px;
  background: linear-gradient(90deg, var(--aph-primary) 0%, #008743 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Button Styling */
.aph-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--aph-radius);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.aph-btn-primary {
  background: var(--aph-primary);
  color: white;
}

.aph-btn-primary:hover {
  background: #008743;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 159, 77, 0.3);
}

.aph-btn-secondary {
  background: transparent;
  border: 2px solid var(--aph-blue);
  color: var(--aph-blue);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .aph-module {
    padding: 24px;
  }

  .CanvasZone {
    padding: 16px;
  }
}
```

### Apply Custom CSS to Site
1. Upload `APH-Custom.css` to **Style Library**
2. Go to **Site Settings** > **Master Page**
3. Add CSS file reference:
   ```html
   <link rel="stylesheet" href="/sites/aph-product-owner-program/Style Library/APH-Custom.css">
   ```
4. Or use **"Inject CSS"** SPFx extension

---

## Phase 6: Data Flow & Permissions

### User Journey Flow

1. **New User Arrives**:
   ```
   Home.aspx (Welcome)
   ↓
   Microsoft Forms (Assessment)
   ↓
   Power Automate Flow
   ↓
   Write to "User Profiles" List
   ↓
   Redirect to Dashboard.aspx
   ```

2. **Returning User**:
   ```
   Home.aspx
   ↓
   SPFx Web Part checks "User Profiles" list
   ↓
   If profile exists → Redirect to Dashboard.aspx
   ↓
   Dashboard fetches progress from lists
   ↓
   User clicks "Continue Learning"
   ↓
   Navigate to next incomplete module page
   ```

3. **Completing a Module**:
   ```
   User on module page (e.g., day1-registry-intro.aspx)
   ↓
   Reads content (2-5 min)
   ↓
   Takes quiz (SPFx Interactive Quiz web part)
   ↓
   Writes to "Quiz Responses" list
   ↓
   Clicks "Mark Complete"
   ↓
   SPFx Module Navigation web part writes to "Module Progress" list
   ↓
   Auto-navigate to next module
   ```

### Permissions Model

**Site Permissions**: All authenticated APH users (read access)

**List Permissions**:
- **User Profiles**: Users can edit their own profile only
- **Module Progress**: Users can add/edit their own items only
- **Quiz Responses**: Users can add/edit their own items only
- **Bookmarks**: Users can add/edit/delete their own items only

**Recommended Approach**:
- Use **item-level permissions** (out-of-the-box SharePoint feature)
- Set list settings: "Users can only see their own items"
- Or use **Power Automate** to filter results by current user

---

## Phase 7: Implementation Steps (Updated for Rebuild)

### Step 0: Pre-Implementation Assessment (2 weeks) - NEW
- [ ] Validate GCC tenant access and configuration
- [ ] Test external dependency loading (fonts, CDNs)
- [ ] Build minimal SPFx proof-of-concept
- [ ] Measure baseline bundle size
- [ ] Get stakeholder approval to proceed
- [ ] Finalize technical specifications

### Step 1: Site Provisioning (1 week)
- [ ] Create SharePoint Hub Site
- [ ] Set up navigation (top nav + quick launch)
- [ ] Apply APH theme (colors, logo)
- [ ] Create folder structure (SitePages, Style Library, etc.)
- [ ] Upload self-hosted fonts to Style Library (GCC requirement)

### Step 2: List Creation (3 days)
- [ ] Create "User Profiles" list with columns
- [ ] Create "Module Progress" list with columns
- [ ] Create "Quiz Responses" list with columns
- [ ] Create "Bookmarks" list with columns
- [ ] Set item-level permissions on all lists
- [ ] Test list CRUD operations from SPFx Workbench

### Step 3: Content Migration (2 weeks)
- [ ] Create 34 module pages (use template for consistency)
- [ ] Paste module content from React app (moduleData.ts)
- [ ] Format content with rich text editor
- [ ] Replace Material Symbols icons with Fluent UI MDL2
- [ ] Add images/diagrams where needed
- [ ] Create Resources page with document library
- [ ] Create Support page with contact info

### Step 4: SPFx Development (4-5 weeks) - UPDATED
- [ ] Set up SPFx 1.21.1+ development environment (Node 22 LTS)
- [ ] Configure Webpack for GCC compliance (no external CDNs)
- [ ] Build "Assessment" component with Fluent UI ChoiceGroup
- [ ] Build "Progress Dashboard" web part with Fluent UI components
- [ ] Implement custom SVG progress ring (or @fluentui/react-charting)
- [ ] Build "Interactive Quiz" web part with Fluent UI RadioButton
- [ ] Build "Module Navigation" web part
- [ ] Implement SharePointService.ts (replace storage.ts)
- [ ] Add PnPClientStorage caching layer
- [ ] Test all web parts in SharePoint Workbench (local & online)
- [ ] Optimize bundle size (remove unused dependencies)
- [ ] Package and deploy to App Catalog

### Step 5: Forms & Automation (1 week)
- [ ] Create Microsoft Forms for assessment
- [ ] Build Power Automate flow to process responses
- [ ] Test flow writes to "User Profiles" list correctly
- [ ] Add redirect logic after form submission
- [ ] Handle error cases (network failures, etc.)

### Step 6: Styling & Polish (1.5 weeks) - UPDATED
- [ ] Create Fluent UI theme with APH brand colors
- [ ] Upload custom CSS to Style Library
- [ ] Apply CSS to all pages
- [ ] Test mobile responsiveness across devices
- [ ] Add brand assets (logos, self-hosted icons)
- [ ] Ensure WCAG 2.2 AA compliance
- [ ] Verify no external CDN calls (Network tab audit)

### Step 7: GCC-Specific Testing (1 week) - NEW
- [ ] Deploy to GCC test site
- [ ] Verify all fonts load correctly (no external CDN calls)
- [ ] Test all Fluent UI components render properly
- [ ] Validate SharePoint List permissions in GCC
- [ ] Test cross-device sync (desktop + mobile)
- [ ] Verify Content Security Policy compliance
- [ ] Load testing with 50+ concurrent users
- [ ] Document any GCC-specific issues

### Step 8: Testing & Launch (2 weeks)
- [ ] User acceptance testing (UAT) with 5-10 POs
- [ ] Fix bugs and gather feedback
- [ ] Performance testing (page load times, bundle size)
- [ ] Train support staff on how to update content
- [ ] Create admin documentation
- [ ] Soft launch to pilot group (20-30 users)
- [ ] Monitor for issues, collect feedback
- [ ] Full launch communication
- [ ] Post-launch support plan

**Updated Timeline**: 12-14 weeks (vs. 10-12 weeks original estimate)

**Timeline Breakdown:**
- Weeks 1-2: Pre-assessment & POC
- Weeks 3-4: Site setup & list creation
- Weeks 5-6: Content migration
- Weeks 7-11: SPFx development (4-5 weeks)
- Week 12: Forms & automation
- Weeks 13-14: Styling, testing, GCC validation
- Weeks 15-16: UAT & launch (may overlap with Week 14)

---

## Phase 8: Maintenance & Content Updates

### How to Add New Modules

1. **Create Module Page**:
   - Go to **Site Pages** library
   - Click **+ New** > **Site Page**
   - Name: `{category}-{module-slug}.aspx`
   - Choose **One-column** layout

2. **Add Content**:
   - Add **Text** web part
   - Paste module content (formatted with headings, lists, etc.)
   - Add duration and priority badges

3. **Add Interactive Components**:
   - Add **Interactive Quiz** web part (if module has quiz)
     - Set properties: moduleId, question, options, correctAnswer
   - Add **Module Navigation** web part at bottom
     - Will auto-detect position in sequence

4. **Update Module Config**:
   - Edit `module-config.json` in **Site Assets**
   - Add new module metadata:
     ```json
     {
       "id": "week3-new-module",
       "title": "New Module Title",
       "duration": 5,
       "category": "week3-4",
       "priority": "medium",
       "learningPaths": ["standard", "comprehensive"],
       "order": 25
     }
     ```

5. **Test**:
   - View page as different user
   - Verify navigation buttons work
   - Complete module and check Dashboard updates

### How to Update Existing Content

1. **Edit Page**:
   - Navigate to module page
   - Click **Edit** (top-right)
   - Modify text web part content
   - **Republish** page

2. **Update Quiz Questions**:
   - Edit **Interactive Quiz** web part properties
   - Change question text, options, or correct answer
   - Save and republish

3. **Change Module Order**:
   - Edit `module-config.json`
   - Change `order` property
   - **Module Navigation** web part will use new order

---

## Comparison: React vs. SharePoint

| Feature | React Version | SharePoint Version | Migration Notes |
|---------|---------------|-------------------|-----------------|
| **Assessment** | React component with localStorage | Microsoft Forms + Power Automate | ✅ Easier to maintain |
| **Dashboard** | React component | SPFx web part | ⚠️ Requires SPFx dev |
| **Module Pages** | Dynamic routing | Static SharePoint pages | ✅ Non-devs can edit |
| **Progress Tracking** | localStorage | SharePoint lists | ✅ Persistent across devices |
| **Quizzes** | React component | SPFx web part | ⚠️ Requires SPFx dev |
| **Navigation** | React Router | SPFx web part + hyperlinks | ⚠️ Requires SPFx dev |
| **Mobile** | Fully responsive | Responsive (with custom CSS) | ✅ Works well OOTB |
| **Performance** | Fast (SPA) | Good (server-rendered) | ⚠️ Slightly slower |
| **Offline** | No | No | Same |
| **Search** | None | SharePoint Search (OOTB) | ✅ Bonus feature! |
| **Analytics** | None | SharePoint Usage Analytics + Power BI | ✅ Bonus feature! |
| **Content Updates** | Requires dev | Non-devs can edit pages | ✅ Easier maintenance |

---

## Cost Estimate

### Development Costs

| Phase | Hours | Rate | Cost |
|-------|-------|------|------|
| Site setup & lists | 40 | $150/hr | $6,000 |
| SPFx development (4 web parts) | 120 | $150/hr | $18,000 |
| Content migration | 80 | $100/hr | $8,000 |
| Forms & automation | 20 | $150/hr | $3,000 |
| Styling & branding | 40 | $125/hr | $5,000 |
| Testing & QA | 40 | $100/hr | $4,000 |
| **Total** | **340 hours** | | **$44,000** |

### Licensing Costs
- **SharePoint Online**: Included in Microsoft 365 E3/E5
- **Power Automate**: 500 runs/month included, unlikely to exceed
- **No additional cost** if APH already has M365

---

## Risks & Mitigation (Updated for GCC Rebuild)

### Critical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **External CDN dependencies discovered at runtime** | Critical | Medium | Thorough bundle analysis; test in GCC sandbox early; Network tab monitoring |
| **React 18 → React 17 breaking changes** | High | Medium | Audit current hooks usage; test migration; avoid concurrent features |
| **Radix UI → Fluent UI conversion issues** | High | Medium | Build POC first; test each component; maintain design parity |
| **Bundle size exceeds SharePoint limit (10MB)** | High | Medium | Aggressive tree-shaking; remove unused Radix components; code splitting |
| **GCC CSP blocks critical functionality** | Critical | Low | Test fonts, icons, assets in GCC early; self-host everything |

### High Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| SPFx development complexity | High | Medium | Start with POC; validate approach; hire SPFx specialist if needed |
| SharePoint List permissions misconfiguration | High | Medium | Use PnP provisioning scripts; test with multiple user accounts |
| User adoption challenges | High | Low | Pilot testing with 20-30 users; training sessions; feedback loops |
| Vite → Webpack build migration issues | High | Medium | Study SPFx Webpack config; test early; document differences |

### Medium Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Performance degradation vs. current React app | Medium | High | Optimize bundle; use PnPClientStorage; lazy loading |
| Fluent UI theming doesn't match APH brand | Medium | Medium | Custom theme with CSS overrides; design review checkpoints |
| Cross-device sync latency | Medium | High | PnPClientStorage with 10-min expiration; "Pull to refresh" option |
| Data migration from localStorage lost | Medium | Low | Provide export/import tool; accept data loss for demo users |
| SharePoint permissions complexity | Medium | Medium | Use OOTB item-level permissions; document clearly |
| Content updates break web parts | Low | Low | Use `module-config.json` for metadata; decouple from page content |

### Low Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Browser compatibility in GCC | Low | Low | Test in Edge (primary GCC browser); provide compatibility docs |
| Icon mapping incomplete | Low | Low | Fluent UI MDL2 has 1000+ icons; manual mapping for critical ones |
| Accessibility regression | Low | Low | Fluent UI is WCAG 2.2 AA by default; conduct audit |
| markdown-to-jsx rendering issues | Low | Low | Test all module content during migration; have fallback |

### NEW: GCC-Specific Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **GCC High tenant restrictions unknown** | Critical | Medium | Early engagement with SharePoint admin; document all restrictions |
| **Font loading failures** | Medium | Medium | Self-host fonts in Style Library; test early; fallback to system fonts |
| **User Profile Service unavailable** | High | Low | Verify service availability; implement fallback to email-based identification |
| **App Catalog deployment blocked** | Critical | Low | Confirm deployment permissions before starting; work with tenant admin |
| **SPFx version incompatibility** | High | Low | Use SPFx 1.21.1+ (confirmed GCC-compatible); verify in POC |

---

## Recommendations (Updated for GCC)

### ✅ Rebuild on SharePoint If:
- **GCC deployment is required** (government compliance) ✅ **RECOMMENDED FOR APH**
- Non-developers need to update content frequently
- You want persistent progress tracking across devices
- You need built-in search and analytics
- Organization standardizes on SharePoint for intranets
- Cross-device sync is important
- You need audit trails and usage analytics

### ❌ Keep React If:
- You don't need GCC compliance (but APH does)
- You need maximum performance (SPA experience)
- You want complete control over UI/UX
- You have dedicated React developers (no SharePoint expertise)
- Budget is constrained (rebuild = $64K vs. current $0 hosting)
- External CDN usage is acceptable

### 🚫 Hybrid Approach NOT Recommended for GCC:
The original "hybrid approach" recommendation is **NOT viable** for GCC deployment because:
- Current React app uses external CDNs (blocked in GCC)
- Can't iframe GitHub Pages into GCC SharePoint (security policy)
- Two separate systems = confusion and double maintenance
- GCC users can't access public GitHub Pages

**For GCC, choose one platform only:** Rebuild on SharePoint is the recommended path.

---

## Next Steps

1. **Stakeholder Decision**: React-only, SharePoint-only, or hybrid?
2. **Budget Approval**: Secure funding for chosen approach
3. **Kickoff Meeting**: Assemble team (SharePoint admin, SPFx dev, content editors)
4. **Pilot Phase**: Build 5-10 modules as proof-of-concept
5. **Feedback & Iterate**: Gather user feedback before full migration
6. **Full Launch**: Complete remaining modules and promote to users

---

## Appendix: Code Examples

### Example: SPFx Web Part - Module Navigation

```typescript
// src/webparts/moduleNavigation/ModuleNavigationWebPart.ts
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";

export default class ModuleNavigationWebPart extends BaseClientSideWebPart<IModuleNavigationWebPartProps> {

  public async onInit(): Promise<void> {
    await super.onInit();
    // Setup PnP JS
    sp.setup({
      spfxContext: this.context
    });
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="aph-module-nav">
        <button id="btnPrevious" class="aph-btn aph-btn-secondary">
          ← Previous
        </button>
        <div class="aph-module-actions">
          <button id="btnBookmark" class="aph-btn aph-btn-secondary">
            🔖 Bookmark
          </button>
          <button id="btnSkip" class="aph-btn aph-btn-secondary">
            Skip for Now
          </button>
          <button id="btnComplete" class="aph-btn aph-btn-primary">
            Mark Complete ✓
          </button>
        </div>
        <button id="btnNext" class="aph-btn aph-btn-primary">
          Next →
        </button>
      </div>
    `;

    this._setupEventHandlers();
  }

  private _setupEventHandlers(): void {
    const btnComplete = this.domElement.querySelector('#btnComplete');
    btnComplete.addEventListener('click', async () => {
      await this._markModuleComplete();
    });

    const btnBookmark = this.domElement.querySelector('#btnBookmark');
    btnBookmark.addEventListener('click', async () => {
      await this._toggleBookmark();
    });
  }

  private async _markModuleComplete(): Promise<void> {
    const userEmail = this.context.pageContext.user.email;
    const moduleId = this._getCurrentModuleId();

    // Write to Module Progress list
    await sp.web.lists.getByTitle("Module Progress").items.add({
      Title: `${userEmail}-${moduleId}`,
      UserEmail: userEmail,
      ModuleID: moduleId,
      CompletedDate: new Date().toISOString(),
      TimeSpent: 5 // Could calculate actual time
    });

    alert('Module marked as complete!');

    // Navigate to next module
    const nextModule = this._getNextModuleUrl();
    window.location.href = nextModule;
  }

  private async _toggleBookmark(): Promise<void> {
    const userEmail = this.context.pageContext.user.email;
    const moduleId = this._getCurrentModuleId();

    // Check if already bookmarked
    const existing = await sp.web.lists.getByTitle("Bookmarks")
      .items.filter(`UserEmail eq '${userEmail}' and ModuleID eq '${moduleId}'`)
      .get();

    if (existing.length > 0) {
      // Remove bookmark
      await sp.web.lists.getByTitle("Bookmarks").items.getById(existing[0].Id).delete();
      alert('Bookmark removed!');
    } else {
      // Add bookmark
      await sp.web.lists.getByTitle("Bookmarks").items.add({
        Title: moduleId,
        UserEmail: userEmail,
        ModuleID: moduleId,
        BookmarkedDate: new Date().toISOString()
      });
      alert('Module bookmarked!');
    }
  }

  private _getCurrentModuleId(): string {
    // Extract from page URL
    const url = window.location.href;
    const pageName = url.split('/').pop().replace('.aspx', '');
    return pageName;
  }

  private _getNextModuleUrl(): string {
    // Load module config and find next module
    // This would fetch from a JSON file or SharePoint list
    return '/sites/aph-product-owner-program/SitePages/day1-registry-complete.aspx';
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
```

---

**Document Version**: 2.0 (Updated for GCC Rebuild Approach)
**Last Updated**: January 2025
**Contact**: APH Product Governance Team
**Related Documents**:
- See `SPFX_REBUILD_GUIDE.md` for step-by-step implementation instructions
- See `SHAREPOINT_GCC_REQUIREMENTS.md` for detailed compliance documentation

---

## Quick Reference: SharePoint vs. React Feature Matrix (Updated)

| Component | React Implementation | SPFx Rebuild Equivalent | GCC Compatibility | Complexity |
|-----------|---------------------|------------------------|-------------------|------------|
| **Assessment** | `Assessment.tsx` (Radix UI) | Fluent UI ChoiceGroup | ✅ Compatible | ⭐⭐ Medium |
| **Dashboard** | `Dashboard.tsx` (Recharts) | Custom SVG or Fluent UI DonutChart | ✅ Compatible | ⭐⭐⭐ Medium-High |
| **Module View** | `ModuleView.tsx` (react-markdown) | markdown-to-jsx + Fluent UI | ✅ Compatible | ⭐⭐ Medium |
| **Progress Storage** | localStorage (device-specific) | SharePoint Lists + PnPClientStorage | ✅ Compatible | ⭐⭐⭐ Medium |
| **Navigation** | State-based (no routing) | State-based SPFx component | ✅ Compatible | ⭐⭐ Medium |
| **UI Components** | Radix UI (27+ packages) | Fluent UI v8 | ✅ Compatible | ⭐⭐⭐ Medium-High |
| **Icons** | Material Symbols CDN | Fluent UI MDL2 (bundled) | ✅ Compatible | ⭐⭐ Medium |
| **Fonts** | Google Fonts CDN | Self-hosted or system fonts | ✅ Compatible | ⭐⭐ Medium |
| **Build Tool** | Vite 6.0.1 | Webpack 5 (SPFx) | ✅ Compatible | ⭐⭐⭐⭐ High |
| **Styling** | Tailwind CSS + Custom CSS | Fluent UI theme + Custom SCSS | ✅ Compatible | ⭐⭐ Medium |

### Key Differences: Current React vs. GCC-Compatible SPFx

| Aspect | Current React App | GCC-Compatible SPFx | Impact |
|--------|------------------|---------------------|--------|
| **External Dependencies** | ❌ Google Fonts, Material Symbols | ✅ Self-hosted, bundled | GCC requires rebuild |
| **React Version** | ❌ React 18.3.1 | ✅ React 17.0.2 (SPFx bundled) | May need hook adjustments |
| **Build System** | ❌ Vite (incompatible) | ✅ Webpack (SPFx standard) | Slower dev experience |
| **Data Persistence** | Device-only (localStorage) | Cross-device (SharePoint Lists) | ✅ Better UX |
| **Deployment** | GitHub Pages (1 min) | App Catalog (5 min) | Slightly slower |
| **GCC Compliance** | ❌ Not compliant | ✅ Fully compliant | Required for government |

This guide provides everything needed to successfully rebuild the adaptive micro-learning portal on SharePoint with full GCC compliance while preserving the core user experience and personalization features!
