# Deployment Parity Comparison

## Overview

The APH Product Owner Portal exists in **two deployment versions** optimized for different environments:

1. **GitHub Pages Demo** (React 18 - Modern Web)
2. **SharePoint Production** (SPFx - Enterprise)

This document explains the differences, similarities, and when to use each version.

---

## Quick Reference

| Aspect | GitHub Pages | SharePoint |
|--------|--------------|------------|
| **Purpose** | Public demo, prototyping | Production use for APH staff |
| **URL** | https://crypticpy.github.io/aph-product-owner-portal | SharePoint Hub site |
| **Branch** | `main` | `spfx-version` |
| **React Version** | 18.3.1 | 17.0.1 |
| **Build Tool** | Vite 6.0.1 | Gulp 4.x + Webpack 5 |
| **Data Storage** | localStorage (browser) | SharePoint Lists (server) |
| **User Isolation** | Per device/browser | Per SharePoint user account |
| **Cross-Device Sync** | ❌ No | ✅ Yes |
| **Authentication** | None (public) | SharePoint SSO |
| **Package Format** | Static HTML/JS/CSS | .sppkg (67KB) |
| **Deployment Method** | `pnpm deploy` (gh-pages) | Upload to App Catalog |

---

## Version 1: GitHub Pages (React 18)

### Characteristics

- **Branch**: `main`
- **Technology**: React 18.3.1, Vite, pnpm
- **URL**: https://crypticpy.github.io/aph-product-owner-portal
- **Purpose**: Public demo, rapid prototyping, showcase

### Technology Stack

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^6.0.1",
  "typescript": "^5.6.2",
  "@radix-ui/*": "latest",
  "tailwindcss": "^3.4.16",
  "react-router-dom": "^6.28.0"
}
```

### Data Persistence

**localStorage-based** (client-side only):

```typescript
// Storage keys
localStorage.setItem('aph_user_profile', JSON.stringify(profile))
localStorage.setItem('aph_user_progress', JSON.stringify(progress))

// Features
- Per-device storage only
- No cross-device sync
- Data lost if cache cleared
- No server-side backup
```

### Advantages

✅ **Modern React features**: Concurrent rendering, automatic batching, transitions
✅ **Fast development**: HMR with Vite (instant updates)
✅ **Latest dependencies**: Always uses newest packages
✅ **No build constraints**: Full ES2020+ support
✅ **Easy deployment**: `pnpm deploy` to GitHub Pages
✅ **Public access**: Great for demos and sharing

### Limitations

❌ **No user authentication**: Anyone can access
❌ **No data persistence**: Progress lost on cache clear
❌ **Single-device only**: Can't sync across devices
❌ **No enterprise features**: No SSO, no role-based access
❌ **Not GCC compliant**: Uses external CDNs

### When to Use

- Showcasing the portal to stakeholders
- Rapid prototyping of new features
- Testing UI/UX changes quickly
- Sharing with external partners (no login required)
- Development and iteration

---

## Version 2: SharePoint (SPFx)

### Characteristics

- **Branch**: `spfx-version`
- **Technology**: SPFx 1.21.1, React 17.0.1, Gulp
- **Deployment**: SharePoint App Catalog → Hub Site
- **Purpose**: Production use for APH Product Owners

### Technology Stack

```json
{
  "@microsoft/sp-core-library": "1.21.1",
  "@microsoft/sp-webpart-base": "1.21.1",
  "react": "17.0.1",
  "react-dom": "17.0.1",
  "@fluentui/react": "^8.120.8",
  "typescript": "4.7.4"
}
```

### Data Persistence

**SharePoint Lists via REST API**:

```typescript
// Three SharePoint Lists
1. User Profiles - Assessment results, learning path
2. User Progress - Completed modules, bookmarks, current module
3. Module Responses - Quiz answers (optional)

