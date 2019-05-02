import React from 'react'
import styl from './index.less'
import globalStyles from '../../globalset/css/globalClassName.less'

import {
  Icon,
  Input
} from 'antd'

export default class processTemplate extends React.Component{
  state = {
    isLoadMore: false
  }
  loadMore() {
    // console.log('loadMore!!')
    this.setState({
      isLoadMore: !this.state.isLoadMore
    })
  }
  deleteTemplate(id) {
    // console.log('deleteTemplate!!')
    this.props.dispatch({
      type: 'projectDetailProcess/deleteProcessTemplate',
      payload: {
        id
      }
    })
  }
  startTemplate() {
    console.log('startTemplate!!')
  }
  render() {
    const { nodes = [] } = this.props.itemValue 
    const { isLoadMore } = this.state
    return (
      <div className={styl.container}>
        <div className={styl.box}>
          {/* <Icon style={{margin: '0 15px 0'}} type="heart" /> */}
          <i style={{margin: '0 15px 0', color: '#1890FF'}} className={globalStyles.authTheme}>&#xe62d;</i>
          <span className={styl.title}>
            {this.props.itemValue.name}
          </span>
          {
            this.props.withoutOperate?null:<Icon onClick={this.deleteTemplate.bind(this, this.props.itemValue.id)} style={{marginRight: '10px', cursor: 'pointer'}} type="delete" />
          }
          {
            this.props.withoutOperate?null:<Icon onClick={this.startTemplate.bind(this)} type="caret-right" />
          }
        </div>
        <div className={styl.description}>
          {this.props.itemValue.description}
        </div>
        <div className={styl.steps}>
          {/* 数据异常 */}
          {
            this.props.itemValue.nodes?this.props.itemValue.nodes.map((c, i) => {
              if(isLoadMore) {
                return <div key={`steps${i}`} className={styl.input}>{`${i+1}.${c.name}`}</div>
              }else {
                if(i <= 2) {
                  return <div key={`steps${i}`} className={styl.input}>{`${i+1}.${c.name}`}</div>
                }
              }
            }):null
          }
        </div>
        <div className={styl.more}>
          { isLoadMore?<i style={{margin: '0 15px 0', transform: 'rotate(270deg)', cursor: 'pointer',}} onClick={this.loadMore.bind(this)} className={globalStyles.authTheme}>&#xe7f0;</i>:<i style={{margin: '0 15px 0', transform: 'rotate(90deg)', cursor: 'pointer',}} onClick={this.loadMore.bind(this)} className={globalStyles.authTheme}>&#xe7f0;</i>} 
        </div>
      </div>
    )
  }
}