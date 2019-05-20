const React = require('react')
const ReactDOMServer = require('react-dom/server')

const { Root } = require('./components/root')

module.exports = assets => {
  const js = assets.filter(filename => filename.match(/\.js$/))

  const app = ReactDOMServer.renderToString(<Root />)

  const buildScripts = files => {
    const tags = files.map(file => `<script src="${file}" async></script>`)
    return tags.join('\n')
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Testing</title>
  </head>
  <body>
    <div id="app">${app}</div>
    ${js ? buildScripts(js) : ''}
  </body>
</html>
`
}
