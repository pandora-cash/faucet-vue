const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => {

    const isProd = argv.mode === "production"

    return {
        target: 'web',
        mode: 'production',

        devtool: false,

        entry:[
            "./src/main.js",
        ],

        output: {
            path: path.resolve(__dirname, './../dist'),
            publicPath: '/',
            filename: 'bundle.js'
        },

        resolve: {
            extensions: [ '.js', '.vue' ],
            alias: {
                src: path.resolve(__dirname + '/../src'),
            },
            fallback: {
                fs: false,
                assert: false,
                crypto: false,
                stream: false,
                util: false,
                http: false,
                https: false,
                net: false,
                path: false,
                tls: false,
                zlib: false,
                buffer: false,
                child_process: false,
                dgram: false,
                uws: false,
                os: false,
            }
        },
        module: {
            rules: [{
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [ {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[contenthash].[ext]',
                        publicPath: '/',
                    },
                }],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: isProd,
                    preserveWhitespace: false,
                }
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }]
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        plugins: [
            new VueLoaderPlugin(),
            new TerserPlugin(),
            new CompressionWebpackPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: new RegExp('\\.(js|css)$'),
                threshold:10240,
                minRatio: 0.8,
            })
        ],
    }
}