#!/bin/bash

## Check MODE ##########################################################################################################
function help {
  echo "Usage: install-brightics.sh [mode]"
  echo " supported mode : [dev]"
}

if [ $# -gt 1 ]
then
  echo "Error: invalid the number of arguments"
  help
  exit 1
fi

case $1 in
  dev|'')
    ;;
  *)
    echo "Error: invalid options : $1"
    help
    exit 1
    ;;
esac


## Check JAVA_HOME and Java version ####################################################################################
import_java () {
  echo Untar Java 8 file. It will be used for Installer.
  tar xf ./files/java_binaries.tar -C ./files
  tar xfz ./files/cookbooks/java/files/default/jdk-8u73-linux-x64.gz -C ./files/cookbooks/java/files/default
  JAVA_HOME=./files/cookbooks/java/files/default/jdk1.8.0_73
}

if [ -n "$JAVA_HOME" ]
then
  JAVA_CMD="$JAVA_HOME/bin/java"
  JAVA_VERSION=$($JAVA_CMD -version 2>&1 | awk -F'"' '/version/ {print $2}' | awk -F'_' '{print $1}')

  echo "Run using java version $JAVA_VERSION (JAVA_HOME is $JAVA_HOME)"

  [[ $JAVA_VERSION > 1.8 ]]
  if [ $? -eq 0 ]
  then
    echo This java version is supported version.
  else
    echo This java version is not supported. You must use java 8 or greater version
    import_java
  fi
else
  echo "Java doesn't exists."
  import_java
fi
########################################################################################################################

echo "starting BrighticsInstaller.(Estimated time: 1 ~ 3 minutes)"
file="./tmp/infra.mv.db"
service_port=$(cat ./etc/application.yaml | grep server.port | cut -d : -f2 | tr -d '[[:space:]]')
logging_file=$(cat ./etc/application.yaml | grep logging.file | cut -d : -f2 | tr -d '[[:space:]]')
sp=".         ..        ...       ....      .....     ......    .......   ........  ......... .........."

if [ $1 ] ; then MODES+=($1) ; fi
if [ ! -f "$file" ] ; then MODES+=("init") ; fi

MODE=$(printf ",%s" "${MODES[@]}")
MODE=${MODE:1}

if [ "${MODE}" != "" ] ; then
  SPRING_PROFILES_ACTIVE="--spring.profiles.active="${MODE}
fi

#echo ./bin/BrighticsInstaller ${SPRING_PROFILES_ACTIVE} --spring.config.location=./etc/application.yaml
nohup ./bin/BrighticsInstaller ${SPRING_PROFILES_ACTIVE} --spring.config.location=./etc/application.yaml >$logging_file 2>&1 &

while :
do
  for (( i=0; i<${#sp}; i=i+10 )); do
    sleep 0.5
    echo -en "${sp:$i:10}" "\r"
  done
  check=`pgrep -f BrighticsInstaller`
  if [ "$check" != "" ] ; then
    check2=`curl -s --head http://localhost:"$service_port"/login | grep "200 OK"`
    if [ "$check2" != "" ] ; then
      echo "BrighticsInstaller was started!";
      break;
    fi
  else
    break
  fi
done