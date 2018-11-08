# Basic settings
export SPARK_HOME=/home/brightics/brightics/packages/spark
export SCALA_HOME=/home/brightics/brightics/packages/scala
export JAVA_HOME=/home/brightics/brightics/packages/java
export BRIGHTICS_AGENT_HOME=/home/brightics/brightics/packages/brightics-agent
export BRIGHTICS_FUNCTION_HOME=/home/brightics/brightics/packages/brightics-library/functions

export BRIGHTICS_AGENT_HOST=brtcpvr01
export BRIGHTICS_SERVER_HOST=brtcpvr01
export BRIGHTICS_SERVER_PORT=9098
export REDIS_SERVER_HOST=brtcpvr01
export REDIS_SERVER_PORT=6379

# Options only for advanced users
export IS_SPARK_USE=true
export PID_PATH=/pid
export IDLE_TIME_MIN=60
export BRIGHTICS_DATA_ROOT=""
export TMP_ROOT=$BRIGHTICS_AGENT_HOME/tmp
export OBSERVER_HOST_PORT=9643
export CONCURRENT_JOB=30
export BRIGHTICS_FS_USE_HDFS_ONLY=true

