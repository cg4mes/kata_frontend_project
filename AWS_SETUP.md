# AWS Configuration Quick Reference - Frontend

## 📋 Placeholders a Reemplazar

| Placeholder | Descripción | Ejemplo |
|------------|-------------|---------|
| `YOUR_AWS_ACCOUNT_ID` | Tu AWS Account ID | `123456789012` |
| `https://api-qa.yourapp.com` | URL del backend QA | `https://api-qa.kata.com` |
| `https://api-staging.yourapp.com` | URL del backend Staging | `https://api-staging.kata.com` |
| `https://api.yourapp.com` | URL del backend Production | `https://api.kata.com` |

## 🚀 Setup Rápido por Ambiente

### QA Environment

```bash
export ENV=qa
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export BACKEND_URL=https://api-qa.yourapp.com

# 1. Crear ECR (una sola vez)
aws ecr create-repository --repository-name kata-frontend

# 2. Crear ECS Cluster
aws ecs create-cluster --cluster-name kata-frontend-$ENV-cluster

# 3. Crear Log Group
aws logs create-log-group --log-group-name /aws/ecs/kata-frontend-$ENV
aws logs put-retention-policy --log-group-name /aws/ecs/kata-frontend-$ENV --retention-in-days 30

# 4. Actualizar buildspec con URL correcta
sed -i '' "s|https://api-qa.yourapp.com|$BACKEND_URL|g" pipeline/buildspecs/buildspec.qa.yml
```

### Staging Environment

```bash
export ENV=staging
export BACKEND_URL=https://api-staging.yourapp.com

# Repetir los mismos comandos cambiando $ENV
```

### Production Environment

```bash
export ENV=production
export BACKEND_URL=https://api.yourapp.com

# Repetir con configuraciones de producción
```

## 📦 Primer Build y Deploy

```bash
# 1. Actualizar AWS Account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
find . -type f \( -name "*.yml" -o -name "*.json" \) -exec sed -i '' "s/YOUR_AWS_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" {} +

# 2. Actualizar URLs del backend en buildspecs
vim pipeline/buildspecs/buildspec.qa.yml  # Cambiar VITE_API_URL
vim pipeline/buildspecs/buildspec.staging.yml
vim buildspec.yml

# 3. Build local para testing
./ci-cd/local-build.sh qa true

# 4. Test local
docker run -p 8080:80 kata-frontend:qa
# Abrir http://localhost:8080

# 5. Push a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag kata-frontend:qa $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0

# 6. Registrar task definition y crear servicio
sed "s|\${image_url}|$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-v1.0.0|g" \
  pipeline/service/task-definition.qa.json > /tmp/td.json

aws ecs register-task-definition --cli-input-json file:///tmp/td.json

aws ecs create-service \
  --cluster kata-frontend-qa-cluster \
  --service-name kata-frontend-qa-service \
  --task-definition kata-frontend-qa \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

## ✅ Verificación

```bash
# Ver tasks
aws ecs list-tasks --cluster kata-frontend-qa-cluster --service-name kata-frontend-qa-service

# Obtener IP pública del task
TASK_ARN=$(aws ecs list-tasks --cluster kata-frontend-qa-cluster --service-name kata-frontend-qa-service --query 'taskArns[0]' --output text)
ENI_ID=$(aws ecs describe-tasks --cluster kata-frontend-qa-cluster --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

# Test health
curl http://$PUBLIC_IP/health

# Ver logs
aws logs tail /aws/ecs/kata-frontend-qa --follow
```

## 🔐 Configuración SSL (Producción)

### 1. Solicitar Certificado

```bash
aws acm request-certificate \
  --domain-name yourapp.com \
  --subject-alternative-names www.yourapp.com \
  --validation-method DNS \
  --region us-east-1
```

### 2. Validar DNS

Agregar records CNAME en Route53 para validar el certificado (valores provistos por ACM).

### 3. Configurar ALB con HTTPS

```bash
# Crear listener HTTPS
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=<CERT_ARN_FROM_ACM> \
  --default-actions Type=forward,TargetGroupArn=<TG_ARN>

# Opcional: Redirect HTTP → HTTPS
aws elbv2 modify-listener \
  --listener-arn <HTTP_LISTENER_ARN> \
  --default-actions Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}
```

### 4. Configurar Route53

```bash
# Crear A record apuntando al ALB
cat > dns-change.json << EOF
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "yourapp.com",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "<ALB_HOSTED_ZONE_ID>",
        "DNSName": "<ALB_DNS_NAME>",
        "EvaluateTargetHealth": true
      }
    }
  }]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id <YOUR_ZONE_ID> \
  --change-batch file://dns-change.json
