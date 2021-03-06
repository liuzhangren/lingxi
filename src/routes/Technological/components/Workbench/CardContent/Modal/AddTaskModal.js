import React, { Component } from 'react';
import {
  Modal,
  Input,
  Button,
  message,
  Upload,
  Cascader,
  Tooltip,
  notification
} from 'antd';
import styles from './AddTaskModal.less';
import { connect } from 'dva';
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE
} from './../../../../../../globalset/js/constant';
import { deleteUploadFile } from './../../../../../../services/technological/workbench';
import DropdownSelectWithSearch from './../DropdownSelectWithSearch/index';
import DropdownMultipleSelectWithSearch from './../DropdownMultipleSelectWithSearch/index';
import DateRangePicker from './../DateRangePicker/index';
import Cookies from 'js-cookie';
import {
  checkIsHasPermissionInBoard,
  setStorage
} from '../../../../../../utils/businessFunction';
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FILES_FILE_UPLOAD,
  PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE
} from '../../../../../../globalset/js/constant';

const taskTypeToName = {
  RESPONSIBLE_TASK: 'Tasks',
  EXAMINE_PROGRESS: 'Flows',
  MEETIMG_ARRANGEMENT: 'Tasks',
  MY_DOCUMENT: 'Files'
};
/* eslint-disable */
@connect(({ workbench }) => ({ workbench }))
class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    const {
      projectList,
      workbench: {
        datas: {
          projectTabCurrentSelectedProject,
          currentSelectedProjectFileFolderList
        }
      },
      taskType
    } = this.props;
    const rootFileFolder =
      currentSelectedProjectFileFolderList &&
      currentSelectedProjectFileFolderList.parent_id === '0' &&
      currentSelectedProjectFileFolderList.folder_id;
    const findAndCheckCurrentSelectedProject = projectList.find(
      item =>
        item.board_id === projectTabCurrentSelectedProject &&
        item.apps &&
        item.apps.find(i => i.code === taskTypeToName[taskType])
    );
    this.state = {
      addTaskTitle: '',
      currentSelectedProject: findAndCheckCurrentSelectedProject
        ? findAndCheckCurrentSelectedProject
        : {},
      currentSelectedProjectMember: [],
      start_time: '',
      due_time: '',
      attachment_fileList: [],
      currentSelectedFileFolder: rootFileFolder ? [rootFileFolder] : [''],
      currentSelectedProjectGroupListItem: {},
    };
  }
  handleDateRangeChange = dateRange => {
    const [start_time, due_time] = dateRange;
    this.setState({
      start_time: start_time,
      due_time: due_time
    });
  };
  handleAddTaskModalOk = () => {};
  handleAddTaskModalCancel = () => {
    //取消之后回归公共tab_bar board_id到缓存
    const {
      datas: { projectTabCurrentSelectedProject }
    } = this.props.workbench;
    setStorage('board_id', projectTabCurrentSelectedProject);

    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectMembersList'
    });
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectFileFolderList'
    });
    this.setState({
      addTaskTitle: '',
      currentSelectedProject: {},
      start_time: '',
      due_time: '',
      attachment_fileList: [],
      currentSelectedFileFolder: ['']
    });
    const { addTaskModalVisibleChange } = this.props;
    addTaskModalVisibleChange(false);
  };
  handleSelectedProjectGroupItem = item => {
    this.setState({
      currentSelectedProjectGroupListItem: item
    })
  }
  handleSelectedItem = item => {
    const { dispatch, taskType } = this.props;
    this.setState(
      {
        currentSelectedProject: item,
        currentSelectedProjectGroupListItem: {}
      },
      () => {
        dispatch({
          type: 'workbench/fetchCurrentSelectedProjectMembersList',
          payload: {
            projectId: item.board_id
          }
        });
        if (taskType === 'MY_DOCUMENT') {
          Promise.resolve(
            dispatch({
              type: 'workbench/fetchCurrentSelectedProjectFileFolderList',
              payload: {
                board_id: item.board_id
              }
            })
          ).then(() => {
            this.handleDefaultSelectProjectFileFolder();
          });
        }
      }
    );
  };
  handleDefaultSelectProjectFileFolder = () => {
    const {
      workbench: {
        datas: { currentSelectedProjectFileFolderList }
      }
    } = this.props;
    const rootFileFolder =
      currentSelectedProjectFileFolderList &&
      currentSelectedProjectFileFolderList.parent_id === '0' &&
      currentSelectedProjectFileFolderList.folder_id;
    if (!rootFileFolder) {
      message.error('当前项目没有根目录文件夹');
      this.setState({
        currentSelectedFileFolder: ['']
      });
    }
    this.setState({
      currentSelectedFileFolder: [rootFileFolder]
    });
  };
  getNewTaskParams = () => {
    const { taskType } = this.props;
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      currentSelectedProjectGroupListItem,
    } = this.state;
    const taskObj = {
      add_type: 1,//默认0， 按分组1
      board_id: currentSelectedProject.board_id,
      name: addTaskTitle,
      type: 0,
      users: currentSelectedProjectMember.reduce((acc, curr) => {
        return acc ? acc + ',' + curr.id : curr.id;
      }, ''),
      list_id: currentSelectedProjectGroupListItem.board_id ? currentSelectedProjectGroupListItem.board_id : ''
    };
    if (taskType === 'MEETIMG_ARRANGEMENT') {
      return Object.assign({}, taskObj, { start_time, due_time, type: 1 });
    }
    return taskObj;
  };
  handleClickedSubmitBtn = e => {
    e.stopPropagation();
    const { taskType } = this.props;
    //权限控制
    let authCode = '';
    switch (taskType) {
      case 'RESPONSIBLE_TASK':
        authCode = PROJECT_TEAM_CARD_CREATE;
        break;
      case 'MEETIMG_ARRANGEMENT':
        authCode = PROJECT_TEAM_CARD_CREATE;
        break;
      case 'MY_DOCUMENT':
        authCode = PROJECT_FILES_FILE_UPLOAD;
        break;
      case 'EXAMINE_PROGRESS':
        authCode = PROJECT_FLOWS_FLOW_CREATE;
        break;
      default:
        break;
    }
    if (!checkIsHasPermissionInBoard(authCode)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
      return false;
    }

    const paramObj = this.getNewTaskParams();
    this.addNewTask(paramObj);
    this.addNewMeeting(paramObj);
    this.uploadNewFile();
  };

  getNewUploadedFileIdList = () => {
    const {attachment_fileList} = this.state
    const {dispatch} = this.props
    const collectFileId = (arr = []) => {
              //筛选出上传成功的文件
      return arr.filter(file => file.response && file.response.code === '0' && file.response.data.id).map(file => file.response.data.id)
    }
    dispatch({
      type: 'workbench/updateUploadedFileNotificationIdList',
      payload: {
        idsList: collectFileId(attachment_fileList)
      }
    })
    // console.log(attachment_fileList, 'attachment_fileList')
  }

  uploadNewFile = () => {
    const { taskType, dispatch } = this.props;
    if (taskType !== 'MY_DOCUMENT') {
      return;
    }

    //更新文件列表
    Promise.resolve(
      dispatch({
        type: 'workbench/getUploadedFileList'
      })
    )
    .then(() => {
      //获取刚才上传成功的文件的idList
      this.getNewUploadedFileIdList()
    })
    .then(() => {
      this.handleAddTaskModalCancel();
    });
  };
  addNewMeeting = paramObj => {
    const { taskType, dispatch, addTaskModalVisibleChange } = this.props;
    if (taskType !== 'MEETIMG_ARRANGEMENT') {
      return;
    }
    Promise.resolve(
      dispatch({
        type: 'workbench/addTask',
        payload: {
          data: paramObj
        }
      })
    ).then(taskId => {
      if (!taskId) throw new Error('创建任务失败');
      const { board_id, name } = paramObj;
      this.showCreateTaskSuccessNote(board_id, taskId, name);
    })
      .then(() =>
        dispatch({
          type: 'workbench/getMeetingList'
        })
      )
      .then(() => {
        this.handleAddTaskModalCancel();
      });
  };
  addNewTask = paramObj => {
    const { taskType, dispatch, addTaskModalVisibleChange } = this.props;
    if (taskType !== 'RESPONSIBLE_TASK') {
      return;
    }
    Promise.resolve(
      dispatch({
        type: 'workbench/addTask',
        payload: {
          data: paramObj
        }
      })
    )
      .then(taskId => {
        if (!taskId) throw new Error('创建任务失败');
        const { board_id, name } = paramObj;
        this.showCreateTaskSuccessNote(board_id, taskId, name);
      })
      .then(() => {
        dispatch({
          type: 'workbench/getResponsibleTaskList'
        });
      })
      .then(() => {
        this.handleAddTaskModalCancel();
      })
      .catch(err => console.log(err));
  };
  getTaskTypeText = () => {
    const {taskType} = this.props
    const taskTypeObj = {
      RESPONSIBLE_TASK: '任务',
      MEETIMG_ARRANGEMENT: '日程',
      MY_DOCUMENT: '文档'
    }
    return taskTypeObj[taskType]
  }
  showCreateTaskSuccessNote = (board_id, id, name) => {
    const handleJump = e => {
      if (e) e.stopPropagation();
      notification.destroy()
      this.props.updatePublicDatas({ board_id });
      this.props.getCardDetail({ id, board_id });
      this.props.setTaskDetailModalVisibile();
    };
    const descirptionEle = (
      <div>
        <p><span>新建{this.getTaskTypeText()}“<span style={{color: '#1D93FF'}}>{name}</span>”成功，可在“项目详情”中查看{this.getTaskTypeText()}</span></p>
        <div style={{textAlign: 'right'}}><Button type="primary" size="small" onClick={e => handleJump(e)} >查看详情</Button></div>
      </div>
    );
    notification.success({
      message: '新建成功',
      description: descirptionEle,
      placement: 'bottomLeft'
    });
  };
  handleAddTaskModalTaskTitleChange = e => {
    this.setState({
      addTaskTitle: e.target.value
    });
  };
  handleSelectedItemChange = list => {
    this.setState({
      currentSelectedProjectMember: list
    });
  };
  handleSelectedFileFolderChange = folderIds => {
    const len = folderIds.length;
    this.setState({
      // currentSelectedFileFolder: folderIds[len - 1]
      currentSelectedFileFolder: folderIds
    });
  };
  formatFolderTreeData = (orgArr = {}) => {
    if (!orgArr.folder_name) {
      return {};
    }
    if (!orgArr.child_data.length) {
      return {
        label: orgArr.folder_name,
        value: orgArr.folder_id
        // children: []
      };
    }
    return {
      label: orgArr.folder_name,
      value: orgArr.folder_id,
      children: orgArr.child_data.map(item => this.formatFolderTreeData(item))
    };
  };
  componentWillReceiveProps(nextProps) {
    const { addTaskModalVisible: nextAddTaskModalVisible } = nextProps;
    const { addTaskModalVisible } = this.props;
    if (addTaskModalVisible === false && nextAddTaskModalVisible) {
      //如果是显示modal,那么就初始化当前的项目
      const {
        dispatch,
        projectList,
        projectTabCurrentSelectedProject
      } = this.props;
      //如果当前的项目选择不是 "所有参与的项目", 并且用户的项目列表，有当前选择的项目，那么就去拉取当前项目的所有用户
      const isProjectListExistCurrentSelectedProject = projectList.find(
        item => item.board_id === projectTabCurrentSelectedProject
      );
      if (
        isProjectListExistCurrentSelectedProject &&
        projectTabCurrentSelectedProject !== '0'
      ) {
        this.setState({
          currentSelectedProject: isProjectListExistCurrentSelectedProject
        });
      }
    }
  }
  render() {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      attachment_fileList,
      currentSelectedFileFolder,
      currentSelectedProjectGroupListItem
    } = this.state;
    const {
      projectList,
      addTaskModalVisible,
      workbench: {
        datas: {
          currentSelectedProjectMembersList,
          projectTabCurrentSelectedProject,
          currentSelectedProjectFileFolderList
        }
      },
      modalTitle,
      taskType,
      projectGroupLists
    } = this.props;
    const isHasTaskTitle = () => addTaskTitle && String(addTaskTitle).trim();
    const isHasSelectedProject = () =>
      currentSelectedProject && currentSelectedProject.board_id;
    const isHasSelectedProjectMember = () =>
      currentSelectedProjectMember && currentSelectedProjectMember.length;
    let isShouldNotDisableSubmitBtn = () =>
      isHasTaskTitle() && isHasSelectedProject();
    if (taskType === 'MEETIMG_ARRANGEMENT') {
      isShouldNotDisableSubmitBtn = () =>
        isHasTaskTitle() && isHasSelectedProject() && start_time && due_time;
    }

    if (taskType === 'MY_DOCUMENT') {
      isShouldNotDisableSubmitBtn = () =>
        isHasSelectedProject() && currentSelectedFileFolder.length;
    }

    const board_id = currentSelectedProject.board_id;
    const findAndTransProjectGroupList = (projectGroupLists = [], board_id) => {
      const isFinded = projectGroupLists.find(item => item.board_id === board_id)
      if(!isFinded) return []
      //映射数据，只是为了复用 DropdownSelectWithSearch 组件
      return isFinded.list_data.map(item => ({board_id: item['list_id'], board_name: item['list_name']}))
    }
    const currentSelectedProjectGroupList = findAndTransProjectGroupList(projectGroupLists, board_id)
    const folderOptions = this.formatFolderTreeData(
      currentSelectedProjectFileFolderList
    );
    const that = this;
    const uploadProps = {
      name: 'file',
      fileList: attachment_fileList,
      withCredentials: true,
      action: `${REQUEST_DOMAIN_BOARD}/file/upload`,
      multiple: true,
      data: {
        board_id,
        folder_id:
          currentSelectedFileFolder[currentSelectedFileFolder.length - 1]
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken')
      },
      beforeUpload(e) {
        if (e.size == 0) {
          message.error(`不能上传空文件`);
          return false;
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`);
          return false;
        }
      },
      onChange({ file, fileList, event }) {
        if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
          return false;
        }
        if (file.status === 'done' && file.response.code === '0') {

        } else if (
          file.status === 'error' ||
          (file.response && file.response.code !== '0')
        ) {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid == fileList[i].uid) {
              fileList.splice(i, 1);
            }
          }
        }
        that.setState(
          {
            attachment_fileList: fileList
          },
          () => {}
        );
        // drawContent["attachment_data"] = fileList;
        // that.props.updateDatasTask({
        //   drawContent
        // });
      },
      onPreview(e, a) {
        // const file_resource_id =
        //   e.file_resource_id || e.response.data.file_resource_id;
        // const file_id = e.file_id || e.response.data.file_id;
        // that.setState({
        //   previewFileType: "attachment"
        // });
        // that.props.updateDatasFile({
        //   seeFileInput: "taskModule",
        //   isInOpenFile: true,
        //   filePreviewCurrentId: file_resource_id,
        //   filePreviewCurrentFileId: file_id
        // });
        // that.props.filePreview({ id: file_resource_id, file_id: file_id });
      },
      onRemove(e) {
        const id = e.id || (e.response.data && e.response.data.id);
        if (!id) {
          return;
        }

        deleteUploadFile({ id })
          .then(res => {
            if (res.code === '0') {
              message.success('删除成功');
            } else {
              message.error('删除失败，请稍后再试');
            }
          })
          .catch(err => {
            message.error('删除失败，请稍后再试');
          });
      }
    };

    const filteredNoThatTypeProject = projectList.filter(item => {
      return (
        item.apps && item.apps.find(i => i.code === taskTypeToName[taskType])
      );
    });

    return (
      <Modal
        visible={addTaskModalVisible}
        // maskClosable={false}
        title={
          // <div style={{ textAlign: "center" }}>{"添加内容" + modalTitle}</div>
          <div style={{ textAlign: 'center' }}>{'添加内容'}</div>
        }
        onOk={this.handleAddTaskModalOk}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.addTaskModalContent}>
          <div className={styles.addTaskModalSelectProject}>
            <div className={styles.addTaskModalSelectProject_and_groupList}>
            <DropdownSelectWithSearch
              list={filteredNoThatTypeProject}
              initSearchTitle="选择项目"
              selectedItem={currentSelectedProject}
              handleSelectedItem={this.handleSelectedItem}
            />
            <div className={styles.groupList__wrapper}>
            {(taskType === 'RESPONSIBLE_TASK' || taskType === 'MEETIMG_ARRANGEMENT') && (
              <DropdownSelectWithSearch
              list={currentSelectedProjectGroupList}
              initSearchTitle="任务分组"
              selectedItem={currentSelectedProjectGroupListItem}
              handleSelectedItem={this.handleSelectedProjectGroupItem}
              isShowIcon={false}
              isSearch={false}
              isCanCreateNew={false}
              isProjectGroupMode={true}
            />
            )}
            </div>
            </div>
            {taskType === 'MEETIMG_ARRANGEMENT' && (
              <DateRangePicker
                handleDateRangeChange={this.handleDateRangeChange}
                isSameYearNotShowYear={true}
              />
            )}
            {taskType === 'MY_DOCUMENT' && currentSelectedProject.board_id && (
              <div className={styles.addTaskModalSelectFileFolder}>
                <Cascader
                  className={styles.addTaskModalSelectFileFolder__selectWrapper}
                  // defaultValue= {[currentSelectedFileFolder]}
                  value={currentSelectedFileFolder}
                  options={[folderOptions]}
                  onChange={this.handleSelectedFileFolderChange}
                  placeholder="选择一个文件夹"
                  changeOnSelect
                />
              </div>
            )}
          </div>
          <div className={styles.addTaskModalTaskTitle}>
            {taskType === 'RESPONSIBLE_TASK' ||
            taskType === 'MEETIMG_ARRANGEMENT' ? (
              <Input
                value={addTaskTitle}
                onChange={this.handleAddTaskModalTaskTitleChange}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                {!isShouldNotDisableSubmitBtn() ? (
                  <Tooltip placement="bottom" title="请选择具体项目和文件夹">
                    <Button
                      block={true}
                      disabled={!isShouldNotDisableSubmitBtn()}
                    >
                      <span style={{ width: '442px' }}>
                        点击此处/拖拽文件到对话框
                      </span>
                    </Button>
                  </Tooltip>
                ) : (
                  <Upload {...uploadProps}>
                    <Button
                      block={true}
                      disabled={!isShouldNotDisableSubmitBtn()}
                    >
                      <span style={{ width: '442px' }}>
                        点击此处/拖拽文件到对话框
                      </span>
                    </Button>
                  </Upload>
                )}
              </div>
            )}
          </div>
          {taskType === 'RESPONSIBLE_TASK' ||
          taskType === 'MEETIMG_ARRANGEMENT' ? (
            <div className={styles.addTaskModalFooter}>
              <div className={styles.addTaskModalOperator}>
                <DropdownMultipleSelectWithSearch
                  itemTitle={
                    taskType === 'RESPONSIBLE_TASK' ? '执行人' : '参与人'
                  }
                  list={
                    currentSelectedProject.board_id
                      ? currentSelectedProjectMembersList
                      : []
                  }
                  handleSelectedItemChange={this.handleSelectedItemChange}
                  currentSelectedProjectMember={currentSelectedProjectMember}
                />
              </div>
              <div className={styles.confirmBtn}>
                <Button
                  type="primary"
                  disabled={!isShouldNotDisableSubmitBtn()}
                  onClick={this.handleClickedSubmitBtn}
                >
                  完成
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.addTaskModalFooter}>
              <div className={styles.confirmBtnRight}>
                <Button
                  type="primary"
                  disabled={!isShouldNotDisableSubmitBtn()}
                  onClick={this.handleClickedSubmitBtn}
                >
                  完成
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

export default AddTaskModal;
