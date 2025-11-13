# APH Product Owner Portal - SharePoint Edition

[![SharePoint Framework](https://img.shields.io/badge/SharePoint%20Framework-1.21.1-green.svg)](https://aka.ms/spfx)
[![React](https://img.shields.io/badge/React-17.0.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen.svg)](https://nodejs.org/)

**Adaptive micro-learning platform for Austin Public Health Product Owners**

---

## Overview

This is the **SharePoint Framework (SPFx) version** of the APH Product Owner Portal, designed for enterprise deployment on SharePoint Hub sites with:

- ✅ SharePoint authentication (SSO)
- ✅ Cross-device progress sync via SharePoint Lists
- ✅ GCC compliance (no external CDNs)
- ✅ Server-side data persistence
- ✅ Role-based access control

---

## Deployment Versions

This project exists in **two deployment versions** optimized for different environments:

### 1. GitHub Pages (Public Demo)

- **Branch**: [`main`](https://github.com/crypticpy/aph-product-owner-portal/tree/main)
- **URL**: https://crypticpy.github.io/aph-product-owner-portal
- **Technology**: React 18.3.1 + Vite
- **Purpose**: Public demo, rapid prototyping
- **Data Storage**: localStorage (browser-based)

### 2. SharePoint (Production) - THIS PROJECT

- **Branch**: [`spfx-version`](https://github.com/crypticpy/aph-product-owner-portal/tree/spfx-version)
- **Deployment**: SharePoint App Catalog → Hub Site
- **Technology**: SPFx 1.21.1 + React 17.0.1
- **Purpose**: Production use for APH staff
- **Data Storage**: SharePoint Lists (server-based)

**See [DEPLOYMENT_PARITY_COMPARISON.md](./DEPLOYMENT_PARITY_COMPARISON.md) for detailed comparison.**

---

## Features

### Core Functionality

- **34 micro-learning modules** (2-5 minutes each) covering product ownership fundamentals
- **3 adaptive learning paths**:
  - Express (8 modules, ~2 hours) - Experienced POs with simple products
  - Standard (20 modules, ~6 hours) - New POs with moderate complexity
  - Comprehensive (34 modules, ~10 hours) - New POs with complex products
- **Personalized assessment** (3 questions) determines learning path
- **Progress tracking** - Completed modules, time spent, bookmarks
- **Interactive knowledge checks** - Quiz questions with instant validation
- **Dashboard visualization** - Circular progress ring, statistics, "Up Next" preview

### SharePoint-Specific Features

- **SharePoint SSO authentication** - Automatic user identification
- **Cross-device sync** - Progress follows user across all devices
- **Server-side persistence** - Data stored in SharePoint Lists, no data loss
- **User isolation** - Each user's data is separate and secure
- **API permissions** - Leverages SharePoint REST API (User.ReadWrite.All)

### Brand & Accessibility

- **APH brand compliance** - Official City of Austin colors, typography, spacing
- **WCAG 2.2 AA compliant** - 4.5:1 color contrast, keyboard navigation, screen reader support
- **Responsive design** - Optimized for mobile, tablet, laptop, desktop

---

## Prerequisites

### For Building

- **Node.js**: v22.14.0 or higher (but < 23.0.0)
  - Install via [nvm](https://github.com/nvm-sh/nvm): `nvm install 22 && nvm use 22`
- **npm**: v9+ (comes with Node.js)
- **SharePoint admin access** (for deployment only)

### For Deployment

- SharePoint Online tenant
- SharePoint admin rights (to upload to App Catalog)
- PowerShell with [PnP PowerShell module](https://pnp.github.io/powershell/) (for SharePoint Lists setup)

---

## Quick Start

### 1. Build Production Package

```bash
# Switch to Node 22
nvm use 22

# Install dependencies
npm install

# Build for production
npx gulp bundle --ship
npx gulp package-solution --ship
```

**Output**: `sharepoint/solution/aph-product-owner-portal.sppkg` (~67KB)

**See [README_BUILD.md](./README_BUILD.md) for detailed build instructions.**

---

### 2. Deploy to SharePoint

#### Step 1: Create SharePoint Lists

Run the PowerShell setup script (one-time):

```powershell
# Edit the script to set your site URL
.\setup-sharepoint-lists.ps1
```

This creates three lists:
- **User Profiles** - Assessment results, learning path
- **User Progress** - Completed modules, bookmarks, time spent
- **Module Responses** - Quiz answers (optional)

#### Step 2: Upload Package

1. Go to **SharePoint Admin Center**
2. Navigate to **More features → Apps → App Catalog**
3. Click **Apps for SharePoint**
4. Upload `sharepoint/solution/aph-product-owner-portal.sppkg`
5. Check **"Make this solution available to all sites"**
6. Click **Deploy**

#### Step 3: Approve API Permissions

1. In SharePoint Admin Center, go to **API access**
2. Find pending request: **SharePoint - User.ReadWrite.All**
3. Click **Approve**

#### Step 4: Add to SharePoint Page

1. Navigate to your SharePoint Hub site
2. Edit the page where you want the portal
3. Click **+ Add a web part**
4. Search for **"APH Product Owner Portal"**
5. Add to page and **Publish**

**See [DEPLOY_TO_SHAREPOINT.md](./DEPLOY_TO_SHAREPOINT.md) for detailed deployment guide with screenshots.**

---

## Development

### Local Testing

```bash
# Start local dev server
npx gulp serve

# Opens: https://localhost:4321/temp/workbench.html
```

**Note**: SharePoint Lists integration won't work in local workbench. You must test on a real SharePoint site with the lists created.

---

## Project Structure

```
aph-product-owner-portal/
├── src/
│   └── webparts/
│       └── productOwnerPortal/
│           ├── components/              # React components
│           │   ├── ProductOwnerPortal.tsx    # Main app component
│           │   ├── Assessment.tsx            # 3-question assessment
│           │   ├── Dashboard.tsx             # Progress dashboard
│           │   ├── ModuleView.tsx            # Module content + quiz
│           │   ├── Resources.tsx             # Resources page
│           │   └── index.css                 # Global styles
│           ├── services/                # Data layer
│           │   └── SharePointService.ts      # SharePoint Lists API
│           ├── moduleData.ts            # 34 learning modules
│           ├── types.ts                 # TypeScript interfaces
│           ├── ProductOwnerPortalWebPart.ts  # SPFx entry point
│           └── loc/                     # Localization strings
├── config/
│   ├── package-solution.json            # SPFx package config + API permissions
│   └── config.json                      # Bundle configuration
├── sharepoint/
│   └── solution/
│       └── aph-product-owner-portal.sppkg    # Production package (67KB)
├── setup-sharepoint-lists.ps1           # PowerShell setup script
├── README_BUILD.md                      # Build instructions
├── DEPLOY_TO_SHAREPOINT.md              # Deployment guide
├── DEPLOYMENT_PARITY_COMPARISON.md      # GitHub vs SharePoint comparison
└── README.md                            # This file
```

---

## Technology Stack

### SharePoint Framework

- **SPFx**: 1.21.1
- **@microsoft/sp-core-library**: 1.21.1
- **@microsoft/sp-webpart-base**: 1.21.1
- **@microsoft/sp-http**: 1.21.1 (for SharePoint REST API)

### UI Framework

- **React**: 17.0.1 (SPFx requirement)
- **React DOM**: 17.0.1
- **Fluent UI**: 8.120.8 (SharePoint-native components)

### Build Tools

- **Gulp**: 4.x (SPFx build system)
- **Webpack**: 5.x (bundling)
- **TypeScript**: 4.7.4 (SPFx-compatible version)

### Development

- **Node.js**: 22.x LTS
- **npm**: 9+
- **rush-stack-compiler**: 5.3

---

## Data Architecture

### SharePoint Lists Schema

#### User Profiles

| Column | Type | Values |
|--------|------|--------|
| Title | Text | User email (from SPFx context) |
| ExperienceLevel | Choice | 'new', 'experienced', 'somewhat' |
| GovernanceTier | Choice | 'tier1-2', 'tier3-4', 'not-sure' |
| TimeCommitment | Choice | 'less-than-1', '1-to-3', 'more-than-3' |
| LearningPath | Choice | 'express', 'standard', 'comprehensive' |
| CompletedAt | DateTime | When assessment was completed |

#### User Progress

| Column | Type | Description |
|--------|------|-------------|
| Title | Text | User email |
| CompletedModules | Note | JSON array of module IDs |
| BookmarkedModules | Note | JSON array of module IDs |
| CurrentModuleId | Text | ID of current module |
| TotalTimeSpent | Number | Total minutes spent |
| LastAccessedAt | DateTime | Last activity timestamp |

### API Integration

All data operations use **SPHttpClient** for SharePoint REST API:

```typescript
// Example: Fetch user profile
const endpoint = `${siteUrl}/_api/web/lists/getbytitle('User Profiles')/items?$filter=Title eq '${userEmail}'`
const response = await context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
```

**See `src/webparts/productOwnerPortal/services/SharePointService.ts` for full implementation.**

---

## API Permissions

This solution requires the following API permission:

- **Resource**: SharePoint
- **Scope**: `User.ReadWrite.All`
- **Reason**: Read and write user progress data to SharePoint Lists

**Approval required**: SharePoint admin must approve this permission after package deployment.

---

## Comparison: GitHub Pages vs SharePoint

| Feature | GitHub Pages | SharePoint (This Project) |
|---------|--------------|---------------------------|
| **Authentication** | None (public) | SharePoint SSO |
| **Data Persistence** | localStorage | SharePoint Lists |
| **Cross-Device Sync** | ❌ No | ✅ Yes |
| **User Isolation** | Per device | Per SharePoint account |
| **GCC Compliance** | ❌ No (external CDNs) | ✅ Yes (bundled assets) |
| **Deployment** | `pnpm deploy` | Upload .sppkg |
| **React Version** | 18.3.1 | 17.0.1 |
| **Build Tool** | Vite | Gulp + Webpack |
| **Purpose** | Demo, prototyping | Production for APH staff |

**Full comparison**: [DEPLOYMENT_PARITY_COMPARISON.md](./DEPLOYMENT_PARITY_COMPARISON.md)

---

## Migration from React 18 to SPFx

This project was migrated from a React 18 application to SPFx. Key changes:

### Code Changes

- ✅ React 18.3.1 → React 17.0.1
- ✅ Vite → Gulp + Webpack
- ✅ localStorage → SharePoint Lists via REST API
- ✅ `App.tsx` → `ProductOwnerPortal.tsx` (SPFx pattern)
- ✅ Synchronous data calls → Async with loading states
- ✅ Added `SharePointService` for data layer

### Configuration Changes

- ✅ TypeScript target: ES5 with ES2015/ES2016 libraries
- ✅ API permissions configured in `package-solution.json`
- ✅ All assets bundled (no external CDNs)
- ✅ SPFx web part manifest created

**No functionality was lost** - all 34 modules, learning paths, and features work identically.

---

## Troubleshooting

### Build Errors

**Problem**: "NodeJS version does not meet requirements"
**Solution**: Use Node.js v22: `nvm use 22`

**Problem**: TypeScript compilation errors
**Solution**: Clean and rebuild:
```bash
npx gulp clean
npm install
npx gulp bundle --ship
```

### Deployment Issues

**Problem**: "Access denied" when saving data
**Solution**: Ensure API permissions approved in SharePoint Admin Center

**Problem**: SharePoint Lists don't exist
**Solution**: Run `setup-sharepoint-lists.ps1` PowerShell script

**Problem**: Web part not appearing in page editor
**Solution**:
1. Verify package deployed to App Catalog
2. Ensure "Make available to all sites" is checked
3. Wait 5-10 minutes for propagation

---

## Support

- **GitHub Repository**: https://github.com/crypticpy/aph-product-owner-portal
- **GitHub Issues**: https://github.com/crypticpy/aph-product-owner-portal/issues
- **APH Product Governance**: APHProductGovernance@austintexas.gov
- **Office Hours**: Every other Friday

---

## Documentation

- [README_BUILD.md](./README_BUILD.md) - Detailed build instructions
- [DEPLOY_TO_SHAREPOINT.md](./DEPLOY_TO_SHAREPOINT.md) - Step-by-step deployment guide
- [DEPLOYMENT_PARITY_COMPARISON.md](./DEPLOYMENT_PARITY_COMPARISON.md) - GitHub vs SharePoint comparison

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | November 13, 2025 | Initial SPFx conversion from React 18 app |
|       |                    | - Migrated to React 17.0.1 |
|       |                    | - Added SharePointService for data persistence |
|       |                    | - Created SharePoint Lists setup script |
|       |                    | - Built production .sppkg package (67KB) |

---

## License

This project is provided **AS IS** for use by Austin Public Health and the City of Austin.

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Authors

- **Austin Public Health Governance Team**
- **Website**: https://www.austintexas.gov/department/austin-public-health
- **Email**: APHProductGovernance@austintexas.gov

---

## References

- [SharePoint Framework Documentation](https://aka.ms/spfx)
- [SPFx React 17 Support](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/compatibility)
- [SharePoint REST API](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [PnP PowerShell](https://pnp.github.io/powershell/)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)

---

**Ready to deploy to SharePoint!**

See [DEPLOY_TO_SHAREPOINT.md](./DEPLOY_TO_SHAREPOINT.md) to get started.
