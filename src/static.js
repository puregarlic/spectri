const React = require('react')
const { Helmet } = require('react-helmet')
const { collect } = require('linaria/server')
const ReactDOMServer = require('react-dom/server')

const { Root } = require('./components/root')

module.exports = (assets, stylesheet, title = 'Spectri') => {
  const js = assets.filter(filename => filename.match(/\.js$/))
  const css = assets.filter(filename => filename.match(/\.css$/))

  const app = ReactDOMServer.renderToString(React.createElement(Root))
  const helmet = Helmet.renderStatic()
  const { critical, other } = collect(app, stylesheet)

  const buildScripts = files => {
    const tags = files.map(file => `<script src="${file}" async></script>`)
    return tags.join('\n')
  }

  const buildLinks = files => {
    const tags = files.map(file => `<link href="${file}" rel="stylesheet" />`)
    return tags.join('\n')
  }

  const html = `
<!DOCTYPE html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <style type="text/css">${critical}</style>
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="app">${app}</div>
    ${css ? buildLinks(css) : ''}
    ${js ? buildScripts(js) : ''}
  </body>
</html>
`

  return { html, css: other }
}
