:: Download megatools and uncompress
curl -fsS -o megatools.zip https://megatools.megous.com/builds/megatools-1.9.97-win32.zip
7z x megatools.zip
set "curpath=%cd%"
set PATH=%curpath%\megatools-1.9.97-win32;%PATH%

:: Package it
npm install -g electron-packager
electron-packager . --asar --platform=win32 --arch=all --prune --ignore="\.babel|\.git|\.happypack|[Bb]uild|deps|([a-z]|[A-Z]|[0-9])+/src|\.git|\.git(attributes|ignore|modules)|appveyor\.yml|CMake.*?|([a-z]|[0-9])*.ilk|.pdb|binding.gyp|([a-z]|[0-9])*\.sh|([a-z]|[0-9])*\.cc|components|helpers|less|test|([a-z]|[0-9])*\.cmake|readme.md|webpack.config.js"

:: Compress
7z a -t7z -m0=lzma2 -mx=9 -aoa -mfb=64 -md=32m -ms=on -d=1024m -mhe -r Win32-x86.7z APE-win32-x86
7z a -t7z -m0=lzma2 -mx=9 -aoa -mfb=64 -md=32m -ms=on -d=1024m -mhe -r Win32-x64.7z APE-win32-x64

:: Push to mega.nz
megaput --username=%mega_user% --password=%mega_pass% Win32-x86.7z
megaput --username=%mega_user% --password=%mega_pass% Win32-x64.7z