// Features
- Server-side storage
- Cross-device sync
- Per-user isolation
- Backed up with SharePoint
- SharePoint SSO authentication
```

### SharePoint Lists Schema

#### User Profiles List

| Column | Type | Description |
|--------|------|-------------|
| Title | Single line of text | User email (from context) |
| ExperienceLevel | Choice | 'new', 'experienced', 'somewhat' |
| GovernanceTier | Choice | 'tier1-2', 'tier3-4', 'not-sure' |
| TimeCommitment | Choice | 'less-than-1', '1-to-3', 'more-than-3' |
| LearningPath | Choice | 'express', 'standard', 'comprehensive' |
| CompletedAt | Date and Time | When assessment was completed |

#### User Progress List

| Column | Type | Description |
|--------|------|-------------|
| Title | Single line of text | User email |
| CompletedModules | Multiple lines of text | JSON array of module IDs |
| BookmarkedModules | Multiple lines of text | JSON array of module IDs |
| CurrentModuleId | Single line of text | ID of current module |
| TotalTimeSpent | Number | Total minutes spent |
| LastAccessedAt | Date and Time | Last activity timestamp |

### Advantages

✅ **Enterprise authentication**: SharePoint SSO (no separate login)
✅ **Cross-device sync**: Progress follows user everywhere
✅ **Data persistence**: Server-side storage, no data loss
✅ **User isolation**: Each user's data is separate
✅ **GCC compliant**: No external CDNs, all assets bundled
✅ **SharePoint integration**: Works with existing hub site
✅ **Role-based access**: Leverage SharePoint permissions
✅ **Backup and recovery**: SharePoint handles data backup

### Limitations

❌ **React 17 only**: Can't use React 18 features
❌ **Older dependencies**: SPFx dictates versions
❌ **Slower builds**: Gulp + Webpack slower than Vite
❌ **Complex deployment**: Requires App Catalog access
❌ **SharePoint-only**: Can't deploy outside SharePoint
❌ **API permissions**: Requires admin approval for Lists access

### When to Use

- Production deployment for APH staff
- When user progress needs to persist
- When cross-device sync is required
- When authentication is needed
- When data needs server-side backup
- For GCC compliance requirements

---

## Functional Parity Analysis

### ✅ Identical Functionality

Both versions provide **100% feature parity** for core functionality:

- **34 micro-learning modules** (identical content)
- **3 adaptive learning paths** (same algorithm)
- **3-question assessment** (same questions and logic)
- **Progress tracking** (completed modules, time spent, bookmarks)
- **Dashboard visualization** (circular progress, statistics)
- **Module navigation** (previous/next, back to dashboard)
- **Knowledge checks** (quiz questions with validation)
- **APH brand compliance** (same colors, typography, spacing)
- **WCAG 2.2 AA accessibility** (same focus states, keyboard nav)
- **Responsive design** (same breakpoints and layouts)

### ⚠️ Implementation Differences

| Feature | GitHub Pages | SharePoint |
|---------|--------------|------------|
| **User Identification** | None (anonymous) | SharePoint email |
| **Data Persistence** | localStorage | SharePoint Lists |
| **API Calls** | None | SPHttpClient REST API |
| **Loading States** | Instant (synchronous) | Async with spinners |
| **Error Handling** | Try-catch on localStorage | Try-catch on HTTP requests |
| **Build Output** | dist/ folder (HTML/JS/CSS) | .sppkg package (67KB) |

---

## User Experience Comparison

### First-Time User Flow

**GitHub Pages**:
1. Navigate to https://crypticpy.github.io/aph-product-owner-portal
2. Assessment appears immediately (no login)
3. Answer 3 questions
4. Profile saved to browser localStorage
5. Redirected to dashboard

**SharePoint**:
1. Navigate to SharePoint Hub site
2. Already authenticated via SharePoint SSO
3. Web part loads and checks SharePoint Lists
4. If no profile found, assessment appears
5. Answer 3 questions
6. Profile saved to SharePoint Lists (server)
7. Redirected to dashboard

### Returning User Flow

**GitHub Pages**:
1. Navigate to site
2. localStorage checked for existing profile
3. If found, load dashboard immediately
4. **Limitation**: Only works on same device/browser

**SharePoint**:
1. Navigate to SharePoint site
2. SharePoint Lists queried for user's profile
3. If found, load dashboard (may show loading spinner)
4. **Advantage**: Works on any device, progress syncs

---

## Code Architecture Differences

### Main Application Component

**GitHub Pages** (`App.tsx`):

```typescript
// Direct localStorage calls
const savedProfile = getUserProfile()  // Synchronous
const savedProgress = getUserProgress()  // Synchronous

