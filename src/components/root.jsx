import React from 'react'
import { styled } from 'linaria/react'
import { Helmet } from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'

import Document, { tableOfContents } from '../documents.index'

import Footer from './footer'
import Image from './image'

const Global = styled.div`
  :global() {
    html {
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 20px;
      line-height: 1.5;
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

const DocumentContainer = styled.div`
  @media screen {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(auto, 32em) auto;
    grid-template-rows: 8em auto 8em;
    grid-template-areas:
      'actions actions actions'
      'nav content .'
      'footer footer footer';
  }
`

const ContentContainer = styled.div`
  @media screen {
    grid-area: content;
  }
`

const components = {
  img: Image
}

export const Root = () => {
  return (
    <DocumentContainer>
      <Helmet>
        <title>Hey there</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </Helmet>
      <Global />
      <ContentContainer>
        <MDXProvider components={components}>
          <Document />
        </MDXProvider>
      </ContentContainer>
      <Footer />
    </DocumentContainer>
  )
}
