# APH Product Owner Portal - SharePoint Deployment Guide

This guide shows you how to deploy the Product Owner Portal to SharePoint in 3 simple steps.

---

## What You're Deploying

**APH Product Owner Portal** - An adaptive learning platform with 34 micro-learning modules, personalized onboarding paths, and progress tracking. All user data is stored in SharePoint Lists.

---

## Prerequisites

Before you start, make sure you have:
- SharePoint Admin access to your tenant
- PowerShell installed on your computer
- The `.sppkg` file from the `sharepoint/solution/` folder

---

## Step 1: Create SharePoint Lists (One-Time Setup)

The portal stores user data in 3 SharePoint Lists. Run this PowerShell script to create them:

### Option A: Automatic Setup (Recommended)

1. Open PowerShell
2. Navigate to the project folder:
   ```powershell
   cd path\to\aph-product-owner-portal
   ```

3. Run the setup script:
   ```powershell
   .\setup-sharepoint-lists.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/yoursite"
   ```

4. When prompted, sign in with your SharePoint credentials
5. Wait for the script to complete (~30 seconds)

### Option B: Manual Setup

If you prefer to create the lists manually through SharePoint UI:

1. Go to your SharePoint site
2. Click **New** → **List** three times to create:
   - **User Profiles** (stores assessment results)
   - **User Progress** (tracks module completion)
   - **Module Responses** (optional analytics)

3. Add columns as specified in `setup-sharepoint-lists.ps1`

---

## Step 2: Upload Package to App Catalog

1. Open SharePoint Admin Center:
   - Go to https://yourtenant-admin.sharepoint.com

2. Navigate to **More features** → **Apps** → **Open**

3. Click **App Catalog**
   - If you don't have an App Catalog, click **Create a new app catalog site** first

4. Click **Apps for SharePoint** in the left menu

5. Drag and drop the file:
   ```
   sharepoint/solution/aph-product-owner-portal.sppkg
   ```

6. When the dialog appears:
   - ✅ Check **"Make this solution available to all sites in the organization"**
   - Click **Deploy**

7. Wait for "Deployment Successful" message

---

## Step 3: Grant API Permissions

The portal needs permission to read/write SharePoint Lists for user data.

1. In SharePoint Admin Center, go to **Advanced** → **API access**

2. Find the pending request:
   ```
   Resource: SharePoint
   Permission: User.ReadWrite.All
   ```

3. Click the request and click **Approve**

4. Confirm the approval

---

## Step 4: Add Portal to SharePoint Page

1. Navigate to the SharePoint site where you want the portal

2. Go to **Site Contents** → **Add an app**

3. Search for **"APH Product Owner Portal"**

4. Click **Add** to install the app to your site

5. Create a new page or edit an existing page

6. Click **+ Add a web part**

7. Search for **"ProductOwnerPortal"**

8. Add the web part to the page

9. Click **Publish**

**Done!** The portal is now live on your SharePoint site.

---

## Testing the Deployment

1. Visit the SharePoint page with the portal

2. You should see the assessment screen (first-time visit)

3. Complete the 3-question assessment

4. Verify your progress is saved:
   - Go to **Site Contents** → **User Profiles** list
   - You should see your entry

5. Complete a module and check:
   - Go to **Site Contents** → **User Progress** list
   - Your completed modules should be listed

---

## Updating the Portal

When you receive an updated `.sppkg` file:

1. Go to App Catalog (same as Step 2)

2. Drag and drop the new `.sppkg` file

3. When prompted, click **Replace**

4. All pages using the portal will automatically update (may need browser refresh)

---

## Troubleshooting

### Problem: "Access Denied" when using the portal

**Solution:** Make sure API permissions were approved in Step 3.

1. Go to SharePoint Admin Center → Advanced → API access
2. Check if "User.ReadWrite.All" is approved
3. If still pending, click Approve

### Problem: Web part doesn't appear in the list

**Solution:** The app may not be installed on the site.

1. Go to Site Contents
2. Click "Add an app"
3. Search for "APH Product Owner Portal"
4. Click Add

### Problem: Portal shows "Loading..." forever

**Solution:** Check browser console for errors.

1. Press F12 to open developer tools
2. Check the Console tab for errors
3. Common issues:
   - SharePoint Lists not created → Run `setup-sharepoint-lists.ps1` again
   - API permissions not approved → See Step 3

### Problem: Data not saving

**Solution:** Verify SharePoint Lists exist and have correct columns.

1. Go to Site Contents
2. Check for:
   - User Profiles
   - User Progress
3. Open each list and verify columns match the PowerShell script

---

## Support

For technical support, contact:
- **Email:** governance@aph.gov
- **Office Hours:** Tuesdays 2-3 PM

---

**Built with ❤️ for Austin Public Health**
