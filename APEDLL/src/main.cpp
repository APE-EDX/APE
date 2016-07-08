#include <Windows.h>
#include <duktape.h>
#include <vector>

#include "utils.hpp"
#include "helpers.hpp"
#include "redirect.hpp"

duk_context *ctx = nullptr;

void require(duk_context* ctx, char* base_path, char* override_path, char* file)
{
	// Override with the API file
	strcpy(override_path, file);

	// Load it to duktape
	duk_push_object(ctx);
	duk_eval_file(ctx, base_path);
}

BOOL WINAPI DllMain(HINSTANCE handle, DWORD reason, LPVOID reserved)
{
	if (reason == DLL_PROCESS_ATTACH) // Self-explanatory
	{
		CreateConsole();
		DisableThreadLibraryCalls(handle);
		ctx = duk_create_heap_default();

		// Allow setHook to be called from inside JS
		duk_push_c_function(ctx, createRedirection, DUK_VARARGS);
		duk_put_global_string(ctx, "cpp_redirect");

		duk_push_c_function(ctx, addressOf, DUK_VARARGS);
		duk_put_global_string(ctx, "cpp_addressOf");
		
		// Get current path
		char path[MAX_PATH];
		size_t len = GetModuleFileNameA(handle, path, sizeof(path));

		// Find last / and 
		while (len > 0 && path[--len] != '\\') {};
		if (len > 0)
		{
			// Overwrite path from here on
			char* override_from = &path[len + 1];

			// Add all API files
			require(ctx, path, override_from, "api/call_convention.js");
			require(ctx, path, override_from, "api/ptr.js");
			require(ctx, path, override_from, "api/find.js");
			require(ctx, path, override_from, "api/redirect.js");

			// Custom user init code
			require(ctx, path, override_from, "init.js");
		}
		else
		{
			// Notify of error via protocol
		}
	}

	if (reason == DLL_PROCESS_DETACH) // Self-explanatory
	{
		duk_destroy_heap(ctx);
	}

	return TRUE;
}
