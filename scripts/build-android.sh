#!/bin/bash

# Function to display colored output
function echo_color() {
  case $1 in
    "red") color="\033[0;31m" ;;
    "green") color="\033[0;32m" ;;
    "yellow") color="\033[0;33m" ;;
    "blue") color="\033[0;34m" ;;
    *) color="\033[0m" ;;
  esac
  echo -e "${color}$2\033[0m"
}

# Display header
echo_color "blue" "========================================"
echo_color "blue" "   Meal Mate Android Build Helper       "
echo_color "blue" "========================================"
echo ""

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo_color "yellow" "eas-cli not found, installing..."
    npm install -g eas-cli
else
    echo_color "green" "✓ eas-cli is installed"
fi

# Check if logged in to EAS
echo_color "yellow" "Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo_color "yellow" "Please log in to EAS:"
    eas login
else
    echo_color "green" "✓ Logged in to EAS"
fi

# Clean up existing files
echo_color "yellow" "Cleaning up old build files..."
rm -rf node_modules package-lock.json yarn.lock

# Check for the downgraded package.json
if [ -f "package.json.downgraded" ]; then
    echo_color "yellow" "Downgraded package.json found. Would you like to use it? (y/n)"
    read use_downgraded
    
    if [[ $use_downgraded == "y" ]]; then
        echo_color "yellow" "Backing up current package.json and using downgraded version..."
        cp package.json package.json.backup
        cp package.json.downgraded package.json
        echo_color "green" "✓ Using downgraded package.json"
    fi
fi

# Create or update .npmrc file
echo_color "yellow" "Creating .npmrc file..."
cat > .npmrc << EOL
engine-strict=false
legacy-peer-deps=true
EOL
echo_color "green" "✓ Created .npmrc file"

# Install dependencies
echo_color "yellow" "Installing dependencies with legacy-peer-deps..."
npm install --legacy-peer-deps
echo_color "green" "✓ Dependencies installed"

# Configure build profile
echo_color "yellow" "Would you like to check/update the EAS build configuration? (y/n)"
read update_config

if [[ $update_config == "y" ]]; then
    echo_color "yellow" "Opening eas.json for editing..."
    if command -v nano &> /dev/null; then
        nano eas.json
    else
        echo_color "yellow" "Nano not found. Please manually update eas.json if needed."
    fi
fi

# Start the build
echo_color "yellow" "Starting EAS build..."
echo_color "blue" "This will build an APK file that can be installed on Android devices."
echo_color "blue" "The build will happen on Expo's servers and may take some time."
echo ""
echo_color "yellow" "Press Enter to continue or Ctrl+C to cancel..."
read

eas build --platform android --profile production

echo_color "green" "Build process has been started!"
echo_color "green" "You can monitor the build status on the Expo website."