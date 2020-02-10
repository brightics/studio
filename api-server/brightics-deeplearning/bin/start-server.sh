#!/bin/bash
set -e
get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}
get_abs_script_path

export appdir
export BRIGHTICS_DEEPLEARNING_HOME=$appdir
export BRIGHTICS_DATA_ROOT=$BRIGHTICS_DEEPLEARNING_HOME/data

PIDFILE=brightics-deeplearning.pid

GC_OPTS="-XX:+UseConcMarkSweepGC -verbose:gc -XX:+PrintGCTimeStamps -Xloggc:$appdir/gc.out -XX:+CMSClassUnloadingEnabled "

JAVA_OPTS="-Xms1g -Xmx2g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Djava.net.preferIPv4Stack=true -Djava.io.tmpdir=$BRIGHTICS_DEEPLEARNING_HOME/tmp -Dbrightics.local.user=$1

DEBUG_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=6005"

MAIN="org.springframework.boot.loader.JarLauncher -Dspring.config.location=$appdir/BOOT-INF/classes/"

if [ -z "$JAVA_HOME" ]; then
	echo 'JAVA_HOME is not found.'
	exit 1
fi

if [ -f "$PIDFILE" ] && kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics deeplearning is already running'
   exit 1
fi

exec java $JAVA_OPTS $MAIN &>/dev/null &

echo $! > $PIDFILE
