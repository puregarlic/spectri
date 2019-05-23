import React from 'react'
import { css } from 'linaria'
import ImageZoom from 'react-medium-image-zoom'

const className = css`
  width: 100%;
  height: auto;
`

const Image = props => (
  <a href={props.src} onClick={e => e.preventDefault()}>
    <ImageZoom image={{ className, ...props }} zoomImage={props} />
  </a>
)

export default Image
