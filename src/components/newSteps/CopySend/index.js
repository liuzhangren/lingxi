import React from 'react'
import indexStyles from './index.less'
import { timeToTimestamp } from '../../../utils/util'

import {
  Input,
  Radio,
  Icon,
  DatePicker,
  Divider,
  Dropdown
} from 'antd'

const RadioGroup = Radio.Group
const TextArea = Input.TextArea
const plainOptions = ['串签', '并签', '汇签']

export default class Approval extends React.Component {
  state = {
    value: '',
    pushPersonVisible: false,
    subVisible: false,
    dateVisible: false,
  }
  change(e) {
    // this.setState({
    //   value: e.target.value,
    // })
    this.updateEditDatas(e.target.value, 'name')
  }
  onChange(e) {
    // this.setState({
    //   value: e.target.value,
    // })
    this.updateEditDatas(e.target.value, 'name')
  }
  dateShow() {
    this.setState({
      dateVisible: true
    })
  }
  pushPersonShow() {
    this.setState({
      pushPersonVisible: true,
    })
  }
  subShow() {
    this.setState({
      subVisible: true,
    })
  }
  desChange(e) {
    this.updateEditDatas(e.target.value, 'description')
  }
  deadline(value , dateString) {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    this.updateEditDatas((timeToTimestamp(dateString)/1000).toString(), 'deadline')
  }
  updateEditDatas(data, key) {
    const { datas: { formDatas = {} } } = this.props.model
    const { itemKey, itemType, itemIndex } = this.props
    formDatas.nodes[itemKey][key] = data
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }
  render() {
    const pushPersonVisible = this.state.pushPersonVisible?'':'none'
    const subVisible = this.state.subVisible?'':'none'
    const dateVisible = this.state.dateVisible?'':'none'

    // const selectUser = (data) => {
    //   data.reduce((r, c, i) => {
    //     return [
    //       ...r,
    //       <Menu.Item key='i'>
    //         <Icon type='user' />
    //         姓名
    //       </Menu.Item>
    //     ]
    //   }, [])
    // }
    return (
      <div className={indexStyles.line}>
        <div className={indexStyles.angleWrapper}>
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer',marginRight: '16px', marginLeft: '16px', marginTop: '12px'}} type="close" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.dateShow.bind(this)} type="clock-circle" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.subShow.bind(this)} type="form" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.pushPersonShow.bind(this)} type="user" />
          <div className={indexStyles.find}>
            <Input style={{border: 'none'}} onChange={this.change.bind(this)} style={{width: '90%', marginLeft: '10px'}} placeholder='名称(必填)' />
          </div>
          <span className={indexStyles.select}><Icon type="warning" />抄送</span>

          <div>
            <Divider style={{margin: 0}} />
            <span className={indexStyles.itemMargin}><Icon type="user" />抄送接收人</span><br></br>
            <Dropdown overlay={<h1>hello</h1>} trigger={['click']}>
              <Icon style={{fontSize: '32px', color: 'rgba(24,144,255,1)', marginLeft: '8px'}} type="plus-circle" />
            </Dropdown>
            
          </div>
          
          <div style={{display: subVisible}}>
            <Divider style={{margin: 0}} />
            <span className={indexStyles.itemMargin}><Icon type="file" />描述</span><br></br>
            <TextArea onChange={this.desChange.bind(this)} style={{marginLeft: '8px', marginBottom: '8px' ,width: '70%'}} placeholder='添加描述' />
          </div>
          
          <div style={{display: dateVisible}}>
            <Divider style={{margin: 0}} />
            <span className={indexStyles.itemMargin}><Icon type="clock-circle" />截止时间</span><br></br>
            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime onChange={this.deadline.bind(this)} style={{marginLeft: '8px'}} />
          </div>
        </div>
      </div>
    )
  }
}