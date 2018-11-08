#!/bin/bash

cd $(dirname $0)

source settings.sh

appdir=$(pwd)
AGENT_NAME=$1
AGENT_PORT=$2

if [ -z "$JAVA_HOME" ]; then
  echo 'JAVA_HOME is not found.'
  exit 1
fi

if [ -z "$SCALA_HOME" ]; then
  echo 'SCALA_HOME is not found.'
  exit 1
fi

if [ -z "$BRIGHTICS_AGENT_HOME" ]; then
  echo 'BRIGHTICS_AGENT_HOME is not found.'
  exit 1
fi

if $IS_SPARK_USE ; then  
  if [ -z "$SPARK_HOME" ]; then
    echo 'SPARK_HOME is not found.'
    exit 1
  fi
fi


JAVA_OPTS="-Djava.net.preferIPv4Stack=true -Dlogback.configurationFile=$appdir/conf/logback-agent.xml -Dlog.name=$AGENT_NAME -Dscala.home=$SCALA_HOME -Djava.io.tmpdir=$TMP_ROOT/$AGENT_NAME"

GC_OPTS="-XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

DEBUG_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=6006"

MAIN="com.samsung.sds.brightics.agent.BrighticsAgent"

PIDFILE=$appdir/pid/$AGENT_NAME.pid

if [ -f "$PIDFILE" ] && kill -0 $(cat "$PIDFILE"); then
   echo "Brightics agent [$AGENT_NAME] is already running"
   exit 1
fi


if $IS_SPARK_USE ; then
  echo 'Start spark agent.'
  exec $SPARK_HOME/bin/spark-submit --class $MAIN --driver-java-options "$JAVA_OPTS $GC_OPTS" $appdir/brightics-agent.jar $AGENT_NAME $AGENT_PORT $3 $4 > $appdir/logs/$AGENT_NAME.out 2> $appdir/logs/$AGENT_NAME.err &
else
  echo 'Start none spark agent.'
  packagedir="$(dirname "$(pwd)")"
  CLASSPATH="$packagedir/brightics-library/common/*:$packagedir/brightics-library/functions/scala:$packagedir/brightics-agent/conf/"
  exec $JAVA_HOME/bin/java $JAVA_OPTS $GC_OPTS -cp $CLASSPATH $MAIN $AGENT_NAME $AGENT_PORT $3 $4 > $appdir/logs/$AGENT_NAME.out 2> $appdir/logs/$AGENT_NAME.err &
fi

echo $! > $PIDFILE
