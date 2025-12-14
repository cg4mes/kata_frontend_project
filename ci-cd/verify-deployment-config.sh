#!/bin/bash

###############################################################################
# Script para verificar configuración de deployment - Frontend
# Verifica que todos los valores placeholder hayan sido reemplazados
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

check_placeholder() {
    local file=$1
    local placeholder=$2
    local description=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ ! -f "$file" ]; then
        print_error "Archivo no encontrado: $file"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return
    fi
    
    if grep -q "$placeholder" "$file"; then
        print_error "$description en $file"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    else
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    fi
}

check_file_exists() {
    local file=$1
    local description=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ]; then
        print_success "$description existe"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_error "$description no encontrado: $file"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

check_executable() {
    local file=$1
    local description=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -x "$file" ]; then
        print_success "$description es ejecutable"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_warning "$description no es ejecutable"
        WARNINGS=$((WARNINGS + 1))
        print_info "Ejecuta: chmod +x $file"
    fi
}

print_header "KATA FRONTEND - VERIFICACIÓN DE DEPLOYMENT"

# 1. Verificar archivos requeridos
print_header "1. Verificando Archivos Requeridos"

check_file_exists "buildspec.yml" "BuildSpec Production"
check_file_exists "pipeline/buildspecs/buildspec.qa.yml" "BuildSpec QA"
check_file_exists "pipeline/buildspecs/buildspec.staging.yml" "BuildSpec Staging"
check_file_exists "ci-cd/deploy.sh" "Deploy Script"
check_file_exists "ci-cd/install-dependencies.sh" "Install Script"
check_file_exists "ci-cd/local-build.sh" "Local Build Script"
check_file_exists "setup-s3-cloudfront.sh" "S3 CloudFront Setup Script"

# 2. Verificar placeholders CloudFront Distribution IDs
print_header "2. Verificando Placeholders de CloudFront"

check_placeholder "buildspec.yml" "CLOUDFRONT_DISTRIBUTION_ID" "CloudFront Distribution ID en buildspec.yml"
check_placeholder "pipeline/buildspecs/buildspec.qa.yml" "QA_CLOUDFRONT_DISTRIBUTION_ID" "CloudFront Distribution ID en buildspec.qa.yml"
check_placeholder "pipeline/buildspecs/buildspec.staging.yml" "STAGING_CLOUDFRONT_DISTRIBUTION_ID" "CloudFront Distribution ID en buildspec.staging.yml"
check_placeholder ".github/workflows/deploy-production.yml" "PRODUCTION_DISTRIBUTION_ID" "CloudFront Distribution ID en deploy-production.yml"
check_placeholder ".github/workflows/deploy-qa.yml" "QA_DISTRIBUTION_ID" "CloudFront Distribution ID en deploy-qa.yml"
check_placeholder ".github/workflows/deploy-staging.yml" "STAGING_DISTRIBUTION_ID" "CloudFront Distribution ID en deploy-staging.yml"

# 3. Verificar placeholders API URLs
print_header "3. Verificando Placeholders de API URLs"

check_placeholder "buildspec.yml" "https://api.appKata.com" "API URL en buildspec.yml"
check_placeholder "pipeline/buildspecs/buildspec.qa.yml" "https://api-qa.appKata.com" "API URL QA en buildspec.qa.yml"
check_placeholder "pipeline/buildspecs/buildspec.staging.yml" "https://api-staging.appKata.com" "API URL Staging en buildspec.staging.yml"
check_placeholder ".env.qa" "https://api-qa.appKata.com" "API URL en .env.qa"
check_placeholder ".env.staging" "https://api-staging.appKata.com" "API URL en .env.staging"
check_placeholder ".env.production" "https://api.appKata.com" "API URL en .env.production"

# 4. Verificar permisos de scripts
print_header "4. Verificando Permisos de Scripts"

check_executable "ci-cd/deploy.sh" "deploy.sh"
check_executable "ci-cd/install-dependencies.sh" "install-dependencies.sh"
check_executable "ci-cd/local-build.sh" "local-build.sh"

# 5. Verificar AWS CLI
print_header "6. Verificando AWS CLI"

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if command -v aws &> /dev/null; then
    print_success "AWS CLI está instalado"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    aws --version
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if aws sts get-caller-identity &> /dev/null; then
        print_success "AWS CLI está configurado correctamente"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        print_5nfo "AWS Account ID: $AWS_ACCOUNT"
    else
        print_warning "AWS CLI no está configurado (ejecuta: aws configure)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_error "AWS CLI no está instalado"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# 7. Verificar Node.js
print_header "7. Verificando Node.js"

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
    
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_success "Node.js versión adecuada: $NODE_VERSION"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_warning "Node.js versión $NODE_VERSION (se recomienda v18+)"
  6. Verificar Node.js
print_header "6
else
    print_error "Node.js no está instalado"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# 8. Verificar dependencias del proyecto
print_header "8. Verificando Dependencias del Proyecto"

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -d "node_modules" ]; then
    print_success "node_modules existe"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    print_warning "node_modules no existe (ejecuta: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi

check_file_exists "package.json" "package.json"
ch7. Verificar dependencias del proyecto
print_header "7
# 8. Verificar archivos de configuración de ambiente
print_header "8. Verificando Archivos de Ambiente"

check_file_exists ".env.qa" ".env.qa"
check_file_exists ".env.staging" ".env.staging"
check_file_exists ".env.production" ".env.production"
check_file_exists ".env.example" ".env.example"

# 9. Verificar configuración Vite
print_header "9. Verificando Configuración Vite"

check_file_exists "vite.config.ts" "Vite Config"
check_file_exists "index.html" "index.html"

# Resumen
print_header "RESUMEN"

echo "Total de verificaciones: $TOTAL_CHECKS"
print_success "Pasadas: $PASSED_CHECKS"
print_warning "Advertencias: $WARNINGS"
print_error "Fallidas: $FAILED_CHECKS"

echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    print_success "✓ Todas las verificaciones críticas pasaron"
    echo ""
    print_info "Siguiente paso: Revisar y actualizar los valores en:"
    echo "  1. CloudFront Distribution IDs en buildspecs y workflows"
    echo "  2. API URLs (appKata.com) en buildspecs y archivos .env.*"
    echo "  3. Archivos .env.* con valores reales de tu backend"
    echo "  4. Configurar infraestructura S3 + CloudFront (ejecuta ./setup-s3-cloudfront.sh)"
    echo ""
    print_info "Luego puedes hacer un build local:"
    echo "  ./ci-cd/local-build.sh qa"
    echo ""
    exit 0
else
    print_error "✗ Hay $FAILED_CHECKS verificación(es) fallida(s)"
    echo ""
    print_info "Por favor, revisa los errores arriba y corrígelos antes de deployar"
    echo ""
    exit 1
fi
