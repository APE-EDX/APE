import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';


export default {
controller: function(attrs) {
        return {
            showing: attrs.showing
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

view: function(ctrl, attrs) {
	ctrl.showing = attrs.showing;

return m('a','holamundo') 
//m('div#consoleDialog', {className: ctrl.showing ? '' : 'hidden', class: 'modal fade', role: 'dialog'},
//	m('div', {class: 'modal-dialog modal-lg'},
//		m('div', {class: 'modal-content'},
//			m('div', {class: 'modal-header'},
//				m('button', {class: 'close', onclick: this.hideConsole.bind(this)},'x'),
//				m('h4','Select Process:',{class: 'modal-title'})
//   			 ),
//   			m('div', {class: 'modal-body'},
//				m("div#jseditor", {'data-language': "javascript", config: this.configEditor.bind(this) })
//			 ),
//			m('div', {class: 'modal-footer'},
//				m('button', {onclick: this.hideConsole.bind(this), class: 'btn btn-default'}, 'Close')
//				 )
//			 )
//		 )
// 	 )
 }
};