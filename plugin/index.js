const moduleEval = require('eval')

class StaticReactSiteGeneratorPlugin {
  apply (compiler) {
    compiler.hooks.emit.tapAsync(
      'StaticReactSiteGeneratorPlugin',
      (compilation, callback) => {
        try {
          const asset = this.findAsset(
            undefined,
            compilation,
            compilation.getStats().toJson()
          )
          const source = compilation.assets[asset].source()
          const render = moduleEval(source)
          const output = render(
            Object.keys(compilation.assets).filter(
              filename => !/\.static.js$/.test(filename)
            )
          )

          compilation.assets['index.html'] = {
            source: () => output,
            size: () => output.length
          }
        } catch (e) {
          throw e
        }

        callback()
      }
    )
  }

  findAsset (name = 'static', compilation, webpackStatsJson) {
    let asset = compilation.assets[name]

    if (!asset) {
      asset = webpackStatsJson.assetsByChunkName[name]
      if (!asset) throw new Error(`Cannot find entry file "${name}"`)
      if (Array.isArray(asset)) {
        asset = asset.find(name => /\.js$/.test(name))
      }
    }

    return asset
  }
}

module.exports = StaticReactSiteGeneratorPlugin
