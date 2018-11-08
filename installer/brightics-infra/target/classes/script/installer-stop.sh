#!/bin/bash
echo "stopping BrighticsInstaller."
PID=`ps h -e -o pid -o args --cols=1000 | grep BrighticsInstaller | grep -v grep | head -n 1 | awk '{print $1}'`
service_port=`cat ./etc/application.yaml | grep server.port | cut -d : -f2`
sp=".         ..        ...       ....      .....     ......    .......   ........  ......... .........."

if [ "${PID}" != "" ]; then
    kill -9 ${PID}
fi

while :
do
  for (( i=0; i<${#sp}; i=i+10 )); do
    sleep 0.5
    echo -en "${sp:$i:10}" "\r"
  done
  check2=`curl -s --head http://localhost:"$service_port"/login | grep "200 OK"`
  if [ "$check2" == "" ] ; then
    echo "BrighticsInstaller was stopped!";
    break;
  fi
done
