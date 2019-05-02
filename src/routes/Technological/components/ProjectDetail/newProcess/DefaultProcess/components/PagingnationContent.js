import React from 'react'
import indexStyles from '../../index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import ProccessDetailModal from './Modal'
import {
  Input,
  DatePicker,
  Menu,
  Dropdown
} from 'antd'

export default class PagingnationContent extends React.Component{
  state = {
    isPrint: false,
    values: [],
    isShowTimePicker: false,
    color: '',
    isShowDate: false,
    dateString: '',
    itemHover: false,
    flag: false,
    processDetailModalVisible: false,
    isPrevent: false
  }

  changeDom() {
    this.setState({
      isPrint: true
    })
  }

  onChange(e) {
    if(e.target.value !== '') {
      this.setState({
        isShowTimePicker: true
      })
    }else {
      this.setState({
        isShowTimePicker: false
      })
    }
  }
  complete(e) {
    const { value } = e.target
    this.setState({
      isPrint: false
    })
    this.setState({
      values: [
        ...this.state.values,
        `${value} (*/*)`
      ]
    })
  }

  hoverNewCreateTemplate() {
    this.setState({
      color: '#1890FF',
      isShowDate: true
    })
  }
  outNeCreateTemplate() {
    this.setState({
      color: '',
      isShowDate: false
    })
  }

  onChangeDate(date, dateString) {
    // console.log(date, dateString)
    this.setState({
      dateString
    })
  }
  hoverItem() {
    this.setState({
      itemHover: true
    })
  }
  outItem() {
    this.setState({
      itemHover: false
    })
  }
  changeNodeType() {
    console.log('changeNodeType')
  }
  intoFlag(e) {
    e.stopPropagation()
    this.setState({
      flag: true
    })
  }
  cancelFlag(e) {
    e.stopPropagation()
    this.setState({
      flag: false
    })
  }
  showProcessDetail() {
    this.setState({
      processDetailModalVisible: true
    })
  }
  close() {
    this.setState({
      processDetailModalVisible: false
    })
  }
  render() {
    const { isPrint, values, isShowTimePicker } = this.state
    const icon = (
      <i style={{color: '#1890FF'}} className={globalStyles.authTheme}>&#xe62d;</i>
    )
    const timePicker = (
      isShowTimePicker?(
        <div>
          <DatePicker
            className={indexStyles.removeInputBorder}
            showTime
            suffixIcon={
              <span 
                style={{color: this.state.color}} 
                onMouseOver={this.hoverNewCreateTemplate.bind(this)} 
                onMouseOut={this.outNeCreateTemplate.bind(this)} 
                className={globalStyles.authTheme}
              >&#xe637;</span>
            }
          />
        </div>
      ):null
    )
    //item icon悬浮下拉列表
    const menu = (
      <Menu>
        { this.state.flag?
          <Menu.Item>
            <span onClick={this.cancelFlag.bind(this)}> <i style={{color: '#FAAD14'}} className={globalStyles.authTheme}>&#xe633;</i> 取消标记 </span>
          </Menu.Item>:
          <Menu.Item>
            <span onClick={this.intoFlag.bind(this)}> <i style={{color: '#FAAD14'}} className={globalStyles.authTheme}>&#xe633;</i> 标记为里程碑 </span>
          </Menu.Item> 
        }
      </Menu>
    )
    const items = (
      values.length > 0?(
        values.reduce((r, c, i) => {
          return [
            ...r,
            <div className={indexStyles.container} key={`div${i}`}>
              {
                this.state.itemHover?
                  <Dropdown overlay={menu} >
                    <i 
                      style={{color: this.state.color, marginLeft: '20px'}} 
                      className={globalStyles.authTheme}
                    >&#xe66f;</i>
                  </Dropdown>:
                <Dropdown overlay={menu} >
                  { this.state.flag?<i style={{color: '#FAAD14', marginLeft: '20px'}} className={globalStyles.authTheme}>&#xe633;</i>:<i style={{color: '#1890FF', marginLeft: '20px'}} className={globalStyles.authTheme}>&#xe62d;</i> }
                </Dropdown>
              }

              <div onClick={this.showProcessDetail.bind(this)} onMouseOver={this.hoverItem.bind(this)} onMouseOut={this.outItem.bind(this)} key={`items${i}`} className={indexStyles.processItems}>
                <span style={{marginLeft: '60px'}}>{c}</span>
              </div>
              <DatePicker
                className={indexStyles.removeInputBorder}
                showTime
                format="YYYY-MM-DD HH:mm"
                allowClear='true'
                onChange={this.onChangeDate.bind(this)}
                suffixIcon={
                  this.state.dateString!==''?
                  <span 
                    style={{minWidth: '145px', color: this.state.color}}
                  > {this.state.dateString} </span>:
                  <span 
                    style={{color: this.state.color}} 
                    onMouseOver={this.hoverNewCreateTemplate.bind(this)} 
                    onMouseOut={this.outNeCreateTemplate.bind(this)} 
                    className={globalStyles.authTheme}
                  >&#xe637;</span>
                }
              />
            </div>
          ]
        }, [])
        
      ):null
    )
    return (
      <div>
        {!isPrint?(
          <div onClick={this.changeDom.bind(this)} className={indexStyles.processItems}>
            <i style={{color: '#1890FF', marginLeft: '20px'}} className={globalStyles.authTheme}>&#xe62d;</i>
            <span style={{marginLeft: '25px'}}>新建节点</span>
          </div>
        ):(
          <Input 
            onChange={this.onChange.bind(this)} 
            size='large' 
            prefix={icon} 
            onPressEnter={this.complete.bind(this)} 
            placeholder="请输入节点名字" 
          />
        )}
        { items }
        <ProccessDetailModal {...this.props} close={this.close.bind(this)} processDetailModalVisible={this.state.processDetailModalVisible} />
      </div>
    )
  }
}