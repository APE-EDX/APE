import m from 'mithril';
import '../less/main.less';
import '../less/codeflask.less';
import '../less/prism.less';
const {ipcRenderer} = require('electron');

// Other modules
import Header from './header';
import Menu from './menu';
import QuickEdit from './quick-edit';
import Target from './target-process';


var target = null;
ipcRenderer.on('set-target', (event, resultTarget) => {
	target = resultTarget.result ? resultTarget : null;
	m.endComputation();
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
		return 	m("div.height100",
			m(Header, {target: target}),
			m(Menu, {
				showing: ctrl.showing,
				default: 2,
				changeFrame: this.changeFrame.bind(ctrl),
				overlayFrame: this.overlayFrame.bind(ctrl),
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl)
			}),
			m(QuickEdit, {showing: ctrl.showing[3]}),
			m(Target, {showing: ctrl.showing[0], closeOverlayFrame: this.closeOverlayFrame.bind(ctrl, 0)})
		);
	}
};
