#!/bin/bash
# Script to stop the deeplearning server

get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}

get_abs_script_path

PIDFILE=brightics-deeplearning.pid

if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics deep learning server not running'
else
  echo 'Stopping Brightics deep learning server...'
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  echo '...Brightics deep learning server stopped'
fi
