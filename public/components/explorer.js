import m from 'mithril';
const {ipcRenderer} = require('electron');
const {component: TreeView, TreeElement} = require('./treeview');
const path = require('path');

var config = ipcRenderer.sendSync('get-config');
var files = [];

ipcRenderer.on('reload-config', (event, newConfig) => {
    config = newConfig;
    m.redraw();
});

ipcRenderer.on('reload-project-files', (event, newFiles) => {
    console.log(newFiles);

    var recurse = function(what, acc, root) {
        if (!Array.isArray(what) && typeof what == "object") {
            var key = Object.keys(what)[0];
            var children = recurse(what[key], [], path.join(root, key));
            acc.push(new TreeElement(key, children));
        }
        else if (Array.isArray(what)) {
            for (var i = 0; i < what.length; ++i) {
                acc.push(recurse(what[i], [], root)[0]);
            }
        }
        else {
            acc.push(new TreeElement(what));
        }

        return acc;
    }

    files = recurse(newFiles, [], '');
    console.log(files);
    m.redraw();
});

ipcRenderer.send('request-project-files');

export default {
    controller: function(attrs) {
        return {
            changeFrame: attrs.changeFrame
        };
    },

    fileClicked: function(ctrl, e) {
        // Broadcast edition
        ipcRenderer.send('quick-edit-file', e.target.dataset.name);

        // Goto quick-edit
        ctrl.changeFrame({target: {dataset: {target: 3}}});
    },

	view: function(ctrl, attrs) {
		return m('div.explorer',
            m('div.treeview',
                m(TreeView, {treeRoot: files, fileClick: this.fileClicked.bind(this, ctrl)})
            ),
            m('div.buttons',
                m('button', 'Send')
            )
        );
	}
};
