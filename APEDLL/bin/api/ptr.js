// Wraps a pointer
function Ptr(orig, offset, convention) {
    // Make sure it is using "new"
    if (!(this instanceof Ptr)) {
        return new Ptr(orig, offset, convention);
    }

    if (orig instanceof Ptr) {
        // Pointer of pointer not yet implemented
        return false;
    }

    // Save address
    this.address = orig;

    // If no convention has been specified or AUTO was used
    this.convention = convention >= 0 ? convention : CallConvention.CDECLCALL;
};
