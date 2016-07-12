// NPM imports
const {ipcMain}  = require('electron');
const path = require("path");
const net = require("net");

// Try to load injector
try {
    var injector = require('../InjectorAddon/build/Release/injector');
}
catch(e) {
    var injector = false;
    console.error("Injector not available yet in this platform");
}

const dllPath = path.resolve(__dirname, "../APEDLL/bin/APEDLL.dll");
const kernel32Exe = path.resolve(__dirname, "../APEKernel32/Release/APEKernel32.exe");
const kernel64Exe = path.resolve(__dirname, "../APEKernel32/Release/APEKernel64.exe");

let dllSocket = null;
let serverReady = false;

let inject = (targetProcess) => {
    return serverReady && injector && injector.injectDLL(targetProcess, dllPath, kernel32Exe, kernel64Exe);
}

module.exports = () => {
    // Create the TCP server
    var server = net.createServer((socket) => {
        if (dllSocket == null) {
            dllSocket = socket;
        }
    }).on('error', (err) => {
        dllSocket = null;
    });

    // Listen on TCP
    server.listen(25100, 'localhost', () => {
        address = server.address();
        serverReady = true;
        console.log('Opened server on %j', address);
    });

    // Send-code event
    ipcMain.on('send-code', (event, arg) => {
        if (dllSocket) {
            var json = {method: 'eval_js', args: [arg]};
            dllSocket.write(JSON.stringify(json));
        }
    });

    // Inject event
    ipcMain.on('inject', (event, arg) => {
        event.returnValue = inject(arg);
    });

    return {
        injector: injector,
        inject: inject
    };
};
