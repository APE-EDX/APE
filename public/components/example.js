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

	view: function(ctrl){
		return m("div",
			m("h1", "Welcome"),
			m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this) }),
			m('button', {onclick: this.sendCode.bind(this) }, 'Enviar')
		);
	}
};
