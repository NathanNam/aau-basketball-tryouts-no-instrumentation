# Deployment Guide for AAU Basketball Tryouts

This guide covers deploying the AAU Basketball Tryouts application to an AWS EC2 instance.

## Prerequisites

- AWS EC2 instance (Amazon Linux 2023 or Ubuntu 22.04 LTS)
- Instance type: t3.small or larger (t3.micro for testing)
- Domain name pointed to your EC2 instance's IP address
- SSH access to your EC2 instance

## Step 1: Initial EC2 Setup

### Connect to your EC2 instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### Update system packages

For Amazon Linux 2023:
```bash
sudo yum update -y
```

For Ubuntu:
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Node.js

### For Amazon Linux 2023:

```bash
# Install Node.js 20.x LTS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

### For Ubuntu:

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Install PM2 Process Manager

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

## Step 4: Install and Configure Nginx

### For Amazon Linux 2023:

```bash
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### For Ubuntu:

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Verify Nginx is running:

```bash
sudo systemctl status nginx
```

## Step 5: Install Certbot for SSL

### For Amazon Linux 2023:

```bash
sudo yum install -y certbot python3-certbot-nginx
```

### For Ubuntu:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 6: Clone and Build the Application

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/yourusername/aau-basketball-tryouts.git
cd aau-basketball-tryouts

# Set proper permissions
sudo chown -R $USER:$USER /var/www/aau-basketball-tryouts

# Install dependencies
npm install

# Build the application
npm run build

# Create logs directory for PM2
mkdir -p logs
```

## Step 7: Configure Nginx

```bash
# Copy the example Nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/aau-basketball-tryouts

# Edit the config file and replace 'yourdomain.com' with your actual domain
sudo nano /etc/nginx/sites-available/aau-basketball-tryouts

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/aau-basketball-tryouts /etc/nginx/sites-enabled/

# Remove default Nginx config if it exists
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 8: Obtain SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 9: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command that PM2 outputs
```

## Step 10: Configure Firewall (Security Groups)

In your AWS EC2 Security Group, allow:

- Port 22 (SSH) - Restrict to your IP address
- Port 80 (HTTP)
- Port 443 (HTTPS)

### Example using AWS CLI:

```bash
# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

## Step 11: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check SSL certificate is valid (green padlock in browser)
3. Verify all tryouts are loading correctly
4. Test filtering and search functionality
5. Check mobile responsiveness

## Managing the Application

### View application logs:

```bash
pm2 logs aau-basketball-tryouts
```

### Restart application:

```bash
pm2 restart aau-basketball-tryouts
```

### Stop application:

```bash
pm2 stop aau-basketball-tryouts
```

### Monitor application:

```bash
pm2 monit
```

### View application status:

```bash
pm2 status
```

## Updating the Application

```bash
# Navigate to app directory
cd /var/www/aau-basketball-tryouts

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2
pm2 restart aau-basketball-tryouts
```

## Monitoring and Maintenance

### Check Nginx logs:

```bash
sudo tail -f /var/log/nginx/aau-tryouts-access.log
sudo tail -f /var/log/nginx/aau-tryouts-error.log
```

### Check PM2 logs:

```bash
pm2 logs --lines 100
```

### Monitor system resources:

```bash
# CPU and memory
htop

# Disk usage
df -h

# PM2 monitoring
pm2 monit
```

### Auto-renewal of SSL certificates:

Certbot automatically renews certificates. Verify with:

```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Application won't start:

```bash
# Check PM2 logs
pm2 logs aau-basketball-tryouts --lines 50

# Verify build completed
ls -la .output/server/

# Check Node.js version
node --version
```

### Nginx 502 Bad Gateway:

```bash
# Verify app is running on port 3000
pm2 status
curl http://localhost:3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/aau-tryouts-error.log

# Restart services
pm2 restart aau-basketball-tryouts
sudo systemctl restart nginx
```

### SSL Certificate issues:

```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test Nginx config
sudo nginx -t
```

## Performance Optimization

### Enable CloudWatch monitoring:

Install CloudWatch agent for detailed metrics:

```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
```

### Setup automated backups:

Create a backup script:

```bash
#!/bin/bash
# Save to /var/www/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/backups"
APP_DIR="/var/www/aau-basketball-tryouts"

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz $APP_DIR

# Keep only last 7 backups
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete
```

Add to crontab:

```bash
# Run daily at 2 AM
0 2 * * * /var/www/backup.sh
```

## Security Best Practices

1. Keep system and packages updated:
   ```bash
   sudo yum update -y  # Amazon Linux
   sudo apt update && sudo apt upgrade -y  # Ubuntu
   ```

2. Configure automatic security updates:
   ```bash
   # Ubuntu
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

3. Use AWS IAM roles instead of storing credentials
4. Regularly review CloudWatch logs
5. Monitor failed login attempts
6. Keep SSH key secure and use key-based authentication only

## Support

For issues or questions:
- Check application logs: `pm2 logs`
- Check Nginx logs: `/var/log/nginx/`
- Review this deployment guide
- Contact support: info@aautryouts.com
