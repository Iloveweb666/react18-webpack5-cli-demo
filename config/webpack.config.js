const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'prod';
const getStyleLoaders = (pre) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 
        'css-loader', 
        { 
            loader: 'poster-css',  // 处理样式兼容性
            options: { 
                postcssOptions: {
                    plugins: ['postcss-preset-env'], // 读取package.json中的browserslist限制
                }
            }
        },
        pre
    ].filter(Boolean)
}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: isProduction ? path.resolve(__dirname, 'dist') : undefined, // 开发模式不需要输出，
        filename: isProduction ? 'static/js/[name].[contenthash:10].js' : 'static/js/[name].js', // 打包结果
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:10].chunk.js' : 'static/js/[name].chunk.js', // chunk分包结果
        assetModuleFilename: 'static/media/[hash:10][ext][query]', // 资源打包结果
        // clean: true, // 默认clean
    },
    module: {
        rules: [
            // 处理CSS文件
            { 
                test: /\.css$/, 
                use: getStyleLoaders()},
            // 处理LESS文件
            { 
                test: /\.less$/, 
                use: getStyleLoaders('less-loader')},
            // 处理LESS文件
            { 
                test: /\.s[ac]ss$/, 
                use: getStyleLoaders('sass-loader')},
            // 处理图片
            {
                test: /\.(jpg?g|png|gif|webp|svg)/,
                type: 'asset',
                parser: {
                    dateUrlCondition: {
                        maxSize: 10 * 1024, // 将10kb以内的图片压缩成base64
                    },
                }
            },
            // 处理其他资源
            {
                test: /\.(woff2?|ttf)/,
                type: 'asset/resource'
            },
            {
                test: /\.jsx?$/,
                // exclude: /node_modules/,
                include: path.resolve(__dirname, '../src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        // plugins: [
                        //     !isProduction && 'react-refresh/babel'
                        // ].filter(Boolean)
                    },
                }
            }
        ],
        
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: 'static/css/index.css'
        }),
        // !isProduction && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}.js`
        }
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json'],
    },
    devServer: {
        host: 'localhost',
        port: '8080',
        open: true,
        hot: true,
    },
}