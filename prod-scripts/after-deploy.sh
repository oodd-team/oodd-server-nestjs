#!/bin/bash
REPOSITORY=/home/ubuntu/build
APP_NAME=node_app_prod
export PATH=$PATH:$(npm root -g)
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