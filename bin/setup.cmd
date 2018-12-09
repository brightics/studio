:: Name:     setup.cmd
:: Purpose:  Start Brightics services for windows

@ECHO OFF
TITLE Setup BrighticsForWindows

for %%B in (%~dp0\.) do SET BRIGHTICS_HOME=%%~dpB

where /q python
IF ERRORLEVEL 1 (
    ECHO Python is missing. Ensure it is installed and placed in your PATH.
    EXIT /B
)

ECHO Create python environment...
python -m venv "%BRIGHTICS_HOME%lib\brightics_python_env"
call "%BRIGHTICS_HOME%lib\brightics_python_env\Scripts\activate"

pip install %* -r "%BRIGHTICS_HOME%lib\requirements.txt"

call "%BRIGHTICS_HOME%lib\brightics_python_env\Scripts\deactivate"