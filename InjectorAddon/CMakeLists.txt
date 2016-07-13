project(InjectorAddon)

if("${CMAKE_SIZEOF_VOID_P}" EQUAL "8")
    set(ARCH x64)
else ()
    set(ARCH ia32)
endif()

add_custom_target(
    InjectorAddon-configure ALL
    COMMAND node-gyp configure --directory=${PROJECT_SOURCE_DIR} --target=1.2.5 --arch=${ARCH} --dist-url=https://atom.io/download/atom-shell
)

add_custom_target(
    InjectorAddon-build ALL
    COMMAND node-gyp build --directory=${PROJECT_SOURCE_DIR} --target=1.2.5 --arch=${ARCH} --dist-url=https://atom.io/download/atom-shell
    DEPENDS InjectorAddon-configure
)

add_custom_target(
    InjectorAddon-copy ALL
    COMMAND ${CMAKE_COMMAND} -E copy ${PROJECT_SOURCE_DIR}/build/Release/injector.node ${PROJECT_SOURCE_DIR}/bin/${ARCH}/injector.node
    DEPENDS InjectorAddon-build
)
