:: Name:     setup-py-env.cmd
:: Purpose:  Setup a Python Environment on Windows

@ECHO OFF
TITLE Setup a Python Environment

SET BRIGHTICS_HOME=%~dp0

ECHO Create python environment...

where /q python
IF ERRORLEVEL 1 (
    ECHO Python is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)

IF EXIST "%BRIGHTICS_HOME%lib\brightics_python_env\Lib\site-packages\pip\" (
    FOR /D %%X IN ("%BRIGHTICS_HOME%lib\brightics_python_env\Lib\site-packages\pip*") DO RD /S /Q "%%X"
)

IF EXIST "%BRIGHTICS_HOME%lib\brightics_python_env\Lib\site-packages\setuptools\" (
    FOR /D %%X IN ("%BRIGHTICS_HOME%lib\brightics_python_env\Lib\site-packages\setuptools*") DO RD /S /Q "%%X"
)

python -m venv "%BRIGHTICS_HOME%lib\brightics_python_env"

@ECHO %BRIGHTICS_HOME%> "%BRIGHTICS_HOME%lib\brightics_python_env\build.info"