import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';


export default {
controller: function(attrs) {
        return {
            showing: attrs.showing,
            closeOverlayFrame: attrs.closeOverlayFrame
        }
    },


hideConsole: function() {
		if (this.showing && !this.closing) {
			this.showing = false;
			this.closing = false;

			this.dialog.className = 'model fade show';

			setTimeout((function() {
				this.dialog.className = 'model fade hide';
				this.closing = false;
			}).bind(this), 500);
		}
	},

view: function(ctrl, attrs) {
	ctrl.showing = attrs.showing;

return m('div#consoleDialog', {className: ctrl.showing ? 'modal fade in show' : 'modal fade hidden', role: 'dialog'},
	m('div', {class: 'modal-dialog modal-lg'},
		m('div', {class: 'modal-content'},
			m('div', {class: 'modal-header'},
				m('button', {class: 'close', onclick: ctrl.closeOverlayFrame},'x'),
				m('h4','Select Process:',{class: 'modal-title'})
   			 ),
   			m('div', {class: 'modal-body'}, 'aaa'
			 ),
			m('div', {class: 'modal-footer'},
				m('button', {onclick: ctrl.closeOverlayFrame, class: 'btn btn-default'}, 'Close')
				 )
			 )
		 )
 	 );
 }
};
