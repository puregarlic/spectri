const moduleEval = require('eval')

class StaticReactSiteGeneratorPlugin {
  constructor ({ title }) {
    this.title = title
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync(
      'StaticReactSiteGeneratorPlugin',
      (compilation, callback) => {
        const webpackStatsJson = compilation.getStats().toJson()
        try {
          const staticEntry = this.findAsset(
            undefined,
            compilation,
            webpackStatsJson
          )
          const staticRendererSource = compilation.assets[staticEntry].source()
          const render = moduleEval(staticRendererSource)
          const cssAssetName = Object.keys(compilation.assets).find(n =>
            /\.main.css/.test(n)
          )

          const { html, css } = render(
            Object.keys(compilation.assets).filter(
              filename => !filename.includes('static')
            ),
            cssAssetName ? compilation.assets[cssAssetName].source() : '',
            this.title
          )

          Object.keys(compilation.assets)
            .filter(f => f.includes('static'))
            .forEach(s => delete compilation.assets[s])

          compilation.assets['index.html'] = {
            source: () => html,
            size: () => html.length
          }

          compilation.assets[cssAssetName] = {
            source: () => css,
            size: () => css.length
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
