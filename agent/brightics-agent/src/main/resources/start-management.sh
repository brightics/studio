#!/bin/bash

cd $(dirname $0)

source settings.sh

if [ -z "$SCALA_HOME" ]; then
echo 'SCALA_HOME is not found.'
exit 1
fi

if [ -z "$JAVA_HOME" ]; then
echo 'JAVA_HOME is not found.'
exit 1
fi

if [ -z "$TMP_ROOT" ]; then
echo 'TMP_ROOT is not found. Please check settings.sh file.'
exit 1
fi

if [ -z "$BRIGHTICS_AGENT_HOME" ]; then
echo 'BRIGHTICS_AGENT_HOME is not found.'
exit 1
fi

if [ -z "$OBSERVER_HOST_PORT" ]; then
echo 'WARNING: OBSERVER_HOST_PORT is not found. Default 9643 port will be used.'
fi

export GC_OPTS="-XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

# External compiler(FSC) refer to this java.io.tmpdir. Don't modify this.
export JAVA_OPTS="-Dscala.home=${SCALA_HOME} -Xmx512m -Djava.net.preferIPv4Stack=true -Djava.io.tmpdir=${TMP_ROOT}/scala"

$JAVA_HOME/bin/java $JAVA_OPTS $GC_OPTS -cp brightics-management.jar com.samsung.sds.brightics.management.BrighticsManagement $OBSERVER_HOST_PORT &>> $BRIGHTICS_AGENT_HOME/logs/management.log &

