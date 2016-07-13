import m from 'mithril';
import '../less/main.less';
import '../less/codeflask.less';
import '../less/prism.less';

const {ipcRenderer, remote} = require('electron');
const $ = require('jquery');
import CodeFlask from './codeflask';

let flask = new CodeFlask;

export default {

	controller: function() {
		return {
			inputValue: m.prop(""),
			showing: [false, false, false, false, false]
		};
	},

	configEditor: function(el, hasInit) {
		if (!hasInit) {
    		flask.run('#jseditor', {language: 'js'});
		}
	},

	sendCode: function(e) {
		ipcRenderer.send('send-code', flask.textarea.value);
	},

	closeApp: function() {
		remote.getCurrentWindow().close();
	},

	changeFrame: function(e) {
		this.showing = [false, false, false, false, false];
		this.showing[e.target.dataset.target] = true;
	},

	view: function(ctrl) {
		if (ctrl.showing.every((x) => x == false)) {
			ctrl.showing[1] = true;
		}

		return 	m("div.height100",
			m('div.title-frame',
				m('div.title',
					m('span', 'APE')
				),
				m('div.buttons',
					m('button.close-button', { onclick: this.closeApp.bind(this) }, 'X')
				)
			),
			m('div.menu-frame',
				m('div.buttons',
					m('a','File'),
					m('a','Edit'),
					m('a','About')
				)
			),

			m('div', {class: 'menu-lateral'}, //col-sm-3 col-md-2 sidebar
				m("ul", //nav nav-sidebar
					m('li', {className: ctrl.showing[0] ? 'menu-active' : ''},
						m('a#menuLeft', {
							onclick: this.changeFrame.bind(ctrl),
							'data-target': 0
						}, 'Target')
					),
					m('li', {className: ctrl.showing[1] ? 'menu-active' : ''},
						m('a#menuLeft', {
							onclick: this.changeFrame.bind(ctrl),
							'data-target': 1
						}, 'Project')
					),
					m('li', {className: ctrl.showing[2] ? 'menu-active' : ''},
						m('a#menuLeft', {
							onclick: this.changeFrame.bind(ctrl),
							'data-target': 2
						}, 'Console')
					),
					m('li', {className: ctrl.showing[3] ? 'menu-active' : ''},
						m('a#menuLeft', {
							onclick: this.changeFrame.bind(ctrl),
							'data-target': 3
						}, 'Quick Edit')
					),
					m('li', {className: ctrl.showing[4] ? 'menu-active' : ''},
						m('a#menuLeft', {
							onclick: this.changeFrame.bind(ctrl),
							'data-target': 4
						}, 'Something')
					)
				)
			),

			m('div.quick-edit-body.body-frame', {className: ctrl.showing[3] ? '' : 'hidden'},
				m('h1', 'Javascript Editor'),
				m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this)}),
				m('div.buttons',
					m('button', {onclick: this.sendCode.bind(this), class:'btn btn-success' }, 'Enviar')
				)
			)
		);
	}
};
