#!/bin/bash

mkdir -p /opt/brightics-studio/brightics-server/logs \
         /opt/brightics-studio/visual-analytics/logs
touch /opt/brightics-studio/brightics-server/logs/brightics-server.log \
      /opt/brightics-studio/visual-analytics/logs/visual-analytics.client.log \
      /opt/brightics-studio/visual-analytics/logs/visual-analytics.error.log \
      /opt/brightics-studio/visual-analytics/logs/visual-analytics.log

sh /opt/brightics-studio/start-brightics.sh
exec tail -f /opt/brightics-studio/brightics-server/logs/* /opt/brightics-studio/visual-analytics/logs/*
