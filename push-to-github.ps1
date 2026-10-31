# Push to GitHub — One-time setup script
# Run this in PowerShell from the exp5 folder AFTER creating the GitHub repo

# Step 1: Go to https://github.com/new
# Step 2: Repository name: techfest-2026-portal
# Step 3: Set to Public (or Private), DO NOT initialize with README
# Step 4: Click "Create repository"
# Step 5: Run the commands below:

Set-Location "C:\Users\sayoo\Dropbox\PC\Downloads\exp5"
git remote add origin https://github.com/sayooj/techfest-2026-portal.git
git push -u origin main

Write-Host "`n[DONE] Your TechFest 2026 Portal is now on GitHub!" -ForegroundColor Green
Write-Host "GitHub Actions CI will now run automatically on every push." -ForegroundColor Cyan
