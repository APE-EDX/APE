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
import Console from './console';
import QuickEdit from './quick-edit';
import Options from './options';
import Target from './target-process';
import Notifications from './notifications';
import NewFile from './new-file';

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

ipcRenderer.on('save-result', (event, result) => {
	if (result) {
		Notifications.doNotify({title: 'Injection', body: 'Saved file'}, true);
	}
	else {
		Notifications.doNotify({title: 'Injection', body: 'Could not save file'}, true);
	}
});

var Frames = {
	Target: 	0,
	Project: 	1,
	Console: 	2,
	QuickEdit: 	3,
	Options:	4,
	NewFile: 	5
};

var framesValues = Object.keys(Frames).map(val => Frames[val]);
var nItems = framesValues.reduce(function(mx,c) { return Math.max(mx, c); } );
var initialState = Array(nItems).fill(false);

export default {
	controller: function() {
		return {
			inputValue: m.prop(""),
			showing: Array.from(initialState)
		};
	},

	changeFrame: function(e) {
		this.showing = Array.from(initialState);
		this.showing[e.target.dataset.target] = true;
	},

	overlayFrame: function(e) {
		this.showing[e.target.dataset.target] = true;
	},

	closeOverlayFrame: function(which, e) {
        this.showing[which] = false;
    },

	view: function(ctrl) {
		if (ctrl.showing.every((x) => x == false)) {
			this.changeFrame.bind(ctrl)({target: {dataset: {target: Frames.Project}}})
		}

		return 	m("div.height100.showing-explorer",
			m(Header, {target: target}),
			m(Menu, {
				showing: ctrl.showing,
				default: Frames.Project,
				changeFrame: this.changeFrame.bind(ctrl),
				overlayFrame: this.overlayFrame.bind(ctrl),
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl)
			}),
			m(Target, {
				showing: ctrl.showing[Frames.Target],
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl, Frames.Target)
			}),
			m(Project, {
				showing: ctrl.showing[Frames.Project]
			}),
			m(Console, {
				showing: ctrl.showing[Frames.Console]
			}),
			m(QuickEdit, {
				showing: ctrl.showing[Frames.QuickEdit]
			}),
			m(Options, {
				showing: ctrl.showing[Frames.Options]
			}),
			m(Explorer, {
				changeFrame: this.changeFrame.bind(ctrl),
				showNewFile: this.overlayFrame.bind(ctrl, {target: {dataset: {target: Frames.NewFile}}})
			}),
            m(NewFile, {
				showing: ctrl.showing[Frames.NewFile],
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl, Frames.NewFile)
			})
		);
	}
};
