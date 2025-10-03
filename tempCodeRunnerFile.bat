
    echo Restarting...
    call launch-windows.bat %*
)

IF %ERRORLEVEL% NEQ 0 ( pause )
