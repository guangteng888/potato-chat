# 即时社交交易项目实施指南和部署文档

## 📋 实施指南概述

**文档名称**: 即时社交交易项目实施指南和部署文档  
**目标读者**: 项目团队、运维人员、管理层  
**文档版本**: v1.0  
**最后更新**: 2024年12月29日  
**执行周期**: 2025年Q1-Q2 (6个月)  

## 🚀 快速启动指南

### ⚡ 5分钟快速部署

#### 环境要求
```bash
# 系统要求
操作系统: Ubuntu 20.04+ / CentOS 8+ / macOS 10.15+
内存: 16GB+
存储: 500GB+ SSD
网络: 100Mbps+

# 软件依赖
Docker: 20.10+
Docker Compose: 2.0+
Node.js: 18.0+
Python: 3.9+
Git: 2.30+
```

#### 一键部署脚本
```bash
#!/bin/bash
# 即时社交交易项目一键部署脚本

echo "🚀 开始部署即时社交交易项目..."

# 1. 克隆项目代码
git clone https://github.com/guangteng888/potato-chat.git
cd potato-chat

# 2. 环境配置
cp .env.example .env
echo "请编辑 .env 文件配置数据库和API密钥"

# 3. 启动基础服务
docker-compose up -d redis postgres mongodb

# 4. 安装依赖
npm install
pip install -r requirements.txt

# 5. 数据库初始化
npm run db:migrate
python manage.py migrate

# 6. 启动服务
docker-compose up -d

echo "✅ 部署完成！访问 http://localhost:3000"
```

### 📱 各平台快速启动

#### Web应用启动
```bash
# 进入Web应用目录
cd potato-chat-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址: http://localhost:3000
```

#### 移动应用启动
```bash
# Android应用
cd PotatoChatMobile
./gradlew assembleDebug

# iOS应用
cd PotatoChatIOS
pod install
xcodebuild -workspace PotatoChatIOS.xcworkspace -scheme PotatoChatIOS build
```

#### 桌面应用启动
```bash
# 进入桌面应用目录
cd PotatoChatDesktop

# 安装依赖
npm install

# 启动应用
npm run electron:dev
```

#### 管理后台启动
```bash
# 后端服务
cd PotatoChatAdmin/backend
npm install
npm run dev

# 前端应用
cd PotatoChatAdmin/frontend
npm install
npm run dev

# 访问地址: http://localhost:8080
```

## 🏗️ 详细部署指南

### 🐳 Docker容器化部署

#### Docker Compose配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端Web应用
  web-app:
    build: ./potato-chat-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://api-gateway:8000
    depends_on:
      - api-gateway

  # API网关
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DB_URL=postgresql://postgres:password@postgres:5432/istdb
    depends_on:
      - redis
      - postgres
      - user-service
      - trading-service

  # 用户服务
  user-service:
    build: ./microservices/user-service
    ports:
      - "8001:8000"
    environment:
      - DB_URL=postgresql://postgres:password@postgres:5432/userdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # 交易服务
  trading-service:
    build: ./microservices/trading-service
    ports:
      - "8002:8000"
    environment:
      - DB_URL=postgresql://postgres:password@postgres:5432/tradingdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # 社交服务
  social-service:
    build: ./microservices/social-service
    ports:
      - "8003:8000"
    environment:
      - DB_URL=postgresql://postgres:password@postgres:5432/socialdb
      - MONGODB_URL=mongodb://mongo:27017/socialdb
    depends_on:
      - postgres
      - mongodb

  # 数据服务
  data-service:
    build: ./microservices/data-service
    ports:
      - "8004:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/datadb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  # 支付服务
  payment-service:
    build: ./microservices/payment-service
    ports:
      - "8005:8000"
    environment:
      - DB_URL=postgresql://postgres:password@postgres:5432/paymentdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # 通知服务
  notification-service:
    build: ./microservices/notification-service
    ports:
      - "8006:8000"
    environment:
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://mongo:27017/notificationdb
    depends_on:
      - redis
      - mongodb

  # 管理后台前端
  admin-frontend:
    build: ./PotatoChatAdmin/frontend
    ports:
      - "8080:80"
    environment:
      - API_URL=http://admin-backend:8000

  # 管理后台后端
  admin-backend:
    build: ./PotatoChatAdmin/backend
    ports:
      - "8007:8000"
    environment:
      - DB_URL=postgresql://postgres:password@postgres:5432/admindb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # PostgreSQL数据库
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=istdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  # MongoDB数据库
  mongodb:
    image: mongo:5.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  # Redis缓存
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  # Nginx负载均衡
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web-app
      - api-gateway
      - admin-frontend

  # 监控服务
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  # 日志收集
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  grafana_data:
  elasticsearch_data:

