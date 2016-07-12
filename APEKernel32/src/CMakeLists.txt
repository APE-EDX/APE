
set(CPP_SOURCES
    main.cpp
    ${DUKTAPE_SOURCES})

include_directories(${DUKTAPE_INCLUDE} ${CMAKE_CURRENT_SOURCE_DIR})
add_executable(APEKernel32 ${CPP_SOURCES})

if (WIN32)
    if("${CMAKE_SIZEOF_VOID_P}" EQUAL "8")
        set(WINXXBITS 64)
    else ()
        set(WINXXBITS 32)
    endif()

    set(OUTPUT_NAME "APEKernel${WINXXBITS}")
else ()
    set(OUTPUT_NAME "APEKernelxx")
endif ()

set_target_properties(APEKernel32 PROPERTIES
    OUTPUT_NAME ${OUTPUT_NAME}
    RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin
    RUNTIME_OUTPUT_DIRECTORY_DEBUG ${PROJECT_SOURCE_DIR}/bin
    RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR}/bin
)
