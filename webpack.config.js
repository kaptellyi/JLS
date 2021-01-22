/* eslint-disable */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TesrerWerbpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TesrerWerbpackPlugin(),
    ];
  }

  return config;
};

const plugins = () => {
  const base = [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            'src/assets/vids/contact-modal-anim.webm'
          ),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: './index.html',
      publickPath: './src',
      minify: isProd,
    }),
    new MiniCssExtractPlugin(),
  ];

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './app.js'],
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      Teachers: path.resolve(__dirname, 'src/assets/img/teachers/'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@src': path.resolve(__dirname, 'src'),
      '@img': path.resolve(__dirname, 'src/assets/img'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@illustrations': path.resolve(__dirname, 'src/assets/illustrations'),
      '@vids': path.resolve(__dirname, './src/assets/vids'),
    },
  },

  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg|webm)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: isDev ? 'assets' : '',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  optimization: optimization(),

  devtool: isDev ? 'source-map' : '',

  devServer: {
    port: 4000,
    hot: true,
  },
};
