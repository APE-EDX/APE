// Require electron modules
const {app, BrowserWindow, ipcMain}  = require('electron');
const path = require("path");
const fs = require('fs');
const mkdirp = require('mkdirp');
const exec = require('child_process').exec;
var jsonfile = require('jsonfile');
var inject = require('./inject');

const configPath = path.resolve(__dirname, path.join('..', 'config', 'default.json'));
var config = {};
jsonfile.readFile(configPath, (err, obj) => { config = obj; });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// TODO: Change Location?
ipcMain.on('getProc', (event, arg) => {
   exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
	  if (err) {
		console.error(err);
		return;
	  }

      event.sender.send('procReply', stdout);
	});
});

// Broadcast set-target
ipcMain.on('set-target', (event, target) => {
    var result = inject.inject(target);
    target.result = result;
    event.sender.send('set-target', target);
});


ipcMain.on('get-default-projects-path', (event, target) => {
    event.returnValue = path.resolve(__dirname, path.join('..', 'Projects'));
});

ipcMain.on('get-config', (event, target) => {
    event.returnValue = config;
});

ipcMain.on('set-config', (event, newConfig) => {
    var isReloadProjectFiles = config.activeProject != newConfig.activeProject;
    config = newConfig;
    jsonfile.writeFile(configPath, config, () => {});
    event.sender.send('reload-config', config);
    isReloadProjectFiles && reloadProjectFiles(event.sender);
});

ipcMain.on('scan-projects', (event, where) => {
    var projects = [];
    try {
        // TODO: Async
        projects = fs.readdirSync(where).filter(function(file) {
            var current = path.join(where, file);
            if (fs.statSync(current).isDirectory()) {
                try {
                    return fs.statSync(path.join(current, '.ape')).isFile();
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        });
    }
    catch (e) {
        // Unexisting dir
    }

    event.sender.send('scanned-projects', projects);
})

ipcMain.on('request-project-files', (event, args) => {
    reloadProjectFiles(event.sender);
});

var currentFile = null;
ipcMain.on('quick-edit-file', (event, file) => {
    currentFile = file;
    fs.readFile(file, 'utf-8', (err, data) => {
        event.sender.send('quick-edit-contents', data);
    })
});

ipcMain.on('new-file', (event, file) => {
    var root = path.join(config.projectFolder, config.activeProject);
    var filePath = path.join(root, path.dirname(file));
    mkdirp(filePath, err => {
        fs.writeFile(path.join(root, file), '', 'utf-8', err => {
            reloadProjectFiles(event.sender);
        });
    });
});

ipcMain.on('save-code', (event, data) => {
    if (currentFile) {
        fs.writeFile(currentFile, data, 'utf-8', (err) => {
            event.sender.send('save-result', !!!err);
        });
    } else {
        event.sender.send('save-result', false);
    }
});

ipcMain.on('send-all', (event, args) => {
    var root = path.join(config.projectFolder, config.activeProject);
    var OEP = jsonfile.readFileSync(path.join(root, '.ape')).OEP;

    var recur = function(dir, root) {
        var list = fs.readdirSync(dir);

        list.forEach(function(file){
            var file2 = path.resolve(dir, file);
            var stats = fs.statSync(file2);

            if(stats.isDirectory()) {
                recur(file2, path.join(root, file));
            }
            else {
                var isOEP = !path.relative(path.join(root, file), OEP);
                var isAPE = !path.relative(path.join(root, file), '.ape');

                if (isOEP) {
                    OEP = file2;
                }
                else if (!isAPE) {
                    console.log('Sending ' + file2);
                    inject.send(fs.readFileSync(file2, 'utf-8'));
                }
            }
        });
    };

    recur(root, '.');
    console.log('Sending ' + OEP);
    inject.send(fs.readFileSync(OEP, 'utf-8'));
});

function reloadProjectFiles(sender) {
    var recur = function(dir, acc) {
        var list = fs.readdirSync(dir);

        list.forEach(function(file){
            var file2 = path.resolve(dir, file);
            var stats = fs.statSync(file2);

            if(stats.isDirectory()) {
                acc.push(recur(file2, []));
            }
            else {
                acc.push(file);
            }
        });

        var o = {};
        o[path.basename(dir)] = acc;
        return o;
    };

    try {
        if (config.projectFolder && config.activeProject) {
            var files = recur(path.join(config.projectFolder, config.activeProject), []);
            var ret = {root: config.projectFolder, files: files};
            (sender || mainWindow.webContents).send('reload-project-files', ret);
            return ret;
        }
    }
    catch (e) {
        // Unexisting directory
    }

    return [];
}

let argv = [process.argv[0], '.'];
Array.prototype.push.apply(argv, process.argv.slice(1));

const program = require("commander")
    .option("-d, --dev-tools", "Open Dev Tools on start up")
    .option("-r, --hard-reloading", "Open Dev Tools on start up")
    .parse(argv)

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
    mainWindow = new BrowserWindow({width: 1000, height: 600, frame: false, resizable: false, show: false});
    mainWindow.setMenu(null);

    // Setup inject
    inject = inject(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + path.resolve(__dirname, '../public/index.html'));

    // Create Splash Screen.
    let splashWindow = new BrowserWindow({width: 400, height: 560, frame: false, resizable: false, algaysOnTop: true });
    splashWindow.setMenu(null);
    setTimeout(() => { splashWindow.close(); mainWindow.show(); }, 2000);

    // load the splash.html of the app.
    splashWindow.loadURL('file://' + path.resolve(__dirname,'../public/splash.html'));

    // Open the devtools.
    program.devTools && mainWindow.openDevTools({mode: 'detach'});

    // Emitted when the window is closed.
    mainWindow.on('closed', function(){
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        process.exit(0);
    })
});
