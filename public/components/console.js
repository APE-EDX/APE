import m from 'mithril';
const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;


export default {
    controller: function(attrs) {
        return {
            showing: attrs.showing
        }
    },

	view: function(ctrl, attrs) {
        ctrl.showing = attrs.showing;
		return m('div.console-body.body-frame', {className: ctrl.showing ? '' : 'hidden'},
            m('div.todo', 'Work in progress')
        );
	}
};
