import React from 'react'
import { styled } from 'linaria/react'
import { MDXProvider } from '@mdx-js/react'

import Document, { tableOfContents } from '../documents.index'

const Global = styled.div`
  :global() {
    html {
      box-sizing: border-box;
    }

    *,
    *:after,
    *:before {
      box-sizing: inherit;
    }

    body {
      margin: 0;
    }
  }
`

export const Root = () => {
  return (
    <>
      <Global />
      <p>{JSON.stringify(tableOfContents())}</p>
      <MDXProvider>
        <Document />
      </MDXProvider>
    </>
  )
}
