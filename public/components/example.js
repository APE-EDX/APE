import m from 'mithril';
import '../less/main.less';
import '../less/codeflask.less';
import '../less/prism.less';

const {ipcRenderer} = require('electron');

import CodeFlask from './codeflask';

console.log(CodeFlask);

export default {
	flask: new CodeFlask,

	controller: function(){
		this.inputValue = m.prop("");
		this.showing = false;
		this.closing = false;
	},

	configEditor: function(el) {
    	this.flask.run('#jseditor', {language: 'js'});
	},

	sendCode: function(e) {
		ipcRenderer.send('send-code', this.flask.textarea.value);
	},

	showConsole: function(){
		if (!this.showing && !this.closing) {
			this.showing = true;
			this.dialog.className = 'model fade in show';
		}
	},

	hideConsole: function() {
		if (this.showing && !this.closing) {
			this.showing = false;
			this.closing = true;

			this.dialog.className = 'model fade show';
			
			setTimeout((function() {
				this.dialog.className = 'model fade hide'; 
				this.closing = false;
			}).bind(this), 500);
		}
	},

	dialogConfig: function(el) {
		this.dialog = el;
	},

	view: function(ctrl){
		return 	m("div",
			m('nav', {class : 'navbar navbar-default navbar-fixed-top'}, 
				m('div', {class: 'container'},
					m('div', {class: 'navbar-header'},
						m('div#navbar',{class: 'navbar-collapse collapse'},
							m('ul',{class: 'nav navbar-nav'},
								m('li',{class: 'active'},
									m('a','Console')
								),
								m('li',{class: 'active'},
									m('a','Dump')
								),
								m('li',{class: 'active'},
									m('a','PushEdx', {href:'http://www.pushedx.net/'})
								)
							)
						)
					)
				)
			),
			m("h1", {style: {'margin-top': '60px'}}, "Welcome"),
			m('div#consoleDialog', {config: this.dialogConfig.bind(this), class: 'modal fade', role: 'dialog'},
				m('div', {class: 'modal-dialog modal-lg'},
					m('div', {class: 'modal-content'},
						m('div', {class: 'modal-header'},
							m('button', {class: 'close', onclick: this.hideConsole.bind(this)},'x'),
							m('h4','JS Console',{class: 'modal-title'})
						),
						m('div', {class: 'modal-body'},
							m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this) })
						),
						m('div', {class: 'modal-footer'},
							m('button', {onclick: this.sendCode.bind(this), class:'btn btn-lg btn-primary' }, 'Enviar'),
							m('button', {onclick: this.hideConsole.bind(this), class: 'btn btn-default'}, 'Close')
						)
					)
				)
			),
			m('button', {onclick: this.showConsole.bind(this), class:'btn btn-lg btn-primary' }, 'Console')
		);
	}
};
