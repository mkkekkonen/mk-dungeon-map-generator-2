const path = require('path');

const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        library: 'mkDungeonMapGenerator2',
        libraryTarget: 'umd',
    },

    resolve: {
        extensions: ['.js', '.ts'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
        },
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
            },
        ],
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
        }),
    ],
};
