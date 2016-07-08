
set(CPP_SOURCES
    main.cpp        common.hpp
    helpers.cpp     helpers.hpp
    redirect.cpp    redirect.hpp
    utils.cpp       utils.hpp
    socket.cpp      socket.hpp
    ${DUKTAPE_SOURCES})

include_directories(${DUKTAPE_INCLUDE} ${CMAKE_CURRENT_SOURCE_DIR})
add_library(APEDLL SHARED ${CPP_SOURCES})

target_link_libraries(APEDLL ws2_32)

set_target_properties(APEDLL PROPERTIES
    OUTPUT_NAME APEDLL
    RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin
    RUNTIME_OUTPUT_DIRECTORY_DEBUG ${PROJECT_SOURCE_DIR}/bin
    RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR}/bin
)
