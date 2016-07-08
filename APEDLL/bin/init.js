
var customCode = function(key) {
    print('Inside hook, key = ' + key);
}

Redirect(Find('user32.dll', 'GetKeyState'), customCode);
