#!/bin/bash

################################################################################
# Script de Configuración de S3 + CloudFront para Frontend
# 
# Este script crea y configura:
# - S3 bucket para hosting estático
# - CloudFront distribution con SSL
# - Route 53 DNS records
# - Certificados SSL (ACM)
#
# Uso: ./setup-s3-cloudfront.sh <environment>
# Ejemplo: ./setup-s3-cloudfront.sh production
################################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar argumento de entorno
if [ -z "$1" ]; then
    error "Uso: $0 <environment> (qa|staging|production)"
fi

ENVIRONMENT=$1
AWS_REGION="us-east-1"

# Validar entorno
if [[ ! "$ENVIRONMENT" =~ ^(qa|staging|production)$ ]]; then
    error "Entorno inválido. Usa: qa, staging, o production"
fi

log "Configurando S3 + CloudFront para entorno: ${BLUE}$ENVIRONMENT${NC}"

# Solicitar información necesaria
read -p "Ingresa tu AWS Account ID: " AWS_ACCOUNT_ID
read -p "Ingresa el nombre del dominio (ej: kata.lab.com): " DOMAIN_NAME
read -p "Ingresa el Hosted Zone ID de Route 53: " HOSTED_ZONE_ID

# Variables derivadas
BUCKET_NAME="kata-frontend-${ENVIRONMENT}"
CLOUDFRONT_COMMENT="Kata Frontend - ${ENVIRONMENT}"

################################################################################
# 1. CREAR S3 BUCKET
################################################################################

log "Paso 1: Creando S3 bucket ${BLUE}${BUCKET_NAME}${NC}..."

if aws s3 ls "s3://${BUCKET_NAME}" 2>/dev/null; then
    warning "El bucket ${BUCKET_NAME} ya existe. Saltando creación."
else
    aws s3api create-bucket \
        --bucket "${BUCKET_NAME}" \
        --region "${AWS_REGION}" \
        --acl private
    
    log "Bucket creado exitosamente"
fi

# Habilitar versionado
log "Habilitando versionado en el bucket..."
aws s3api put-bucket-versioning \
    --bucket "${BUCKET_NAME}" \
    --versioning-configuration Status=Enabled

# Configurar encriptación
log "Configurando encriptación en el bucket..."
aws s3api put-bucket-encryption \
    --bucket "${BUCKET_NAME}" \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            },
            "BucketKeyEnabled": true
        }]
    }'

# Bloquear acceso público
log "Bloqueando acceso público..."
aws s3api put-public-access-block \
    --bucket "${BUCKET_NAME}" \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

################################################################################
# 2. CREAR CLOUDFRONT ORIGIN ACCESS IDENTITY (OAI)
################################################################################

log "Paso 2: Creando CloudFront Origin Access Identity..."

OAI_ID=$(aws cloudfront create-cloud-front-origin-access-identity \
    --cloud-front-origin-access-identity-config \
        "CallerReference=kata-frontend-${ENVIRONMENT}-$(date +%s),Comment=${CLOUDFRONT_COMMENT}" \
    --query 'CloudFrontOriginAccessIdentity.Id' \
    --output text 2>/dev/null || echo "")

if [ -z "$OAI_ID" ]; then
    # Intentar obtener OAI existente
    OAI_ID=$(aws cloudfront list-cloud-front-origin-access-identities \
        --query "CloudFrontOriginAccessIdentityList.Items[?Comment=='${CLOUDFRONT_COMMENT}'].Id | [0]" \
        --output text)
    
    if [ -z "$OAI_ID" ]; then
        error "No se pudo crear ni encontrar OAI"
    fi
    warning "Usando OAI existente: ${OAI_ID}"
else
    log "OAI creado: ${OAI_ID}"
fi

################################################################################
# 3. CREAR BUCKET POLICY PARA CLOUDFRONT
################################################################################

log "Paso 3: Configurando bucket policy para CloudFront..."

BUCKET_POLICY=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudFrontAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${OAI_ID}"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
)

echo "$BUCKET_POLICY" > /tmp/bucket-policy.json
aws s3api put-bucket-policy \
    --bucket "${BUCKET_NAME}" \
    --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json

log "Bucket policy configurada"

################################################################################
# 4. CREAR CERTIFICADO SSL (OPCIONAL)
################################################################################

log "Paso 4: Certificado SSL..."
echo -e "${YELLOW}NOTA:${NC} Debes crear un certificado SSL en ACM (us-east-1) para: ${DOMAIN_NAME}"
echo "Si ya tienes un certificado, ingresa su ARN. Si no, presiona Enter para continuar sin SSL."
read -p "ARN del certificado ACM (opcional): " CERTIFICATE_ARN

################################################################################
# 5. CREAR CLOUDFRONT DISTRIBUTION
################################################################################

log "Paso 5: Creando CloudFront distribution..."

