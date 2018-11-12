#!/bin/bash
# Script to stop the job server

get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}

get_abs_script_path

PIDFILE=brightics-server.pid

if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics server not running'
else
  echo 'Stopping Brightics server...'
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  echo '...Brightics server stopped'
fi
