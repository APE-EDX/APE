cmake_minimum_required(VERSION 2.8)
project(APE)


option(SKIP_SUBMODULES_UPDATE "Skip updating submodules" OFF)

if (NOT ${SKIP_SUBMODULES_UPDATE})
    add_custom_target(UpdateSubmodules
        COMMAND git submodule update --init --recursive
        COMMAND git pull --recurse-submodules
        COMMAND git submodule update --recursive
        WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}
    )
else ()
    add_custom_target(UpdateSubmodules)
endif ()

macro(BuildMultiArch TARGET_NAME BUILD_PATH SKIP64)
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
            set(GENERATOR "${CMAKE_GENERATOR} ${ARCH}")
        else ()
            set(GENERATOR "${CMAKE_GENERATOR}")
        endif ()

        add_custom_target(${TARGET_NAME}-${ARCH}-CMAKE ALL
            ${CMAKE_COMMAND} .. -G${GENERATOR}
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS UpdateSubmodules ${TARGET_NAME}-${ARCH}-MKDIR
        )
        add_custom_target(${TARGET_NAME}-${ARCH}-BUILD ALL
            ${CMAKE_COMMAND} --build . --config Release
            WORKING_DIRECTORY ${BUILD_PATH}
            DEPENDS UpdateSubmodules ${TARGET_NAME}-${ARCH}-CMAKE
        )
    endmacro(BuildNow)

    BuildNow("")

    if (NOT ${SKIP64})
        BuildNow("Win64")
    endif ()
endmacro(BuildMultiArch)

if(LINUX)
    BuildMultiArch(APESO        "${PROJECT_SOURCE_DIR}/APESO/build"         OFF)
else()
    BuildMultiArch(APEDLL       "${PROJECT_SOURCE_DIR}/APEDLL/build"        OFF)
endif()
BuildMultiArch(APEKernel        "${PROJECT_SOURCE_DIR}/APEKernel/build"     OFF)
BuildMultiArch(InjectorAddon    "${PROJECT_SOURCE_DIR}/InjectorAddon/build" OFF)

#add_custom_target(
#    APE-configure ALL
#    COMMAND npm install
#)

#add_custom_target(
#    APE-build ALL
#    COMMAND npm run build
#    DEPENDS APE-configure
#)
