:: Name:     start-brightics.cmd
:: Purpose:  Start Brightics services for windows

@ECHO OFF
TITLE BrighticsForWindows

SET BRIGHTICS_HOME=%~dp0

IF NOT EXIST "%BRIGHTICS_HOME%lib\brightics_python_env\Scripts\activate" (
    ECHO Brightics python env is not configured. Execute setup first.
    EXIT /B
)

where /q java
IF ERRORLEVEL 1 (
    ECHO Java is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)
where /q python
IF ERRORLEVEL 1 (
    ECHO Python is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)
IF NOT EXIST "%BRIGHTICS_HOME%lib\node\node.exe" (
    ECHO Node.js is missing. Ensure Visual-analytics is installed.
    EXIT /B
)

call "%BRIGHTICS_HOME%lib\brightics_python_env\Scripts\activate"

ECHO      ______    ______      ___    ________  ________  ________  ___    ________  ________  
ECHO     /      \  /      \    /  /\  /       /\/   /   /\/       /\/  /\  /       /\/       /\ 
ECHO    /   /   /\/   /   /\  /  / /\/  _____/ /   /   / /__   __/ /  / /\/   ____/ /    ___/ /\
ECHO   /      ^<:\/      ^<:\/\/  / / /  /_   /\/       / /\:/  /\:\/  / / /   /___ \/___    /\/ /
ECHO  /   /   /\/   /   /\ \/  / / /    /  / /   /   / / //  / /\/  / / /       /\/       / /\/ 
ECHO /_______/ /___/___/ /\/__/ / /_______/ /___/___/ / //__/ / /__/ / /_______/ /_______/ / /  
ECHO \:::\:::\/\:::\:::\/ /\::\/ /\:::\:::\/\:::\:::\/ / \::\/ /\::\/ /\:::\:::\/\:::\:::\/ /   
ECHO  \___\___\/\___\___\/  \__\/  \___\___\_\___\___\/   \__\/  \__\/  \___\___\_\___\___\/    
ECHO.                                                                                            
ECHO ^> Brightics for Windows                                                                    
ECHO.                                                                                             
ECHO ** DO NOT CLOSE THIS CMD WINDOW **                                                                
ECHO.                                                                                             

SET USER_ID=brightics@samsung.com
SET ACCESS_TOKEN=ACCESS_TOKEN

:: Brightics Server
CD /d "%BRIGHTICS_HOME%brightics-server"
START /B start-server.cmd %USER_ID% %ACCESS_TOKEN%

ECHO Waiting for 30 seconds to run Brightics Server.
ping -n 30 127.0.0.1 > nul

:: Visual Analytics
CD /d "%BRIGHTICS_HOME%visual-analytics"
START /B CMD /C "%BRIGHTICS_HOME%lib\node\node.exe" app.js --user_id %USER_ID% --access_token %ACCESS_TOKEN%

If Not Exist "%USERPROFILE%\Desktop\Brightics Studio.lnk" (
  "%BRIGHTICS_HOME%lib\shortcut\Shortcut.exe" /f:"%USERPROFILE%\Desktop\Brightics Studio.lnk" /a:c /t:"%BRIGHTICS_HOME%start-brightics.cmd" /I:"%BRIGHTICS_HOME%\lib\shortcut\favicon.ico"
)

ping -n 10 127.0.0.1 > nul

CLS

ECHO      ______    ______      ___    ________  ________  ________  ___    ________  ________  
ECHO     /      \  /      \    /  /\  /       /\/   /   /\/       /\/  /\  /       /\/       /\ 
ECHO    /   /   /\/   /   /\  /  / /\/  _____/ /   /   / /__   __/ /  / /\/   ____/ /    ___/ /\
ECHO   /      ^<:\/      ^<:\/\/  / / /  /_   /\/       / /\:/  /\:\/  / / /   /___ \/___    /\/ /
ECHO  /   /   /\/   /   /\ \/  / / /    /  / /   /   / / //  / /\/  / / /       /\/       / /\/ 
ECHO /_______/ /___/___/ /\/__/ / /_______/ /___/___/ / //__/ / /__/ / /_______/ /_______/ / /  
ECHO \:::\:::\/\:::\:::\/ /\::\/ /\:::\:::\/\:::\:::\/ / \::\/ /\::\/ /\:::\:::\/\:::\:::\/ /   
ECHO  \___\___\/\___\___\/  \__\/  \___\___\_\___\___\/   \__\/  \__\/  \___\___\_\___\___\/    
ECHO.                                                                                            
ECHO ^> Brightics for Windows                                                                    
ECHO.                                                                                             
ECHO ** DO NOT CLOSE THIS CMD WINDOW ** 
ECHO. 
ECHO Please open Chrome browser with http://127.0.0.1:3000
ECHO. 

START chrome http://127.0.0.1:3000
