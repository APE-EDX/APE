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


/*
Redirect.restoreAll();

var customSend = function(socket, buf, len, flags) {
    var str = buf.string(len.get());
    print('Send (' + len.get() + ') : ' + str);
    return this.fn(socket, buf, len, flags);
}

Redirect(Find('ws2_32.dll', 'send'), customSend);

var customRecv = function(socket, buf, len, flags) {
    var len = this.fn(socket, buf, len, flags);
    var str = buf.string(len.get());
    print('Recv (' + len.get() + ') : ' + str);
    return len;
}

Redirect(Find('ws2_32.dll', 'recv'), customRecv);
*/


/*
Redirect.restoreAll();

var customSend = function(socket, bufs, count, bytes, flags, overlapped, completion) {
    var len = bufs.value.get();
    var buf = Ptr(bufs.get(), ptrSize()).value;
    var str = buf.string(len);
    print('Send (' + len + ') : ' + str);
    return this.fn(socket, bufs, count, bytes, flags, overlapped, completion);
}

Redirect(Find('ws2_32.dll', 'WSASend'), customSend);
*/

/*
Redirect.restoreAll();

var customSend = function(socket, bufs, count, bytes, flags, overlapped, completion) {
    print('--------------------------');
    print(socket);
    print(bufs);
    print(count);
    print(bytes);
    print(flags);
    print(overlapped);
    print(completion);
    print('bufs[0].len = ' + bufs.value);
    return this.fn(socket, bufs, count, bytes, flags, overlapped, completion);
}

Redirect(Find('ws2_32.dll', 'WSASend'), customSend);
*/
