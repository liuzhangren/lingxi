import React from 'react'
import Header from './header'
import ProcessDetailContent from './processDetailContent'
import indexStyles from './index.less'

export default class ProcessDetail extends React.Component{
  state = {
    clientHeight: document.documentElement.clientHeight,
    clientWidth: document.documentElement.clientWidth,
  }
  constructor() {
    super();
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY.bind(this,'ing'))
  }
  resizeTTY(type) {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
  }
  render() {
    console.log('🐍', this.props)
    const { clientHeight, clientWidth } = this.state
    const modalTop = 20
    const offsetTopDeviation = 100 //用来计算偏移量偏差
    return (
      <div className={indexStyles.fileDetailOut} style={{height: clientHeight - offsetTopDeviation, top: 0}}>
        <Header status={this.props.status} {...this.props} />
        <ProcessDetailContent {...this.props} clientHeight={clientHeight} clientWidth={clientWidth} />
      </div>
    )
  }
}