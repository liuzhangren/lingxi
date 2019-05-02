import React from 'react'
import indexStyles from './index.less'

import {
  Checkbox,
  Input
} from 'antd'

export default class Upload extends React.Component{
  state = {

  }
  uploadFileCount(e) {
    this.updateEditDatas(e.target.value, 'limit_file_num')
  }

  limitFileTypeChange(value) {
    // console.log(value)
    this.updateEditDatas(value.join(','), 'limit_file_type')
  }
  uploadLimitSize(e) {
    this.updateEditDatas(e.target.value, 'limit_file_size')
  }
  updateEditDatas(data, key) {
    const { datas: { formDatas = {} } } = this.props.model
    const { itemKey, itemType, itemIndex } = this.props
    formDatas.nodes[itemKey].upload_base_data[key] = data
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }
  render() {
    const { datas: { formDatas = {} } } = this.props.model
    const { itemKey} = this.props

    const { limit_file_num, limit_file_type, limit_file_size } = formDatas.nodes[itemKey].upload_base_data
    const limit_file_type_default = limit_file_type?limit_file_type.split(','):[]
    return (
      <div style={{display: this.props.visible}} className={indexStyles.container}>
        <div style={{width: 312}}>
          <span>限制上传数量为</span> 
          <Input onChange={this.uploadFileCount.bind(this)} placeholder='0'/> 
          <span>个文件(0为不受限制)</span>
        </div>
        <div style={{width: 400, display: 'flex', justifyContent: 'space-arround'}}>
          <span style={{marginRight: '8px'}}>限制文件格式为</span> 
          <div>
            <Checkbox.Group defaultValue={limit_file_type_default}  onChange={this.limitFileTypeChange.bind(this)} style={{color: '#262626', marginTop: 14}}>
              <Checkbox value="1" style={{color: '#262626'}}>文档</Checkbox>
              <Checkbox value="2" style={{color: '#262626'}}>图像</Checkbox>
              <Checkbox value="3" style={{color: '#262626'}}>音频</Checkbox>
              <Checkbox value="4" style={{color: '#262626'}}>视频</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div style={{width: 298}}> 
          <span>限制文件大小为</span> 
          <Input onChange={this.uploadLimitSize.bind(this)} placeholder='0'/>
          <span>MB(0为不受限制)</span>
        </div>
      </div>
    )
  }
}