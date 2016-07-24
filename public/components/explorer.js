import m from 'mithril';
const {ipcRenderer} = require('electron');
const {component: TreeView, TreeElement} = require('./treeview');

var config = ipcRenderer.sendSync('get-config');
var files = [];

ipcRenderer.on('reload-config', (event, newConfig) => {
    config = newConfig;
    m.redraw();
});

ipcRenderer.on('reload-project-files', (event, newFiles) => {
    console.log(newFiles);
    files = newFiles;
    m.redraw();
});

ipcRenderer.send('request-project-files');

export default {
    controller: function(attrs) {
        return {
        };
    },

	view: function(ctrl, attrs) {
		return m('div.explorer',
            m('span', config.activeProject),
            m(TreeView, {treeRoot: []})
        );
	}
};
