#!/bin/bash
REPOSITORY=/home/ubuntu/build-dev
APP_NAME=node_app_dev

cd $REPOSITORY

# Check if the app is already running
if sudo pm2 list | grep $APP_NAME > /dev/null
then
  echo "$APP_NAME is already running. Restarting..."
  sudo pm2 delete $APP_NAME
  sudo pm2 start dist/main.js --name $APP_NAME
else
  echo "Starting $APP_NAME"
  sudo pm2 start dist/main.js --name $APP_NAME
fi