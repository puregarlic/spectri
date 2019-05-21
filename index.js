#!/usr/bin/env node

const webpack = require('webpack')
const { readFile } = require('fs').promises
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const schema = require('./schema')
const StaticReactSiteGeneratorPlugin = require('./plugin')

const presets = ['@babel/preset-env', '@babel/preset-react', 'linaria/babel']

;(async function () {
  let config
  try {
    let fileContents = await readFile(
      path.resolve(process.cwd(), 'spectri.json'),
      'utf8'
    )
    config = JSON.parse(fileContents)
    await schema.isValid(config)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  webpack(
    {
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
                options: { sourceMap: true }
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
    },
    (err, stats) => {
      if (err | stats.hasErrors()) {
        console.log('Errors: ', err)
        console.log('Stat Errors: ', stats.compilation.errors)
        throw new Error(err || stats.compilation.errors)
      }

      console.log('Successfully output files')
    }
  )
})()
