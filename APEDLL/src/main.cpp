#include <Windows.h>
#include <duktape.h>
#include <vector>

duk_context *ctx = nullptr;

typedef SHORT (WINAPI *GetKeyState_t)(int);
GetKeyState_t getKeyState_orig;

SHORT WINAPI Detour(int key)
{
	SHORT n = getKeyState_orig(key);

	__asm pushad
	__asm pushfd

	__asm popfd
	__asm popad

	return n;
}

template <typename F>
F CreateHook(void* orig, F dest)
{
	DWORD codecave = (DWORD)VirtualAlloc(NULL, 10, MEM_RESERVE | MEM_COMMIT, PAGE_EXECUTE_READWRITE);
	memcpy((void*)codecave, (void*)orig, 5);
	*(BYTE*)(codecave + 5) = 0xE9;
	*(DWORD*)(codecave + 6) = ((DWORD)orig + 5 - (codecave + 5)) - 5;

	// Unprotect address
	DWORD oldProtect;
	VirtualProtect((LPVOID)orig, 5, PAGE_EXECUTE_READWRITE, &oldProtect);

	// JMP codecave
	*(BYTE*)(orig) = 0xE9;
	*(DWORD*)((DWORD)orig + 1) = ((DWORD)dest - (DWORD)orig) - 5;

	VirtualProtect((LPVOID)orig, 5, oldProtect, &oldProtect);

	return (F)codecave;
}

__declspec(naked) void WrapJSRedirect()
{
	// Save some registers
	__asm push EAX
	__asm push EBX
	__asm push EDI

	// duk_get_global_string(ctx, currentName);
	__asm push DWORD PTR SS:[ESP + 12] // currentName
	__asm push ctx
	__asm call duk_get_global_string
	__asm add ESP, 8	// Pop arguments

	__asm mov EBX, DWORD PTR SS:[ESP + 16]		// EBX = numArgs
	__asm mov EDI, EBX	// EDI = counter

	// for each argument
loop_args:
	__asm test EDI, EDI // Ended?
	__asm je call_duktape

	__asm mov EAX, 4
	__asm imul EAX, EDI
	__asm mov EAX, DWORD PTR SS : [EBP + 8 + EAX] // PUSH ret + PUSH EBP

	// duk_push_int(ctx, argVal);
	__asm push EAX
	__asm push ctx
	__asm call duk_push_int
	__asm add ESP, 8	// Pop arguments

	__asm dec EDI
	__asm jmp loop_args

call_duktape:
	//duk_pcall(ctx, numArgs);
	__asm push EBX
	__asm push ctx
	__asm call duk_pcall
	__asm add ESP, 8	// Pop arguments

	// Restore resigters
	__asm pop EDI
	__asm pop EBX
	__asm pop EAX

	// Pop currentName, numArgs
	__asm add ESP, 8

	// Restore EBP
	__asm pop EBP

	// Return to fake address
	__asm ret
}

enum class CallConvention
{
	STDCALL,
	CDECLCALL,
	FASTCALL
};

duk_ret_t createRedirection(duk_context *ctx) {
	int n = duk_get_top(ctx);  /* #args */

	// Address
	DWORD address = duk_to_number(ctx, 0);

	printf("%x %x\n", address, GetProcAddress(GetModuleHandleA("user32.dll"), "GetKeyState"));

	// Number of parameters
	int numArgs = duk_to_number(ctx, 1);

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

	void* notUsed = CreateHook((void*)address, (void*)codecave);
	VirtualFree(notUsed, 0, MEM_RELEASE);

	duk_push_boolean(ctx, true);
	return 1;  /* one return value */
}


/*
duk_ret_t callOriginal(duk_context *ctx) {
	int n = duk_get_top(ctx);
	int* args = new int[n];
	int retval = 0;

	for (int i = 0; i < n; ++n)
	{
		args[i] = duk_to_number(ctx, i);
	}

	for (int i = n - 1; i >= 0; --i)
	{
		__asm push args[i]
	}

	__asm call org_func
	__asm mov retval, EAX

	duk_push_int(ctx, retval);
	return 1;
}
*/

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

duk_ret_t addressOf(duk_context *ctx) {
	int n = duk_get_top(ctx);  /* #args */

	// Library
	const char* libname = duk_to_string(ctx, 0);
	const char* method = duk_to_string(ctx, 1);

	DWORD addr = (DWORD)GetProcAddress(GetModuleHandleA(libname), method);
	duk_push_int(ctx, addr);
	return 1;
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
		while (len && path[--len] != '\\') {};
		if (len > 0)
		{
			// Override with the API file
			strcpy(&path[len + 1], "api/redirect.js");

			// Load it to duktape
			duk_push_object(ctx);
			duk_eval_file(ctx, path);
		
			// Custom user code
			auto js = "var customCode = function(key) {"						\
			"	print('Inside hook, key = ' + key); "							\
			"}; "																\
			"Redirect(Find('user32.dll', 'GetKeyState'), customCode);";
			duk_push_object(ctx);
			duk_eval_string(ctx, js);
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
