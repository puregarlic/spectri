#!/usr/bin/env node

const ora = require('ora')
const path = require('path')
const webpack = require('webpack')
const { readFile } = require('fs').promises

const schema = require('./schema')
const buildConfig = require('./buildConfig')

;(async function () {
  const configSpinner = ora('Validating config...').start()
  let config

  try {
    let fileContents = await readFile(
      path.resolve(process.cwd(), 'spectri.json'),
      'utf8'
    )
    config = JSON.parse(fileContents)
    await schema.isValid(config)
    configSpinner.succeed('Config validated')
  } catch (e) {
    configSpinner.fail(`Config invalid: ${e}`)
    process.exit(1)
  }

  const buildSpinner = ora('Building files...').start()
  webpack(buildConfig(config), (err, stats) => {
    if (err | stats.hasErrors()) {
      console.error('Errors: ', err)
      console.error('Stat Errors: ', stats.compilation.errors)
      buildSpinner.fail('Build unsuccessful')
    }

    buildSpinner.succeed(
      `Files available in the "${config.dist || 'dist'}" directory`
    )
  })
})()
