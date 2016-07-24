import m from 'mithril';
import '../less/main.less';
import '../less/light.less';
import '../less/codeflask.less';
import '../less/prism.less';
const {ipcRenderer} = require('electron');

// Other modules
import Header from './header';
import Menu from './menu';
import Explorer from './explorer';
import Project from './project';
import QuickEdit from './quick-edit';
import Target from './target-process';
import Notifications from './notifications';

var target = null;
ipcRenderer.on('set-target', (event, resultTarget) => {
	if (resultTarget.result) {
		Notifications.doNotify({title: 'Injection', body: 'APE injection was successful'}, true);
		target = resultTarget;
	}
	else {
		Notifications.doNotify({title: 'Injection', body: 'APE could not inject the DLL'}, true);
		target = null;
	}

	m.endComputation();
});

ipcRenderer.on('lost-target', (event, lostTarget) => {
	Notifications.doNotify({title: 'Injection', body: 'APE lost connection with ' + lostTarget.name}, true);
	target = lostTarget;
	m.redraw();
});

export default {
	controller: function() {
		return {
			inputValue: m.prop(""),
			showing: [false, false, false, false, false]
		};
	},

	changeFrame: function(e) {
		this.showing = [false, false, false, false, false];
		this.showing[e.target.dataset.target] = true;
	},

	overlayFrame: function(e) {
		this.showing[e.target.dataset.target] = true;
	},

	closeOverlayFrame: function(which, e) {
        this.showing[which] = false;
    },

	view: function(ctrl) {
		return 	m("div.height100.showing-explorer",
			m(Header, {target: target}),
			m(Menu, {
				showing: ctrl.showing,
				default: 2,
				changeFrame: this.changeFrame.bind(ctrl),
				overlayFrame: this.overlayFrame.bind(ctrl),
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl)
			}),
			m(Project, {
				showing: ctrl.showing[1]
			}),
			m(QuickEdit, {showing: ctrl.showing[3]}),
			m(Target, {showing: ctrl.showing[0], closeOverlayFrame: this.closeOverlayFrame.bind(ctrl, 0)}),
			m(Explorer, {
				changeFrame: this.changeFrame.bind(ctrl)
			})
		);
	}
};
