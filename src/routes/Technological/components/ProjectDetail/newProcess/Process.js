import React from 'react'
import DefaultProcess from './DefaultProcess'

export default class Process extends React.Component{
  state = {}
  render() {
    return (
      <DefaultProcess {...this.props} />
    )
  }
}