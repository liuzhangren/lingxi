import React from 'react'
import indexStyles from './index.less'
import globalStyles from '../../../globalset/css/globalClassName.less'
import TextBox from './textBox'
import DateBox from './dateBox'
import SelectBox from './selectBox'
import Upload from './upload'
import { timeToTimestamp } from '../../../utils/util'

import {
  Checkbox,
  Icon,
  Input,
  Select,
  InputNumber,
  Dropdown,
  Menu,
  Divider,
  DatePicker
} from 'antd'

const Option = Select.Option
const { TextArea } = Input
export default class ContentCollection extends React.Component{
  state = {
    writeVisible: false,
    uploadVisible: false,
    pushPersonVisible: false,
    subVisible: false,
    dateVisible: false,
    writeType: [
      1
    ]
  }
  componentDidMount() {

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
  writeVisibleChange(e) {
    this.setState({
      writeVisible: !this.state.writeVisible
    })
    const {
      formDatas, 
      newProcessContentCollectionTextBox,
      processCurrentEditStep
    } = this.props.model.datas

    if(e.target.checked) {
      formDatas.nodes[processCurrentEditStep].selected_form = '1'
      formDatas.nodes[processCurrentEditStep].form_base_data[0] = newProcessContentCollectionTextBox
    }else {
      formDatas.nodes[processCurrentEditStep].selected_form = '0'
      formDatas.nodes[processCurrentEditStep].form_base_data[0] = {}
    }

    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }  
  uploadVisibleChange(e) {
    this.setState({
      uploadVisible: !this.state.uploadVisible
    })
    const {
      formDatas, 
      processCurrentEditStep,
      newProcesssContentCollectionUpload
    } = this.props.model.datas

    if(e.target.checked) {
      formDatas.nodes[processCurrentEditStep].selected_upload = '1'
      formDatas.nodes[processCurrentEditStep].upload_base_data = newProcesssContentCollectionUpload
    }else {
      formDatas.nodes[processCurrentEditStep].selected_upload = '0'
      formDatas.nodes[processCurrentEditStep].upload_base_data = {}
    }

    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }
  menuClick({item, key}) {
    // console.log(key)
    let temp = [
      ...this.state.writeType,
      key
    ]
    this.setState({
      writeType: temp
    })

    const {
      formDatas, 
      processCurrentEditStep, 
      newProcessContentCollectionTextBox, 
      newProcessContentCollectionDateBox,  
      newProcessContentCollectionSelectBox
    } = this.props.model.datas
    
    if(key === '1') {
      formDatas.nodes[processCurrentEditStep].form_base_data.push(newProcessContentCollectionTextBox)
    } else if(key === '2') {
      formDatas.nodes[processCurrentEditStep].form_base_data.push(newProcessContentCollectionDateBox)
    } else {
      formDatas.nodes[processCurrentEditStep].form_base_data.push(newProcessContentCollectionSelectBox)
    }
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })


  }
  del(key) {
    let Lists = this.state.writeType
    Lists.splice(key, 1, '')
    this.setState({
      writeType: Lists
    })
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

  change(e) {
    this.updateEditDatas(e.target.value, 'name')
  }
  desChange(e) {
    this.updateEditDatas(e.target.value, 'description')
  }
  deadline(value , dateString) {
    // console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString)
    this.updateEditDatas((timeToTimestamp(dateString)/1000).toString(), 'deadline')
  }
  updateEditDatas(data, key) {
    const { datas: { formDatas = {} } } = this.props.model
    const { itemKey } = this.props
    formDatas.nodes[itemKey][key] = data
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }

  render() {
    console.log('🐶', this.props)
    const writeVisible = this.state.writeVisible?'flex':'none'
    const uploadVisible = this.state.uploadVisible?'':'none'

    const pushPersonVisible = this.state.pushPersonVisible?'':'none'
    const subVisible = this.state.subVisible?'':'none'
    const dateVisible = this.state.dateVisible?'':'none'

    const menu = (
      <Menu onClick={this.menuClick.bind(this)}>
        <Menu.Item key='1'>文本框</Menu.Item>
        <Menu.Item key='2'>日期</Menu.Item>
        <Menu.Item key='3'>下拉选项</Menu.Item>
      </Menu>
    )
    // console.log(this.state.writeType)
    const write = (type) => {
      let containers = []
      type.forEach((c, i) => {
        if (c === '2') {
          containers.push(<DateBox {...this.props} itemType={c} itemIndex={i} click={this.del.bind(this, i)} writeVisible={writeVisible}/>)
        }else if (c === '3') {
          containers.push(<SelectBox {...this.props} itemType={c} itemIndex={i} click={this.del.bind(this, i)}  writeVisible={writeVisible}/>)
        }else if(c === '') {
          containers.push('')
        }else {
          containers.push(<TextBox {...this.props} itemType={c} itemIndex={i} click={this.del.bind(this, i)}  writeVisible={writeVisible}/>)
        }
      })
      return containers
    }

    return (
      <div className={indexStyles.line}>
        <div className={indexStyles.angleWrapper}>
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer',marginRight: '16px', marginLeft: '16px', marginTop: '12px'}} type="close" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.dateShow.bind(this)} type="clock-circle" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.subShow.bind(this)} type="form" />
          <Icon className={indexStyles.hoverIcon} style={{float: 'right', cursor: 'pointer', marginLeft: '16px', marginTop: '12px'}} onClick={this.pushPersonShow.bind(this)} type="user" />
          {/* {this.props.content[i+1]} */}
          <div className={indexStyles.find}>
            <Input style={{border: 'none'}} onChange={this.change.bind(this)} style={{width: '90%', marginLeft: '10px'}} placeholder='名称(必填)' />
          </div>
          <span className={indexStyles.itemMargin}><Icon type="form" /> 内容收集</span><br></br>
          <Checkbox onChange={this.writeVisibleChange.bind(this)} className={indexStyles.itemMargin}>填写</Checkbox><br></br>
          { write(this.state.writeType) }
          <Dropdown overlay={menu}>
            <div style={{display: writeVisible}} className={indexStyles.writeAdd}> <i style={{margin: '0 auto'}} className={globalStyles.authTheme}>&#xe6ca;</i> </div>
          </Dropdown>
          <Checkbox onChange={this.uploadVisibleChange.bind(this)} className={indexStyles.itemMargin}>上传</Checkbox>
          {/* 上传 */}
          <Upload {...this.props} visible={uploadVisible}/>

          <div style={{display: pushPersonVisible}}>
            <Divider style={{margin: 0}} />
            <span className={indexStyles.itemMargin}><Icon type="user" />推进人</span><br></br>
            <Icon style={{fontSize: '32px', color: 'rgba(24,144,255,1)', marginLeft: '8px'}} type="plus-circle" />
          </div>
          
          <div style={{display: subVisible}}>
            <Divider style={{margin: 0}} />
            <span className={indexStyles.itemMargin}><Icon type="file" />描述</span><br></br>
            <TextArea onChange={this.desChange.bind(this)} style={{marginLeft: '8px', marginBottom: '8px' ,width: '70%'}} placeholder='添加描述' />
          </div>
          
          <div style={{display: dateVisible}}>
            <Divider style={{margin: 0}} />
            <span  className={indexStyles.itemMargin}><Icon type="clock-circle" />截止时间</span><br></br>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.deadline.bind(this)} style={{marginLeft: '8px'}} />
          </div>
        </div>
      </div>
    )
  }
}