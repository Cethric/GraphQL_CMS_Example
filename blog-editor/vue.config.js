/** @format */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    pages: undefined,
    lintOnSave: 'warning',
    runtimeCompiler: true,
    transpileDependencies: [],
    productionSourceMap: true,
    crossorigin: 'anonymous',
    integrity: true,
    configureWebpack: {
        resolve: {
            plugins: [PnpWebpackPlugin],
            // alias: {
            //     // Alias for using source of BootstrapVue
            //     'bootstrap-vue$': 'bootstrap-vue/src/index.js',
            // },
        },
        resolveLoader: {
            plugins: [PnpWebpackPlugin.moduleLoader(module)],
        },
        module: {
            rules: [
                {
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    use: [{ loader: 'graphql-tag/loader' }],
                },
                // {
                //     test: /\.js$/,
                //     include: /bootstrap-vue\/src/,
                //     use: {
                //         loader: 'babel-loader',
                //         options: {
                //             presets: ['env'],
                //         },
                //     },
                // },
            ],
        },
        plugins: [new LodashModuleReplacementPlugin({})],
        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'all',
                // maxSize: 1024 * 512,
                // cacheGroups: {
                //     corejs: {
                //         test: /[\\/]node_modules[\\/](core-js)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-core-js',
                //     },
                //     vue: {
                //         test: /[\\/]node_modules[\\/](vue|vue-router|vue-class-component)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-vue',
                //     },
                //     apollo: {
                //         test: /[\\/]node_modules[\\/](vue-apollo|apollo|apollo-.*|@apollo|graphql)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-apollo',
                //     },
                //     bootstrap: {
                //         test: /[\\/]node_modules[\\/](bootstrap|bootstrap-vue)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-bootstrap',
                //     },
                //     uppy: {
                //         test: /[\\/]node_modules[\\/](@uppy|classnames|polyglot.js|cropperjs)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-uppy',
                //     },
                //     hljs: {
                //         test: /[\\/]node_modules[\\/](highlight.js)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-hljs',
                //     },
                //     lodash: {
                //         test: /[\\/]node_modules[\\/](lodash)[\\/]/giu,
                //         chunks: () => true,
                //         name: 'vendor-lodash',
                //     },
                //     vendors: {
                //         name: 'vendor-all',
                //         chunks: (chunk) => {
                //             return !/vue|vue-router|vue-apollo|apollo|apollo-.*|@apollo|graphql|bootstrap|bootstrap-vue|@uppy|classnames|polyglot.js|cropperjs|highlight.js|lodash/.test(
                //                 chunk.name
                //             );
                //         },
                //     },
                // },
            },
            // mergeDuplicateChunks: true,
            runtimeChunk: true,
            concatenateModules: true,
            usedExports: true,
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                options.transformAssetUrls = {
                    img: 'src',
                    image: 'xlink:href',
                    'b-avatar': 'src',
                    'b-img': 'src',
                    'b-img-lazy': ['src', 'blank-src'],
                    'b-card': 'img-src',
                    'b-card-img': 'src',
                    'b-card-img-lazy': ['src', 'blank-src'],
                    'b-carousel-slide': 'img-src',
                    'b-embed': 'src',
                };
            });
    },
    css: {
        requireModuleExtension: true,
        extract: true,
        sourceMap: true,
        loaderOptions: {},
    },
    parallel: true,
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: require.resolve('./src/sw.ts'),
            swDest: 'service-worker.js',
        },
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default',
        assetsVersion: '1.0.0',
        manifestCrossorigin: 'anonymous',
    },
    pluginOptions: {
        apollo: {
            lintGQL: true,
        },
    },
    devServer: {
        https: {
            cert: fs.readFileSync('./cert/localhost+5.pem'),
            key: fs.readFileSync('./cert/localhost+5-key.pem'),
        },
        http2: true,
        compress: true,
        host: '0.0.0.0',
        hot: true,
        serveIndex: false,
        staticOptions: {
            dotfiles: 'ignore',
            etag: true,
            immutable: true,
            lastModified: true,
            maxAge: 1000 * 60,
            redirect: true,
        },
        stats: 'normal',
        transportMode: 'ws',
    },
};
