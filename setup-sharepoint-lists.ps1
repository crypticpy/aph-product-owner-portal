# ============================================================================
# APH Product Owner Portal - SharePoint Lists Setup Script
# ============================================================================
# This script creates the required SharePoint Lists for the portal.
# Run this ONCE before deploying the web part.
#
# Prerequisites:
# - PnP PowerShell module installed: Install-Module PnP.PowerShell -Scope CurrentUser
# - SharePoint admin or site owner permissions
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl
)

# Connect to SharePoint site
Write-Host "Connecting to SharePoint site: $SiteUrl" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

# ============================================================================
# List 1: User Profiles
# Stores assessment results (one item per user)
# ============================================================================
Write-Host "`nCreating 'User Profiles' list..." -ForegroundColor Yellow

$userProfilesList = Get-PnPList -Identity "User Profiles" -ErrorAction SilentlyContinue
if ($null -eq $userProfilesList) {
    New-PnPList -Title "User Profiles" -Template GenericList -OnQuickLaunch:$false
    Write-Host "✓ List created" -ForegroundColor Green

    # Add custom columns
    Add-PnPField -List "User Profiles" -DisplayName "ExperienceLevel" -InternalName "ExperienceLevel" -Type Choice -Choices @("new","experienced","somewhat") -Required
    Add-PnPField -List "User Profiles" -DisplayName "GovernanceTier" -InternalName "GovernanceTier" -Type Choice -Choices @("tier1-2","tier3-4","not-sure") -Required
    Add-PnPField -List "User Profiles" -DisplayName "TimeCommitment" -InternalName "TimeCommitment" -Type Choice -Choices @("less-than-1","1-to-3","more-than-3") -Required
    Add-PnPField -List "User Profiles" -DisplayName "LearningPath" -InternalName "LearningPath" -Type Choice -Choices @("express","standard","comprehensive") -Required
    Add-PnPField -List "User Profiles" -DisplayName "CompletedAt" -InternalName "CompletedAt" -Type DateTime -Required

    Write-Host "✓ Columns added" -ForegroundColor Green

    # Disable attachments
    Set-PnPList -Identity "User Profiles" -EnableAttachments $false
    Write-Host "✓ Attachments disabled" -ForegroundColor Green
} else {
    Write-Host "⚠ List already exists - skipping" -ForegroundColor DarkYellow
}

# ============================================================================
# List 2: User Progress
# Stores module completion tracking (one item per user)
# ============================================================================
Write-Host "`nCreating 'User Progress' list..." -ForegroundColor Yellow

$userProgressList = Get-PnPList -Identity "User Progress" -ErrorAction SilentlyContinue
if ($null -eq $userProgressList) {
    New-PnPList -Title "User Progress" -Template GenericList -OnQuickLaunch:$false
    Write-Host "✓ List created" -ForegroundColor Green

    # Add custom columns
    Add-PnPField -List "User Progress" -DisplayName "CompletedModules" -InternalName "CompletedModules" -Type Note -Required
    Add-PnPField -List "User Progress" -DisplayName "BookmarkedModules" -InternalName "BookmarkedModules" -Type Note -Required
    Add-PnPField -List "User Progress" -DisplayName "CurrentModule" -InternalName "CurrentModule" -Type Text
    Add-PnPField -List "User Progress" -DisplayName "LastVisited" -InternalName "LastVisited" -Type DateTime -Required
    Add-PnPField -List "User Progress" -DisplayName "TotalTimeSpent" -InternalName "TotalTimeSpent" -Type Number -Required

    Write-Host "✓ Columns added" -ForegroundColor Green

    # Disable attachments
    Set-PnPList -Identity "User Progress" -EnableAttachments $false
    Write-Host "✓ Attachments disabled" -ForegroundColor Green
} else {
    Write-Host "⚠ List already exists - skipping" -ForegroundColor DarkYellow
}

# ============================================================================
# List 3: Module Responses (Optional - for analytics)
# Stores individual quiz responses
# ============================================================================
Write-Host "`nCreating 'Module Responses' list (optional)..." -ForegroundColor Yellow

$moduleResponsesList = Get-PnPList -Identity "Module Responses" -ErrorAction SilentlyContinue
if ($null -eq $moduleResponsesList) {
    New-PnPList -Title "Module Responses" -Template GenericList -OnQuickLaunch:$false
    Write-Host "✓ List created" -ForegroundColor Green

    # Add custom columns
    Add-PnPField -List "Module Responses" -DisplayName "UserEmail" -InternalName "UserEmail" -Type Text -Required
    Add-PnPField -List "Module Responses" -DisplayName "ModuleId" -InternalName "ModuleId" -Type Text -Required
    Add-PnPField -List "Module Responses" -DisplayName "QuizAnswer" -InternalName "QuizAnswer" -Type Number -Required
    Add-PnPField -List "Module Responses" -DisplayName "IsCorrect" -InternalName "IsCorrect" -Type Boolean -Required
    Add-PnPField -List "Module Responses" -DisplayName "CompletedAt" -InternalName "CompletedAt" -Type DateTime -Required

    Write-Host "✓ Columns added" -ForegroundColor Green

    # Disable attachments
    Set-PnPList -Identity "Module Responses" -EnableAttachments $false
    Write-Host "✓ Attachments disabled" -ForegroundColor Green
} else {
    Write-Host "⚠ List already exists - skipping" -ForegroundColor DarkYellow
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "SharePoint Lists Setup Complete!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created Lists:" -ForegroundColor White
Write-Host "  1. User Profiles  - Stores assessment results" -ForegroundColor Gray
Write-Host "  2. User Progress   - Tracks module completion" -ForegroundColor Gray
Write-Host "  3. Module Responses - Stores quiz responses (optional)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "  1. Deploy the .sppkg package to App Catalog" -ForegroundColor Gray
Write-Host "  2. Approve API permissions in SharePoint Admin Center" -ForegroundColor Gray
Write-Host "  3. Add the web part to a SharePoint page" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan

# Disconnect
Disconnect-PnPOnline
