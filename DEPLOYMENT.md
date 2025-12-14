# Kata Frontend - Deployment Guide

Guía completa para desplegar el frontend de Kata a ambientes QA, Staging y Production en AWS ECS/Fargate.

## 📋 Arquitectura

```
Usuario → Route53 → ALB → ECS Fargate (Nginx + React App) → Backend API
```

## 🔧 Requisitos Previos

- AWS CLI configurado
- Docker instalado
- Node.js v18+
- Acceso a AWS con permisos necesarios

## ☁️ Infraestructura AWS

### 1. Configuración de Red (VPC)

El frontend comparte la VPC con el backend. Si ya creaste la VPC para el backend, sáltate este paso.

```bash
# Usar la misma VPC del backend
export VPC_ID=<VPC_ID_DEL_BACKEND>
export SUBNET_1=<SUBNET_ID_1>
export SUBNET_2=<SUBNET_ID_2>
```

### 2. Security Groups

```bash
# Crear Security Group para Frontend
aws ec2 create-security-group \
  --group-name kata-frontend-qa-ecs-sg \
  --description "Security group for Kata Frontend QA ECS tasks" \
  --vpc-id $VPC_ID

# Permitir tráfico HTTP
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

### 3. ECR Repository

```bash
# Crear repositorio ECR para frontend
aws ecr create-repository \
  --repository-name kata-frontend \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256
```

### 4. IAM Roles

```bash
# Task Execution Role
aws iam create-role \
  --role-name kata-frontend-ecs-execution-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name kata-frontend-ecs-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Task Role (para runtime, si necesitas acceso a S3, etc.)
aws iam create-role \
  --role-name kata-frontend-ecs-task-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

### 5. ECS Cluster

```bash
# Crear clusters por ambiente
aws ecs create-cluster --cluster-name kata-frontend-qa-cluster
aws ecs create-cluster --cluster-name kata-frontend-staging-cluster
aws ecs create-cluster --cluster-name kata-frontend-production-cluster
```

### 6. Application Load Balancer

```bash
# Crear ALB
aws elbv2 create-load-balancer \
  --name kata-frontend-qa-alb \
  --subnets $SUBNET_1 $SUBNET_2 \
  --security-groups <ALB_SG_ID> \
  --scheme internet-facing

# Crear Target Group
aws elbv2 create-target-group \
  --name kata-frontend-qa-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30

# Crear Listener
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<TG_ARN>
```

### 7. CloudWatch Logs

```bash
aws logs create-log-group --log-group-name /aws/ecs/kata-frontend-qa
aws logs create-log-group --log-group-name /aws/ecs/kata-frontend-staging
aws logs create-log-group --log-group-name /aws/ecs/kata-frontend-production

aws logs put-retention-policy --log-group-name /aws/ecs/kata-frontend-qa --retention-in-days 30
aws logs put-retention-policy --log-group-name /aws/ecs/kata-frontend-staging --retention-in-days 60
aws logs put-retention-policy --log-group-name /aws/ecs/kata-frontend-production --retention-in-days 90
```

## 🚀 Deployment

### Build Local (Testing)

```bash
# Build con configuración QA
./ci-cd/local-build.sh qa true

# Test local
docker run -p 8080:80 kata-frontend:qa
open http://localhost:8080
```

### Primer Deployment a QA

```bash
# 1. Actualizar AWS Account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
find . -type f \( -name "*.yml" -o -name "*.json" \) -exec sed -i '' "s/YOUR_AWS_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" {} +

# 2. Actualizar URLs de API en buildspecs
# Edita pipeline/buildspecs/buildspec.qa.yml y actualiza VITE_API_URL

# 3. Build y push imagen
npm run build
docker build --build-arg VITE_API_URL=https://api-qa.yourapp.com -t kata-frontend:qa .

aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag kata-frontend:qa $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0

# 4. Registrar task definition
sed "s|\${image_url}|$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0|g" \
  pipeline/service/task-definition.qa.json > /tmp/task-def-frontend-qa.json
aws ecs register-task-definition --cli-input-json file:///tmp/task-def-frontend-qa.json

# 5. Crear servicio ECS
aws ecs create-service \
  --cluster kata-frontend-qa-cluster \
  --service-name kata-frontend-qa-service \
  --task-definition kata-frontend-qa \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[<SG_ID>],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=<TG_ARN>,containerName=kata-frontend,containerPort=80
```

