import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';

export default {
    reloadProc:	function(){
        m.startComputation();
        ipcRenderer.send('getProc', null);
    },

    controller: function(attrs) {
        return {
            showing: attrs.showing,
            closeOverlayFrame: attrs.closeOverlayFrame,
            inputValue: m.prop("")
        }
    },

    focusSearch: function(el, hasInit) {
        hasInit && el.focus();
    },

    createFile: function(ctrl, e) {
        ipcRenderer.send('new-file', ctrl.inputValue());
        ctrl.closeOverlayFrame();
    },

    view: function(ctrl, attrs) {
        if (!ctrl.showing && attrs.showing) {
            ctrl.inputValue('');
        }

        ctrl.showing = attrs.showing;

        return m('div.new-file', {className: ctrl.showing ? 'modal fade in show' : 'modal fade hidden', role: 'dialog'},
            m('div', {class: 'modal-dialog modal-lg'},
                m('div', {class: 'modal-content'},
                    m('div', {class: 'modal-header'},
                        m('button', {class: 'close', onclick: ctrl.closeOverlayFrame},'x'),

                        m('h4','File path, name and extension:', {class: 'modal-title'})
                    ),
                    m('input.file-path[type=text]', {
                        config: this.focusSearch.bind(this),
                        value: ctrl.inputValue(),
                        oninput: m.withAttr('value', ctrl.inputValue),
                        placeholder: 'newdir/newfile.js'
                    }),
                    m('div', {class: 'modal-footer'},
                        m('button', {onclick: this.createFile.bind(this, ctrl), class: 'btn btn-default'}, 'Create'),
                        m('button', {onclick: ctrl.closeOverlayFrame, class: 'btn btn-default'}, 'Cancel')
                    )
                )
            )
        );
    }
};
