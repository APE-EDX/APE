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
		this.inputValue = m.prop("")
	},

	configEditor: function(el) {
    	this.flask.run('#jseditor', {language: 'js'});
	},

	sendCode: function(e) {
		ipcRenderer.send('send-code', this.flask.textarea.value);
	},
	showConsole: function(){
		alert("work");
		//this.flask.run('#showConsole', {language: 'js'}); // no funciona si esta ejecutando jseditor
			m('div#showConsole',{'data-language': "javascript", class: 'modal fade', role: 'dialog'},
			m('div', {class: 'modal-dialog modal-lg'},
			m('div', {class: 'modal-content'},
			m('div', {class: 'modal-header'},
			m('button',{class: 'close', 'data-dismiss': 'modal'},'x'),
			m('h4','JS Console',{class: 'modal-title'})),
			m('div', {class: 'modal-body'},
			m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this) })),
			m('div', {class: 'modal-footer'},
			m('button', {onclick: this.sendCode.bind(this), class:'btn btn-lg btn-primary' }, 'Enviar'),
			m('button', {class: 'btn btn-default', 'data-dismiss': 'modal'}, 'Close')))))
	},

	view: function(ctrl){
		return 	m("div",
			m('nav', {class : 'navbar navbar-default navbar-fixed-top'}, 
			m('div', {class: 'container'},
			m('div', {class: 'navbar-header'},
			m('div#navbar',{class: 'navbar-collapse collapse'},
			m('ul',{class: 'nav navbar-nav'},
			m('li',{class: 'active'},
			m('a','Console')),
			//button type html m('button', {class: 'btn btn-info btn-lg', 'data-toggle': 'modal', 'data-target': 'showConsole'}, 'Console'),
			m('button', {onclick: this.showConsole.bind(this), class:'btn btn-lg btn-primary' }, 'Console'),
			m('li',{class: 'active'},
			m('a','Dump')),
			m('li',{class: 'active'},
			m('a','PushEdx',{href:'http://www.pushedx.net/'}))))))),
			m("h1", "Welcome"),
			m('div#showConsole',{'data-language': "javascript", class: 'modal fade', role: 'dialog'},
			m('div', {class: 'modal-dialog modal-lg'},
			m('div', {class: 'modal-content'},
			m('div', {class: 'modal-header'},
			m('button',{class: 'close', 'data-dismiss': 'modal'},'x'),
			m('h4','JS Console',{class: 'modal-title'})),
			m('div', {class: 'modal-body'},
			m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this) })),
			m('div', {class: 'modal-footer'},
			m('button', {onclick: this.sendCode.bind(this), class:'btn btn-lg btn-primary' }, 'Enviar'),
			m('button', {class: 'btn btn-default', 'data-dismiss': 'modal'}, 'Close')))))

		);
	}
};
