#!/bin/bash

### Name:     setup-py-env.cmd
### Purpose:  Setup a Python Environment

echo "Create python environment..."

BRIGHTICS_PACKAGES_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

command -v python >/dev/null 2>&1 || { echo >&2 "Python is missing. Ensure it is installed and placed in your PATH."; exit 1; }

if [ -d "$BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/lib/python3.6/site-packages/pip" ]; then
  rm -rf $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/lib/python3.6/site-packages/pip*
fi

if [ -d "$BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/lib/python3.6/site-packages/setuptools" ]; then
  rm -rf $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/lib/python3.6/site-packages/setuptools*
fi

python -m venv $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env

echo $BRIGHTICS_PACKAGES_HOME > $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/build.info