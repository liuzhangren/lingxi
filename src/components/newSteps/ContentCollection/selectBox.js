import React from 'react'
import indexStyles from './index.less'
import globalStyles from '../../../globalset/css/globalClassName.less'
import SelectModal from './selectModal'

import {
  Checkbox,
  Icon,
  Input,
  Select,
  InputNumber,
  Button,
  Modal
} from 'antd'

const Option = Select.Option
const TextArea = Input.TextArea

export default class selectBox extends React.Component {
  state = {
    modalVisible: false
  }
  del() {
    this.props.click()
  }
  openSelect() {
    this.setState({
      modalVisible: true
    })
    debugger
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
  setShowModalVisibile(){
    this.setState({
      modalVisible: false
    })
  }
  propertyNameChange(e) {
    this.updateEditDatas(e.target.value, 'property_name')
  }
  verificationRuleChange(e){
    this.updateEditDatas(e, 'verification_rule')
  }
  isRequiredCheck(e) {
    if(e.target.checked) {
      this.updateEditDatas(1, 'is_required')
    } else {
      this.updateEditDatas(0, 'is_required')
    }
  }
  render() {
    // const { datas: { formDatas = {} } } = this.props.model
    // const { itemKey, itemType, itemIndex } = this.props
    // const { options_data = []} = formDatas.nodesp[itemKey].form_base_data[itemIndex]
    // debugger
    // formDatas.nodes[itemKey].form_base_data[itemIndex][key] = data
    const options_data = [1, 2, 3]
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
        <p>选项</p>
        <Button onClick={this.openSelect.bind(this)} type='default'>编辑选项</Button>
        {/* <selectModal modalVisible={this.state.modalVisible} /> */}
        <SelectModal options_data = {options_data} modalVisible={this.state.modalVisible} setShowModalVisibile={this.setShowModalVisibile.bind(this)}></SelectModal>
      </div>
      <div className={indexStyles.box}>
        <p>默认值</p>
        <Select 
          // value={verification_rule} 
          style={{ width: 106}} 
          size={'small'} 
          // onChange={this.verificationRuleChange.bind(this)}
        >
        </Select>
      </div>
      <div className={indexStyles.box}>
        <p>预设规则</p>
        <Select 
          // value={verification_rule} 
          style={{ width: 106}} 
          size={'small'} 
          onChange={this.verificationRuleChange.bind(this)}
        >
          <Option value="redio">单选</Option>
          <Option value="multiple">多选</Option>
          <Option value="province">省市区</Option>
        </Select>
      </div>
      <div className={indexStyles.box} style={{textAlign: 'center'}}>
        <p>必填</p>
        <Checkbox 
          onChange={this.isRequiredCheck.bind(this)} 
          // checked={is_required === '1'} 
        />
      </div>
      <Icon onClick={this.del.bind(this)} style={{color: 'red',cursor: 'pointer', position: 'relative', top: '24px', left: '50px'}} type="minus-circle" />
    </div>
    )
  }
}