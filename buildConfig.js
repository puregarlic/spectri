const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const StaticReactSiteGeneratorPlugin = require('./plugin')

const presets = ['@babel/preset-env', '@babel/preset-react', 'linaria/babel']
module.exports = config => ({
  context: __dirname,
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    static: path.resolve(__dirname, './src/static.js')
  },
  mode: 'production',
  output: {
    filename: '[hash].[name].js',
    path: path.resolve(process.cwd(), config.dist || 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.mdx', '.md']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets
            }
          },
          {
            loader: 'linaria/loader',
            options: {
              sourceMap: true,
              displayName: true,
              babelOptions: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets
            }
          },
          './loaders/mdx/index.js'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.index$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets
            }
          },
          {
            loader: './loaders/documents/index.js',
            options: {
              document: config.entry
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[hash].[name].css' }),
    new StaticReactSiteGeneratorPlugin({ title: config.title })
  ]
})
