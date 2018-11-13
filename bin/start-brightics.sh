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

USER_ID=brightics@samsung.com
ACCESS_TOKEN=ACCESS_TOKEN
BRIGHTICS_PACKAGES_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Check requirements
command -v java >/dev/null 2>&1 || { echo >&2 "Java is missing. Ensure it is installed and placed in your PATH."; exit 1; }
command -v python >/dev/null 2>&1 || { echo >&2 "Python is missing. Ensure it is installed and placed in your PATH."; exit 1; }
# command -v $#/lib/nodejs/bin/node >/dev/null 2>&1 || { echo >&2 "Node.js is missing. Ensure Visual-analytics is installed."; exit 1; }

if [ -f "$BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/build.info" ]
then
    BRIGHTICS_PYTHON_BUILD_INFO=`head -1 $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/build.info`
    if [ "$BRIGHTICS_PACKAGES_HOME" != "$BRIGHTICS_PYTHON_BUILD_INFO" ]; then
        $BRIGHTICS_PACKAGES_HOME/setup-python-env.sh
    fi
else
    $BRIGHTICS_PACKAGES_HOME/setup-python-env.sh
fi

source $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/bin/activate

# Brightics Server
cd $BRIGHTICS_PACKAGES_HOME/brightics-server
./start-server.sh $USER_ID $ACCESS_TOKEN &

# Visual Analytics
cd $BRIGHTICS_PACKAGES_HOME/visual-analytics
$BRIGHTICS_PACKAGES_HOME/lib/nodejs/bin/node app.js --user_id $USER_ID --access_token $ACCESS_TOKEN &>/dev/null &

