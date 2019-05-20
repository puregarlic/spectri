const readingTime = require('reading-time')
const emoji = require('remark-emoji')
const images = require('remark-images')
const slug = require('remark-slug')
const mdx = require('@mdx-js/mdx')
const tableOfContents = require('mdx-table-of-contents')
const exportJsonByDefault = require('mdx-constant')
const grayMatter = require('gray-matter')

module.exports = async function (source) {
  let result
  const { data, content: mdxContent } = grayMatter(source)
  const callback = this.async()
  const options = {
    remarkPlugins: [slug, images, emoji],
    compilers: [tableOfContents, exportJsonByDefault('frontMatter', data)],
    filepath: this.resourcePath
  }

  try {
    result = await mdx(mdxContent, options)
  } catch (e) {
    return callback(e)
  }

  const estimatedReadingTime = readingTime(source)

  let code = `
import { mdx } from '@mdx-js/react'
${result}
export const readingTime = ${JSON.stringify(estimatedReadingTime)}
`

  return callback(null, code)
}
