#!/bin/bash
set -e
source settings.sh
get_abs_script_path() {
  pushd . >/dev/null
  cd $(dirname $0)
  appdir=$(pwd)
  popd  >/dev/null
}
get_abs_script_path

export appdir

PIDFILE=brightics-deeplearning.pid

GC_OPTS="-XX:+UseConcMarkSweepGC
         -verbose:gc -XX:+PrintGCTimeStamps -Xloggc:$appdir/gc.out
         -XX:+CMSClassUnloadingEnabled "

JAVA_OPTS="-Xms2g -Xmx4g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Djava.net.preferIPv4Stack=true -Djava.io.tmpdir=$BRIGHTICS_DEEPLEARNING_HOME/tmp"

MAIN="org.springframework.boot.loader.JarLauncher"

if [ -z "$JAVA_HOME" ]; then
	echo 'JAVA_HOME is not found.'
	exit 1
fi

if [ -f "$PIDFILE" ] && kill -0 $(cat "$PIDFILE"); then
   echo 'Brightics deep learning server is already running'
   exit 1
fi

CLASSPATH="$appdir"

echo "$JAVA_HOME/bin/java $GC_OPTS $JAVA_OPTS $MAIN"
exec $JAVA_HOME/bin/java $GC_OPTS $JAVA_OPTS $MAIN &>/dev/null &

echo $! > $PIDFILE

