# SharePoint Migration Guide
## APH Product Owner Portal - Adaptive Micro-Learning Experience

This guide provides a comprehensive strategy for migrating the React-based micro-learning portal to SharePoint Online, maintaining the core user experience while leveraging SharePoint's strengths.

---

## Executive Summary

### What We've Built (React Version)
- **Personalized assessment** that routes users to Express/Standard/Comprehensive learning paths
- **20-34 micro-learning modules** (5 minutes each)
- **Progress tracking** with localStorage
- **Interactive quizzes** and bookmarking
- **Responsive dashboard** with progress visualization
- **Mobile-optimized** design

### Migration Strategy
Use a **hybrid approach** that combines:
1. SharePoint pages for content and structure
2. SPFx (SharePoint Framework) web parts for interactivity
3. SharePoint lists for data storage
4. Power Apps for complex forms (optional)

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

## Phase 7: Implementation Steps

### Step 1: Site Provisioning (1 week)
- [ ] Create SharePoint Hub Site
- [ ] Set up navigation (top nav + quick launch)
- [ ] Apply APH theme (colors, logo)
- [ ] Create folder structure (SitePages, Style Library, etc.)

### Step 2: List Creation (3 days)
- [ ] Create "User Profiles" list with columns
- [ ] Create "Module Progress" list with columns
- [ ] Create "Quiz Responses" list with columns
- [ ] Create "Bookmarks" list with columns
- [ ] Set item-level permissions on all lists

### Step 3: Content Migration (2 weeks)
- [ ] Create 34 module pages (use template for consistency)
- [ ] Paste module content from React app (moduleData.ts)
- [ ] Format content with rich text editor
- [ ] Add images/diagrams where needed
- [ ] Create Resources page with document library
- [ ] Create Support page with contact info

### Step 4: SPFx Development (3-4 weeks)
- [ ] Set up SPFx development environment
- [ ] Build "Progress Dashboard" web part
- [ ] Build "Module Progress Bar" web part
- [ ] Build "Interactive Quiz" web part
- [ ] Build "Module Navigation" web part
- [ ] Test all web parts locally
- [ ] Package and deploy to App Catalog

### Step 5: Forms & Automation (1 week)
- [ ] Create Microsoft Forms for assessment
- [ ] Build Power Automate flow to process responses
- [ ] Test flow writes to "User Profiles" list correctly
- [ ] Add redirect logic after form submission

### Step 6: Styling & Polish (1 week)
- [ ] Upload custom CSS to Style Library
- [ ] Apply CSS to all pages
- [ ] Test mobile responsiveness
- [ ] Add brand assets (logos, icons)
- [ ] Ensure WCAG 2.1 AA compliance

### Step 7: Testing & Launch (2 weeks)
- [ ] User acceptance testing (UAT) with 5-10 POs
- [ ] Fix bugs and gather feedback
- [ ] Load testing (100+ concurrent users)
- [ ] Train support staff on how to update content
- [ ] Soft launch to pilot group
- [ ] Full launch communication

**Total Timeline**: 10-12 weeks

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

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| SPFx development complexity | High | Medium | Start with simpler web parts; consider Power Apps alternative |
| User adoption challenges | High | Low | Pilot testing; training sessions; feedback loops |
| Performance issues (large lists) | Medium | Low | Implement list indexing; use paging in web parts |
| SharePoint permissions complexity | Medium | Medium | Use OOTB item-level permissions; document clearly |
| Content updates break web parts | Low | Low | Use `module-config.json` for metadata; decouple from page content |
| Browser compatibility | Low | Low | Test in Edge, Chrome, Firefox; SharePoint is well-supported |

---

## Recommendations

### ✅ Use SharePoint If:
- Non-developers need to update content frequently
- You want persistent progress tracking across devices
- You need built-in search and analytics
- Budget allows for SPFx development time
- Organization standardizes on SharePoint for intranets

### ❌ Keep React If:
- You need maximum performance (SPA experience)
- You want complete control over UI/UX
- You have dedicated React developers
- Budget is constrained (SharePoint migration = $44K)
- Users prefer standalone web app over SharePoint

### 🎯 Hybrid Approach (Recommended):
**Keep React app as the primary experience**, but create a **simplified SharePoint version** for:
- Content discoverability (SharePoint Search)
- Mobile users (easier auth with SharePoint mobile app)
- Users who prefer SharePoint's familiar interface
- Integration with other APH SharePoint sites

**Cost**: ~$20K (simplified version with fewer custom web parts)

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

**Document Version**: 1.0
**Last Updated**: January 2025
**Contact**: APH Product Governance Team

---

## Quick Reference: SharePoint vs. React Feature Matrix

| Component | React Implementation | SharePoint Equivalent | Complexity |
|-----------|---------------------|----------------------|------------|
| Assessment | `Assessment.tsx` | Microsoft Forms | ⭐ Easy |
| Dashboard | `Dashboard.tsx` | SPFx web part | ⭐⭐⭐ Medium |
| Module View | `ModuleView.tsx` | SP Page + SPFx quiz | ⭐⭐ Medium |
| Progress Storage | localStorage | SharePoint lists | ⭐⭐ Medium |
| Navigation | React Router | Hyperlinks + SPFx | ⭐⭐ Medium |
| Styling | CSS-in-JS | Custom CSS file | ⭐ Easy |

This guide provides everything needed to successfully migrate the adaptive micro-learning portal to SharePoint while preserving the core user experience and personalization features!
