:: Name:     start-server.cmd
:: Purpose:  Start Brightics server for windows

@ECHO OFF
SET BRIGHTICS_SERVER_HOME=%~dp0
SET BRIGHTICS_HOME=%BRIGHTICS_SERVER_HOME%..
SET USER_ID=%1
SET ACCESS_TOKEN=%2
SET PATH=%PATH%;%BRIGHTICS_HOME%\lib\graphviz\bin;%BRIGHTICS_SERVER_HOME%
SET HADOOP_HOME=%BRIGHTICS_HOME%\lib\hadoop

if "%USER_ID%"=="" (
	ECHO Please enter USER_ID
	GOTO usage
	EXIT /b 1
)
if "%ACCESS_TOKEN%"=="" (
	ECHO Please enter ACCESS_TOKEN
	GOTO usage
	EXIT /b 1
)

SET GC_OPTS=-XX:+UseConcMarkSweepGC -verbose:gc --Xloggc:"%BRIGHTICS_SERVER_HOME%gc.out" -XX:+CMSClassUnloadingEnabled
SET JAVA_OPTS=-Xms1g -Xmx2g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Djava.net.preferIPv4Stack=true -Djava.io.tmpdir="%BRIGHTICS_SERVER_HOME%tmp" -Dbrightics.local.token=%ACCESS_TOKEN% -Dbrightics.local.user=%USER_ID% -Dfile.encoding=utf-8
SET MAIN=org.springframework.boot.loader.JarLauncher -Dspring.config.location="%BRIGHTICS_SERVER_HOME%BOOT-INF\classes\" 

IF EXIST "%BRIGHTICS_SERVER_HOME%tmp" (
    rmdir /S /Q "%BRIGHTICS_SERVER_HOME%tmp"
)

mkdir "%BRIGHTICS_SERVER_HOME%tmp"

java %JAVA_OPTS% -classpath . %MAIN% 

:usage
echo Usage: %~n0 USER_ID ACCESS_TOKEN
