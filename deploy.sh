#!/usr/bin/env bash
set -euo pipefail

APP_USER="ubuntu"
APP_HOME="/home/ubuntu"
APP_DIR="$APP_HOME/aau-basketball-tryouts"
APP_NAME="aau-tryouts"
LOG_DIR="$APP_HOME/logs"
# Use production build for better performance
START_COMMAND="NODE_ENV=production node dist/server/server.js"

echo "🔄 Starting production deploy for $APP_NAME as $APP_USER..."

sudo -u "$APP_USER" -H bash -lc "
  set -euo pipefail

  export NVM_DIR=\"$APP_HOME/.nvm\"
  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"

  cd \"$APP_DIR\"

  echo '🛑 Stopping pm2 app (if running)...'
  pm2 stop \"$APP_NAME\" 2>/dev/null || echo 'App not running, skipping stop'
  pm2 delete \"$APP_NAME\" 2>/dev/null || echo 'App not in pm2, skipping delete'

  echo '🧹 Resetting working tree...'
  git reset --hard HEAD
  git clean -fd

  echo '📥 Fetching latest code...'
  git fetch --all
  git pull --ff-only

  echo '📦 Installing dependencies...'
  pnpm install --frozen-lockfile || pnpm install

  echo '🏗️  Building production bundle...'
  if ! pnpm build; then
    echo '❌ Build failed! Check the output above for errors.'
    exit 1
  fi

  echo '🔍 Verifying build output...'
  if [ ! -f \"dist/server/server.js\" ]; then
    echo '❌ Build output not found at dist/server/server.js'
    echo '📁 Contents of dist directory:'
    ls -la dist/ || echo 'No dist directory found!'
    exit 1
  fi
  echo '✅ Build output verified'

  echo '📁 Creating log directory...'
  mkdir -p \"$LOG_DIR\"

  echo '🚀 Starting app via pm2 (production mode)...'
  pm2 start \"$START_COMMAND\" \
    --name \"$APP_NAME\" \
    --log \"$LOG_DIR/$APP_NAME.log\" \
    --error \"$LOG_DIR/$APP_NAME-error.log\" \
    --max-memory-restart 500M \
    --time

  echo '💾 Saving pm2 process list...'
  pm2 save

  echo '📊 App status:'
  pm2 info \"$APP_NAME\"
"

echo ''
echo '✅ Deploy complete for aau-tryouts!'
echo ''
echo '📝 Useful commands:'
echo "  View logs:    pm2 logs $APP_NAME"
echo "  View status:  pm2 status"
echo "  Restart app:  pm2 restart $APP_NAME"
echo "  Stop app:     pm2 stop $APP_NAME"
echo ''
