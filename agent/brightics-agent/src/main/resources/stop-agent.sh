#!/bin/bash
# Script to stop the job server

get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}

get_abs_script_path

AGENT_NAME=$1

PIDFILE=$appdir/pid/$AGENT_NAME.pid

if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
   echo "Brightics agent [$AGENT_NAME] not running"
else
  echo "Stopping Brightics agent [$AGENT_NAME]..."
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  echo "...Brightics agent [$AGENT_NAME] stopped"
fi

