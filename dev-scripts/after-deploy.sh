#!/bin/bash
REPOSITORY=/home/ubuntu/build-dev
APP_NAME=node_app_dev
cd $REPOSITORY
export PATH=$PATH:$(npm root -g)

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