#include "helpers.hpp"
#include "common.hpp"

duk_ret_t addressOf(duk_context *ctx)
{
    int n = duk_get_top(ctx);  /* #args */

    // Library and method
    const char* libname = duk_to_string(ctx, 0);
    const char* method = duk_to_string(ctx, 1);

    DWORD addr = (DWORD)GetProcAddress(GetModuleHandleA(libname), method);
    duk_push_int(ctx, addr);
    return 1;
}
