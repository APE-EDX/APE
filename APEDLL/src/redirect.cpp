#include "redirect.hpp"
#include "helpers.hpp"

__declspec(naked) void WrapJSRedirect()
{
    // Save some registers
    __asm push EBX
    __asm push EDI

    // duk_get_global_string(ctx, currentName);
    __asm push DWORD PTR SS:[ESP + 12]           // currentName
    __asm push ctx
    __asm call duk_get_global_string
    __asm add ESP, 8                            // Pop arguments

    __asm mov EBX, DWORD PTR SS:[ESP + 16]      // EBX = numArgs
    __asm mov EDI, EBX                          // EDI = counter

    // for each argument
loop_args:
    __asm test EDI, EDI                         // Ended?
    __asm je call_duktape

    // Cada parametro = 4 bytes ... 1, 2, 3 * 4 = 4, 8, 12 ...
    __asm mov EAX, 4
    __asm imul EAX, EDI
    __asm mov EAX, DWORD PTR SS:[EBP + 8 + EAX] // PUSH ret + PUSH EBP

    // duk_push_int(ctx, argVal);
    __asm push EAX
    __asm push ctx
    __asm call duk_push_int
    __asm add ESP, 8                            // Pop arguments

    __asm dec EDI
    __asm jmp loop_args

call_duktape:
    //duk_pcall(ctx, numArgs);
    __asm push EBX
    __asm push ctx
    __asm call duk_pcall
    __asm add ESP, 8                            // Pop arguments

    // Get returned value
    __asm push -1
    __asm push ctx
    __asm call duk_to_int
    __asm add ESP, 8                            // Pop arguments

    // Restore resigters
    __asm pop EDI
    __asm pop EBX

    // Pop currentName, numArgs
    __asm add ESP, 8

    // Restore EBP
    __asm pop EBP

    // Return to fake address
    __asm ret
}

duk_ret_t createRedirection(duk_context *ctx)
{
    int n = duk_get_top(ctx);  /* #args */

    // Address
    DWORD address = (DWORD)duk_to_int(ctx, 0);

    // Number of parameters
    int numArgs = duk_to_int(ctx, 1);

    // Name
    const char* duk_name = duk_to_string(ctx, 2);
    char* name = new char[strlen(duk_name)];
    strcpy(name, duk_name);

    // Call convention
    CallConvention convention = (CallConvention)duk_to_int(ctx, 3);

    // Fastcall not yet implemented
    if (convention == CallConvention::FASTCALL)
    {
        duk_push_boolean(ctx, false);
        return 1;  /* one return value */
    }

    // Callback
    duk_dup(ctx, 4);
    duk_put_global_string(ctx, name);

    // 5 push + 1 push + 2 mov + 2 push + 5 push + 5 call + 3 retn
    DWORD codecave = (DWORD)VirtualAlloc(NULL, 23, MEM_RESERVE | MEM_COMMIT, PAGE_EXECUTE_READWRITE);
    if (codecave == NULL)
    {
        duk_push_boolean(ctx, false);
        return 1;  /* one return value */
    }

    // PUSH retPoint (codecave + 20)
    *(BYTE*)(codecave + 0) = 0x68;
    *(DWORD*)(codecave + 1) = codecave + 20;

    // PUSH EBP
    // MOV EBP, ESP
    *(BYTE*)(codecave + 5) = 0x55;
    *(WORD*)(codecave + 6) = 0xEC8B;

    // PUSH numArgs
    *(BYTE*)(codecave + 8) = 0x6A;
    *(BYTE*)(codecave + 9) = numArgs;

    // PUSH name
    *(BYTE*)(codecave + 10) = 0x68;
    *(DWORD*)(codecave + 11) = (DWORD)name;

    // JMP WrapJS
    DWORD currentAddr = codecave + 15;
    *(BYTE*)(currentAddr) = 0xE9;
    *(DWORD*)(currentAddr + 1) = ((DWORD)&WrapJSRedirect - currentAddr) - 5;

    // RETN args*4
    if (convention == CallConvention::STDCALL)
    {
        *(BYTE*)(codecave + 20) = 0xC2;
        *(WORD*)(codecave + 21) = numArgs * 4;
    }
    else if (convention == CallConvention::CDECLCALL)
    {
        *(BYTE*)(codecave + 20) = 0xC3;
    }

    CreateHook((void*)address, (void*)codecave, false);
    duk_push_boolean(ctx, true);
    return 1;  /* one return value */
}
