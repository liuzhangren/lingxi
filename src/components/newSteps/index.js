import React from 'react'
import indexStyles from './index.less'
import ContentCollection from './ContentCollection'
import InitStep from './InitStep'

import {
  Icon,
  Button,
  Input,
  Checkbox,
  Collapse
} from 'antd'

const processDetailEdit = {
  node: 2,
}

const Panel = Collapse.Panel

export default class NewSteps extends React.Component {
  state = {
    sort: 0,
    value: '',
    pushPersonVisible: false,
    subVisible: false,
    dateVisible: false
  }
  componentDidMount() {
    
    
  }
  saveTemplate() {
    const { formDatas, board_id } = this.props.model.datas
    formDatas.board_id = board_id
    debugger
    this.props.dispatch({
      type: 'projectDetailProcess/saveProcessTemplate',
      payload: {
        formDatas
      }
    })
  }
  async addAction() {
    await this.setState({
      sort: this.state.sort + 1
    })
    const { datas: { formDatas = {} }  } = this.props.model
    
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        processCurrentEditStep: this.state.sort
      }
    })
  }
  del() {
    this.setState({
      sort: this.state.sort - 1
    })
  }
  change(e) {
    this.setState({
      value: e.target.value
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
  render() {
    const steps = (sort) => {
      let content = [
        <ContentCollection itemKey='0' pushPersonVisible={this.state.pushPersonVisible} subVisible={this.state.subVisible} dateVisible={this.state.dateVisible} {...this.props} key='0' />
      ]
      for(let i = 0; i < sort; i++ ) {
        content.push(
          (<div>
              <div className={indexStyles.circle}>{i+2}</div>
              <InitStep itemKey={i+1} pushPersonVisible={this.state.pushPersonVisible} subVisible={this.state.subVisible} dateVisible={this.state.dateVisible} {...this.props} key={i+2} />
            </div>)
        )
      }
      return content
    }
    return (
      <div className={indexStyles.container}>
        <div className={indexStyles.circle}>1</div>
        {steps(this.state.sort)}
        <div style={{display: 'flex'}}>
          <div onClick={this.addAction.bind(this)} className={indexStyles.circle}>+</div>
          {
            this.state.sort >= 1?
            <Button onClick={this.saveTemplate.bind(this)} style={{marginLeft: '41%'}} type='primary' >保存模板</Button>:
            <Button  style={{marginLeft: '41%'}} type='primary' disabled>保存模板</Button>
          }
        </div>
      </div>
    )
  }
}