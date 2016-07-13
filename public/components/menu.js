import m from 'mithril';

export default {
	controller: function(attrs) {
		return {
			default: attrs.default,
			showing: attrs.showing,
			changeFrame: attrs.changeFrame,
			overlayFrame: attrs.overlayFrame,
			closeOverlayFrame: attrs.closeOverlayFrame
		};
	},

	view: function(ctrl, attrs) {
        ctrl.showing = attrs.showing;
		if (ctrl.showing.every((x) => x == false)) {
			ctrl.showing[ctrl.default] = true;
		}

        return m('div', {class: 'menu-lateral'}, //col-sm-3 col-md-2 sidebar
            m("ul", //nav nav-sidebar
                m('li', {className: ctrl.showing[0] ? 'menu-active' : ''},
                    m('a#menuLeft', {
                        onclick: ctrl.overlayFrame,
                        'data-target': 0
                    }, 'Target')
                ),
                m('li', {className: ctrl.showing[1] ? 'menu-active' : ''},
                    m('a#menuLeft', {
                        onclick: ctrl.changeFrame,
                        'data-target': 1
                    }, 'Project')
                ),
                m('li', {className: ctrl.showing[2] ? 'menu-active' : ''},
                    m('a#menuLeft', {
                        onclick: ctrl.changeFrame,
                        'data-target': 2
                    }, 'Console')
                ),
                m('li', {className: ctrl.showing[3] ? 'menu-active' : ''},
                    m('a#menuLeft', {
                        onclick: ctrl.changeFrame,
                        'data-target': 3
                    }, 'Quick Edit')
                ),
                m('li', {className: ctrl.showing[4] ? 'menu-active' : ''},
                    m('a#menuLeft', {
                        onclick: ctrl.changeFrame,
                        'data-target': 4
                    }, 'Something')
                )
            )
        );
	}
};
