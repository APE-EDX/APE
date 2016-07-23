var path = require('path');

function doNotify(options, image) {
    if (!image) {
        new Notification(options.title, options);
    }
    else {
        options.icon = 'LogoApe.ico';
        new Notification(options.title, options);
    }
}

module.exports = {
    doNotify: doNotify
}
