# SharePoint GCC Requirements
## Government Community Cloud Compliance for APH Product Owner Portal

This document provides comprehensive documentation of GCC (Government Community Cloud) compliance requirements and constraints for deploying the APH Product Owner Portal to SharePoint.

> **Audience**: Technical architects, developers, and IT administrators responsible for GCC deployments

---

## Table of Contents

1. [GCC Overview](#1-gcc-overview)
2. [Critical Compliance Constraints](#2-critical-compliance-constraints)
3. [Technical Requirements](#3-technical-requirements)
4. [Security & Privacy](#4-security--privacy)
5. [Development Constraints](#5-development-constraints)
6. [Testing & Validation](#6-testing--validation)
7. [Deployment Checklist](#7-deployment-checklist)
8. [Monitoring & Auditing](#8-monitoring--auditing)

---

## 1. GCC Overview

### What is GCC?

**GCC (Government Community Cloud)** is Microsoft's cloud platform designed for U.S. federal, state, local, and tribal government entities. It provides the same features as commercial SharePoint Online but with additional security, compliance, and isolation requirements.

### GCC Tiers

| Tier | Use Case | Isolation | Compliance |
|------|----------|-----------|------------|
| **GCC** | State & local government | Logical isolation | FedRAMP Moderate |
| **GCC High** | Federal agencies, DoD | Physical & logical isolation | FedRAMP High, ITAR, DFARS |
| **DoD** | Department of Defense | Physical isolation, dedicated infrastructure | IL5 compliance |

**APH is deploying to: GCC** (assumed - confirm with IT admin)

### Key Differences from Commercial SharePoint

| Feature | Commercial | GCC | GCC High |
|---------|-----------|-----|----------|
| **Endpoint** | `.sharepoint.com` | `.sharepoint.com` or `.sharepoint.us` | `.sharepoint.us` |
| **External CDNs** | Allowed | Allowed (limited) | ❌ Blocked |
| **Graph API** | `graph.microsoft.com` | `graph.microsoft.com` | `graph.microsoft.us` |
| **Public npm packages** | Allowed | Allowed | ⚠️ Restricted |
| **Data residency** | Global | US only | US only (dedicated) |

---

## 2. Critical Compliance Constraints

### 2.1 External CDN Restrictions

#### GCC Standard
**Status:** ✅ Most external CDNs allowed
- Google Fonts: ✅ Allowed
- npm CDN: ✅ Allowed
- Public icon libraries: ✅ Allowed

**Recommendation:** Still self-host for future GCC High compatibility

#### GCC High
**Status:** ❌ All external CDNs blocked

**Blocked Resources:**
- `fonts.googleapis.com` (Google Fonts)
- `fonts.gstatic.com` (Google Fonts assets)
- `unpkg.com` (npm CDN)
- `cdn.jsdelivr.net` (npm CDN)
- `cdnjs.cloudflare.com` (JavaScript library CDN)
- Any non-Microsoft CDN

**Impact on Current React App:**
```typescript
// BLOCKED IN GCC HIGH:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded');
```

**Solution:**
```typescript
// GCC HIGH COMPATIBLE:
@font-face {
  font-family: 'Inter';
  src: url('/sites/aph-portal/SiteAssets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

// Replace Material Symbols with Fluent UI Icons (bundled with SPFx)
import { Icon } from 'office-ui-fabric-react';
<Icon iconName="Contact" />  // Instead of Material Symbols
```

### 2.2 Content Security Policy (CSP)

#### GCC CSP Headers

GCC enforces strict Content Security Policy to prevent XSS and data exfiltration.

**Default CSP Directives:**
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sharepoint.us *.microsoft.com;
  style-src 'self' 'unsafe-inline' *.sharepoint.us;
  font-src 'self' data: *.sharepoint.us;
  img-src 'self' data: https: *.sharepoint.us;
  connect-src 'self' *.sharepoint.us *.microsoft.us;
  frame-src 'self' *.sharepoint.us;
```

**Implications:**

1. **External API calls blocked:**
   ```typescript
   // ❌ BLOCKED:
   fetch('https://api.example.com/data')

   // ✅ ALLOWED:
   fetch('https://tenant.sharepoint.us/_api/...')
   ```

2. **Inline scripts restricted:**
   - SPFx handles this automatically
   - Avoid `eval()` or `new Function()`

3. **External iframes blocked:**
   ```html
   <!-- ❌ BLOCKED: -->
   <iframe src="https://www.youtube.com/embed/..."></iframe>

   <!-- ✅ ALLOWED (if configured): -->
   <iframe src="https://tenant.sharepoint.us/..."></iframe>
   ```

### 2.3 Data Residency Requirements

#### Storage Location

**GCC:** US data centers only
- SharePoint lists: ✅ Stored in US
- OneDrive: ✅ Stored in US
- Microsoft 365 services: ✅ Stored in US

**GCC High:** US government-dedicated data centers

**Prohibited:**
- ❌ Storing sensitive data in commercial cloud
- ❌ Cross-border data transfers
- ❌ Third-party cloud storage (AWS, Google Cloud, etc.)

#### Data Classification

| Classification | GCC | GCC High | Example |
|---------------|-----|----------|---------|
| **Public** | ✅ | ✅ | Published training materials |
| **Internal** | ✅ | ✅ | User progress data |
| **Sensitive** | ✅ | ✅ | PII (email addresses) |
| **Controlled Unclassified (CUI)** | ⚠️ Limited | ✅ | ITAR data |
| **Classified** | ❌ | ❌ | Requires DoD tier |

**APH Product Owner Portal Data:**
- User email addresses: **Internal/Sensitive** (PII)
- Learning progress: **Internal**
- Module content: **Public/Internal**

**Compliance:** ✅ All data appropriate for GCC

---

## 3. Technical Requirements

### 3.1 SPFx Version Requirements

#### Minimum Versions for GCC

| Component | Version | Notes |
|-----------|---------|-------|
| **SharePoint Framework** | 1.18.0+ | GCC-compatible |
| **Node.js** | v18 LTS or v22 LTS | v22 recommended for SPFx 1.21+ |
| **TypeScript** | 4.7+ | Bundled with SPFx |
| **React** | 17.0.2 | Bundled with SPFx (React 18 not supported) |

**Check SPFx GCC compatibility:**
```bash
# Official Microsoft compatibility matrix:
# https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview

# Recommended: SPFx 1.21.1 (latest GA as of Jan 2025)
npm install -g @microsoft/generator-sharepoint@1.21.1
```

### 3.2 Dependency Constraints

#### Allowed Dependencies

✅ **Permitted in GCC:**
- `@pnp/sp` - SharePoint operations
- `office-ui-fabric-react` - Fluent UI components
- `@fluentui/react-charting` - Microsoft charting library
- `markdown-to-jsx` - Markdown rendering
- `react`, `react-dom` - Bundled with SPFx

#### Prohibited Dependencies

❌ **Blocked or problematic in GCC High:**
- `recharts` - Loads external fonts (D3 uses Google Fonts in some configs)
- `@radix-ui/*` - Untested in GCC, potential CSP conflicts
- `axios` - Use `@pnp/sp` instead
- `react-router-dom` - Use state-based navigation in SPFx
- Any package with external CDN dependencies

#### Bundle Size Limits

**SharePoint Web Part Limits:**
- **Maximum bundle size:** 10MB (uncompressed)
- **Recommended:** <2MB (uncompressed)
- **Optimal:** <500KB (compressed)

**Current React App:**
- Bundle size: ~800KB (within limits)
- With SPFx + Fluent UI: ~1.5MB (acceptable)

**Optimization Strategies:**
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/stats.json

# Remove unused Fluent UI components
npm uninstall @fluentui/react-icons
npm install @fluentui/react-icons-mdl2 --save  # Smaller icon set
```

### 3.3 API Endpoint Configuration

#### Environment Detection

```typescript
// Detect GCC environment
export function isGCCEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.location.hostname.includes('.sharepoint.us') ||
    window.location.hostname.includes('.microsoft.us')
  );
}

export function getGraphEndpoint(): string {
  return isGCCEnvironment()
    ? 'https://graph.microsoft.us'
    : 'https://graph.microsoft.com';
}

export function getSharePointEndpoint(context: WebPartContext): string {
  // SPFx automatically uses correct endpoint
  // Manual override if needed:
  return context.pageContext.web.absoluteUrl;
}
```

#### API Permissions

**Required SharePoint Permissions:**
```json
// package-solution.json
{
  "solution": {
    "webApiPermissionRequests": [
      {
        "resource": "SharePoint",
        "scope": "Web.All"
      }
    ]
  }
}
```

**Approval Process:**
1. Deploy .sppkg to App Catalog
2. Navigate to SharePoint Admin Center
3. Go to **API access** → **Pending approvals**
4. Approve "SharePoint Web.All" request

---

## 4. Security & Privacy

### 4.1 User Identity & Authentication

#### Authentication Methods

**GCC uses:**
- ✅ Azure AD (government cloud)
- ✅ Single Sign-On (SSO)
- ✅ Multi-Factor Authentication (MFA) - often required

**Not available:**
- ❌ Social logins (Google, Facebook, etc.)
- ❌ Consumer Microsoft accounts (@outlook.com, @hotmail.com)

#### User Profile Access

```typescript
// Get current user information
export class SharePointService {
  constructor(context: WebPartContext) {
    // Primary: User email
    this.userEmail = context.pageContext.user.email;

    // Fallback: Login name (for guest users)
    this.userLoginName = context.pageContext.user.loginName;

    // Display name
    this.userName = context.pageContext.user.displayName;
  }

  async getCurrentUserWithFallback(): Promise<string> {
    // Try email first
    if (this.userEmail) return this.userEmail;

    // Fallback to login name
    if (this.userLoginName) return this.userLoginName;

    // Last resort: Query User Profile Service
    try {
      const user = await sp.web.currentUser.get();
      return user.Email || user.LoginName;
    } catch (error) {
      throw new Error('Unable to identify user');
    }
  }
}
```

### 4.2 Data Privacy & PII Handling

#### Personal Identifiable Information (PII)

**PII in APH Portal:**
- User email addresses (stored in SharePoint Lists)
- User display names
- Learning progress (linked to email)

**Compliance Requirements:**
- ✅ Store PII only in SharePoint Lists (GCC-approved)
- ✅ Use item-level permissions (users see only their own data)
- ❌ Do not log PII to browser console
- ❌ Do not send PII to external services

**Implementation:**
```typescript
// ✅ CORRECT: Store in SharePoint Lists
await sp.web.lists.getByTitle('UserProfiles').items.add({
  Title: userEmail,  // PII stored in GCC-approved location
  ExperienceLevel: 'new'
});

// ❌ WRONG: Log PII
console.log('User email:', userEmail);  // PII in browser console

// ❌ WRONG: Send to external service
fetch('https://analytics.example.com', {
  body: JSON.stringify({ email: userEmail })  // PII exfiltration
});
```

### 4.3 SharePoint List Permissions

#### Item-Level Security

```powershell
# Enable item-level permissions
Set-PnPList -Identity "UserProfiles" -ItemLevelSecurity Enabled

# Configure: Users can only read/edit their own items
# SharePoint UI: List Settings → Advanced Settings
# "Read access": Read items that were created by the user
# "Create and Edit access": Create items and edit items that were created by the user
```

**SPFx Code:**
```typescript
// Filter by current user automatically
async getUserProfile(): Promise<UserProfile | null> {
  const items = await sp.web.lists
    .getByTitle('UserProfiles')
    .items
    .filter(`Title eq '${this.userEmail}'`)  // Only returns current user's data
    .get();

  // Even if user tries to query someone else's data,
  // SharePoint list permissions prevent access
  return items.length > 0 ? items[0] : null;
}
```

---

## 5. Development Constraints

### 5.1 React Version Limitations

#### SPFx React 17 vs. React 18

**SPFx uses React 17.0.2 (bundled):**

❌ **Unavailable React 18 features:**
- `useId` hook
- `useTransition` hook
- `useDeferredValue` hook
- `Suspense` for data fetching
- Automatic batching (works differently)
- Concurrent rendering

✅ **Available React 17 features:**
- All hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useContext`
- Suspense for code splitting (limited)
- Error boundaries
- Portals

**Migration Considerations:**
```typescript
// Current React App (React 18):
import { useId } from 'react';
const id = useId();  // ❌ Not available in SPFx

// SPFx Compatible (React 17):
import { useState } from 'react';
const [id] = useState(() => `id-${Math.random().toString(36).substr(2, 9)}`);  // ✅ Works
```

### 5.2 Build Tool Differences

#### Vite vs. Webpack

| Feature | Vite (Current) | Webpack (SPFx) |
|---------|---------------|----------------|
| **Dev server startup** | ~2 seconds | ~30 seconds |
| **Hot Module Replacement** | Instant | 5-10 seconds |
| **Production build** | ~10 seconds | ~60 seconds |
| **Bundle optimization** | Automatic | Manual config |
| **Code splitting** | Automatic | Manual config |

**Webpack Configuration:**

SPFx uses Webpack 5 with pre-configured settings. Limited customization available via `gulpfile.js`.

**Example: Optimize bundle size**
```javascript
// gulpfile.js (advanced)
build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    // Add custom optimization
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    };
    return config;
  }
});
```

### 5.3 Debugging & Logging

#### GCC-Safe Logging

```typescript
// ✅ CORRECT: Safe logging (no PII)
console.log('User profile loaded successfully');
console.log('Modules completed:', completedCount);

// ⚠️ CAUTION: Conditional PII logging (dev only)
if (process.env.NODE_ENV === 'development') {
  console.log('Debug: User email:', userEmail);
}

// ❌ WRONG: PII in production logs
console.log('User:', userEmail, 'completed module:', moduleId);
```

#### Error Handling

```typescript
// Sanitize errors before logging
try {
  await spService.saveUserProfile(profile);
} catch (error) {
  // ❌ WRONG: May contain PII
  console.error('Error:', error);

  // ✅ CORRECT: Sanitized error
  console.error('Error saving profile:', error.message);

  // ✅ BETTER: Structured error logging
  console.error({
    component: 'SharePointService',
    method: 'saveUserProfile',
    errorType: error.name,
    message: error.message,
    // NO user identifiers
  });
}
```

---

## 6. Testing & Validation

### 6.1 GCC Environment Testing

#### Pre-Deployment Testing

**Test in GCC Sandbox:**
1. Deploy to GCC test site
2. Test with real GCC users
3. Verify network traffic (no external CDN calls)
4. Check browser console for errors
5. Validate SharePoint List access

**Network Traffic Audit:**
```bash
# Browser DevTools → Network Tab
# Filter: All
# Look for:
# ❌ fonts.googleapis.com
# ❌ fonts.gstatic.com
# ❌ unpkg.com
# ❌ cdn.jsdelivr.net
# ✅ Only *.sharepoint.us or *.microsoft.us
```

**Browser Console Audit:**
```bash
# Look for CSP violations:
# "Refused to load..."
# "Blocked by Content Security Policy"

# Example CSP error:
# Refused to load the font 'https://fonts.googleapis.com/...'
# because it violates the following Content Security Policy directive:
# "font-src 'self' *.sharepoint.us"
```

### 6.2 Accessibility Testing

#### WCAG 2.2 AA Compliance

**Requirements:**
- ✅ Color contrast ratios meet 4.5:1 minimum
- ✅ All interactive elements keyboard accessible
- ✅ Proper heading hierarchy
- ✅ ARIA labels for icon-only buttons
- ✅ Focus indicators visible (3px minimum)

**Testing Tools:**
```bash
# Install axe DevTools browser extension
# https://www.deque.com/axe/devtools/

# Run automated scan
# Look for violations

# Manual testing:
# - Tab through entire page (keyboard nav)
# - Test with screen reader (NVDA/JAWS)
# - Test high contrast mode
```

**Fluent UI Accessibility:**
- ✅ All components WCAG 2.2 AA compliant by default
- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation built-in
- ⚠️ Verify custom components maintain accessibility

### 6.3 Performance Testing

#### Load Testing

**Target Metrics:**
- Page load time: <3 seconds
- Bundle size: <2MB uncompressed
- Interactive time: <5 seconds
- 60fps scrolling/animations

**Testing Tools:**
```bash
# Lighthouse audit
# Chrome DevTools → Lighthouse → Generate report

# Bundle size analysis
npm run build
npx webpack-bundle-analyzer dist/stats.json

# Load testing (50+ concurrent users)
# Use Azure Load Testing or similar tool
```

---

## 7. Deployment Checklist

### 7.1 Pre-Deployment Checklist

**Environment Validation:**
- [ ] Confirm GCC or GCC High tenant
- [ ] Verify SharePoint site URL (`.sharepoint.us`)
- [ ] Confirm App Catalog access
- [ ] Verify User Profile Service availability
- [ ] Document Content Security Policy settings

**Code Validation:**
- [ ] No external CDN references in code
- [ ] All fonts self-hosted in SharePoint
- [ ] All icons from Fluent UI MDL2
- [ ] API endpoints use `.us` domain (if GCC High)
- [ ] Bundle size under 10MB uncompressed
- [ ] No public npm packages loaded at runtime

**Data Validation:**
- [ ] SharePoint Lists created
- [ ] Item-level permissions configured
- [ ] Test data operations (CRUD)
- [ ] Verify cross-device sync

**Security Validation:**
- [ ] No PII in console logs
- [ ] No external API calls
- [ ] Proper error handling (no PII in errors)
- [ ] SharePoint permissions tested

**Accessibility Validation:**
- [ ] Axe DevTools scan (0 violations)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] High contrast mode tested
- [ ] Color contrast ratios verified

### 7.2 Deployment Steps

**1. Build Production Package:**
```bash
gulp clean
gulp bundle --ship
gulp package-solution --ship
```

**2. Upload to App Catalog:**
- Navigate to SharePoint Admin Center
- Apps → App Catalog → Apps for SharePoint
- Upload `.sppkg` file
- Check "Make this solution available to all sites"
- Click **Deploy**

**3. Approve API Permissions:**
- SharePoint Admin Center → API access
- Approve "SharePoint Web.All" request

**4. Add to Site:**
- Navigate to target site
- Site Contents → New → App
- Select "APH Product Owner Portal"
- Add web part to page

**5. Verify Deployment:**
- Test as multiple users
- Check network traffic
- Verify SharePoint List access
- Monitor errors

### 7.3 Post-Deployment Monitoring

**Monitor for 48 hours:**
- SharePoint usage analytics
- Error logs in App Catalog
- User feedback
- Performance metrics

---

## 8. Monitoring & Auditing

### 8.1 Usage Analytics

**SharePoint Usage Reports:**
- Navigate to SharePoint Admin Center
- Reports → Usage
- Filter by site
- Track:
  - Active users
  - Page views
  - File activity
  - Storage usage

**Custom Analytics:**
```typescript
// Track module completions (optional)
async trackModuleCompletion(moduleId: string): Promise<void> {
  // Write to SharePoint List for reporting
  await sp.web.lists.getByTitle('Analytics').items.add({
    EventType: 'ModuleCompleted',
    ModuleId: moduleId,
    Timestamp: new Date().toISOString(),
    // NO PII - aggregate data only
  });
}
```

### 8.2 Security Auditing

**Audit Log Search:**
```powershell
# Connect to Security & Compliance Center
Connect-IPPSSession -UserPrincipalName admin@tenant.onmicrosoft.us

# Search audit logs
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) `
  -RecordType SharePointFileOperation `
  -Operations FileAccessed,FileModified
```

**Regular Audits:**
- Monthly: Review user access logs
- Quarterly: Review API permission requests
- Annually: Full security audit

### 8.3 Compliance Reporting

**Required Reports for GCC:**
- User access reports
- Data residency verification
- External API call audit (should be zero)
- PII handling compliance

---

## Summary

### Key Takeaways

✅ **GCC Compatible:**
- SPFx 1.21.1+ with React 17.0.2
- Fluent UI v8 components
- Self-hosted fonts and icons
- SharePoint Lists for data storage

❌ **Not GCC Compatible:**
- External CDNs (Google Fonts, Material Symbols)
- React 18 features
- Vite build system
- Radix UI components

### Success Criteria

- ✅ Zero external CDN calls
- ✅ All data stored in GCC boundary
- ✅ No PII in logs or external services
- ✅ WCAG 2.2 AA compliance
- ✅ Bundle size under limits
- ✅ Approved API permissions

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Contact**: APH Product Governance Team
**Related Documents**:
- `SHAREPOINT_MIGRATION_GUIDE.md` - Migration overview
- `SPFX_REBUILD_GUIDE.md` - Implementation guide
