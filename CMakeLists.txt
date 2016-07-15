project(APE)

if (NOT WIN32)
    message(FATAL_ERROR "Building on non-windows platforms is not supported yet")
endif ()

option(SKIP_SUBMODULES_UPDATE OFF "Skip updating submodules")

if (NOT SKIP_SUBMODULES_UPDATE)
    add_custom_target(UpdateSubmodules
        COMMAND git submodule update --init --recursive
        COMMAND git pull --recurse-submodules
        COMMAND git submodule update --recursive
        WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}
    )
else ()
    add_custom_target(UpdateSubmodules)
endif ()

macro(BuildMultiArch TARGET_NAME BUILD_PATH COMPILER)
    macro(BuildNow ARCH)
        add_custom_target(${TARGET_NAME}-${ARCH}-RMDIR ALL
            ${CMAKE_COMMAND} -DDEL="${BUILD_PATH}" -P ${PROJECT_SOURCE_DIR}/distclean.cmake
            DEPENDS UpdateSubmodules
        )
        add_custom_target(${TARGET_NAME}-${ARCH}-MKDIR ALL
            ${CMAKE_COMMAND} -E make_directory ${BUILD_PATH}
            DEPENDS UpdateSubmodules ${TARGET_NAME}-${ARCH}-RMDIR
        )

        if (WIN32 AND NOT "${ARCH}" STREQUAL "")
            set(FULL_COMPILER "${COMPILER} ${ARCH}")
        else ()
            set(FULL_COMPILER "${COMPILER}")
        endif ()

        add_custom_target(${TARGET_NAME}-${ARCH}-CMAKE ALL
            ${CMAKE_COMMAND} .. -G${FULL_COMPILER}
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS UpdateSubmodules ${TARGET_NAME}-${ARCH}-MKDIR
        )
        add_custom_target(${TARGET_NAME}-${ARCH}-BUILD ALL
            ${CMAKE_COMMAND} --build .
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS UpdateSubmodules ${TARGET_NAME}-${ARCH}-CMAKE
        )
    endmacro(BuildNow)

    BuildNow("")
    BuildNow("Win64")
endmacro(BuildMultiArch)

BuildMultiArch(APEDLL           "${PROJECT_SOURCE_DIR}/APEDLL/Build"        ${CMAKE_GENERATOR})
BuildMultiArch(APEKernel        "${PROJECT_SOURCE_DIR}/APEKernel/Build"     ${CMAKE_GENERATOR})
BuildMultiArch(InjectorAddon    "${PROJECT_SOURCE_DIR}/InjectorAddon/Build" ${CMAKE_GENERATOR})

#add_custom_target(
#    APE-configure ALL
#    COMMAND npm install
#)

#add_custom_target(
#    APE-build ALL
#    COMMAND npm run build
#    DEPENDS APE-configure
#)
