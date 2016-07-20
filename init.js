CreateConsole();

/*
var customCode = function(key) {
    print('Inside hook, key = ' + key);
    return this.fn(key);
}

Redirect(Find('user32.dll', 'GetKeyState'), customCode);
*/

/*
var customCode = function(socket, buf, len, flags) {
    print('Inside hook, key = ' + socket + " " + len + " " + flags);
    var len = this.fn(socket, buf, len, flags);
    print('Sent len ' + len);
    return len;
}

Redirect(Find('ws2_32.dll', 'send'), customCode);

*/
