import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import MeetingItem from './MeetingItem'
import TaskItem from './TaskItem'
import BoardItem from './BoardItem'
import FlowItem from './FlowItem'
import FileItem from './FileItem'

import {connect} from "dva/index";
import SchedulingItem from "../components/Workbench/CardContent/School/SchedulingItem";
const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
//此弹窗应用于各个业务弹窗，和右边圈子适配
const getEffectOrReducerByName = name => `globalSearch/${name}`
@connect(mapStateToProps)
export default class TypeResult extends React.Component {
  state = {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  filterTitle = (listType, value) => {
    const { dispatch } = this.props
    let title = ''
    let ele = <div></div>
    let defaultSearchType = '1'
    switch (listType) {
      case 'boards':
        title = '项目'
        defaultSearchType = '2'
        ele = <BoardItem itemValue={value} dispatch={dispatch}/>
        break
      case 'cards':
        title = '任务'
        defaultSearchType = '3'
        ele = <TaskItem itemValue={value} dispatch={dispatch} />
        break
      case 'files':
        title = '文档'
        defaultSearchType = '6'
        ele = <FileItem itemValue={value} dispatch={dispatch} />
        break
      case 'flows':
        title = '流程'
        defaultSearchType = '5'
        ele = <FlowItem itemValue={value} dispatch={dispatch} />
        break
      case 'schedules':
        title = '日程'
        defaultSearchType = '4'
        ele = <MeetingItem itemValue={value} dispatch={dispatch} />
        break
      default:
        break
    }
    return { title, ele, defaultSearchType }
  }

  lookMore(defaultSearchType) {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        defaultSearchType
      }
    })
  }

  render() {

    const { allTypeResultList } = this.props.model
    const { dispatch } = this.props

    return(
      <div>
        {allTypeResultList.map((value, key) => {
          const { lists = [], listType } = value
          return (
            <div className={indexstyles.typeResult} key={key}>
              <div className={indexstyles.contentTitle}>{this.filterTitle(listType).title}</div>
              {lists.map((value, key) => {
                return (
                  <div key={key}>
                    {this.filterTitle(listType, value).ele}
                  </div>
                )
              })}
              <div className={indexstyles.lookMore} onClick={this.lookMore.bind(this, this.filterTitle(listType).defaultSearchType)}>查看更多...</div>
            </div>
          )
        })}
      </div>

    )
  }
}

function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, allTypeResultList = [] } } }) {
  return {
    model: { searchTypeList, defaultSearchType, searchInputValue, allTypeResultList },
  }
}
