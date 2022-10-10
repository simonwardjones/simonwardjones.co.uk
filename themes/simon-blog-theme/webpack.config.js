const path = require('path');
// Mini css plugin extracts css to it's own file
// Manifest plugin writes bundled files to json
// Clean webpack deletes old build artefacts
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

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
        })
    ],
    module: {
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
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