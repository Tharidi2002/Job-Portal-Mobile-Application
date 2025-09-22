# Meal Mate Android Build Helper for Windows

# Function to display colored output
function Write-Color {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Text,
        [Parameter(Mandatory=$false)]
        [string]$Color = "White"
    )
    
    Write-Host $Text -ForegroundColor $Color
}

# Display header
Write-Color "========================================" -Color Cyan
Write-Color "   Meal Mate Android Build Helper       " -Color Cyan
Write-Color "========================================" -Color Cyan
Write-Host ""

# Check if eas-cli is installed
$easInstalled = $null
try {
    $easInstalled = Get-Command eas -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if ($null -eq $easInstalled) {
    Write-Color "eas-cli not found, installing..." -Color Yellow
    npm install -g eas-cli
} else {
    Write-Color "✓ eas-cli is installed" -Color Green
}

# Check if logged in to EAS
Write-Color "Checking EAS login status..." -Color Yellow
$easLoginStatus = $null
try {
    $easLoginStatus = eas whoami
} catch {
    # Not logged in
}

if ($null -eq $easLoginStatus) {
    Write-Color "Please log in to EAS:" -Color Yellow
    eas login
} else {
    Write-Color "✓ Logged in to EAS" -Color Green
}

# Clean up existing files
Write-Color "Cleaning up old build files..." -Color Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "yarn.lock" -Force -ErrorAction SilentlyContinue

# Check for the downgraded package.json
if (Test-Path "package.json.downgraded") {
    Write-Color "Downgraded package.json found. Would you like to use it? (y/n)" -Color Yellow
    $useDowngraded = Read-Host
    
    if ($useDowngraded -eq "y") {
        Write-Color "Backing up current package.json and using downgraded version..." -Color Yellow
        Copy-Item -Path "package.json" -Destination "package.json.backup" -Force
        Copy-Item -Path "package.json.downgraded" -Destination "package.json" -Force
        Write-Color "✓ Using downgraded package.json" -Color Green
    }
}

# Create or update .npmrc file
Write-Color "Creating .npmrc file..." -Color Yellow
Set-Content -Path ".npmrc" -Value "engine-strict=false`nlegacy-peer-deps=true"
Write-Color "✓ Created .npmrc file" -Color Green

# Install dependencies
Write-Color "Installing dependencies with legacy-peer-deps..." -Color Yellow
npm install --legacy-peer-deps
Write-Color "✓ Dependencies installed" -Color Green

# Configure build profile
Write-Color "Would you like to check/update the EAS build configuration? (y/n)" -Color Yellow
$updateConfig = Read-Host

if ($updateConfig -eq "y") {
    Write-Color "Opening eas.json for editing..." -Color Yellow
    notepad.exe eas.json
}

# Start the build
Write-Color "Starting EAS build..." -Color Yellow
Write-Color "This will build an APK file that can be installed on Android devices." -Color Cyan
Write-Color "The build will happen on Expo's servers and may take some time." -Color Cyan
Write-Host ""
Write-Color "Press Enter to continue or Ctrl+C to cancel..." -Color Yellow
Read-Host

eas build --platform android --profile production

Write-Color "Build process has been started!" -Color Green
Write-Color "You can monitor the build status on the Expo website." -Color Green