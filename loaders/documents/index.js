const { getOptions } = require('loader-utils')
const path = require('path')

module.exports = async function (source) {
  const callback = this.async()
  const { document } = getOptions(this)

  const code = `
import Document, { tableOfContents } from '${path.resolve(
    process.cwd(),
    document
  )}'

export { tableOfContents }
export default Document
`
  callback(null, code)
}
