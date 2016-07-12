#include "utils.hpp"

#include <io.h>
#include <fcntl.h>

bool CreateConsole()
{
    if (AllocConsole())
    {
        long stdioHandle = (long)GetStdHandle(STD_INPUT_HANDLE);
        int consoleHandleR = _open_osfhandle(stdioHandle, _O_TEXT);
        FILE* fptr = _fdopen(consoleHandleR, "r");
        *stdin = *fptr;
        setvbuf(stdin, NULL, _IONBF, 0);

        stdioHandle = (long)GetStdHandle(STD_OUTPUT_HANDLE);
        int consoleHandleW = _open_osfhandle(stdioHandle, _O_TEXT);
        fptr = _fdopen(consoleHandleW, "w");
        *stdout = *fptr;
        setvbuf(stdout, NULL, _IONBF, 1);

        stdioHandle = (long)GetStdHandle(STD_ERROR_HANDLE);
        *stderr = *fptr;
        setvbuf(stderr, NULL, _IONBF, 0);

        // Compatibility for older implementations
        freopen("CONIN$", "r", stdin);
        freopen("CONOUT$", "w", stdout);
        freopen("CONOUT$", "w", stderr);

        return true;
    }

    return false;
}

duk_ret_t WrapCreateConsole(duk_context *ctx)
{
    duk_push_boolean(ctx, CreateConsole());
    return 1;  /* one return value */
}