### Deployments Automatizados

```bash
# Hacer cambios
git checkout develop
# ... cambios ...
git commit -m "feat: nueva feature"

# Deploy
./ci-cd/deploy.sh
```

## 🔍 Verificación

```bash
# Estado del servicio
aws ecs describe-services --cluster kata-frontend-qa-cluster --services kata-frontend-qa-service

# Ver logs
aws logs tail /aws/ecs/kata-frontend-qa --follow

# Test health
ALB_DNS=$(aws elbv2 describe-load-balancers --names kata-frontend-qa-alb --query 'LoadBalancers[0].DNSName' --output text)
curl http://$ALB_DNS/health
```

## 🔐 Configuración SSL/TLS (Producción)

```bash
# 1. Solicitar certificado en ACM
aws acm request-certificate \
  --domain-name yourapp.com \
  --subject-alternative-names www.yourapp.com \
  --validation-method DNS

# 2. Crear listener HTTPS en ALB
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=<CERT_ARN> \
  --default-actions Type=forward,TargetGroupArn=<TG_ARN>

# 3. Configurar Route53
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://dns-change.json
```

## 📊 Monitoreo

### Métricas Clave
- Request Count
- Latency (p50, p95, p99)
- HTTP 4xx/5xx errors
- Healthy Host Count

### Alarmas CloudWatch

```bash
# Alta tasa de errores 5xx
aws cloudwatch put-metric-alarm \
  --alarm-name kata-frontend-qa-5xx-errors \
  --alarm-description "5xx errors > 10" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold

# Unhealthy targets
aws cloudwatch put-metric-alarm \
  --alarm-name kata-frontend-qa-unhealthy \
  --metric-name UnHealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold
```

## 🛠️ Troubleshooting

### Build falla

**Problema**: Error durante npm build  
**Solución**:
```bash
# Limpiar cache
rm -rf node_modules dist
npm ci
npm run build
```

### Container no inicia

**Problema**: Task stops inmediatamente  
**Solución**:
1. Ver logs en CloudWatch
2. Verificar health check endpoint: `curl http://container-ip/health`
3. Verificar que nginx está escuchando en puerto 80

### Health check falla

**Problema**: Target unhealthy en ALB  
**Solución**:
1. Verificar security group permite tráfico del ALB
2. Test health endpoint directamente
3. Verificar nginx.conf tiene location /health
4. Ver logs de nginx

### Variables de entorno incorrectas

**Problema**: App no conecta al backend  
**Solución**:
1. Verificar VITE_API_URL en buildspec
2. Rebuild image con ARG correcto
3. Variables VITE_ deben estar en tiempo de build, no runtime

## 📝 Notas Importantes

### Variables de Entorno en React/Vite

⚠️ Las variables `VITE_*` se inyectan en **build time**, no runtime:

```dockerfile
# Correcto - build arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Incorrecto - no funcionará cambiar después del build
```

Para diferentes ambientes, necesitas **builds separados** con diferentes valores de `VITE_API_URL`.

### Nginx como Servidor

El frontend usa nginx para servir archivos estáticos. Configuración en [nginx.conf](./nginx.conf):
- Gzip compression habilitado
- Cache de assets estático (1 año)
- Security headers
- React Router support (fallback a index.html)

### Health Check

El endpoint `/health` retorna JSON:
```json
{"status":"healthy","timestamp":"2025-12-14T..."}
```

## 📚 Referencias

- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

**Última actualización**: Diciembre 2025  
**Equipo**: Kata Frontend Development Team
