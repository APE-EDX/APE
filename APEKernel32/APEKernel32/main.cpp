#include <Windows.h>

int main() {
    ShowWindow(GetConsoleWindow(), SW_HIDE);
    return (int)GetProcAddress(GetModuleHandleA("kernel32.dll"), "LoadLibraryA");
}
