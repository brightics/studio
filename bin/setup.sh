#!/bin/bash

echo "Create python environment..."

BRIGHTICS_PACKAGES_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

command -v python >/dev/null 2>&1 || { echo >&2 "Python is missing. Ensure it is installed and placed in your PATH."; exit 1; }

python -m venv $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env
source $BRIGHTICS_PACKAGES_HOME/lib/brightics_python_env/bin/activate

pip install %* -r $BRIGHTICS_PACKAGES_HOME/lib/requirements.txt

deactivate