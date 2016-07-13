message(INFO ${DEL})

FOREACH(D ${DEL}) # DEL is a list of the directories and files to delete
    message(INFO ${D})
    IF(EXISTS ${D})
        FILE(REMOVE_RECURSE ${D})
    ENDIF()
ENDFOREACH()
