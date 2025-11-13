# SharePoint Deployment Guide
## APH Product Owner Portal

This guide explains what the portal does and how to deploy it to SharePoint Online with GCC compliance.

---

## What This Application Does

### Features

**1. Personalized Assessment**
- 3-question assessment determines user's learning path
- Routes to Express (8 modules), Standard (20 modules), or Comprehensive (34 modules)
- Questions: Experience level, governance tier, time commitment

**2. Progress Dashboard**
- Circular progress visualization
- Statistics: completed modules, time invested, bookmarks
- "Up Next" module preview
- Bookmarked modules for quick reference

**3. Micro-Learning Modules**
- 34 total modules, 2-5 minutes each
- Markdown content with headings, lists, code blocks
- Optional knowledge check quizzes
- Navigation: previous/next, back to dashboard

**4. Progress Tracking**
- Persistent progress across sessions
- Module completion tracking
- Bookmark system for important modules
- Learning path locked after assessment

**5. Responsive Design**
- Mobile, tablet, and desktop layouts
- APH brand colors (Green #009F4D, Blue #44499C)
- Fluent UI components
- WCAG 2.2 AA accessibility compliance

---

## Current Tech Stack

### Application
- **React**: 18.3.1
- **Build Tool**: Vite 6.2.6
- **UI Library**: Fluent UI v8.120.8 (SharePoint-compatible)
- **Icons**: Fluent UI React Icons 2.0.314 (bundled, no CDN)
- **Markdown**: markdown-to-jsx 8.0.0
- **Routing**: React Router DOM v6
- **TypeScript**: 5.6.3

### Bundle Size
- **Uncompressed**: 421.87 kB
- **Gzipped**: 102.36 kB
- **Well under SharePoint's 10MB limit** ✅

### Dependencies (6 total)
```json
{
  "@fluentui/react": "8.120.8",
  "@fluentui/react-icons": "2.0.314",
  "markdown-to-jsx": "8.0.0",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-router-dom": "6.30.0"
}
```

### GCC Compliance Status
- ✅ No external CDN dependencies
- ✅ Fluent UI v8 (SharePoint native)
- ✅ Bundled icon system
- ✅ System fonts only (no Google Fonts)
- ✅ All assets self-hosted
- ⚠️ React 18 (SPFx uses React 17 - requires downgrade)
- ⚠️ Vite build tool (SPFx uses Webpack - requires rebuild)

---

## SharePoint Requirements

### Environment
- **SharePoint Online** (GCC or GCC High)
- **Node.js**: 22 LTS (or 18 LTS)
- **SPFx**: 1.21.1 or higher
- **SharePoint Admin** access for App Catalog deployment

### SharePoint Lists Required

**1. User Profiles**
```
Columns:
- Title (Single line of text) - User email
- ExperienceLevel (Choice) - new, somewhat, experienced
- GovernanceTier (Choice) - tier1-2, tier3-4, not-sure
- TimeCommitment (Choice) - less-than-1, 1-to-3, more-than-3
- LearningPath (Choice) - express, standard, comprehensive
- CompletedAt (Date and Time)
```

**2. User Progress**
```
Columns:
- Title (Single line of text) - User email
- CompletedModules (Multiple lines of text) - JSON array
- BookmarkedModules (Multiple lines of text) - JSON array
- CurrentModule (Single line of text)
- LastUpdated (Date and Time)
```

**3. Module Responses**
```
Columns:
- Title (Single line of text) - User email
- ModuleId (Single line of text)
- QuizAnswer (Number)
- IsCorrect (Yes/No)
- CompletedAt (Date and Time)
```

**4. Module Content**
```
Columns:
- Title (Single line of text) - Module ID
- ModuleTitle (Single line of text)
- Description (Multiple lines of text)
- Duration (Number) - minutes
- Category (Choice) - day1, week1, week2, week3-4, resources
- Priority (Choice) - high, medium, low
- LearningPaths (Multiple lines of text) - JSON array
- Content (Multiple lines of text) - Markdown
- QuizQuestion (Multiple lines of text)
- QuizOptions (Multiple lines of text) - JSON array
- QuizCorrectAnswer (Number)
```

### API Permissions Required
```
SharePoint:
- Read items in all site collections
- Create items in all site collections
- Update items in all site collections

Microsoft Graph:
- User.Read (get current user email)
```

---

## Deployment Steps

### Option 1: SPFx Web Part (Recommended for GCC)

**1. Environment Setup**
```bash
# Install Node.js 22 LTS
node --version  # Should be v22.x.x

# Install Yeoman and SPFx generator
npm install -g yo @microsoft/generator-sharepoint

# Verify SPFx version
yo @microsoft/sharepoint --version  # Should be 1.21.1+
```

**2. Create SPFx Project**
```bash
# Run generator
yo @microsoft/sharepoint

# Answers:
# - Solution name: aph-product-owner-portal
# - Baseline package: SharePoint Online only (latest)
# - Place files: Use current folder
# - Tenant admin: No
# - Type of client-side component: WebPart
# - WebPart name: ProductOwnerPortal
# - Description: APH Product Owner adaptive learning portal
# - Framework: React
```

**3. Downgrade React to 17.0.2**

SPFx 1.21.1 uses React 17, not React 18. Update `package.json`:
```json
{
  "dependencies": {
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "@fluentui/react": "8.120.8",
    "@fluentui/react-icons": "2.0.314",
    "markdown-to-jsx": "8.0.0"
  }
}
```

Then run: `npm install`

**4. Copy Source Files**

Copy from current React app to SPFx project:
```
src/components/ → src/webparts/productOwnerPortal/components/
src/types.ts → src/webparts/productOwnerPortal/types.ts
src/moduleData.ts → src/webparts/productOwnerPortal/moduleData.ts
```

**5. Create SharePoint Service**

Create `src/webparts/productOwnerPortal/services/SharePointService.ts`:
```typescript
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { UserProfile, UserProgress } from '../types';

export class SharePointService {
  private context: any;
  private siteUrl: string;

  constructor(context: any) {
    this.context = context;
    this.siteUrl = context.pageContext.web.absoluteUrl;
  }

  // Get user profile
  public async getUserProfile(email: string): Promise<UserProfile | null> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items?$filter=Title eq '${email}'`;
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(
      endpoint,
      SPHttpClient.configurations.v1
    );
    const data = await response.json();
    if (data.value && data.value.length > 0) {
      const item = data.value[0];
      return {
        experienceLevel: item.ExperienceLevel,
        governanceTier: item.GovernanceTier,
        timeCommitment: item.TimeCommitment,
        learningPath: item.LearningPath,
        completedAt: item.CompletedAt
      };
    }
    return null;
  }

  // Save user profile
  public async saveUserProfile(email: string, profile: UserProfile): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items`;
    const body = JSON.stringify({
      Title: email,
      ExperienceLevel: profile.experienceLevel,
      GovernanceTier: profile.governanceTier,
      TimeCommitment: profile.timeCommitment,
      LearningPath: profile.learningPath,
      CompletedAt: profile.completedAt
    });

    await this.context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=nometadata',
          'odata-version': ''
        },
        body: body
      }
    );
  }

  // Get user progress
  public async getUserProgress(email: string): Promise<UserProgress | null> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items?$filter=Title eq '${email}'`;
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(
      endpoint,
      SPHttpClient.configurations.v1
    );
    const data = await response.json();
    if (data.value && data.value.length > 0) {
      const item = data.value[0];
      return {
        completedModules: JSON.parse(item.CompletedModules || '[]'),
        bookmarkedModules: JSON.parse(item.BookmarkedModules || '[]'),
        currentModule: item.CurrentModule || null
      };
    }
    return {
      completedModules: [],
      bookmarkedModules: [],
      currentModule: null
    };
  }

  // Update user progress
  public async updateUserProgress(email: string, progress: UserProgress): Promise<void> {
    // First check if item exists
    const existing = await this.getUserProgress(email);
    const body = JSON.stringify({
      Title: email,
      CompletedModules: JSON.stringify(progress.completedModules),
      BookmarkedModules: JSON.stringify(progress.bookmarkedModules),
      CurrentModule: progress.currentModule,
      LastUpdated: new Date().toISOString()
    });

    if (existing && existing.completedModules.length > 0) {
      // Update existing item
      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items?$filter=Title eq '${email}'`;
      const response = await this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
      const data = await response.json();
      const itemId = data.value[0].Id;

      await this.context.spHttpClient.post(
        `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items(${itemId})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-type': 'application/json;odata=nometadata',
            'IF-MATCH': '*',
            'X-HTTP-Method': 'MERGE'
          },
          body: body
        }
      );
    } else {
      // Create new item
      await this.context.spHttpClient.post(
        `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-type': 'application/json;odata=nometadata'
          },
          body: body
        }
      );
    }
  }
}
```

**6. Update App Component**

Modify `src/webparts/productOwnerPortal/components/ProductOwnerPortal.tsx` to use SharePointService instead of localStorage:

```typescript
import * as React from 'react';
import { ThemeProvider, createTheme } from '@fluentui/react';
import { SharePointService } from '../services/SharePointService';
import { Assessment } from './Assessment';
import { Dashboard } from './Dashboard';
import { ModuleView } from './ModuleView';
import { UserProfile, UserProgress } from '../types';

// APH Theme (same as current app)
const aphTheme = createTheme({
  palette: {
    themePrimary: '#009F4D',
    neutralPrimary: '#22254E',
    // ... rest of theme
  }
});

export const ProductOwnerPortal: React.FC<any> = (props) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = React.useState<UserProgress | null>(null);
  const [viewMode, setViewMode] = React.useState<'assessment' | 'dashboard' | 'module'>('assessment');

  const sharePointService = new SharePointService(props.context);
  const userEmail = props.context.pageContext.user.email;

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const profile = await sharePointService.getUserProfile(userEmail);
    const progress = await sharePointService.getUserProgress(userEmail);

    if (profile) {
      setUserProfile(profile);
      setUserProgress(progress);
      setViewMode('dashboard');
    }
  };

  const handleAssessmentComplete = async (profile: UserProfile) => {
    await sharePointService.saveUserProfile(userEmail, profile);
    await sharePointService.updateUserProgress(userEmail, {
      completedModules: [],
      bookmarkedModules: [],
      currentModule: null
    });
    setUserProfile(profile);
    setViewMode('dashboard');
  };

  return (
    <ThemeProvider theme={aphTheme}>
      {viewMode === 'assessment' && (
        <Assessment onComplete={handleAssessmentComplete} />
      )}
      {viewMode === 'dashboard' && userProfile && (
        <Dashboard
          userProfile={userProfile}
          userProgress={userProgress}
          onStartLearning={() => setViewMode('module')}
        />
      )}
      {viewMode === 'module' && (
        <ModuleView
          // ... props
          onComplete={async () => {
            // Update progress in SharePoint
            await sharePointService.updateUserProgress(userEmail, updatedProgress);
          }}
        />
      )}
    </ThemeProvider>
  );
};
```

**7. Build SPFx Package**
```bash
# Bundle and package
gulp bundle --ship
gulp package-solution --ship

# Output: sharepoint/solution/aph-product-owner-portal.sppkg
```

**8. Deploy to SharePoint**

```bash
# 1. Open SharePoint Admin Center
# 2. Navigate to: More features → Apps → App Catalog
# 3. Upload aph-product-owner-portal.sppkg
# 4. Check "Make this solution available to all sites"
# 5. Click "Deploy"
```

**9. Add to SharePoint Page**

```bash
# 1. Navigate to your SharePoint site
# 2. Create new page or edit existing
# 3. Add web part → Search "ProductOwnerPortal"
# 4. Add to page
# 5. Publish page
```

---

### Option 2: Embed React App (Not GCC Compliant)

If you don't need GCC compliance, you can embed the current React app using an iframe:

**1. Build React App**
```bash
cd aph-product-owner-portal
npm run build
```

**2. Host on Azure Static Web Apps or Azure Blob Storage**

**3. Add to SharePoint Page**
```html
<!-- Add Embed web part with iframe -->
<iframe
  src="https://your-app.azurestaticapps.net"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>
```

**Limitations:**
- ❌ Not GCC compliant (external URL)
- ❌ May be blocked by Content Security Policy
- ❌ No SharePoint context (user email, permissions)
- ❌ Still uses localStorage (doesn't sync across devices)

---

## Testing

### Functional Testing

**Assessment Flow:**
1. Load page → Assessment displays
2. Answer 3 questions → Submit
3. Verify correct learning path assigned
4. Verify redirect to dashboard
5. Check SharePoint List "User Profiles" has new item

**Module Completion:**
1. Start module from dashboard
2. Read content
3. Complete quiz (if present)
4. Mark complete
5. Verify SharePoint List "User Progress" updated

**Progress Tracking:**
1. Complete multiple modules
2. Refresh page
3. Verify progress persisted
4. Check dashboard shows correct completion %

### Performance Testing

**Benchmarks:**
- Dashboard load: < 3 seconds
- Module page load: < 2 seconds
- Quiz submission: < 1 second

**Tools:**
- Chrome DevTools Lighthouse
- SharePoint Performance Dashboard

### Accessibility Testing

**WCAG 2.2 AA Compliance:**
- Color contrast: 4.5:1 minimum
- Keyboard navigation: All features accessible
- Screen reader: NVDA/JAWS compatible
- Focus indicators: 3px white rings visible

**Tools:**
- axe DevTools
- WAVE browser extension
- Windows Narrator

---

## Troubleshooting

### Build Errors

**"Cannot find module '@fluentui/react'"**
```bash
npm install @fluentui/react@8.120.8
```

**"React version mismatch"**
```bash
# SPFx requires React 17.0.2
npm install react@17.0.2 react-dom@17.0.2
```

### Deployment Errors

**"App Catalog not found"**
- Ensure you have SharePoint Admin rights
- App Catalog must be created (one-time setup)

**"API permissions not granted"**
- Go to SharePoint Admin Center → API access
- Approve pending requests for SharePoint and Microsoft Graph

### Runtime Errors

**"Access denied to SharePoint List"**
- Verify list permissions
- Verify SPFx API permissions approved
- Check user has access to site

**"Data not persisting"**
- Check SharePoint Lists exist
- Verify column names match exactly
- Check browser console for errors

---

## Resources

### SharePoint Documentation
- [SPFx Overview](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [Build your first web part](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/build-a-hello-world-web-part)
- [GCC High guidance](https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod)

### Fluent UI
- [Fluent UI React v8 docs](https://developer.microsoft.com/en-us/fluentui#/controls/web)
- [Theming in SharePoint](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/use-theme-colors-in-your-customizations)

### SPFx Development
- [SPFx DevTools](https://github.com/pnp/sp-dev-fx-webparts)
- [PnP SPFx Generator](https://pnp.github.io/generator-spfx/)

---

## Support

For questions or issues with deployment:
- **SharePoint Admin**: Contact your IT department
- **APH Governance Team**: APHProductGovernance@austintexas.gov
- **Office Hours**: Every other Friday (schedule via governance team)
