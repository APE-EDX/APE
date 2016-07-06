var path = require('path');

module.exports = {
    context: path.join(__dirname, "/public"),
    entry: "./app.js",

    output: {
        filename: "app.js",
        path: path.join(__dirname, "dist"),
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        },{
            test: /\.less$/,
            loader: "style!css!less"
        }],
    },
};
