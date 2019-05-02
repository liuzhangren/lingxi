import React from 'react'
import indexStyles from './index.less'
import globalStyles from '../../../globalset/css/globalClassName.less'

import {
  Checkbox,
  Icon,
  Input,
  Select,
  InputNumber
} from 'antd'

const Option = Select.Option

export default class DateBox extends React.Component {
  state = {
    verification_rule: []
  }
  del() {
    this.props.click()
  }
  updateEditDatas(data, key) {
    const { datas: { formDatas = {} } } = this.props.model
    const { itemKey, itemType, itemIndex } = this.props
    formDatas.nodes[itemKey].form_base_data[itemIndex][key] = data
    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }
  propertyNameChange(e) {
    this.updateEditDatas(e.target.value, 'property_name')
  }
  async verificationRuleChange(e) {
    console.log(e)
    await this.setState({
      verification_rule: [
        ...this.state.verification_rule,
        e
      ]
    })
    this.updateEditDatas(this.state.verification_rule.join('_'), 'verification_rule')
  }
  valLengthChange(e) {
    this.updateEditDatas(e, 'val_length')
  }
  isRequiredCheck(e) {
    if(e.target.checked) {
      this.updateEditDatas(1, 'is_required')
    } else {
      this.updateEditDatas(0, 'is_required')
    }
  }
  render() {
    return (
      <div style={{display: this.props.writeVisible}} className={indexStyles.write}>
      <i style={{marginLeft: '8px',fontSize: '28px', color: 'rgba(217,217,217,1)'}} className={globalStyles.authTheme}>&#xe8e0;</i>
      <div className={indexStyles.box}>
        <p>标题</p>
        <Input 
          // value={property_name} 
          style={{width: 68, height: 24}} 
          onChange={this.propertyNameChange.bind(this)}
        />
      </div>
      <div className={indexStyles.box}>
        <p>模式</p>
        <Select 
          // value={verification_rule} 
          style={{ width: 106}} 
          size={'small'} 
          onChange={this.verificationRuleChange.bind(this)}
        >
          <Option value="SINGLE">单个</Option>
          <Option value="MULTI">多个</Option>
        </Select>
      </div>
      <div className={indexStyles.box}>
        <p>精确度</p>
        <Select 
          // value={verification_rule} 
          style={{ width: 106}} 
          size={'small'} 
          onChange={this.verificationRuleChange.bind(this)}
        >
          <Option value="DATE_TIME">日期+时分</Option>
          <Option value="DATE">日期</Option>
        </Select>
      </div>
      <div className={indexStyles.box}>
        <p>预设值</p>
        <InputNumber min={1} 
          // value={Number(val_length)} 
          onChange={this.valLengthChange.bind(this)} 
          size={'small'} 
          style={{width: 46}} 
        />
        {/*<Input style={{width: 36, height: 24}}/>*/}
      </div>
      <div className={indexStyles.box} style={{textAlign: 'center'}}>
        <p>必填</p>
        <Checkbox 
          onChange={this.isRequiredCheck.bind(this)} 
          // checked={is_required === '1'} 
        />
      </div>
      <Icon onClick={this.del.bind(this)} style={{color: 'red', cursor: 'pointer',position: 'relative', top: '24px', left: '86px'}} type="minus-circle" />
    </div>
    )
  }
}