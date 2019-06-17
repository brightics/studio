#!/bin/bash

cd $(dirname $0)

appdir=$(pwd)
NAME_OR_MODEL=$1
PREPARED_DATA=$2

PIDFILE=brightics-lightweight.pid

export appdir
export BRIGHTICS_SERVER_HOME=$appdir
export FORCED_UNPERSIST=true
export MODEL_FILE_PATH=./model
export MODEL_CONCURRENT_COUNT=2

export GC_OPTS="-XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"
export JAVA_OPTS="-Xmx62m -Djava.net.preferIPv4Stack=true -Dlogback.configurationFile=$appdir/config/logback-lightweight.xml"
export CLASSPATH=":$appdir/envlib/java_lib/*"
export MAIN="com.samsung.sds.brightics.lightweight.Application"

source $appdir/envlib/brightics_python_env/bin/activate

$JAVA_HOME/bin/java $JAVA_OPTS $GC_OPTS -cp $CLASSPATH:brightics-lightweight.jar $MAIN 5352  &

echo $! > $PIDFILE

