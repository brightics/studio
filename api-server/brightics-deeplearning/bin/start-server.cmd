:: Name:     start-server.cmd
:: Purpose:  Start Brightics deeplearning for windows

@ECHO OFF
SET BRIGHTICS_DEEPLEARNING_HOME=%~dp0
SET BRIGHTICS_HOME=%BRIGHTICS_DEEPLEARNING_HOME%..
SET USER_ID=%1
SET PATH=%PATH%;%BRIGHTICS_DEEPLEARNING_HOME%

if "%USER_ID%"=="" (
	ECHO Please enter USER_ID
	GOTO usage
	EXIT /b 1
)

SET JAVA_HOME=%BRIGHTICS_HOME%\lib\java
SET GC_OPTS=-XX:+UseConcMarkSweepGC -verbose:gc -XX:+PrintGCTimeStamps -Xloggc:"%BRIGHTICS_DEEPLEARNING_HOME%gc.out" -XX:MaxMetaspaceSize=512m -XX:+CMSClassUnloadingEnabled
SET JAVA_OPTS=-Xms1g -Xmx2g -XX:+HeapDumpOnOutOfMemoryError -Djava.net.preferIPv4Stack=true -Djava.io.tmpdir="%BRIGHTICS_DEEPLEARNING_HOME%tmp" -Dbrightics.local.user=%USER_ID%
SET MAIN=org.springframework.boot.loader.JarLauncher -Dspring.config.location="%BRIGHTICS_DEEPLEARNING_HOME%BOOT-INF\classes\"

IF EXIST "%BRIGHTICS_DEEPLEARNING_HOME%tmp" (
    rmdir /S /Q "%BRIGHTICS_DEEPLEARNING_HOME%tmp"
)

mkdir "%BRIGHTICS_DEEPLEARNING_HOME%tmp"

"%JAVA_HOME%\bin\java" %GC_OPTS% %JAVA_OPTS% -classpath . %MAIN%

:usage
echo Usage: %~n0 USER_ID
