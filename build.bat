@echo off
if not exist bin mkdir bin

echo [BUILD] Nowshin Compiler banacchi...
g++ main.cpp Lexer.cpp Generator.cpp -o bin/nowshin.exe

if %errorlevel% neq 0 (
    echo [ERROR] Jhamela hoyeche! Code check koro.
    pause
    exit /b
)

echo [SUCCESS] Compiler ready!
echo.
echo [TEST] Running example...
bin\nowshin.exe examples/new_test.now
pause