const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const developmentEnv = process.env.NODE_ENV === 'development';

/* function extHash(name, ext, hash = '[hash]') {
  return developmentEnv ? `${name}.${ext}?${hash}` : `${name}.${hash}.${ext}`;
} */

module.exports = {
  mode: developmentEnv ? 'development' : 'production',
  entry: {
    main: './dev/client/main.js',
    style: './dev/client/style.css'
  },
  output: {
    /* filename: (chunkData) => {
      return chunkData.chunk.name === 'main' ? 'assets/js/[name].js': 'assets/css/[name].css';
    }, */
    filename: 'assets/js/[name].js',
    chunkFilename: 'client/js/[name].js',
    path: path.join(__dirname, 'app'),
    publicPath: '/'
  },
  /* optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }, */
  devtool: `source-map`,
  module: {
    rules: [
      {
        test: /\.(gif|png|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/img/[name].[ext]',
            outputPath: url => url.slice(url.indexOf('/') + 1)
          }
        }]
      },
      {
        test: /\.(ttf|otf|woff2|woff)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/font/[name].[ext]',
            outputPath: url => url.slice(url.indexOf('/') + 1)
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {modules: false}]]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, /* 'style-loader' */'css-loader', 'postcss-loader' ]
      }
      
    ]
  },
  plugins: [
    /* new HtmlWebpackPlugin({
      template: `./public/index.html`
    }), */

    new CopyPlugin([
      {from: 'dev/server/config', to: 'config'},
      {from: 'dev/server/controllers', to: 'controllers'},
      {from: 'dev/server/app.js', to: 'app.js'},
      {from: 'dev/server/*.ico', to: '[name].[ext]', test: /[A-Za-z].ico$/},
      {from: 'dev/client/components/**/*.pug', to: 'templates/[name].pug'},
      {from: 'dev/client/components/**/*.mp3', to: 'assets/static/[name].mp3'},
      {from: 'dev/client/components/**/*.json', to: 'assets/static/[name].json'},
      {from: 'dev/client/templates', to: 'templates'}
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'assets/css/[name].css',
      //chunkFilename: "[id].css"
    })
    /* new webpack.HotModuleReplacementPlugin() */

  ]

};


