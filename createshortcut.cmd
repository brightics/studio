@ECHO OFF

SET BRIGHTICS_HOME=%~dp0

"%BRIGHTICS_HOME%lib\shortcut\Shortcut.exe" /f:"%USERPROFILE%\Desktop\Brightics Studio.lnk" /a:c /t:"%BRIGHTICS_HOME%Brightics-Studio-Launcher.exe" /I:"%BRIGHTICS_HOME%lib\shortcut\favicon.ico"
