import React from 'react'
import ProcessTemplate from '../../../../../../../components/processTemplate'
import indexStyles from '../../index.less'
import ProcessDetailModal from './Modal'
//测试数据
const mock = {
  
}

// const processTemplateList = [
//   {
//     processName: '哈哈哈哈哈哈',
//     description: '这是一段描述',
//     steps: [
//       'aaa',
//       'bbb',
//       'ccc',
//       'ddd'
//     ]
//   },
//   {
//     processName: '呵呵呵呵呵',
//     description: '这是一段描述常产出噶还能错过啊',
//     steps: [
//       '111',
//       '222',
//       '333',
//       '444',
//       '555'
//     ]
//   }
// ]
export default class TemplateProcess extends React.Component {
  state = {
    visible: false
  }
  addTemplate() {
    // console.log('addTemplate!!')
    this.setState({
      visible: true
    })
  }
  close() {
    this.setState({
      visible: false
    })
  }
  render() {
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 160
    const { datas: { processTemplateList={} } } = this.props.model

    return (
      <div>
        {processTemplateList.reduce((r, c, i) => {
          return [
            ...r,
            <ProcessTemplate {...this.props} key={`tempalte${i}`} itemValue={c} />
          ]
        }, [])}
        <div onClick={this.addTemplate.bind(this)} className={indexStyles.addTemplate}>新建模版</div>
        <ProcessDetailModal {...this.props} close={this.close.bind(this)} processDetailModalVisible={this.state.visible} />
      </div>
    )
  }
}