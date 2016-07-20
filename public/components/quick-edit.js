import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';

let flask = new CodeFlask;

export default {
    controller: function(attrs) {
        return {
            showing: attrs.showing
        }
    },

	configEditor: function(el, hasInit) {
		if (!hasInit) {
    		flask.run('#jseditor', {language: 'js'});
		}
	},

	sendCode: function(e) {
		ipcRenderer.send('send-code', flask.textarea.value);
	},

	view: function(ctrl, attrs) {
        ctrl.showing = attrs.showing;

		return m('div.quick-edit-body.body-frame', {className: ctrl.showing ? '' : 'hidden'},
    			m('h1', 'Javascript Editor'),
    			m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this)}),
    			m('div.buttons',
    				m('button', {onclick: this.sendCode.bind(this), class:'btn btn-success' }, 'Enviar'),
                    m('button#basico', {class:'btn btn-success' }, 'Notification 1'),
                    m('button#imagen', {class:'btn btn-success' }, 'Notification 2')
    			)
    		);
	}
};
