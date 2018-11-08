#!/bin/bash

BRIGHTICS_PACKAGES_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Brightics Server
cd $BRIGHTICS_PACKAGES_HOME/brightics-server
./stop-server.sh

# Visual Analytics
kill -9 `pgrep -f node`

