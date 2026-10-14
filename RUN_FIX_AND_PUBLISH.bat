@echo off
chcp 65001>nul
py -3 "%~dp0fix_and_publish.py" --project "E:\Projects\Asfi_blog"
echo.
pause
