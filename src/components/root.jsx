import React from 'react'
import Document, { tableOfContents } from '../documents.index'

export const Root = () => {
  return (
    <>
      <p>{JSON.stringify(tableOfContents)}</p>
      <Document />
    </>
  )
}
