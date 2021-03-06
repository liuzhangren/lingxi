import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon, Avatar } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermission, checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_INTERVIEW, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE, ORG_TEAM_BOARD_QUERY, PROJECT_FLOW_FLOW_ACCESS, APP_KEY
} from "../../../globalset/js/constant";
import { timestampToTimeNormal } from '../../../utils/util'
import Cookies from "js-cookie";
import {connect} from "dva/index";

const FormItem = Form.Item
const TextArea = Input.TextArea

const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
@connect(mapStateToProps)
export default class AnotherItem extends React.Component {
  state = {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  itemClick(data, e) {
    const { id, board_id } = data;
    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { dispatch } = this.props
    const { model = {} } = this.props
    const projectDetailBoardId = model['board_id']
    Cookies.remove('appsSelectKeyIsAreadyClickArray', { path: '' })
    dispatch({
      type: 'globalSearch/updateDatas',
      payload: {
        globalSearchModalVisible: false
      }
    })
    dispatch({
      type: 'globalSearch/routingJump',
      payload: {
        route: `/technological/projectDetail?board_id=${board_id}&appsSelectKey=${APP_KEY.CARD}&card_id=${id}`
      }
    })
  }
  itemOneClick(e) {
    e.stopPropagation();
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize, id, board_id, name, create_time } = itemValue

    return(
      <div>
        <div className={indexstyles.taskItem}>
          <div className={globalStyles.authTheme}>&#xe709;</div>
          <div className={indexstyles.itemName}>
            <div style={{textDecoration: is_realize === "1" ? "line-through" : "none"}} onClick={this.itemClick.bind(this, { id, board_id })}>
              {name}
            </div>
          </div>
          <div className={indexstyles.time}>{timestampToTimeNormal(create_time)}</div>
          {/*<div className={indexstyles.avatar}>*/}
            {/*<Avatar size={16} style={{padding: 0}}/>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}
function mapStateToProps({ projectDetail: { datas: { board_id } } }) {
  return {
    model: { board_id },
  }
}
