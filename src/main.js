var app = require('electron').app;  // Module to control application life.
var BrowserWindow = require('electron').BrowserWindow;  // Module to create native browser window.
// var crashReporter = require('electron').crashReporter;
var path = require("path")

var program = require("commander")
  .option("-d, --dev-tools", "Open Dev Tools on start up")
  .option("-r, --hard-reloading", "Open Dev Tools on start up")
  .parse(process.argv)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Live reloading
let options = {};
if (program.hardReload) {
    options['electron'] = require('electron-prebuilt');
}
require('electron-reload')(path.resolve(__dirname, '../dist'), options);

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
  mainWindow = new BrowserWindow({width: 1000, height: 600 });
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + path.resolve(__dirname, '../public/index.html'));

  // Open the devtools.
  program.devTools && mainWindow.openDevTools({detached:true});

  // Emitted when the window is closed.
  mainWindow.on('closed', function(){
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
});
