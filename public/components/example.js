import m from 'mithril';
import '../less/main.less';

export default {
	controller: function(){
		this.inputValue = m.prop("")
	},

	view: function(ctrl){
		return m("div",
			m("h1", "Welcome"),
			m("div.input-group",
				m("span.input-group-addon#addon","Label: "),
				m("input[type=text].form-control", {
					inputValue: ctrl.inputValue(),
					oninput: m.withAttr("value", ctrl.inputValue),
					placeholder: "Edit src/components/example live!"
				}, "")
			)
		)
	}
};