networks:
  default:
    driver: bridge
```

#### Kubernetes部署配置
```yaml
# k8s-deployment.yml
apiVersion: v1
kind: Namespace
metadata:
  name: instant-social-trading

---
# ConfigMap配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: instant-social-trading
data:
  NODE_ENV: "production"
  API_URL: "http://api-gateway-service:8000"
  REDIS_URL: "redis://redis-service:6379"
  DB_URL: "postgresql://postgres:password@postgres-service:5432/istdb"

---
# Secret配置
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: instant-social-trading
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQ=  # base64编码的password
  REDIS_PASSWORD: cGFzc3dvcmQ=
  JWT_SECRET: c3VwZXJfc2VjcmV0X2tleQ==

---
# Web应用部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: instant-social-trading
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: instant-social-trading/web-app:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
# Web应用服务
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: instant-social-trading
spec:
  selector:
    app: web-app
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP

---
# API网关部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: instant-social-trading
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: instant-social-trading/api-gateway:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"

---
# API网关服务
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: instant-social-trading
spec:
  selector:
    app: api-gateway
  ports:
  - port: 8000
    targetPort: 8000
  type: ClusterIP

---
# Ingress配置
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: instant-social-trading
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - app.instantsocialtrading.com
    - api.instantsocialtrading.com
    secretName: app-tls
  rules:
  - host: app.instantsocialtrading.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app-service
            port:
              number: 3000
  - host: api.instantsocialtrading.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 8000

---
# HPA自动扩缩容
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
  namespace: instant-social-trading
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### ☁️ 云平台部署

#### AWS部署架构
```yaml
# AWS CloudFormation模板
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Instant Social Trading Platform Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [development, staging, production]
  
  InstanceType:
    Type: String
    Default: t3.large
    AllowedValues: [t3.medium, t3.large, t3.xlarge, m5.large, m5.xlarge]

Resources:
  # VPC网络
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-vpc

  # 公有子网
  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-public-subnet-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-public-subnet-2

  # 私有子网
  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.3.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-private-subnet-1

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.4.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-private-subnet-2

  # 互联网网关
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-igw

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # EKS集群
  EKSCluster:
    Type: AWS::EKS::Cluster
    Properties:
      Name: !Sub ${Environment}-eks-cluster
      Version: '1.24'
      RoleArn: !GetAtt EKSClusterRole.Arn
      ResourcesVpcConfig:
        SubnetIds:
          - !Ref PublicSubnet1
          - !Ref PublicSubnet2
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2
        SecurityGroupIds:
          - !Ref EKSClusterSecurityGroup

  # RDS数据库
  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for RDS database
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-db-subnet-group

  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub ${Environment}-postgres
      DBInstanceClass: db.t3.medium
      Engine: postgres
      EngineVersion: '14.6'
      MasterUsername: postgres
      MasterUserPassword: !Ref DBPassword
      AllocatedStorage: 100
      StorageType: gp2
      StorageEncrypted: true
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      BackupRetentionPeriod: 7
      MultiAZ: true
      Tags:
        - Key: Name
          Value: !Sub ${Environment}-postgres

  # ElastiCache Redis
  RedisSubnetGroup:
    Type: AWS::ElastiCache::SubnetGroup
    Properties:
      Description: Subnet group for Redis cluster
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  RedisCluster:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: !Sub ${Environment}-redis
      ReplicationGroupDescription: Redis cluster for caching
      NodeType: cache.t3.micro
      Engine: redis
      EngineVersion: 7.0
      NumCacheClusters: 2
      Port: 6379
      SecurityGroupIds:
        - !Ref CacheSecurityGroup
      CacheSubnetGroupName: !Ref RedisSubnetGroup
      AtRestEncryptionEnabled: true
      TransitEncryptionEnabled: true

  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub ${Environment}-alb
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup

  # CloudFront CDN
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: ALBOrigin
            DomainName: !GetAtt ApplicationLoadBalancer.DNSName
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: https-only
        DefaultCacheBehavior:
          TargetOriginId: ALBOrigin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad  # Managed-CachingDisabled
        Enabled: true
        HttpVersion: http2
        PriceClass: PriceClass_All

Parameters:
  DBPassword:
    Type: String
    NoEcho: true
    Description: Password for the RDS database
    MinLength: 8
    MaxLength: 128

Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub ${Environment}-VPC-ID

  EKSClusterName:
    Description: EKS Cluster Name
    Value: !Ref EKSCluster
    Export:
      Name: !Sub ${Environment}-EKS-Cluster-Name

  RDSEndpoint:
    Description: RDS Database Endpoint
    Value: !GetAtt RDSInstance.Endpoint.Address
    Export:
      Name: !Sub ${Environment}-RDS-Endpoint

  RedisEndpoint:
    Description: Redis Cluster Endpoint
    Value: !GetAtt RedisCluster.RedisEndpoint.Address
    Export:
      Name: !Sub ${Environment}-Redis-Endpoint

  LoadBalancerDNS:
    Description: Application Load Balancer DNS Name
    Value: !GetAtt ApplicationLoadBalancer.DNSName
    Export:
      Name: !Sub ${Environment}-ALB-DNS

  CloudFrontDomain:
    Description: CloudFront Distribution Domain
    Value: !GetAtt CloudFrontDistribution.DomainName
    Export:
      Name: !Sub ${Environment}-CloudFront-Domain
```