```

## 📊 Recursos por Ambiente

| Recurso | QA | Staging | Production |
|---------|-----|---------|------------|
| ECS CPU | 256 | 256 | 512 |
| ECS Memory | 512 MB | 512 MB | 1024 MB |
| Desired Count | 1 | 1 | 2+ |
| ALB | Shared OK | Dedicated | Dedicated |
| SSL/TLS | Opcional | Recomendado | Obligatorio |
| CloudFront | No | Opcional | Recomendado |

## 💰 Estimación de Costos (Mensual)

### QA Environment
- ECS Fargate (256 CPU, 512MB, 1 task): ~$8
- ALB (si dedicado): ~$20
- Data Transfer: ~$5
- **Total: ~$33/mes** (o ~$13 si comparte ALB)

### Staging Environment
- ECS Fargate (256 CPU, 512MB, 1 task): ~$8
- ALB: ~$20
- Data Transfer: ~$5
- **Total: ~$33/mes**

### Production Environment
- ECS Fargate (512 CPU, 1GB, 2 tasks): ~$30
- ALB: ~$20
- Route53: ~$1
- ACM Certificate: Gratis
- CloudFront (opcional): ~$10-50
- Data Transfer: ~$10-30
- **Total: ~$71-131/mes**

## 🎯 Optimizaciones de Costos

### Fargate Spot (QA/Staging)
Usa Fargate Spot para ahorrar hasta 70%:

```bash
aws ecs create-service \
  --capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1
```

### CloudFront (Production)
Para mejor performance y menor costo de data transfer:

```bash
aws cloudfront create-distribution \
  --origin-domain-name <ALB_DNS> \
  --default-cache-behavior ViewerProtocolPolicy=redirect-to-https
```

### Scheduled Scaling (QA)
Apagar QA en noches/fines de semana:

```bash
# Scale down a 0 a las 7pm
aws application-autoscaling put-scheduled-action \
  --service-namespace ecs \
  --schedule "cron(0 19 * * ? *)" \
  --scalable-target-action MinCapacity=0,MaxCapacity=0

# Scale up a 1 a las 7am
aws application-autoscaling put-scheduled-action \
  --service-namespace ecs \
  --schedule "cron(0 7 * * MON-FRI *)" \
  --scalable-target-action MinCapacity=1,MaxCapacity=1
```

## 🔍 Troubleshooting Rápido

### 1. Health check falla
```bash
# Verificar que nginx responde
docker run -p 8080:80 kata-frontend:qa
curl http://localhost:8080/health

# Debe retornar: {"status":"healthy","timestamp":"..."}
```

### 2. CORS errors
```bash
# Verificar backend permite el origen del frontend
# En backend, configurar CORS_ORIGIN correctamente
aws ssm get-parameter --name /kata/qa/cors_origin

# Debe incluir la URL del frontend
```

### 3. App muestra página en blanco
```bash
# Ver console del browser (F12)
# Usualmente es:
# - Error de API URL incorrecta
# - CORS error
# - Assets no se cargan (verificar nginx.conf)
```

### 4. Variables de entorno no funcionan
```bash
# Recordar: VITE_ vars son build-time, no runtime
# Debes hacer rebuild con el valor correcto:

docker build \
  --build-arg VITE_API_URL=https://correct-api-url.com \
  -t kata-frontend:qa .
```

## 📚 Comandos Útiles

```bash
# Force new deployment
aws ecs update-service \
  --cluster kata-frontend-qa-cluster \
  --service kata-frontend-qa-service \
  --force-new-deployment

# Ver eventos del servicio
aws ecs describe-services \
  --cluster kata-frontend-qa-cluster \
  --services kata-frontend-qa-service \
  --query 'services[0].events[0:5]'

# Test desde dentro del container
docker run -it kata-frontend:qa sh
# Dentro del container:
curl localhost/health
ls -la /usr/share/nginx/html/
cat /etc/nginx/nginx.conf
```

## 🎓 Best Practices

1. **Separar builds por ambiente** - Cada ambiente debe tener su propia imagen con VITE_API_URL correcto
2. **Usar CloudFront en producción** - Mejor performance y menor costo
3. **Implementar SSL/TLS** - Obligatorio en producción
4. **Configurar cache correctamente** - index.html sin cache, assets con cache largo
5. **Monitorear métricas** - Request count, latency, error rate
6. **Scheduled scaling en QA** - Apagar cuando no se usa
7. **Usar tags en imágenes** - No usar solo :latest

---

**Contacto**: DevOps Team  
**Última actualización**: Diciembre 2025
