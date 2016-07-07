#include <Windows.h>
#include <duktape.h>

duk_context *ctx = nullptr;

BOOL WINAPI DllMain(HINSTANCE handle, DWORD reason, LPVOID reserved)
{
	if (reason == DLL_PROCESS_ATTACH) // Self-explanatory
	{
		DisableThreadLibraryCalls(handle);
		ctx = duk_create_heap_default();
	}

	if (reason == DLL_PROCESS_DETACH) // Self-explanatory
	{
		duk_destroy_heap(ctx);
	}

	return TRUE;
}