## 📊 监控和运维

### 📈 监控体系

#### Prometheus监控配置
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Prometheus自身监控
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter系统监控
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # 应用服务监控
  - job_name: 'web-app'
    static_configs:
      - targets: ['web-app:3000']
    metrics_path: '/metrics'

  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8000']
    metrics_path: '/metrics'

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8000']
    metrics_path: '/metrics'

  - job_name: 'trading-service'
    static_configs:
      - targets: ['trading-service:8000']
    metrics_path: '/metrics'

  # 数据库监控
  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  # Kubernetes监控
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name
```

#### 告警规则配置
```yaml
# alert_rules.yml
groups:
  - name: system_alerts
    rules:
      # 系统资源告警
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for more than 5 minutes on {{ $labels.instance }}"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 85% for more than 5 minutes on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 15
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk space is below 15% on {{ $labels.instance }}"

  - name: application_alerts
    rules:
      # 应用服务告警
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.job }} service is down for more than 1 minute"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is above 1 second for {{ $labels.job }}"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate"
          description: "Error rate is above 5% for {{ $labels.job }}"

  - name: database_alerts
    rules:
      # 数据库告警
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends / pg_settings_max_connections * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connections"
          description: "Database connections are above 80% of max connections"

      - alert: DatabaseSlowQueries
        expr: rate(pg_stat_database_tup_returned[5m]) / rate(pg_stat_database_tup_fetched[5m]) < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database slow queries detected"
          description: "Database query efficiency is below 10%"

  - name: business_alerts
    rules:
      # 业务指标告警
      - alert: LowUserRegistrations
        expr: increase(user_registrations_total[1h]) < 10
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Low user registrations"
          description: "User registrations in the last hour are below 10"

      - alert: HighTradingVolume
        expr: increase(trading_volume_total[5m]) > 1000000
        for: 5m
        labels:
          severity: info
        annotations:
          summary: "High trading volume"
          description: "Trading volume in the last 5 minutes exceeded 1M"
```

### 📋 日志管理

#### ELK Stack配置
```yaml
# elasticsearch.yml
cluster.name: "instant-social-trading"
node.name: "elasticsearch-node-1"
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
xpack.monitoring.collection.enabled: true

# logstash.conf
input {
  beats {
    port => 5044
  }
  
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [fields][service] == "web-app" {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
    date {
      match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
    }
  }
  
  if [fields][service] == "api-gateway" {
    json {
      source => "message"
    }
    date {
      match => [ "timestamp", "ISO8601" ]
    }
  }
  
  # 添加地理位置信息
  if [client_ip] {
    geoip {
      source => "client_ip"
      target => "geoip"
    }
  }
  
  # 敏感信息脱敏
  mutate {
    gsub => [
      "message", "password=[^&\s]*", "password=***",
      "message", "token=[^&\s]*", "token=***"
    ]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "instant-social-trading-%{+YYYY.MM.dd}"
  }
  
  # 错误日志单独存储
  if [level] == "ERROR" {
    elasticsearch {
      hosts => ["elasticsearch:9200"]
      index => "errors-%{+YYYY.MM.dd}"
    }
  }
  
  stdout { codec => rubydebug }
}

# kibana.yml
server.name: kibana
server.host: 0.0.0.0
elasticsearch.hosts: [ "http://elasticsearch:9200" ]
monitoring.ui.container.elasticsearch.enabled: true
```

#### Filebeat配置
```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      service: web-app
      environment: production
    fields_under_root: true
    multiline.pattern: '^\d{4}-\d{2}-\d{2}'
    multiline.negate: true
    multiline.match: after

  - type: docker
    containers.ids:
      - "*"
    processors:
      - add_docker_metadata:
          host: "unix:///var/run/docker.sock"

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
  - add_kubernetes_metadata: ~

