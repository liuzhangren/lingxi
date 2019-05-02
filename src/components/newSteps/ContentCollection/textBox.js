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

export default class TextBox extends React.Component {
  state = {

  }
  del() {
    this.props.click()
  }
  propertyNameChange(e) {
    this.updateEditDatas(e.target.value, 'property_name')
  }
  defaultValueChange(e) {
    this.updateEditDatas(e.target.value, 'default_value')
  }

  verificationRuleChange(key, value) {
    const { datas: { formDatas = [], processCurrentEditStep = 0, } } = this.props.model
    this.updateEditDatas(key, 'verification_rule')
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
        <p>默认填写</p>
        <Input 
          // value={default_value} 
          style={{width: 144, height: 24}} 
          onChange={this.defaultValueChange.bind(this)} 
        />
      </div>
      <div className={indexStyles.box}>
        <p>校验规则</p>
        <Select 
          // value={verification_rule} 
          style={{ width: 106}} 
          size={'small'} 
          onChange={this.verificationRuleChange.bind(this)}
        >
          <Option value="">不校验格式</Option>
          <Option value="mobile">手机号码</Option>
          <Option value="tel">座机</Option>
          <Option value="ID_card">身份证号码</Option>
          <Option value="chinese_name">中文名（2-6）个汉字</Option>
          <Option value="url">网址</Option>
          <Option value="qq">QQ号</Option>
          <Option value="postal_code">邮政编码</Option>
          <Option value="positive_integer">正整数</Option>
          <Option value="negative">负数</Option>
          <Option value="two_decimal_places">精确到两位小数</Option>
        </Select>
      </div>
      <div className={indexStyles.box}>
        <p>长度</p>
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
      <Icon onClick={this.del.bind(this)} style={{color: 'red', position: 'relative', top: '24px', left: '50px', cursor: 'pointer'}} type="minus-circle" />
    </div>
    )
  }
}