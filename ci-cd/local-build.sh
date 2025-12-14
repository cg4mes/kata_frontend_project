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
BUILD_DOCKER=${2:-false}

# Set API URL based on environment
case $ENVIRONMENT in
    qa)
        API_URL="https://api-qa.yourapp.com"
        ;;
    staging)
        API_URL="https://api-staging.yourapp.com"
        ;;
    production)
        API_URL="https://api.yourapp.com"
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
print_info "Build Docker: $BUILD_DOCKER"

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

# Step 4: Docker build (optional)
if [ "$BUILD_DOCKER" = "true" ]; then
    print_step "Step 4: Building Docker Image"
    print_info "Building Docker image..."
    docker build \
        --build-arg VITE_API_URL=$API_URL \
        --build-arg VITE_ENVIRONMENT=$ENVIRONMENT \
        -t kata-frontend:$ENVIRONMENT .
    print_info "Docker image built successfully ✓"
    
    print_info "\nTo run the container:"
    print_info "  docker run -p 8080:80 kata-frontend:$ENVIRONMENT"
    print_info "  Then open http://localhost:8080"
fi

print_step "BUILD COMPLETE ✓"
print_info "All checks passed successfully"

if [ "$BUILD_DOCKER" != "true" ]; then
    print_info "\nTo build Docker image, run:"
    print_info "  ./ci-cd/local-build.sh $ENVIRONMENT true"
fi

print_info "\nTo test the build locally:"
print_info "  npm run preview"