output.logstash:
  hosts: ["logstash:5044"]

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
```

## 🔧 运维操作手册

### 🚨 故障处理流程

#### 故障分级和响应时间
```
故障分级:
├── P0级故障 (致命)
│   ├── 影响: 系统完全不可用
│   ├── 响应时间: 5分钟内
│   ├── 解决时间: 1小时内
│   └── 通知: 所有相关人员
├── P1级故障 (严重)
│   ├── 影响: 核心功能不可用
│   ├── 响应时间: 15分钟内
│   ├── 解决时间: 4小时内
│   └── 通知: 技术团队和管理层
├── P2级故障 (重要)
│   ├── 影响: 部分功能异常
│   ├── 响应时间: 1小时内
│   ├── 解决时间: 24小时内
│   └── 通知: 技术团队
└── P3级故障 (一般)
    ├── 影响: 轻微功能问题
    ├── 响应时间: 4小时内
    ├── 解决时间: 72小时内
    └── 通知: 相关开发人员
```

#### 故障处理标准流程
```
处理流程:
├── 1. 故障发现 (5分钟内)
│   ├── 监控告警触发
│   ├── 用户反馈收集
│   ├── 主动巡检发现
│   └── 第三方通知
├── 2. 故障确认 (10分钟内)
│   ├── 故障现象确认
│   ├── 影响范围评估
│   ├── 故障级别判定
│   └── 响应团队通知
├── 3. 应急响应 (30分钟内)
│   ├── 应急小组集结
│   ├── 故障原因初判
│   ├── 临时解决方案
│   └── 用户通知发布
├── 4. 问题诊断 (1小时内)
│   ├── 日志分析
│   ├── 监控数据分析
│   ├── 系统状态检查
│   └── 根因分析
├── 5. 解决方案 (根据级别)
│   ├── 解决方案制定
│   ├── 风险评估
│   ├── 实施计划
│   └── 回滚准备
├── 6. 方案实施
│   ├── 解决方案执行
│   ├── 实时监控
│   ├── 效果验证
│   └── 状态更新
├── 7. 故障恢复
│   ├── 服务恢复确认
│   ├── 功能验证
│   ├── 性能检查
│   └── 用户通知
└── 8. 事后总结
    ├── 故障报告编写
    ├── 根因分析
    ├── 改进措施
    └── 预防方案
```

### 🔄 日常运维任务

#### 每日运维检查清单
```
日常检查:
├── 系统状态检查
│   ├── [ ] 服务器CPU、内存、磁盘使用率
│   ├── [ ] 网络连接状态和带宽使用
│   ├── [ ] 系统负载和进程状态
│   └── [ ] 系统日志错误检查
├── 应用服务检查
│   ├── [ ] 所有微服务运行状态
│   ├── [ ] API响应时间和成功率
│   ├── [ ] 数据库连接和性能
│   └── [ ] 缓存服务状态
├── 业务指标检查
│   ├── [ ] 用户注册和活跃数据
│   ├── [ ] 交易量和成功率
│   ├── [ ] 错误率和异常统计
│   └── [ ] 关键业务流程验证
├── 安全状态检查
│   ├── [ ] 安全日志审查
│   ├── [ ] 异常登录检查
│   ├── [ ] 系统漏洞扫描结果
│   └── [ ] 访问控制验证
└── 备份状态检查
    ├── [ ] 数据库备份完成状态
    ├── [ ] 文件备份完成状态
    ├── [ ] 备份文件完整性验证
    └── [ ] 恢复测试执行
```

#### 每周运维任务
```
周度任务:
├── 性能优化
│   ├── [ ] 数据库性能分析和优化
│   ├── [ ] 缓存命中率分析和调优
│   ├── [ ] 慢查询分析和优化
│   └── [ ] 系统资源使用趋势分析
├── 安全维护
│   ├── [ ] 系统补丁更新检查
│   ├── [ ] 安全扫描执行
│   ├── [ ] 访问日志分析
│   └── [ ] 安全策略更新
├── 容量规划
│   ├── [ ] 存储容量使用分析
│   ├── [ ] 网络带宽使用分析
│   ├── [ ] 服务器资源使用趋势
│   └── [ ] 扩容需求评估
├── 备份恢复
│   ├── [ ] 备份策略执行验证
│   ├── [ ] 恢复流程测试
│   ├── [ ] 备份数据清理
│   └── [ ] 灾备环境同步
└── 文档更新
    ├── [ ] 运维文档更新
    ├── [ ] 故障处理记录整理
    ├── [ ] 配置变更记录
    └── [ ] 知识库维护
```

---

**实施指南制定时间**: 2024年12月29日  
**指南版本**: v1.0  
**适用环境**: 生产环境、测试环境  
**维护责任**: 运维团队、开发团队

