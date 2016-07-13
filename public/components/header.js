import m from 'mithril';
const {remote} = require('electron');

export default {
	closeApp: function() {
		remote.getCurrentWindow().close();
	},

	view: function(ctrl) {
        return m("div",
            m('div.title-frame',
                m('div.title',
                    m('span', 'APE')
                ),
                m('div.buttons',
                    m('button.close-button', { onclick: this.closeApp.bind(this) }, 'X')
                )
            ),
            m('div.menu-frame',
                m('div.buttons',
                    m('a','File'),
                    m('a','Edit'),
                    m('a','About')
                )
            )
        );
	}
};
