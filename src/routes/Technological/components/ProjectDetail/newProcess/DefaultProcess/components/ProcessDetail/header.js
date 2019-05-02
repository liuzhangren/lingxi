import React from 'react'
import { Icon, Modal } from 'antd'
import Settings from '../../../../../../../../components/headerOperate'
import {
  showConfirm,
  showDeleteConfirm
} from '../../../../../../../../components/headerOperateModal'

export default class Header extends React.Component{
  state = {
    controller: 0,
  }

  componentDidMount() {
    this.setState({
      controller: 1
    })
  }
  processEnd() {

  }
  close() {
    console.log(this.props)
    this.props.close()
  }
  render() {
    const processDelete = async () => {
      console.log('h')
    }

    const processEnd = async () => {
      console.log('w')
    }

    const ellipsis = <Icon type="ellipsis" onClick = {() => {console.log(2)}}  style={{float: 'right',marginRight: '20px', fontSize: '16px', cursor: 'pointer'}} />
    
    const dataSource = [
      this.state.controller === 1? {content: '终止流程', click: showConfirm.bind(this, processEnd.bind(this))}:undefined,
      {content: '移入回收站', click: this.state.controller === 1?showDeleteConfirm.bind(this, processDelete.bind(this)):console.log('没权限')}
    ]
    let r = dataSource.reduce((r, c) => {
      return [
        ...r,
        ...(c === undefined?[]:[c])
      ]
    } ,[])

    return (
      <div style = {{
        height:'52px',
        background:'rgba(255,255,255,1)',
        borderRadius:'4px 4px 0px 0px'}}>
        <div style={{
          width:'237px',
          height:'24px',
          background:'rgba(245,245,245,1)',
          borderRadius:'4px',
          textAlign: 'center',
          lineHeight: '24px',
          float: 'left'
        }}>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>示例项目</span>
          <span style={{color: '##8C8C8C', fontSize: '14px'}}> > </span>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>任务看板分组名称</span>
        </div>
        
        <div style={{}}>
          <Icon type="close" onClick = {this.close.bind(this)} style={{float: 'right' ,marginRight: '20px', fontSize: '16px', cursor: 'pointer'}} />
          <Settings 
            // status={this.props.status} 
            // status={this.props.listData} 
            // {...this.props} 
            item={ellipsis} 
            dataSource={r} 
            // disabledEnd={(disabled === undefined || disabled === '')?false:true} 
            // disabledDel={(disabled === undefined || disabled === '')?true:false}
          />
          <Icon type="download" onClick = {() => {console.log(1)}} style={{float: 'right' ,marginRight: '20px', fontSize: '16px', cursor: 'pointer'}}/>
        </div>
      </div>
    )
  }
}