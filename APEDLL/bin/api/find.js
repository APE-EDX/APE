// Wraps a call to GetProcAddress(GetModuleHandle(lib), method)
function Find(lib, method, convention) {
    // Make sure it is using "new"
    if (!(this instanceof Find)) {
        return new Find(lib, method);
    }

    // Save names
    this.lib = lib;
    this.method = method;

    // Stripped name (without .dll and lower case)
    this.name = lib;
    this.name = this.name.substring(0, this.name.lastIndexOf('.dll')) || this.name;
    this.name = this.name.toLowerCase();

    // Get address
    this.address = cpp_addressOf(lib, method);

    // If no convention has been specified or AUTO was used
    convention = convention || CallConvention.AUTO;
    if (convention == CallConvention.AUTO) {
        // WINAPIs are STDCALL
        if (['kernel32', 'user32', 'gdi32'].indexOf(this.name) >= 0) {
            convention = CallConvention.STDCALL;
        }
        else {
            // Default to C/C++ standard
            convention = CallConvention.CDECLCALL;
        }
    }

    // Save convention
    this.convention = convention;
}
