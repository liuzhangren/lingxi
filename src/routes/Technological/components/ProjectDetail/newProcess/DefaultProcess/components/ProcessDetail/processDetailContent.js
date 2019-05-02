import React from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../../../globalset/css/globalClassName.less'
import ProcessTemplate from '../../../../../../../../components/processTemplate'
import NewSteps from '../../../../../../../../components/newSteps'
import {
  Progress,
  Input,
  Menu,
  Dropdown,
  Button,
  Icon,
  Select,
  Divider
} from 'antd'

const { Option } = Select
const { TextArea } = Input

const processTemplateList = 
  {
    processName: '哈哈哈哈哈哈',
    description: '这是一段描述',
    steps: [
      'aaa',
      'bbb',
      'ccc',
      'ddd'
    ]
  }

export default class ProcessDetailContent extends React.Component {
  state = {
    isEdit: false,
    flag: false,
  }
  componentDidMount() {
    this.initCanvas()
  }
  hoverItem(e) {
    e.stopPropagation()
    this.setState({
      isEdit: true
    })
  }
  outItem(e) {
    e.stopPropagation()
    this.setState({
      isEdit: false
    })
  }
  intoFlag(e) {
    this.setState({
      flag: true
    })
  }
  cancelFlag(e) {
    this.setState({
      flag: false
    })
  }
  nameChange(e) {
    this.updateEditDatas(e.target.value, 'name')
  }
  subChange(e) {
    this.updateEditDatas(e.target.value, 'description')
  }
  updateEditDatas(data, key) {
    const { datas: { formDatas = {} } } = this.props.model
    formDatas[key] = data

    this.props.dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        formDatas
      }
    })
  }
  initCanvas() {
    // const { datas: { processInfo = {}, processEditDatas=[] }} = this.props.model
    // const { curr_node_sort } = processInfo
    const curr_node_sort = 2,
    processEditDatas = [
      {sort: 2}
    ]
    const defaultProps = {
      canvaswidth: 138, // 画布宽度
      canvasheight: 138, // 画布高度
      x0: 102,
      y0: 103,
      r: 69,
      lineWidth: 14,
      strokeStyle: '#ffffff',
      LinearGradientColor1: '#3EECED',
      LinearGradientColor2: '#499BE6'
    }
    const {
      x0, //原点坐标
      y0,
      r, // 半径
      lineWidth, // 画笔宽度
      strokeStyle, //画笔颜色
      LinearGradientColor1, //起始渐变颜色
      LinearGradientColor2, //结束渐变颜色
      Percentage, // 进度百分比
    } = defaultProps
    let ele = document.getElementById("time_graph_canvas")
    let circle = ele.getContext("2d");
    circle.clearRect(0, 0, 138, 138);//清空
    //创建多个圆弧
    const length = processEditDatas.length

    for (let i = 0; i < length; i++) {
      circle.beginPath();//开始一个新的路径
      circle.save()
      circle.lineWidth = lineWidth;
      let color = 'rgba(83,196,26,1)'
      if( Number(curr_node_sort) === Number(processEditDatas[i].sort)){
        color = 'rgba(24,144,255,1)'
      }else if(Number(processEditDatas[i].sort) < Number(curr_node_sort)){
        color = 'rgba(83,196,26,1)'
      }else if(Number(processEditDatas[i].sort) > Number(curr_node_sort)){
        color = '#f2f2f2'
      }
      circle.strokeStyle = color; //curr_node_sort
      circle.arc(x0, y0, r, 0.6* Math.PI + i*1.83/length* Math.PI, 0.6* Math.PI + i*1.83/length* Math.PI + 1.83/length* Math.PI - 0.03*Math.PI, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
      circle.stroke();//对当前路径进行描边
      circle.restore()
      circle.closePath()
    }
  }
  render() {
    const { isEdit, flag } = this.state
    //下拉按钮
    const menu = (
      <Menu>
        { 
          flag?
          <Menu.Item>
            <span onClick={this.cancelFlag.bind(this)}> <i style={{color: '#FAAD14'}} className={globalStyles.authTheme}>&#xe633;</i> 取消标记 </span>
          </Menu.Item>:
          <Menu.Item>
            <span onClick={this.intoFlag.bind(this)}> <i style={{color: '#FAAD14'}} className={globalStyles.authTheme}>&#xe633;</i> 标记为里程碑 </span>
          </Menu.Item> 
        }
      </Menu>
    )
    const templateDetail = (
      <Menu>
        <ProcessTemplate withoutOperate='true' {...this.props} itemValue={processTemplateList} />
      </Menu>
    )
    const templateSelect = (
      <div>
        <Dropdown overlay={templateDetail}>
          <div style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid black' }}>
            <Icon type="plus" /> Add item1
          </div>
        </Dropdown>
        <div style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid black' }}>
          <Icon type="plus" /> Add item2
        </div>
        <div style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid black' }}>
          <Icon type="plus" /> Add item3
        </div>
      </div>
    )
    return (
      <div className={styles.newTotalContainer}>
        <div style={{height: 0.83*document.documentElement.clientHeight}} className={styles.newLeftContainer}>
          <div className={styles.newSteps}>
            <canvas style={{float: 'left'}} id="time_graph_canvas" width={210} height={210} />
            <div className={styles.newEditItem}>
              <div onMouseOver={this.hoverItem.bind(this)} onMouseOut={this.outItem.bind(this)} style={{width: '55%'}}>
                { 
                  isEdit?
                  <Dropdown overlay={menu} trigger={['click']}>
                    <span 
                      className={`${globalStyles.authTheme} ${styles.newMore}`}
                    >&#xe66f;</span>
                  </Dropdown>:
                  <Dropdown overlay={menu} trigger={['click']}>
                    {
                      flag?
                      <span 
                        className={`${globalStyles.authTheme} ${styles.newNormal}`}
                        style={{color: '#FAAD14'}}
                      >&#xe633;</span>:
                      <span 
                        className={`${globalStyles.authTheme} ${styles.newNormal}`}
                      >&#xe62d;</span>
                    } 
                  </Dropdown>
                }
                <Input onChange={this.nameChange.bind(this)} style={{height: '38px', width: '60%'}} placeholder="名称（必填）" />
              </div>
              <TextArea onChange={this.subChange.bind(this)} placeholder='+ 简介' />
              <NewSteps formData={this.state.form} {...this.props} />

            </div>
            
          </div>
        </div>

        <div style={{height: 0.83*document.documentElement.clientHeight}} className={styles.newRightContainer}>
        
        </div>
      </div>
    )
  }
}