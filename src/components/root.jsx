import React from 'react'
import { styled } from 'linaria/react'
import { Helmet } from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'

import Document, { tableOfContents } from '../documents.index'

import Footer from './footer'

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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 64px;
    padding-bottom: 64px;
  }
`

const ContentContainer = styled.div`
  @media screen {
    width: 100%;
    max-width: 32em;
    padding-bottom: 64px;
  }
`

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
        <MDXProvider>
          <Document />
        </MDXProvider>
      </ContentContainer>
      <Footer />
    </DocumentContainer>
  )
}
