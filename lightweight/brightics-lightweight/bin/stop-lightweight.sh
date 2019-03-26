#!/bin/bash
# Script to stop the job server

get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}

get_abs_script_path

PIDFILE=brightics-lightweight.pid

if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics lightweight not running'
else
  echo 'Stopping Brightics lightweight...'
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  echo '...Brightics lightweight stopped'
fi

