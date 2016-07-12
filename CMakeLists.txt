project(APE)

add_subdirectory(APEDLL)
add_subdirectory(APEKernel32)
add_subdirectory(InjectorAddon)

add_custom_target(
    APE-configure ALL
    COMMAND npm install
)

add_custom_target(
    APE-build ALL
    COMMAND npm run build
    DEPENDS APE-configure
)
