import React from 'react'
import DetailConfirmInfoBox from '../../../../../../components/DetailConfirmInfoBox'
import indexStyles from './index.less'
import styles from './index.css'
import { Card, Input, Icon, DatePicker, Dropdown, Button, Tooltip, Avatar } from 'antd'
import MenuSearchMultiple from '../ProcessStartConfirm/MenuSearchMultiple'
import OpinionModal from './OpinionModal'
import {timeToTimestamp, timestampToTimeNormal} from "../../../../../../utils/util";
import Cookies from "js-cookie";
import ContentRaletion from '../../../../../../components/ContentRaletion'
import AvatarComps from '../../../../../../components/avatarMore'

const { RangePicker } = DatePicker;

//里程碑确认信息
export default class DetailConfirmInfoOne extends React.Component {
  state = {
    opinionModalVisible: false,
    due_time: '',
    isShowBottDetail: false, //是否显示底部详情
  }
  componentWillMount(nextProps) {
    const { itemKey } = this.props
    //设置底部可伸缩部分id
    this.setState({
      ConfirmInfoOut_1_bott_Id: `ConfirmInfoOut_1_bott_Id__${itemKey * 100 + 1}`
    })
    this.propsChangeSetIsShowBottDetail(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.propsChangeSetIsShowBottDetail(nextProps)
  }
  //isShowBottDetail是否在当前步骤
  propsChangeSetIsShowBottDetail(props) {
    const { datas: { processEditDatas, processInfo = {} } } = props.model
    const { itemKey } = props //所属列表位置
    const { curr_node_sort} = processInfo //当前节点
    const { sort } = processEditDatas[itemKey]
    if(curr_node_sort == sort) {
      this.setState({
        isShowBottDetail: true
      })
    } else {
      this.setState({
        isShowBottDetail: false
      })
    }
  }

  datePickerChange(date, dateString) {
    this.setState({
      due_time: dateString
    })
    const { datas: { processEditDatas = [], projectDetailInfoData = [] } } = this.props.model
    const { itemKey } = this.props
    processEditDatas[itemKey]['deadline_value'] = timeToTimestamp(dateString)
    this.props.updateDatasProcess({
      processEditDatas
    })

  }
  setAssignees(data) { //替换掉当前操作人
    const { datas: { processEditDatas = [], projectDetailInfoData = [], processInfo = {} } } = this.props.model

    const { itemKey } = this.props
    const { assignees = [] } = processEditDatas[itemKey]
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const currentUserId= userInfo.id //当前用户id, 用于替换
    const users = projectDetailInfoData.data //项目参与人
    //将当前用户替换成所选用户
    let willSetAssignee = ''
    for(let i = 0; i < assignees.length; i++) {
      if(assignees[i].user_id === currentUserId) {
        assignees[i] = data[0]
        willSetAssignee = data[0]
        break;
      }
    }
    processEditDatas[itemKey]['assignees'] = assignees
    this.props.updateDatasProcess({
      processEditDatas
    })
    //重新指派推进人接口
    this.props.resetAsignees({
      assignee: willSetAssignee,
      flow_node_instance_id: processEditDatas[itemKey].id,
      instance_id: processInfo.id,
    })
  }
  setIsShowBottDetail() {
    this.setState({
      isShowBottDetail: !this.state.isShowBottDetail
    }, function () {
      this.funTransitionHeight(element, 500, this.state.isShowBottDetail)
    })
    const { ConfirmInfoOut_1_bott_Id } = this.state
    const element = document.getElementById(ConfirmInfoOut_1_bott_Id)
  }
  funTransitionHeight = function(element, time, type) { // time, 数值，可缺省
    if (typeof window.getComputedStyle === "undefined") return;
    const height = window.getComputedStyle(element).height;
    element.style.transition = "none"; // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
    element.style.height = "auto";
    const targetHeight = window.getComputedStyle(element).height;
    element.style.height = height;
    element.offsetWidth;
    if (time) element.style.transition = "height "+ time +"ms";
    element.style.height = type ? targetHeight : 0;
  };

  setOpinionModalVisible(operateType) {
    this.setState({
      operateType, //1完成 0 撤回
      opinionModalVisible: !this.state.opinionModalVisible
    })
  }

  render() {
    const { due_time, isShowBottDetail, relations = [] } = this.state
    const { ConfirmInfoOut_1_bott_Id } = this.state

    const { datas: { processEditDatas, projectDetailInfoData = [], processInfo = {} } } = this.props.model
    const { itemKey, itemValue } = this.props //所属列表位置
    const { board_id } = projectDetailInfoData
    const { curr_node_sort, status } = processInfo //当前节点
    const { id, name, description, assignees = [], assignee_type, deadline_type, deadline_value, is_workday, sort, enable_opinion, enable_revocation } = processEditDatas[itemKey]
    // console.log( processEditDatas[itemKey])
    //推进人来源
    const users = projectDetailInfoData.data
    //推进人
    const assigneesArray = assignees || []
    //判断当前用户是否有操作权限--从推进人列表里面获得id，和当前操作人的id
    let currentUserCanOperate = false
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const currentUserId= userInfo.id //当前用户id, 用于替换
    for(let i = 0; i <assignees.length; i++) {
      if(assignees[i].user_id === currentUserId) {
        currentUserCanOperate = true
        break
      }
    }

    const imgOrAvatar = (img) => {
      return img ? (
        <div>
          <img src={img} style={{width: 18, height: 18, borderRadius: 16, margin: '0 4px'}} />
        </div>
      ):(
        <div style={{lineHeight: '18px', height: 18, width: 16, borderRadius: 18, backgroundColor: '#e8e8e8', marginRight: 8, textAlign: 'center', margin: '0 8px', marginTop: 2, }}>
          <Icon type={'user'} style={{fontSize: 10, color: '#8c8c8c', }}/>
        </div>
      )
    }
    const filterAssignee = (assignee_type) => {
      let container = (<div></div>)
      switch (assignee_type) {
        case '1':
          container = (<div style={{color: '#595959'}}>任何人</div>)
          break
        case '2':
          container = (
              <div style={{display: 'flex'}}>
                {assigneesArray.map((value, key)=>{
                  const { avatar, name, mobile, email } = value
                  if (key <= 1)
                    return(
                      <Tooltip key={key} placement="top" title={name || mobile || email || '佚名'}>
                        <div>{imgOrAvatar(avatar)}</div>
                      </Tooltip>
                    )
                })}
                
                {assigneesArray.length > 2?(<span style={{color: '#595959'}}><AvatarComps datas={assigneesArray} /></span>): ('') }
              </div>)
          break
        case '3':
          container = (
            <div style={{display: 'flex'}}>
              {assigneesArray.map((value, key)=>{
                const { avatar, name } = value
                if (key <= 1)
                  return(
                    <Tooltip key={key} placement="top" title={name || '佚名'}>
                      <div>{imgOrAvatar(avatar)}</div>
                    </Tooltip>
                  )
              })}
              {assigneesArray.length >2?(<span style={{color: '#595959'}}><AvatarComps datas={assigneesArray} /></span>): ('') }
            </div>)
          break
        default:
          container = (<div></div>)
          break
      }
      return container
    }
    const filterDueTime = (deadline_type) => {
      let container = (<div></div>)
      switch (deadline_type) {
        case '1':
          container = (<div style={{color: '#595959'}}>无限期</div>)
          break
        case '2':
          container = (
            <div style={{color: '#595959'}}>
              {timestampToTimeNormal(deadline_value, '/', true)}
            </div>
          )
          break
        case '3':
          container = (<div style={{color: '#595959'}}>{`${is_workday === '0'? '固定': '工作日'}${deadline_value}天`}</div>)
          break
        default:
          container = (<div></div>)
          break
      }
      return container
    }
    const filterBorderStyle = (sort) => {
      if (Number(sort) < Number(curr_node_sort)) {
        return {border: '2px solid rgba(83,196,26,1)'}
      }else if(Number(sort) === Number(curr_node_sort)) {
        return {border: '2px solid rgba(24,144,255,1)'}
      }else if(Number(sort) > Number(curr_node_sort)) {
       return {border: '2px solid rgba(140,140,140,1)'}
      }else {}
    }
    const filterBottOperate = () => {
      let container = (<div></div>)
      if((currentUserCanOperate || assignee_type === '1') && status !== '3') {
        if (Number(sort) < Number(curr_node_sort)) {
          if(Number(curr_node_sort) - Number(sort) === 1) { //相邻才能有撤回
            container = (
              <div>
                {enable_revocation === '1' ? (
                  <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
                    <Button onClick={this.setOpinionModalVisible.bind(this, '0')} style={{color: 'red'}}>撤回</Button>
                  </div>
                ):(<div></div>)}
              </div>
            )
          }
        } else if (Number(sort) === Number(curr_node_sort)) {
          container = (
            <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
              <Dropdown overlay={<MenuSearchMultiple noMutiple={true} usersArray={users}
                                                     filterUserArray={assigneesArray}
                                                     setAssignees={this.setAssignees.bind(this)}/>}>
                {assignee_type !== '1'? (<div>重新指派推进人</div>) : (<div></div>)}
              </Dropdown>
              <Button type={'primary'} onClick={this.setOpinionModalVisible.bind(this, '1')}>完成</Button>
            </div>
          )
        } else if (Number(sort) > Number(curr_node_sort)) {
          container = (
            <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
            </div>
          )
        } else {
        }
      }else {
      }
      return container
    }
    const AnnotationListItem = (value) => {
      const { name, avatar, comment, time, id } = value
      return (
        <div className={indexStyles.commentListItem}>
          <div className={indexStyles.left}>
            <Avatar src={avatar} icon="user" style={{color: '#8c8c8c'}}></Avatar>
          </div>
          <div className={indexStyles.right}>
            <div className={indexStyles.top}>
              <div className={indexStyles.full_name}>{name}</div>
              <div className={indexStyles.create_time}>
                {time?timestampToTimeNormal(time, '', true): ''}
              </div>
            </div>
            <div className={indexStyles.text}>{comment}</div>
          </div>
        </div>
      )
    }
    let node_amount = this.props.model.datas && this.props.model.datas.processInfo && this.props.model.datas.processInfo.node_amount
    let stylLine, stylCircle
    if(this.props.model.datas.processInfo.completed_amount >= itemKey+1) { //0 1    1  2 | 1 3 | 1 4
      stylLine = styles.line
      stylCircle = styles.circle
    }else if(this.props.model.datas.processInfo.completed_amount == itemKey){
      stylLine = styles.doingLine
      stylCircle = styles.doingCircle
    }else {
      stylLine = styles.hasnotCompetedLine
      stylCircle = styles.hasnotCompetedCircle
    }
    let juge = {
      bordered: false
    }
    return (
      // <div className={indexStyles.ConfirmInfoOut_1}>
      <div className={indexStyles.ConfirmInfoOut_1} style={{display: 'flex', justifyContent: 'center'}}>
        {node_amount <= itemKey+1?null:<div className={stylLine}></div>}
        <div className={stylCircle}> {itemKey + 1}</div>
        <div className={styles.outDiv}>
          {/* <div className={styles.arrow}></div> */}
          <Card {...juge} style={{backgroundColor: '#f5f5f5'}}>
          <div className={indexStyles.ConfirmInfoOut_1_top}>
            <div className={indexStyles.ConfirmInfoOut_1_top_left}>
              {/* <div className={indexStyles.ConfirmInfoOut_1_top_left_left} style={filterBorderStyle(sort)}>{itemKey + 1}</div> */}
              
              <div className={indexStyles.ConfirmInfoOut_1_top_left_right}>
                <div>{name}</div>
                <div style={{marginTop:'10px'}} > <Icon type="flag" /> 里程碑</div>
              </div>
            </div>
            <div className={indexStyles.ConfirmInfoOut_1_top_right} style={{display: 'flex'}}>
              {filterAssignee(assignee_type)}
              {filterDueTime(deadline_type)}
              <div className={isShowBottDetail ? indexStyles.upDown_up: indexStyles.upDown_down}><Icon onClick={this.setIsShowBottDetail.bind(this)} type="down" theme="outlined" style={{color: '#595959'}}/></div>
            </div>
          </div>
          <div className={isShowBottDetail? indexStyles.ConfirmInfoOut_1_bottShow : indexStyles.ConfirmInfoOut_1_bottNormal} id={ConfirmInfoOut_1_bott_Id} >
            <div className={indexStyles.ConfirmInfoOut_1_bott_left}></div>
            <div className={indexStyles.ConfirmInfoOut_1_bott_right} >
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_dec}>{description}</div>
              <div>
                <ContentRaletion
                  {...this.props}
                  board_id ={board_id}
                  link_id={id}
                  link_local={'21'}
                />
              </div>
              {assignees?assignees.map((value, key)=>{
                const { comment } = value
                return !!comment && <div key={key}>{AnnotationListItem(value)}</div>
              }):null}

              <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
                {filterBottOperate()}
              </div>
            </div>

          </div>
        </Card>
        <OpinionModal itemValue={itemValue} operateType={this.state.operateType} enableOpinion={enable_opinion} {...this.props} setOpinionModalVisible={this.setOpinionModalVisible.bind(this)} opinionModalVisible = {this.state.opinionModalVisible}/>
        </div>
      </div>
        
      // </div>
    )
  }
}
