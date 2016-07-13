project(APE)

macro(BuildMultiArch TARGET_NAME BUILD_PATH COMPILER)
    macro(BuildNow ARCH)
        add_custom_target(${TARGET_NAME}-${ARCH}-RMDIR ALL ${CMAKE_COMMAND} -DDEL="${BUILD_PATH}" -P ${PROJECT_SOURCE_DIR}/distclean.cmake)
        add_custom_target(${TARGET_NAME}-${ARCH}-MKDIR ALL ${CMAKE_COMMAND} -E make_directory ${BUILD_PATH} DEPENDS ${TARGET_NAME}-${ARCH}-RMDIR)

        if (WIN32 AND NOT "${ARCH}" STREQUAL "")
            set(FULL_COMPILER "${COMPILER} ${ARCH}")
        else ()
            set(FULL_COMPILER "${COMPILER}")
        endif ()

        add_custom_target(${TARGET_NAME}-${ARCH}-CMAKE ALL
            ${CMAKE_COMMAND} .. -G${FULL_COMPILER}
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS ${TARGET_NAME}-${ARCH}-MKDIR
        )
        add_custom_target(${TARGET_NAME}-${ARCH}-BUILD ALL
            ${CMAKE_COMMAND} --build .
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS ${TARGET_NAME}-${ARCH}-CMAKE
        )
    endmacro(BuildNow)

    BuildNow("")
    BuildNow("Win64")
endmacro(BuildMultiArch)

set(VISUAL_STUDIO_VERSION "Visual Studio 14" CACHE STRING "Visual studio edition used to compile")
BuildMultiArch(APEDLL           "${PROJECT_SOURCE_DIR}/APEDLL/Build"        ${VISUAL_STUDIO_VERSION})
BuildMultiArch(APEKernel32      "${PROJECT_SOURCE_DIR}/APEKernel32/Build"   ${VISUAL_STUDIO_VERSION})
BuildMultiArch(InjectorAddon    "${PROJECT_SOURCE_DIR}/InjectorAddon/Build" ${VISUAL_STUDIO_VERSION})

#add_custom_target(
#    APE-configure ALL
#    COMMAND npm install
#)

#add_custom_target(
#    APE-build ALL
#    COMMAND npm run build
#    DEPENDS APE-configure
#)
