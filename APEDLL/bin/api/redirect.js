// Redirect a function
var Redirect = function(orig, callback, identifier) {
    // Identifier defaults to a random string
    identifier = identifier || Math.random().toString(32);

    // Default to CDECL
    var convention = CallConvention.CDECLCALL;

    // Defer to the bare address
    if (orig instanceof Find || orig instanceof Ptr) {
        orig = orig.address;
        convention = orig.convention;
    }

    // Create the redirection
    cpp_redirect(orig, callback.length, identifier, convention, callback);
};