// No loading states needed
if (savedProfile) {
  setUserProfile(savedProfile)
  setViewMode('dashboard')
}
```

**SharePoint** (`ProductOwnerPortal.tsx`):

```typescript
// Async SharePoint API calls
const [isLoading, setIsLoading] = useState(true)
const [sharePointService] = useState(() => new SharePointService(props.context))

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true)
      const savedProfile = await sharePointService.getUserProfile()  // Async
      const savedProgress = await sharePointService.getUserProgress()  // Async
      if (savedProfile) {
        setUserProfile(savedProfile)
        setViewMode('dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }
  loadData()
}, [sharePointService])

// Show loading spinner while fetching
if (isLoading) {
  return <Spinner size={SpinnerSize.large} label="Loading your progress..." />
}
```

### Data Service Layer

**GitHub Pages** (`utils/storage.ts`):

```typescript
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem('aph_user_profile', JSON.stringify(profile))
}

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem('aph_user_profile')
  return data ? JSON.parse(data) : null
}
```

**SharePoint** (`services/SharePointService.ts`):

```typescript
export class SharePointService {
  private context: WebPartContext
  private siteUrl: string
  private userEmail: string

  constructor(context: WebPartContext) {
    this.context = context
    this.siteUrl = context.pageContext.web.absoluteUrl
    this.userEmail = context.pageContext.user.email
  }

