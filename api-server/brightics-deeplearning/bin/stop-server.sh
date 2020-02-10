#!/bin/bash
# Script to stop the brightics deeplearning

get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}

get_abs_script_path

PIDFILE=brightics-deeplearning.pid

if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics deeplearning not running'
else
  echo 'Stopping Brightics deeplearning...'
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  echo '...Brightics deeplearning stopped'
fi