# Configuración base de CloudFront
CLOUDFRONT_CONFIG=$(cat <<EOF
{
    "CallerReference": "kata-frontend-${ENVIRONMENT}-$(date +%s)",
    "Comment": "${CLOUDFRONT_COMMENT}",
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-${BUCKET_NAME}",
                "DomainName": "${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/${OAI_ID}"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-${BUCKET_NAME}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "Compress": true,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "PriceClass": "PriceClass_100"
}
EOF
)

# Agregar certificado si existe
if [ -n "$CERTIFICATE_ARN" ]; then
    CLOUDFRONT_CONFIG=$(echo "$CLOUDFRONT_CONFIG" | jq --arg cert "$CERTIFICATE_ARN" --arg domain "$DOMAIN_NAME" \
        '.ViewerCertificate = {
            "ACMCertificateArn": $cert,
            "SSLSupportMethod": "sni-only",
            "MinimumProtocolVersion": "TLSv1.2_2021"
        } | .Aliases = {
            "Quantity": 1,
            "Items": [$domain]
        }')
else
    CLOUDFRONT_CONFIG=$(echo "$CLOUDFRONT_CONFIG" | jq \
        '.ViewerCertificate = {
            "CloudFrontDefaultCertificate": true
        }')
fi

echo "$CLOUDFRONT_CONFIG" > /tmp/cloudfront-config.json
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text 2>/dev/null || echo "")

rm /tmp/cloudfront-config.json

if [ -z "$DISTRIBUTION_ID" ]; then
    error "No se pudo crear la distribución de CloudFront"
fi

log "CloudFront distribution creada: ${BLUE}${DISTRIBUTION_ID}${NC}"

# Obtener el dominio de CloudFront
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id "${DISTRIBUTION_ID}" \
    --query 'Distribution.DomainName' \
    --output text)

log "CloudFront Domain: ${BLUE}${CLOUDFRONT_DOMAIN}${NC}"

################################################################################
# 6. CONFIGURAR ROUTE 53 (OPCIONAL)
################################################################################

if [ -n "$CERTIFICATE_ARN" ] && [ -n "$HOSTED_ZONE_ID" ]; then
    log "Paso 6: Configurando Route 53..."
    
    ROUTE53_CHANGE=$(cat <<EOF
{
    "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "${DOMAIN_NAME}",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": "Z2FDTNDATAQYW2",
                "DNSName": "${CLOUDFRONT_DOMAIN}",
                "EvaluateTargetHealth": false
            }
        }
    }]
}
EOF
)
    
    echo "$ROUTE53_CHANGE" > /tmp/route53-change.json
    aws route53 change-resource-record-sets \
        --hosted-zone-id "${HOSTED_ZONE_ID}" \
        --change-batch file:///tmp/route53-change.json
    rm /tmp/route53-change.json
    
    log "Route 53 configurado para ${DOMAIN_NAME}"
else
    warning "Saltando configuración de Route 53 (no se proporcionó certificado o Hosted Zone ID)"
fi

################################################################################
# 7. GUARDAR CONFIGURACIÓN
################################################################################

log "Paso 7: Guardando configuración..."

cat > ".env.${ENVIRONMENT}" <<EOF
# AWS S3 + CloudFront Configuration
AWS_REGION=${AWS_REGION}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
S3_BUCKET=${BUCKET_NAME}
CLOUDFRONT_DISTRIBUTION_ID=${DISTRIBUTION_ID}
CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}
ENVIRONMENT=${ENVIRONMENT}
EOF

log "Configuración guardada en ${BLUE}.env.${ENVIRONMENT}${NC}"

################################################################################
# RESUMEN
################################################################################

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           CONFIGURACIÓN COMPLETADA EXITOSAMENTE           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Entorno:${NC}              ${ENVIRONMENT}"
echo -e "  ${BLUE}S3 Bucket:${NC}            s3://${BUCKET_NAME}"
echo -e "  ${BLUE}CloudFront ID:${NC}        ${DISTRIBUTION_ID}"
echo -e "  ${BLUE}CloudFront Domain:${NC}    https://${CLOUDFRONT_DOMAIN}"
if [ -n "$CERTIFICATE_ARN" ]; then
    echo -e "  ${BLUE}Custom Domain:${NC}        https://${DOMAIN_NAME}"
fi
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Actualiza tu buildspec.yml con estas variables:"
echo "     S3_BUCKET=${BUCKET_NAME}"
echo "     CLOUDFRONT_DISTRIBUTION_ID=${DISTRIBUTION_ID}"
echo ""
echo "  2. Configura las variables de entorno en CodeBuild"
echo ""
echo "  3. Haz un deploy para verificar:"
echo "     npm run build"
echo "     aws s3 sync dist/ s3://${BUCKET_NAME}/"
echo "     aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths '/*'"
echo ""

log "Script completado exitosamente 🚀"
