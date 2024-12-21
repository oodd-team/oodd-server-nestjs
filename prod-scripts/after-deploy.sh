#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
REPOSITORY=/home/ubuntu/build
APP_NAME=node_app_prod
cd $REPOSITORY

# Check if the app is already running
if pm2 list | grep $APP_NAME > /dev/null
then
  echo "$APP_NAME is already running. Restarting..."
  pm2 delete $APP_NAME
  pm2 start dist/main.js --name $APP_NAME
else
  echo "Starting $APP_NAME"
  pm2 start dist/main.js --name $APP_NAME
fi