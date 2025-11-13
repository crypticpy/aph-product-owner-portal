# APH Product Owner Portal - SPFx Build Instructions

This SharePoint Framework (SPFx) project is ready to build and deploy. Follow these instructions to create the production `.sppkg` package.

---

## Current Status

✅ **Project fully configured and SharePoint-ready:**
- All React 18 components migrated to React 17
- SharePointService created for REST API integration
- All 34 learning modules copied
- API permissions configured
- PowerShell setup script created
- Deployment guide written

---

## Node Version Requirement

⚠️ **IMPORTANT:** SPFx 1.21.1 requires Node.js version **22.14.0 or higher (but less than 23.0.0)**.

### Current System
- Node version: **v24.10.0** ❌ (too new)

### Required Version
- Node version: **22.14.0** ✅ (or any 22.x LTS)

---

## Option 1: Use Node Version Manager (Recommended)

### Install nvm (if not already installed)

**macOS/Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

**Windows:**
Download from: https://github.com/coreybutler/nvm-windows/releases

### Switch to Node 22

```bash
# Install Node 22 LTS
nvm install 22

# Use Node 22
nvm use 22

# Verify version
node --version
# Should output: v22.x.x
```

---

## Option 2: Install Node 22 Directly

**macOS (Homebrew):**
```bash
brew uninstall node
brew install node@22
brew link node@22
```

**Windows:**
1. Uninstall current Node via Control Panel
2. Download Node 22 LTS from: https://nodejs.org/
3. Install and restart terminal

---

## Building the Production Package

Once you're on Node 22, run these commands:

```bash
# Clean previous builds (optional)
rm -rf node_modules lib temp dist

# Reinstall dependencies with Node 22
npm install

# Bundle for production
npx gulp bundle --ship

# Package into .sppkg
npx gulp package-solution --ship
```

### Build Output

After successful build, you'll find:
```
sharepoint/solution/aph-product-owner-portal.sppkg
```

This is the file your boss will upload to SharePoint.

---

## Testing Locally (Optional)

To test the web part in the local workbench before deploying:

```bash
# Start local dev server
npx gulp serve

# Opens: https://localhost:4321/temp/workbench.html
```

**Note:** SharePoint Lists won't work in local workbench. You'll need to test on a real SharePoint site.

---

## Build Artifacts

After building, you'll see:

```
aph-product-owner-portal/
├── sharepoint/
│   └── solution/
│       └── aph-product-owner-portal.sppkg    ← This is what you deploy!
├── temp/                                      ← Build temp files
├── dist/                                      ← Compiled JavaScript
└── lib/                                       ← Compiled TypeScript
```

---

## Package Details

**File:** `aph-product-owner-portal.sppkg`
**Size:** ~650-800 KB (estimated)
**Contains:**
- Bundled React application (React 17.0.1)
- All 34 learning modules
- SharePointService for data persistence
- Fluent UI components
- APH brand theming

---

## Next Steps After Building

1. **Give the .sppkg file to your boss**
   - Location: `sharepoint/solution/aph-product-owner-portal.sppkg`

2. **Boss follows deployment guide**
   - See: `DEPLOY_TO_SHAREPOINT.md`
   - Steps: Create lists → Upload package → Approve permissions → Add to page

---

## Troubleshooting

### Problem: "command not found: gulp"

**Solution:** Use `npx gulp` instead of `gulp`

### Problem: Build errors about missing modules

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Problem: TypeScript errors

**Solution:** Clean and rebuild
```bash
npx gulp clean
npx gulp bundle --ship
```

---

## What Changed from Original Project

### Technology Changes
- ✅ React 18.3.1 → React 17.0.1 (SPFx requirement)
- ✅ Vite build system → Gulp + Webpack (SPFx requirement)
- ✅ localStorage → SharePointService (REST API)
- ✅ pnpm → npm (SPFx standard)

### Code Changes
- ✅ `App.tsx` → `ProductOwnerPortal.tsx` (SPFx pattern)
- ✅ Added SharePointService for SharePoint Lists integration
- ✅ All components use async data loading
- ✅ Props interface updated to pass SPFx context
- ✅ Loading states added for async operations

### Configuration
- ✅ API permissions configured (SharePoint User.ReadWrite.All)
- ✅ Package metadata updated (APH branding)
- ✅ Build output configured for `.sppkg` generation

---

## Support

For technical questions about the build process:
- Check `DEPLOY_TO_SHAREPOINT.md` for deployment help
- Review `src/services/SharePointService.ts` for data layer logic
- Inspect `src/webparts/productOwnerPortal/ProductOwnerPortal.tsx` for main app logic

---

**Ready to build when Node 22 is installed!**
