import m from 'mithril';

module.exports = {
    component: {
        controller: function(attrs) {
            return {
                treeRoot: m.prop(attrs.treeRoot)
            };
        },

        view: function(ctrl) {
            var recurse = function(list) {
                return list.map(function(item) {
                    return m('li', [item.name(),
                        item.children() ? m('ul', recurse(item.children())) : null
                    ]);
                });
            };
            return m('ul', [
                recurse(ctrl.treeRoot())
            ]);
        }
    },

    TreeElement: function(name, children) {
        this.children = m.prop(children || []);
        this.name = m.prop(name);
        this.type = this.children.length > 0 ? 'menu' : 'link';
    }
};
