# Deployment Guide

Complete guide for deploying Nook Link to various environments and platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
  - [AWS](#aws-deployment)
  - [Google Cloud](#google-cloud-deployment)
  - [Azure](#azure-deployment)
  - [Vercel](#vercel-deployment)
  - [Heroku](#heroku-deployment)
  - [DigitalOcean](#digitalocean-deployment)
- [Database Setup](#database-setup)
- [SSL/TLS Configuration](#ssltls-configuration)
- [CI/CD Setup](#cicd-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Tools

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control
- **Docker**: v20.0.0 or higher (for containerized deployment)
- **PostgreSQL**: v14.0 or higher
- **Redis**: v7.0 or higher (optional, for caching)

### System Requirements

**Development:**
- RAM: 4GB minimum
- Storage: 10GB available space
- OS: Windows 10+, macOS 11+, or Linux

**Production:**
- RAM: 8GB minimum (16GB recommended)
- Storage: 50GB available space
- CPU: 2+ cores (4+ recommended)
- OS: Linux (Ubuntu 20.04+ or similar)

---

## 🌍 Environment Setup

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=production
PORT=3000
APP_NAME=NookLink
APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (Optional)
REDIS_URL=redis://host:6379
REDIS_PASSWORD=your_redis_password

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@nooklink.com

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=UA-XXXXX-Y

# API Keys (Optional)
THIRD_PARTY_API_KEY=your_api_key

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://yourdomain.com
```

### Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -base64 64
```

---

## 🏠 Local Deployment

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/vchaitanyachowdari/nook-link.git
cd nook-link

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
npm run migrate
npm run seed # Optional: seed sample data

# 5. Build application
npm run build

# 6. Start production server
npm start
```

### Development Mode

```bash
# Start with hot-reload
npm run dev

# Run on specific port
PORT=4000 npm run dev
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nooklink
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nooklink
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

**Commands:**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Scale application
docker-compose up -d --scale app=3
```

### Dockerfile

```dockerfile
# Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1

CMD ["node", "dist/index.js"]
```

---

## ☁️ Cloud Platforms

### AWS Deployment

#### Using Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB
eb init -p node.js nook-link

# 3. Create environment
eb create nook-link-prod

# 4. Deploy
eb deploy

# 5. Open application
eb open
```

#### Using ECS (Fargate)

```bash
# 1. Build and push Docker image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t nook-link .
docker tag nook-link:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/nook-link:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/nook-link:latest

# 2. Create ECS task definition and service using AWS Console or CLI
```

#### RDS Database Setup

```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier nook-link-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourPassword123! \
  --allocated-storage 20
```

---

### Google Cloud Deployment

#### Using Cloud Run

```bash
# 1. Build and deploy
gcloud run deploy nook-link \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 2. Set environment variables
gcloud run services update nook-link \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=..."
```

#### Using App Engine

**app.yaml:**

```yaml
runtime: nodejs18
instance_class: F2

env_variables:
  NODE_ENV: 'production'
  
automatic_scaling:
  min_instances: 1
  max_instances: 10
```

```bash
# Deploy
gcloud app deploy
```

---

### Azure Deployment

#### Using App Service

```bash
# 1. Create resource group
az group create --name nook-link-rg --location eastus

# 2. Create App Service plan
az appservice plan create \
  --name nook-link-plan \
  --resource-group nook-link-rg \
  --sku B1 \
  --is-linux

# 3. Create web app
az webapp create \
  --name nook-link \
  --resource-group nook-link-rg \
  --plan nook-link-plan \
  --runtime "NODE|18-lts"

# 4. Deploy code
az webapp up \
  --name nook-link \
  --resource-group nook-link-rg
```

---

### Vercel Deployment

**vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

### Heroku Deployment

**Procfile:**

```
web: node dist/index.js
```

```bash
# 1. Login to Heroku
heroku login

# 2. Create app
heroku create nook-link

# 3. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# 5. Deploy
git push heroku main

# 6. Run migrations
heroku run npm run migrate
```

---

### DigitalOcean Deployment

#### Using App Platform

```yaml
# .do/app.yaml
name: nook-link
services:
  - name: web
    github:
      repo: vchaitanyachowdari/nook-link
      branch: main
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
    http_port: 3000
databases:
  - name: db
    engine: PG
    version: "15"
```

```bash
# Deploy using doctl
doctl apps create --spec .do/app.yaml
```

---

## 🗄️ Database Setup

### PostgreSQL

#### Manual Setup

```bash
# Create database
createdb nooklink

# Create user
psql -c "CREATE USER nooklink WITH PASSWORD 'yourpassword';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE nooklink TO nooklink;"
```

#### Run Migrations

```bash
# Using Prisma
npx prisma migrate deploy

# Or custom migration script
npm run migrate:prod
```

### Database Backup

```bash
# Backup
pg_dump -U postgres nooklink > backup.sql

# Restore
psql -U postgres nooklink < backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres nooklink | gzip > backup_$DATE.sql.gz
```

---

## 🔒 SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

### Nginx Configuration

**/etc/nginx/sites-available/nook-link:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nook-link /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔄 CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/nook-link
            git pull origin main
            npm install
            npm run build
            pm2 restart nook-link
```

---

## 📊 Monitoring

### Health Check Endpoint

```typescript
// healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.error('ERROR:', err);
  process.exit(1);
});

healthCheck.end();
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/index.js --name nook-link

# Enable startup script
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs nook-link
```

### Logging with Winston

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=4000 npm start
```

#### Database Connection Issues

```bash
# Test database connection
psql -h hostname -p 5432 -U username -d database

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Check memory usage
free -h
```

#### Permission Denied

```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/nook-link

# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
```

#### SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com \
  -connect yourdomain.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Node.js debug mode
node --inspect dist/index.js

# View environment variables
printenv | grep NODE_ENV
```

### Performance Issues

```bash
# Check CPU usage
top

# Check disk usage
df -h

# Check network connections
netstat -tuln

# Monitor logs in real-time
tail -f logs/combined.log
```

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security audit completed (`npm audit`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring tools configured
- [ ] Load testing completed
- [ ] Documentation updated

### Deployment

- [ ] Take database backup
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Check health endpoints
- [ ] Verify SSL/HTTPS
- [ ] Test API endpoints
- [ ] Check logs for errors
- [ ] Monitor performance metrics

### Post-Deployment

- [ ] Verify all features working
- [ ] Check error rates
- [ ] Monitor response times
- [ ] Review logs
- [ ] Update status page
- [ ] Notify team
- [ ] Document any issues

---

## 🔄 Rollback Procedure

### Quick Rollback

```bash
# Using Git
git revert HEAD
git push origin main

# Using PM2
pm2 list
pm2 restart nook-link@previous

# Using Docker
docker run -d previous-image-tag
```

### Database Rollback

```bash
# Restore from backup
psql -U postgres nooklink < backup_previous.sql

# Or use migration rollback
npm run migrate:rollback
```

---

## 📊 Monitoring & Alerts

### Uptime Monitoring

**Services to use:**
- UptimeRobot (free)
- Pingdom
- StatusCake
- New Relic

### Application Performance Monitoring

```bash
# Install New Relic
npm install newrelic

# Add to start of index.js
require('newrelic');
```

### Log Aggregation

**Options:**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- Splunk
- CloudWatch (AWS)

### Alert Configuration

**Example Prometheus Alert:**

```yaml
groups:
  - name: nook-link-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: http_request_duration_seconds > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

---

## 🚀 Zero-Downtime Deployment

### Using Blue-Green Deployment

```bash
# 1. Deploy to green environment
docker-compose -f docker-compose.green.yml up -d

# 2. Wait for health check
curl http://green-env:3000/health

# 3. Switch load balancer to green
# Update nginx or load balancer configuration

# 4. Monitor for issues
tail -f logs/access.log

# 5. If successful, remove blue environment
docker-compose -f docker-compose.blue.yml down
```

### Using Rolling Update

```bash
# Kubernetes rolling update
kubectl set image deployment/nook-link \
  nook-link=nook-link:v2.0.0

# Check rollout status
kubectl rollout status deployment/nook-link

# Rollback if needed
kubectl rollout undo deployment/nook-link
```

---

## 🔐 Security Hardening

### Server Hardening

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Set up fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Application Security Headers

```typescript
// Add security headers
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 📱 Mobile App Deployment

### React Native (if applicable)

```bash
# iOS
cd ios && pod install
npx react-native run-ios --configuration Release

# Android
cd android
./gradlew assembleRelease

# Upload to stores
# iOS: Use Xcode or Transporter
# Android: Use Google Play Console
```

---

## 🌐 CDN Configuration

### Cloudflare Setup

1. Add site to Cloudflare
2. Update nameservers
3. Configure SSL/TLS (Full or Full Strict)
4. Enable caching rules
5. Set up page rules
6. Enable DDoS protection

### Cache Configuration

```nginx
# Nginx caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📈 Scaling Strategy

### Horizontal Scaling

```bash
# Using Docker Swarm
docker swarm init
docker service create --replicas 3 \
  --name nook-link \
  nook-link:latest

# Using Kubernetes
kubectl scale deployment nook-link --replicas=5
```

### Vertical Scaling

```bash
# Increase container resources
docker run -d \
  --memory="2g" \
  --cpus="2.0" \
  nook-link:latest
```

### Auto-Scaling

```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nook-link-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nook-link
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 📝 Maintenance Windows

### Scheduled Maintenance

```bash
# 1. Notify users (24h in advance)
# 2. Enable maintenance mode
touch /var/www/nook-link/maintenance.flag

# 3. Perform maintenance
npm run migrate
npm run optimize

# 4. Disable maintenance mode
rm /var/www/nook-link/maintenance.flag

# 5. Verify functionality
npm run test:e2e
```

### Maintenance Mode Middleware

```typescript
app.use((req, res, next) => {
  if (fs.existsSync('./maintenance.flag')) {
    return res.status(503).json({
      message: 'Service temporarily unavailable. Maintenance in progress.',
      estimatedTime: '30 minutes'
    });
  }
  next();
});
```

---

## 🆘 Emergency Procedures

### Critical Issue Response

1. **Detect**: Monitoring alerts trigger
2. **Assess**: Determine severity and impact
3. **Communicate**: Notify team and users
4. **Mitigate**: 
   - Rollback to previous version
   - Scale down affected components
   - Enable maintenance mode if needed
5. **Fix**: Address root cause
6. **Deploy**: Test and deploy fix
7. **Monitor**: Watch for recurrence
8. **Post-mortem**: Document and learn

### Emergency Contacts

```markdown
- On-Call Engineer: +91 94486 67576
- DevOps Lead: +91 94486 67576
- CTO: +91 94486 67576
- Hosting Provider Support: vchaitanya@chowdari.in
```

---

## 📚 Additional Resources

### Documentation Links

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

### Tools

- [PM2](https://pm2.keymetrics.io/) - Process manager
- [Artillery](https://artillery.io/) - Load testing
- [k6](https://k6.io/) - Performance testing
- [Sentry](https://sentry.io/) - Error tracking

---

## 📞 Support

For deployment assistance:
- **Email**: vchaitanya@chowdari.in
- **Slack**: #deployment-help
- **Documentation**: https://docs.nooklink.com/deployment

---

**Document Version**: 1.0  
**Last Updated**: October 12, 2025  
**Maintained By**: DevOps Team
