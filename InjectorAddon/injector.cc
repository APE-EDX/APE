// injector.cc
#include <node.h>
#include <Windows.h>
#include <tlhelp32.h>
#include <psapi.h>

#pragma comment(lib, "psapi.lib")

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Boolean;
using v8::String;
using v8::Value;
using v8::Exception;

typedef BOOL (WINAPI *IsWow64Process_t) (HANDLE, PBOOL);

IsWow64Process_t IsWow64Process_g;

enum ProcessBits {
    PROCESS_32,
    PROCESS_32_64,
    PROCESS_64
};

ProcessBits IsWow64Process(HANDLE handle)
{
    BOOL bIsWow64 = FALSE;

    IsWow64Process_g = (IsWow64Process_t)GetProcAddress(GetModuleHandleA("kernel32"), "IsWow64Process");

    if (NULL != IsWow64Process_g)
    {
        if (!IsWow64Process_g(handle, &bIsWow64))
        {
            return PROCESS_32;
        }
    }
    else
    {
        return PROCESS_32;
    }

    return bIsWow64 ? PROCESS_32_64 : PROCESS_64;
}


void enableDebugPriv()
{
    HANDLE hToken;
    LUID luid;
    TOKEN_PRIVILEGES tkp;

    OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken);

    LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &luid);

    tkp.PrivilegeCount = 1;
    tkp.Privileges[0].Luid = luid;
    tkp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;

    AdjustTokenPrivileges(hToken, false, &tkp, sizeof(tkp), NULL, NULL);

    CloseHandle(hToken);
}

template <typename T> bool startAndReturn(char* process, T& retval)
{
    const size_t stringSize = 1000;
    STARTUPINFO si;
    PROCESS_INFORMATION pi;
    DWORD exit_code;

    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));

    // Defaut to -1
    retval = (T)-1;

    // Start the child process. 
    if (!CreateProcessA(NULL,   // No module name (use command line)
        (LPSTR)process,   // Command line
        NULL,           // Process handle not inheritable
        NULL,           // Thread handle not inheritable
        FALSE,          // Set handle inheritance to FALSE
        0,              // No creation flags
        NULL,           // Use parent's environment block
        NULL,           // Use parent's starting directory 
        &si,            // Pointer to STARTUPINFO structure
        &pi)           // Pointer to PROCESS_INFORMATION structure
        )
    {
        return false;
    }

    // Wait until child process exits.
    WaitForSingleObject(pi.hProcess, INFINITE);
    GetExitCodeProcess(pi.hProcess, &exit_code);

    // Close process and thread handles. 
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    retval = (T)exit_code;
    return true;
}

void injectDLL(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // Check the number of arguments passed.
    if (args.Length() < 4)
    {
        // Throw an Error that is passed back to JavaScript
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }

    // Check the argument types
    if (!args[0]->IsString() || !args[1]->IsString() || 
        !args[2]->IsString() || !args[3]->IsString())
    {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong arguments")));
        return;
    }

    // Perform the operation
    v8::String::Utf8Value processV8(args[0]->ToString());
    const char* process = *processV8;

    v8::String::Utf8Value pathV8(args[1]->ToString());
    const char* path = *pathV8;
    const size_t pathLen = strlen(path);

    v8::String::Utf8Value kernel32V8(args[2]->ToString());
    const char* kernel32Exe = *kernel32V8;

    v8::String::Utf8Value kernel64V8(args[3]->ToString());
    const char* kernel64Exe = *kernel64V8;

    PROCESSENTRY32 entry;
    entry.dwSize = sizeof(PROCESSENTRY32);

    HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, NULL);

    if (Process32First(snapshot, &entry) == TRUE)
    {
        while (Process32Next(snapshot, &entry) == TRUE)
        {
            if (stricmp(entry.szExeFile, process) == 0)
            {
                HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, entry.th32ProcessID);
                if (hProcess == NULL)
                {
					args.GetReturnValue().Set(Boolean::New(isolate, false));
					CloseHandle(snapshot);
					return;
                }

                LPVOID pathAddr = VirtualAllocEx(hProcess, NULL, pathLen, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
				if (pathAddr == NULL)
                {
					args.GetReturnValue().Set(Boolean::New(isolate, false));
					CloseHandle(hProcess);
					CloseHandle(snapshot);
					return;
				}

                if (WriteProcessMemory(hProcess, pathAddr, (LPCVOID)path, pathLen, NULL) == 0)
                {
					args.GetReturnValue().Set(Boolean::New(isolate, false));
					CloseHandle(hProcess);
					CloseHandle(snapshot);
					return;
                }

                LPVOID loadLibrary = NULL;
                ProcessBits bits = IsWow64Process(hProcess);
                ProcessBits ownBits = IsWow64Process(GetCurrentProcess());

                if (bits != ownBits)
                {
                    char process = (bits == PROCESS_64) ? kernel64Exe : kernel32Exe;
                    if (!startAndReturn(kernel32Exe, loadLibrary))
                    {
    					args.GetReturnValue().Set(Boolean::New(isolate, false));
    					CloseHandle(hProcess);
    					CloseHandle(snapshot);
    					return;
    				}
                }
                else
                {
                    loadLibary = (LPVOID)GetProcAddress(GetModuleHandleA("Kernel32.dll"), "LoadLibraryA");
                }

                HANDLE hThread = CreateRemoteThread(hProcess, NULL, NULL, (LPTHREAD_START_ROUTINE)loadLibrary, pathAddr, 0, NULL);
				if (hThread == NULL)
                {
					args.GetReturnValue().Set(Boolean::New(isolate, false));
					CloseHandle(hProcess);
					CloseHandle(snapshot);
					return;
				}

                WaitForSingleObject(hThread, INFINITE);
                CloseHandle(hThread);

                printf("Path: %s\nPathAddr: %X\nLoadLib: %X\n", path, pathAddr, loadLibrary);

                CloseHandle(hProcess);
                CloseHandle(snapshot);
                args.GetReturnValue().Set(Boolean::New(isolate, true));
                return;
            }
        }
    }

    CloseHandle(snapshot);
    args.GetReturnValue().Set(Boolean::New(isolate, false));
}

void init(Local<Object> exports) {
	enableDebugPriv();

    NODE_SET_METHOD(exports, "injectDLL", injectDLL);
}

NODE_MODULE(injector, init)

}  // namespace demo
