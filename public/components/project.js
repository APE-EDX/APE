import m from 'mithril';
const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

var projects = [];

var scanProjects = function(config) {
    ipcRenderer.send('scan-projects', config.projectFolder);
    m.startComputation();
}

ipcRenderer.on('scanned-projects', (event, args) => {
    projects = args;
    m.endComputation();
});

export default {
    controller: function(attrs) {
        var config = ipcRenderer.sendSync('get-config');
        if (!config.projectFolder) {
            config.projectFolder = ipcRenderer.sendSync('get-default-projects-path');
            ipcRenderer.send('set-config', config);
        }

        return {
            showing: attrs.showing,
            config: config
        }
    },

    showDialog: function(ctrl, e) {
        var folder = dialog.showOpenDialog({properties: ['openDirectory'], defaultPath: ctrl.config.projectFolder});
        if (folder) {
            ctrl.config.projectFolder = folder[0];
            ipcRenderer.send('set-config', ctrl.config);
            scanProjects(ctrl.config);
        }
    },

    setActive: function(ctrl, el, e) {
        ctrl.config.activeProject = el;
        ipcRenderer.send('set-config', ctrl.config);
    },

	view: function(ctrl, attrs) {
        if (!ctrl.showing && attrs.showing) {
            scanProjects(ctrl.config);
        }

        ctrl.showing = attrs.showing;

		return m('div.project-body.body-frame', {className: ctrl.showing ? '' : 'hidden'},
    			m('h1', 'Projects root folder'),
                m('div.inputfile', {onclick: this.showDialog.bind(this, ctrl)}, ctrl.config.projectFolder),
                m('div.button', {onclick: this.showDialog.bind(this, ctrl)}, 'Click to select'),
                m('h1', 'Projects'),
                m('ul', projects.map((el) => {
                    return m('li', {
                        className: ctrl.config.activeProject == el ? 'project active' : 'project',
                        onclick: this.setActive.bind(this, ctrl, el)
                    }, el);
                }))
    		);
	}
};