  public async getUserProfile(): Promise<UserProfile | null> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items?$filter=Title eq '${encodeURIComponent(this.userEmail)}'`
    const response = await this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
    if (!response.ok) return null
    const data = await response.json()
    if (data.value && data.value.length > 0) {
      const item = data.value[0]
      return {
        experienceLevel: item.ExperienceLevel,
        governanceTier: item.GovernanceTier,
        timeCommitment: item.TimeCommitment,
        learningPath: item.LearningPath,
        completedAt: item.CompletedAt
      }
    }
    return null
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    // POST request to create new list item
    // or PATCH to update existing
  }
}
```

---

## Deployment Process Comparison

### GitHub Pages Deployment

**Prerequisites**:
- GitHub account with push access
- pnpm installed

**Steps**:

```bash
# 1. Make changes in main branch
cd aph-product-owner-portal

# 2. Test locally
pnpm dev

# 3. Build and deploy
pnpm deploy  # Builds and pushes to gh-pages branch

# 4. Live in ~2 minutes
# URL: https://crypticpy.github.io/aph-product-owner-portal
```

**Time**: ~2-3 minutes
**Skill Level**: Developer (requires git/npm knowledge)

### SharePoint Deployment

**Prerequisites**:
- SharePoint admin access
- PowerShell with PnP module
- Node.js v22 installed

**Steps**:

```bash
# 1. Build .sppkg package (one-time)
cd aph-product-owner-portal-spfx/aph-product-owner-portal
nvm use 22
npm install
npx gulp bundle --ship
npx gulp package-solution --ship
# Output: sharepoint/solution/aph-product-owner-portal.sppkg (67KB)
```

```powershell
# 2. Create SharePoint Lists (one-time)
.\setup-sharepoint-lists.ps1
```

```
# 3. Upload .sppkg to App Catalog
   - SharePoint Admin Center
   - More features → Apps → App Catalog
   - Apps for SharePoint → Upload aph-product-owner-portal.sppkg
   - Check "Make available to all sites"
   - Deploy

# 4. Approve API permissions (one-time)
   - SharePoint Admin Center → API access
   - Approve "SharePoint - User.ReadWrite.All" request

# 5. Add web part to page
   - Navigate to SharePoint site
   - Edit page → Add web part
   - Search "APH Product Owner Portal"
   - Add to page and publish
```

**Time**: ~30-45 minutes first time, ~5 minutes for updates
**Skill Level**: SharePoint admin (non-technical friendly with guide)

---

## Migration Path (Optional)

If you want to migrate from GitHub Pages to SharePoint:

1. **Keep GitHub Pages running** (for demos)
2. **Deploy SharePoint version** (for production)
3. **Notify users** to switch to SharePoint
4. **Monitor usage** on both platforms
5. **Optionally sunset GitHub Pages** when adoption is complete

Users will need to **retake the assessment** on SharePoint (can't migrate localStorage data).

---

## Testing Checklist

Before deploying either version, verify:

### Functional Tests

- [ ] Assessment flow works (3 questions → learning path)
- [ ] All 34 modules display correctly
- [ ] Module navigation works (previous/next)
- [ ] Knowledge checks validate answers
- [ ] Progress tracking updates correctly
- [ ] Bookmarks save and load
- [ ] Dashboard shows accurate statistics
- [ ] "Up Next" module is correct
- [ ] Circular progress visualization renders
- [ ] Reset functionality clears all data

### Version-Specific Tests

**GitHub Pages**:
- [ ] Data persists in localStorage
- [ ] Works in incognito mode (fresh profile)
- [ ] Progress survives page refresh
- [ ] Multiple users on same device maintain separate profiles

**SharePoint**:
- [ ] SharePoint Lists exist and have correct schema
- [ ] API permissions approved
- [ ] User email correctly identifies current user
- [ ] Data persists across devices
- [ ] Loading spinners appear during async operations
- [ ] Error handling works if Lists don't exist

### Accessibility Tests (Both)

- [ ] Keyboard navigation works throughout
- [ ] Focus states visible (3px white rings)
- [ ] Screen reader announces all content
- [ ] Color contrast meets WCAG 2.2 AA (4.5:1)
- [ ] Heading hierarchy is semantic (H1 → H2 → H3)

---

## Support and Troubleshooting

### GitHub Pages Issues

**Problem**: Changes not appearing
**Solution**: Wait 2-3 minutes for GitHub Pages to rebuild, hard refresh browser (Cmd+Shift+R)

**Problem**: Build fails
**Solution**: Check `pnpm build` locally, ensure all dependencies installed

**Problem**: Progress lost
**Solution**: Explain localStorage limitations, recommend SharePoint version

### SharePoint Issues

**Problem**: "Cannot read property 'spHttpClient'"
**Solution**: Ensure web part receives SPFx context, check ProductOwnerPortalWebPart.ts passes context prop

**Problem**: "Access denied" when saving data
**Solution**: Verify API permissions approved in SharePoint Admin Center

**Problem**: SharePoint Lists don't exist
**Solution**: Run `setup-sharepoint-lists.ps1` PowerShell script

**Problem**: Package upload fails
**Solution**: Verify Node v22 used for build, rebuild .sppkg package, check file size ~67KB

---

## Conclusion

Both versions are **production-ready** and provide **identical user experiences** with different technical implementations:

- **GitHub Pages** = Modern, fast, demo-friendly, single-device
- **SharePoint** = Enterprise, persistent, multi-device, authenticated

Choose based on your deployment requirements. For **APH production use**, the **SharePoint version** is recommended.

---

## Quick Links

- **GitHub Repository**: https://github.com/crypticpy/aph-product-owner-portal
- **GitHub Pages Demo**: https://crypticpy.github.io/aph-product-owner-portal
- **React 18 Branch**: `main`
- **SPFx Branch**: `spfx-version`
- **SharePoint Build Guide**: `README_BUILD.md`
- **SharePoint Deploy Guide**: `DEPLOY_TO_SHAREPOINT.md`

---

**Last Updated**: November 13, 2025
**Document Version**: 1.0
**Maintained By**: APH Product Governance Team
