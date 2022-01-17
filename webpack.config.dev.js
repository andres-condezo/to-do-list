const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rules = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      presets:
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    },
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.(png|scg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'assets/fonts/[hash][ext]',
    },
  },
];

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    static: './dist',
    hot: true,
    open: true,
    watchFiles: ['src/**/*'],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@fonts': path.resolve(__dirname, 'src/fonts/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@modules': path.resolve(__dirname, 'src/modules/'),
      '@images': path.resolve(__dirname, 'src/img/'),
    },
  },
  module: { rules },
};
