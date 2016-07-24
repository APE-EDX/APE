@echo OFF
SET /P AREYOUSURE=Are you sure, it will delete all changes inside APEDLL, APEKernel, InjectorAddon, Projects and jsAPI (Y/[N])?
if /I "%AREYOUSURE%" == "Y" (
    git submodule foreach git stash
    git submodule update --init --recursive
    git pull --recurse-submodules
    git submodule update --recursive
)
@echo ON
