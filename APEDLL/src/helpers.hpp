#pragma once

#include <Windows.h>
#include <duktape.h>

template <typename F> F CreateHook(void* orig, F dest);
duk_ret_t addressOf(duk_context *ctx);


// Implementations

template <typename F>
F CreateHook(void* orig, F dest, bool createCodecave=false)
{
    DWORD codecave = NULL;

    if (createCodecave)
    {
        codecave = (DWORD)VirtualAlloc(NULL, 10, MEM_RESERVE | MEM_COMMIT, PAGE_EXECUTE_READWRITE);
        if (!codecave)
        {
            return NULL;
        }

        memcpy((void*)codecave, (void*)orig, 5);
        *(BYTE*)(codecave + 5) = 0xE9;
        *(DWORD*)(codecave + 6) = ((DWORD)orig + 5 - (codecave + 5)) - 5;
    }

    // Unprotect address
    DWORD oldProtect;
    VirtualProtect((LPVOID)orig, 5, PAGE_EXECUTE_READWRITE, &oldProtect);

    // JMP dest
    *(BYTE*)(orig) = 0xE9;
    *(DWORD*)((DWORD)orig + 1) = ((DWORD)dest - (DWORD)orig) - 5;

    VirtualProtect((LPVOID)orig, 5, oldProtect, &oldProtect);

    return (F)codecave;
}
