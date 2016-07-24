var path = require('path');
var HappyPack = require('happypack');

module.exports = {
    cache: true,
    context: path.join(__dirname, "/public"),
    entry: "./app.js",

    output: {
        filename: "app.js",
        path: path.join(__dirname, "dist"),
    },

    plugins: [
        new HappyPack({ id: 'js' })
    ],

    devServer: {
        contentBase: './dist',
        publicPath: 'http://localhost:8080/built/'
    },

    module: {
        loaders: [
            {
                include: path.join(__dirname, "/public"),
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    cacheDirectory: path.join(__dirname, '.babel')
                },
                happy: { id: 'js' }
            },
            {
                test: /\.less$/,
                include: path.join(__dirname, "/public"),
                loader: "style!css!less",
                happy: { id: 'js' }
            },
            {
                test: /(\.gif|\.svg|\.jpg|\.png|\.ico)$/,
                loader: "file-loader?limit=100000"
            }
        ],
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.less'],
        unsafeCache: true
    },

    externals: [
        (function () {
            var IGNORES = [
                'electron'
            ];
            return function (context, request, callback) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
            };
        })()
    ]
};
