import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import {min_page_width} from "../../../../../../../globalset/js/styles";
import CustormModal from '../../../../../../../components/CustormModal'
import ProcessDetail from './ProcessDetail'
const FormItem = Form.Item
const TextArea = Input.TextArea


class ProccessDetailModal extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onCancel(){
    // this.props.updateDatas({
    //   isInOpenFile: false
    // })
  }

  render() {
    console.log('🐂', this.props)
    // const { modalVisible } = this.props;
    const modalTop = 20
    // const processDetail = (
    //   <h1>hello world</h1>
    // )
    return(
      <CustormModal
        visible={this.props.processDetailModalVisible}
        width={'90%'}
        closable={false}
        maskClosable={false}
        footer={null}
        destroyOnClose
        bodyStyle={{top: 0}}
        style={{top: modalTop}}
        overInner={<ProcessDetail {...this.props} close={this.props.close} />}
      />
    )
  }
}
export default Form.create()(ProccessDetailModal)
