// C/C++ Call conventions
CallConvention = {
    AUTO: -1,
    STDCALL: 0,
    CDECLCALL: 1,
    FASTCALL: 2
};

// Wraps a call to GetProcAddress(GetModuleHandle(lib), method)
function Find(lib, method) {
    // Make sure it is using "new"
    if (!(this instanceof Find)) {
        return new Find(lib, method);
    }

    // Save names
    this.lib = lib;
    this.method = method;

    // Get address
    this.address = cpp_addressOf(lib, method);
};

var Redirect = function(orig, callback, convention, identifier) {
    // Setup some defaults
    // Convention default to AUTO
    convention = convention || CallConvention.AUTO;
    // Identifier defaults to a random string
    identifier = identifier || Math.random().toString(32);

    // If no convention has been specified or AUTO was used
    if (convention == CallConvention.AUTO) {
        // Default to C/C++ standard
        convention = CallConvention.CDECLCALL;

        // If we are using a DLL method
        if (orig instanceof Find) {
            // Parse the name alone, without .dll and lower case
            var libname = orig.lib;
            libname = libname.substring(0, libname.lastIndexOf('.dll')) || libname;
            libname = libname.toLowerCase();

            // Windows WINAPI are STDCALL
            if (['kernel32', 'user32', 'gdi32'].indexOf(libname) >= 0) {
                convention = CallConvention.STDCALL;
            }
        }
    }

    // Defer to the bare address
    if (orig instanceof Find) {
        orig = orig.address;
    }

    // Create the redirection
    cpp_redirect(orig, callback.length, identifier, convention, callback);
};
