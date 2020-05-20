const path = require('path');
// Mini css plugin extracts css to it's own file
// Manifest plugin writes bundled files to json
// Clean webpack deletes old build artefacts
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/js/main.js',
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'static')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].bundle.css'
        }),
        new ManifestPlugin({
            fileName: '../data/manifest.json',
        }),
        new CleanWebpackPlugin({
            dry: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
}