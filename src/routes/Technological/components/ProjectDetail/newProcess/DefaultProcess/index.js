import React from 'react'
import { Tabs } from 'antd'
import indexStyles from '../index.less'
import TemplateProcess from './components/TemplateContent'
import PagingnationContent from './components/PagingnationContent'

const TabPane = Tabs.TabPane

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}

export default class DefaultProcess extends React.Component {
  state = {
    clientHeight: changeClientHeight()
  }
  constructor() {
    super()
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }
  resizeTTY = () => {
    const clientHeight = changeClientHeight();//获取页面可见高度
    this.setState({
      clientHeight
    })
  }

  tabsChange() {

  }
  render() {
    console.log('🐎', this.props)
    const { clientHeight } = this.state
    const flowTabs = () => {
      return (
        <Tabs defaultActiveKey="1" onChange={this.tabsChange.bind(this)} tabBarStyle={{marginLeft: 26, width: '100%', maxWidth: 1100, paddingTop: 0, fontSize: 16}}>
          <TabPane tab={<div style={{padding: 0, fontSize: 16}}>进行中 </div>} key="1">{<PagingnationContent {...this.props} />}</TabPane>
          <TabPane tab={<div style={{padding: 0, fontSize: 16}}>已终止 </div>} key="2">{<div>bbb</div>}</TabPane>
          <TabPane tab={<div style={{padding: 0, fontSize: 16}}>已完成 </div>} key="3">{<div>ccc</div>}</TabPane>
        </Tabs>
      )
    }
    return (
      <div className={indexStyles.processDefautOut}>
        <div className={indexStyles.processDefautOut_left}>
          <div className={indexStyles.title}>模板</div>
          {/* <TemplateContent {...this.props} clientHeight = {clientHeight}/> */}
          <TemplateProcess {...this.props} clientHeight = {clientHeight} />
        </div>
        {/*右方流程*/}
        <div className={indexStyles.processDefautOut_right}>
          {flowTabs()}
        </div>
      </div>
    )
  }
}