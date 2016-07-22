CreateConsole();

/*
var customCode = function(key) {
    print('Inside hook, key = ' + key);
    return this.fn(key);
}

Redirect(Find('user32.dll', 'GetKeyState'), customCode);
*/

/*
Redirect.restoreAll();

var customCode = function(socket, buf, len, flags) {
    var org = buf.string(len.get());
    var dec = "";

    for (var i = 0; i < org.length; ++i) {
        dec += char((org.charCodeAt(i) - 0xF) ^ 0xC3)
    }

    print(dec);
    return this.fn(socket, buf, len, flags);
}

Redirect(Find('ws2_32.dll', 'send'), customCode);

*/
