
function onMessage(msg) {
    var json = JSON.parse(msg);
    var func = this[json.method];
    func.apply(this, json.args);
}

function eval_js(code) {
    eval(code);
}
