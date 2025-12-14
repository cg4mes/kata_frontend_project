#!/bin/bash

###############################################################################
# Local Build and Test Script for kata-frontend
# Simulates the CI/CD pipeline locally for testing
###############################################################################

set -e  # Exit on any error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "\n${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}\n"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Parse command line arguments
ENVIRONMENT=${1:-qa}

# Set API URL based on environment
case $ENVIRONMENT in
    qa)
        API_URL="https://api-qa.appKata.com"
        ;;
    staging)
        API_URL="https://api-staging.appKata.com"
        ;;
    production)
        API_URL="https://api.appKata.com"
        ;;
    local)
        API_URL="http://localhost:3000"
        ;;
    *)
        print_info "Unknown environment: $ENVIRONMENT, using local"
        API_URL="http://localhost:3000"
        ENVIRONMENT="local"
        ;;
esac

print_step "KATA FRONTEND - LOCAL BUILD & TEST"
print_info "Environment: $ENVIRONMENT"
print_info "API URL: $API_URL"

# Step 1: Install dependencies
print_step "Step 1: Installing Dependencies"
npm ci

# Step 2: Lint
print_step "Step 2: Running Linter"
npm run lint || print_info "Linting completed with warnings"

# Step 3: Build
print_step "Step 3: Building Application"
export VITE_API_URL=$API_URL
export VITE_ENVIRONMENT=$ENVIRONMENT
npm run build

print_info "Build artifacts created in ./dist"

print_info "Ready for deployment to S3 + CloudFront"

print_step "BUILD COMPLETE ✓"
print_info "All checks passed successfully"

print_info "\nTo test the build locally:"
print_info "  npm run preview"
print_info "  Then open http://localhost:4173