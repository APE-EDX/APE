// Require electron modules
const {app, BrowserWindow, ipcMain}  = require('electron');
const path = require("path");
const exec = require('child_process').exec;

// TODO: Remove the callback
const inject = require('./inject')(function() {
    console.log("Injection result: " + inject.inject('NostaleX-0.9.3.3057-local.exe'));
});



// TODO: Change Location?
ipcMain.on('getProc', (event, arg) => {

   console.log(arg);  // prints "ping"
   console.log("getPRoc");  // prints "ping"

   exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
	  if (err) {
		console.error(err);
		return;
	  }
	    event.sender.send('procReply', stdout);

	} );

});




let argv = [process.argv[0], '.'];
Array.prototype.push.apply(argv, process.argv.slice(1));

const program = require("commander")
    .option("-d, --dev-tools", "Open Dev Tools on start up")
    .option("-r, --hard-reloading", "Open Dev Tools on start up")
    .parse(argv)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Live reloading (only when developing!)
try {
    let options = {};
    if (program.hardReloading) {
        options['electron'] = require('electron-prebuilt');
    }
    require('electron-reload')(path.resolve(__dirname, '../dist'), options);
}
catch (e) {}

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    app.commandLine.appendSwitch('js-flags', '--harmony_iteration');
    app.commandLine.appendSwitch('js-flags', '--harmony_symbols');
    app.commandLine.appendSwitch('js-flags', '--harmony_observation');
    app.commandLine.appendSwitch('js-flags', '--harmony_scoping');
    app.commandLine.appendSwitch('js-flags', '--harmony_modules');
    app.commandLine.appendSwitch('js-flags', '--harmony_proxies');
    app.commandLine.appendSwitch('js-flags', '--harmony_collections');
    app.commandLine.appendSwitch('js-flags', '--harmony_generators');
    app.commandLine.appendSwitch('js-flags', '--harmony_arrow_functions');

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1000, height: 600, frame: false, resizable: false});
    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + path.resolve(__dirname, '../public/index.html'));

    // Create Splash Screen.
    let splashWindow = new BrowserWindow({width: 400, height: 560, frame: false, resizable: false, algaysOnTop: true });
    splashWindow.setMenu(null);
    setTimeout(() => { splashWindow.close(); }, 2000);

    // load the splash.html of the app.
    splashWindow.loadURL('file://' + path.resolve(__dirname,'../public/splash.html'));

    // Open the devtools.
    program.devTools && mainWindow.openDevTools({detached:true});

    // Emitted when the window is closed.
    mainWindow.on('closed', function(){
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        process.exit(0);
    })
});
