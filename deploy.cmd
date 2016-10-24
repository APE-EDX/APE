:: Only build in the x64 matrix (so as not to build two times)
if "%platform%" == "x86" exit

echo "Deploying"

:: Download megatools and uncompress
curl -fsS -o megatools.zip https://megatools.megous.com/builds/megatools-1.9.97-win32.zip
7z x megatools.zip
set "curpath=%cd%"
set PATH=%curpath%\megatools-1.9.97-win32;%PATH%

:: Package it
call npm install -g electron-packager
call electron-packager . --asar --asar-unpack="init.js" --asar-unpack-dir="{**/{APEDLL,APESO,APEKernel,InjectorAddon}/**,jsAPI}" --platform=win32 --arch=all --prune --ignore="\.babel|\.git|\.happypack|[Bb]uild|deps|([a-z]|[A-Z]|[0-9])+/src|\.git|\.git(attributes|ignore|modules)|Projects|appveyor\.yml|CMake.*?|([a-z]|[0-9])*\.ilk|([a-z]|[0-9])*\.pdb|binding\.gyp|([a-z]|[0-9])*\.sh|([a-z]|[0-9])*\.cc|components|helpers|less|test|([a-z]|[0-9])*\.cmake|readme\.md|LICENSE|webpack\.config\.js"

:: Output debug information
dir APE-win32-ia32 -R

:: Get version from package.json
FOR /F "tokens=* USEBACKQ" %%F IN (`node -p "var pjson = require('./package.json'); pjson.version;"`) DO (
    SET version=%%F
)

:: Compress (-d=1024m)
7z a -t7z -m0=lzma2 -mx=9 -aoa -mfb=64 -md=32m -ms=on -mhe -r Win32-ia32-%version%.7z APE-win32-ia32
7z a -t7z -m0=lzma2 -mx=9 -aoa -mfb=64 -md=32m -ms=on -mhe -r Win32-x64-%version%.7z APE-win32-x64

:: Push to mega.nz
megaput --username=%mega_user% --password=%mega_pass% --path=/Root/APE/ Win32-ia32-%version%.7z
megaput --username=%mega_user% --password=%mega_pass% --path=/Root/APE/ Win32-x64-%version%.7z
