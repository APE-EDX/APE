import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';


//TODO: Improve 
ipcRenderer.on('procReply', (event, arg) => {
  console.log(arg); // prints "pong"
  var res = arg.replace(/\r/g, ","); 
  res = res.split(",");



	document.getElementById("procContainer").innerHTML = ""; 
	for(var i = 0; i < res.length/5 ; i++){
		document.getElementById("procContainer").innerHTML += "Name: " +res[i*5]+ " PID: "+ res[i*5 +1] +"<hr>";
	}
});


export default {
reloadProc:	function(){
	ipcRenderer.send('getProc', 'getProc-value');


},
	
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
			 
				 
				m('div#procContainer', {class: 'modal-body'}, ''
				 ), 
				 
		

			 
			m('div', {class: 'modal-footer'},
				m('button', {onclick: ctrl.closeOverlayFrame, class: 'btn btn-default'}, 'Close')
			 ),
				m('button', {onclick: this.reloadProc.bind(this), class: 'btn btn-default'}, 'Reload')
			)
		 )
 	 );
 }
};
