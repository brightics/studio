#!/bin/bash

echo '     ______    ______      ___    ________  ________  ________  ___    ________  ________  '
echo '    /      \  /      \    /  /\  /       /\/   /   /\/       /\/  /\  /       /\/       /\ '
echo '   /   /   /\/   /   /\  /  / /\/  _____/ /   /   / /__   __/ /  / /\/   ____/ /    ___/ /\'
echo '  /      <:\/      <:\/\/  / / /  /_   /\/       / /\:/  /\:\/  / / /   /___ \/___    /\/ /'
echo ' /   /   /\/   /   /\ \/  / / /    /  / /   /   / / //  / /\/  / / /       /\/       / /\/ '
echo '/_______/ /___/___/ /\/__/ / /_______/ /___/___/ / //__/ / /__/ / /_______/ /_______/ / /  '
echo '\:::\:::\/\:::\:::\/ /\::\/ /\:::\:::\/\:::\:::\/ / \::\/ /\::\/ /\:::\:::\/\:::\:::\/ /   '
echo ' \___\___\/\___\___\/  \__\/  \___\___\_\___\___\/   \__\/  \__\/  \___\___\_\___\___\/    '
echo
echo '> Brightics for *NIX'
echo

BPY=lib/brightics_python_env/bin/python
AU=$($BPY lib/etc/updater.py cu 2>/dev/null)
if [ "$AU" == "ua" ]; then
  read -p "There is an update available. Do you want to update now? " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    $BPY lib/etc/updater.py d 2>/dev/null
    rm -rf ./tmp
  fi
fi

USER_ID=brightics@samsung.com
ACCESS_TOKEN=ACCESS_TOKEN
BRIGHTICS_PACKAGES_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

export JAVA_HOME=$BRIGHTICS_PACKAGES_HOME/lib/java

source $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/lib/python3.7/venv/scripts/common/activate

# Brightics Server
cd $BRIGHTICS_PACKAGES_HOME/brightics-server
./start-server.sh $USER_ID $ACCESS_TOKEN &

# Visual Analytics
cd $BRIGHTICS_PACKAGES_HOME/visual-analytics
$BRIGHTICS_PACKAGES_HOME/lib/nodejs/bin/node app.js &>/dev/null &
echo $! > va.pid

