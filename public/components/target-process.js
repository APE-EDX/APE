import m from 'mithril';
const {ipcRenderer} = require('electron');
import CodeFlask from './codeflask';

var processes = [];
var searchProcesses = [];

//TODO: Improve
ipcRenderer.on('procReply', (event, arg) => {
    var res = arg.replace(/\r/g, ",");
    res = res.split(",");

    // Remove quotes
    var trim = (x) => ((x) => x.substr(1, x.length - 2))(x.trim());

    processes = [];
    for(var i = 0; i < res.length / 5 - 1; i++){
        var pid = res[i * 5 + 1];
        var name = res[i * 5];

        processes.push({pid: parseInt(trim(pid)), name: trim(name)});
    }

    reorderProcesses('name', 'pid');
    m.endComputation();
});

function reorderProcesses(by, sec) {
    function compare(what, a, b) {
        var ap = isNaN(a[what]) ? a[what].toLowerCase() : a[what];
        var bp = isNaN(b[what]) ? b[what].toLowerCase() : b[what];

        if (ap < bp) return -1;
        if (ap > bp) return 1;
        return compare(sec, a, b);
    }

    processes = processes.sort(compare.bind(null, by));
}


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

    reloadNow: function() {
        this.reloadProc();
    },

    setTarget: function(ctrl, target, e) {
        m.startComputation();
        ipcRenderer.send('set-target', target);
        ctrl.closeOverlayFrame();
    },

    search: function(processes, str) {
        var matches = [];
        var re = new RegExp(str);

        for (var i = 0; i < processes.length; ++i) {
            if (processes[i].name.match(re)) {
                matches.push(processes[i]);
            }
        }

        return matches;
    },

    focusSearch: function(el, hasInit) {
        hasInit && el.focus();
    },

    view: function(ctrl, attrs) {
        // Reload now if it was not showing before
        if (!ctrl.showing && attrs.showing) {
            this.reloadNow();
        }

        ctrl.showing = attrs.showing;

        return m('div#consoleDialog', {className: ctrl.showing ? 'modal fade in show' : 'modal fade hidden', role: 'dialog'},
            m('div', {class: 'modal-dialog modal-lg'},
                m('div', {class: 'modal-content'},
                    m('div', {class: 'modal-header'},
                        m('button', {class: 'close', onclick: ctrl.closeOverlayFrame},'x'),

                        m('h4','Select Process:', {class: 'modal-title'})
                    ),
                    m('input.process-search[type=text]', {
                        config: this.focusSearch.bind(this),
                        inputValue: ctrl.inputValue(),
                        oninput: m.withAttr('value', ctrl.inputValue),
                        placeholder: 'Search process'
                    }),
                    m('div#procContainer', {class: 'modal-body'}, '',
                        m('ul#processList', {class: 'list-group'},
                            (ctrl.inputValue() ? this.search(processes, ctrl.inputValue()) : processes).map((e) => {
                                return m('li.list-group-item', {onclick: this.setTarget.bind(this, ctrl, e)},
                                    m('span.badge', e.pid),
                                    e.name
                                )
                            })
                        )
                    ),
                    m('div', {class: 'modal-footer'},
                        m('button', {onclick: reorderProcesses.bind(this, 'name', 'pid'), class: 'btn btn-default'}, 'By name'),
                        m('button', {onclick: reorderProcesses.bind(this, 'pid', null), class: 'btn btn-default'}, 'By PID'),
                        m('button', {onclick: this.reloadProc.bind(this), class: 'btn btn-default'}, 'Reload'),
                        m('button', {onclick: ctrl.closeOverlayFrame, class: 'btn btn-default'}, 'Close')
                    )
                )
            )
        );
    }
};
