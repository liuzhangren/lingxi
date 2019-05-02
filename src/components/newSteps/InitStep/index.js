import React from 'react'
import indexStyles from './index.less'
import ContentCollection from '../ContentCollection'
import Approval from '../Approval'
import CopySend from '../CopySend'

import {
  Dropdown,
  Input,
  Icon,
  Menu
} from 'antd'

export default class InitStep extends React.Component {
  state = {
    type: '0',
    value: ''
  }
  onClick({item, key}) {
    // console.log(item, key)
    this.setState({
      type: key
    })
    const {
      formDatas, 
      processCurrentEditStep, 
      newProcessContentCollection, 
      newProcessApprove,  
      newProcessCopySend
    } = this.props.model.datas
    
    if(key === '1') {
      formDatas.nodes.push(newProcessContentCollection)
    } else if(key === '2') {
      formDatas.nodes.push(newProcessApprove)
    } else {
      formDatas.nodes.push(newProcessCopySend)
    }
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
    // const { datas: { formDatas = {} }  } = this.props.model
    // const { itemKey } = this.props
    // formDatas.nodes[itemKey].flow_node_type = itemKey+1
    
  }
  change(e) {
    this.setState({
      value: e.target.value
    })
  }
  render() {
    const { type } = this.state
    const menu = (
      <Menu onClick={this.onClick.bind(this)}>
        <Menu.Item key='1'>
          <Icon type="form" /> 内容收集
        </Menu.Item>

        <Menu.Item key='2'>
        <Icon type="down-circle" />审批
        </Menu.Item>

        <Menu.Item key='3'>
          <Icon type="warning" /> 抄送
        </Menu.Item>
      </Menu>
    )
    const renderComp = (type) => {
      let r = ''
      switch(type) {
        case '0':
          r = (
            <div className={indexStyles.line}>
              <div className={indexStyles.angleWrapper}>
                {/* {this.props.content[i+1]} */}
                <div className={indexStyles.find}>
                  <Input style={{border: 'none'}} onChange={this.change.bind(this)} style={{width: '90%', marginLeft: '10px'}} placeholder='名称(必填)' />
                </div>
                {/* <ContentCollection pushPersonVisible={this.state.pushPersonVisible} subVisible={this.state.subVisible} dateVisible={this.state.dateVisible} {...this.props} key={i}/> */}
                <Dropdown overlay={menu} trigger={['click']}>
                  <span className={indexStyles.select}><Icon type="menu-fold" /> 类型(必选)</span>
                </Dropdown>
              </div> 
            </div>
          )
          break
        case '1':

          r = (
            <ContentCollection {...this.props} />
          )
          break
        case '2':
          r = (
            <Approval {...this.props} />
          )
          break
        case '3':
          r = (
            <CopySend {...this.props} />
          )
          break
        default: ''
      }
      return r
    }
    return (
      <div>
        { renderComp(type) }
      </div>
    )
  }
}