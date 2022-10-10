const path = require('path');
// Mini css plugin extracts css to it's own file
// Manifest plugin writes bundled files to json
// Clean webpack deletes old build artefacts
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/js/main.js',
    output: {
        filename: '[name].[fullhash].bundle.js',
        path: path.resolve(__dirname, 'static'),
        publicPath: ""
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].bundle.css'
        }),
        new WebpackManifestPlugin({
            fileName: '../data/manifest.json',
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        require('autoprefixer')
                                    ],
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ]
            }
        ]
    }
}