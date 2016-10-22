import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';

let flask = new CodeFlask;

ipcRenderer.on('quick-edit-contents', (event, data) => {
    flask.update(data);
    m.redraw();
});

export default {
    controller: function(attrs) {
        return {
            showing: attrs.showing,
            ipcSet: false
        }
    },

	configEditor: function(el, hasInit) {
		if (!hasInit) {
    		flask.run('#jseditor', {language: 'js'});
		}
	},

    saveCode: function(e, isSync) {
        ipcRenderer.send('save-code', {async: !isSync, text: flask.textarea.value});
    },

	sendCode: function(e) {
		ipcRenderer.send('send-code', flask.textarea.value);
	},

	view: function(ctrl, attrs) {
        ctrl.showing = attrs.showing;

        if (!ctrl.ipcSet) {
            ipcRenderer.on('save-request', (event, data) => {
                this.saveCode({}, true);
            });
        }

		return m('div.quick-edit-body.body-frame', {className: ctrl.showing ? '' : 'hidden'},
    			m('h1', 'Javascript Editor'),
    			m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this)}),
    			m('div.buttons',
                    m('button', {onclick: this.saveCode.bind(this), class: 'btn btn-success'}, 'Save'),
    				m('button', {onclick: this.sendCode.bind(this), class: 'btn btn-success'}, 'Send')
    			)
    		);
	}
};
