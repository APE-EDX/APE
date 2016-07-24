import m from 'mithril';

const folderIco = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU4IDU4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OCA1ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiNFRkNFNEE7IiBkPSJNNTUuOTgxLDU0LjVIMi4wMTlDMC45MDQsNTQuNSwwLDUzLjU5NiwwLDUyLjQ4MVYyMC41aDU4djMxLjk4MUM1OCw1My41OTYsNTcuMDk2LDU0LjUsNTUuOTgxLDU0LjV6ICAiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0VCQkExNjsiIGQ9Ik0yNi4wMTksMTEuNVY1LjUxOUMyNi4wMTksNC40MDQsMjUuMTE1LDMuNSwyNCwzLjVIMi4wMTlDMC45MDQsMy41LDAsNC40MDQsMCw1LjUxOVYxMC41djEwaDU4ICB2LTYuOTgxYzAtMS4xMTUtMC45MDQtMi4wMTktMi4wMTktMi4wMTlIMjYuMDE5eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNFQjc5Mzc7IiBkPSJNMTgsMzIuNWgxNGMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMUgxOGMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxNy40NDgsMzIuNSwxOCwzMi41eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0VCNzkzNzsiIGQ9Ik0xOCwzOC41aDIyYzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xSDE4Yy0wLjU1MiwwLTEsMC40NDctMSwxUzE3LjQ0OCwzOC41LDE4LDM4LjV6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRUI3OTM3OyIgZD0iTTQwLDQyLjVIMThjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjJjMC41NTIsMCwxLTAuNDQ3LDEtMVM0MC41NTIsNDIuNSw0MCw0Mi41eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
const fileIco = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiPgo8Zz4KCTxwYXRoIGQ9Ik00Mi41LDIyaC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzQzLjA1MiwyMiw0Mi41LDIyeiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTE3LjUsMTZoMTBjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTEwYy0wLjU1MiwwLTEsMC40NDctMSwxUzE2Ljk0OCwxNiwxNy41LDE2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTQyLjUsMzBoLTI1Yy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDI1YzAuNTUyLDAsMS0wLjQ0NywxLTFTNDMuMDUyLDMwLDQyLjUsMzB6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8cGF0aCBkPSJNNDIuNSwzOGgtMjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjVjMC41NTIsMCwxLTAuNDQ3LDEtMVM0My4wNTIsMzgsNDIuNSwzOHoiIGZpbGw9IiNGRkZGRkYiLz4KCTxwYXRoIGQ9Ik00Mi41LDQ2aC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzQzLjA1Miw0Niw0Mi41LDQ2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTM4LjkxNCwwSDYuNXY2MGg0N1YxNC41ODZMMzguOTE0LDB6IE0zOS41LDMuNDE0TDUwLjA4NiwxNEgzOS41VjMuNDE0eiBNOC41LDU4VjJoMjl2MTRoMTR2NDJIOC41eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

module.exports = {
    component: {
        controller: function(attrs) {
            return {
                treeRoot: m.prop(attrs.treeRoot),
                fileClick: attrs.fileClick
            };
        },

        view: function(ctrl, attrs) {
            ctrl.treeRoot = m.prop(attrs.treeRoot);

            var recurse = function(list) {
                return list.map(function(item) {
                    return m('li', {
                            'data-type': item.type,
                            'data-name': item.name(),
                            'data-root': item.root(),
                            onclick: item.type == 'file' ? ctrl.fileClick : null
                        }, [
                            m('img', {src: item.type == 'folder' ? folderIco : fileIco}),
                            item.name(),
                            item.children() ? m('ul', recurse(item.children())) : null
                        ]
                    );
                });
            };
            return m('ul', [
                recurse(ctrl.treeRoot())
            ]);
        }
    },

    TreeElement: function(name, root, children) {
        this.children = m.prop(children || []);
        this.name = m.prop(name);
        this.root = m.prop(root);
        this.type = this.children().length > 0 ? 'folder' : 'file';
    }
};
