// NPM imports
const {ipcMain}  = require('electron');
const path = require("path");
const net = require("net");

// Try to load injector
try {
    var injector = require('../InjectorAddon/bin/' + process.arch + '/injector');
}
catch(e) {
    var injector = false;
    console.error("Injector not available yet in this platform");
}

// Is windows and paths
const isWin = /^win/.test(process.platform);
const dllPath = path.resolve(__dirname, "../APEDLL/bin/APEDLL_{}.dll").replace("app.asar", "app.asar.unpacked");
const soPath =  path.resolve(__dirname, "../APESO/bin/libAPESO_{}.so").replace("app.asar", "app.asar.unpacked");
const kernelExe = path.resolve(__dirname, "../APEKernel/bin/APEKernel{}.exe").replace("app.asar", "app.asar.unpacked");

let dllSocket = null;
let serverReady = false;
let currentTarget = null;


var debounce = (x) => {
    return () => {
        var now = +new Date;
        (!debounce.last || (now - debounce.last) > 2000) && x();
        debounce.last = now;
    };
};

let inject = (target) => {
    if (dllSocket) {
        // Avoid having a notification
        debounce(() => {});
        // Disconnect and null-it
        dllSocket.destroy();
        dllSocket = null;
    }

    currentTarget = target;
    if (serverReady && injector) {
        if (isWin) {
            return injector.injectDLLByPID(target.pid, dllPath, kernelExe);
        }
        else {
            return injector.injectDLLByPID(target.pid, soPath);
        }
    }

    return false;
}

let send = function(code) {
    if (dllSocket) {
        var obj = {method: 'eval_js', args: [code]};
        var json = JSON.stringify(obj);
        var len = json.length;
        var bytes = [len & 0xFF, (len & 0xFF00) >> 8];
        dllSocket.write(new Buffer(bytes));
        dllSocket.write(json);
    }
}

module.exports = (rendererWindow, callback) => {
    // Create the TCP server
    var server = net.createServer((socket) => {
        if (dllSocket == null) {
            dllSocket = socket;

            var lostConn = () => {
                currentTarget.lost = true;
                rendererWindow.webContents.send('lost-target', currentTarget);
            };

            socket
                .on('disconnect', debounce(lostConn))
                .on('error', debounce(lostConn))
                .on('close', debounce(lostConn));
        }
    }).on('error', (err) => {
        dllSocket = null;
    });

    // Listen on TCP
    server.listen(25100, 'localhost', () => {
        address = server.address();
        serverReady = true;
        console.log('Opened server on %j', address);

        callback && callback();
    });

    // Send-code event
    ipcMain.on('send-code', (event, arg) => {
        send(arg);
    });

    // Inject event
    ipcMain.on('inject', (event, arg) => {
        event.returnValue = inject(arg);
    });

    return {
        injector: injector,
        inject: inject,
        send: send,
    };
};
