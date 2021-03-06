import request from "../../utils/requestAxios";
import {REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN} from "../../globalset/js/constant";

//开启关闭特权
export async function toggleContentPrivilege(data) {
  const {content_id, content_type, is_open} = data
  //content_id 内容ID（如 board_id,card_id 等）
  //content_type 内容类型（如 board , list, card, file, folder,flow等）
  //is_open  1: 开启 || 0：关闭
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_privilege/open`,
    method: 'POST',
    data: {
      content_id,
      content_type,
      is_open
    }
  })
}

//设置内容访问特权
export async function setContentPrivilege(data) {
  const {content_id, content_type, privilege_code, user_ids} = data
  //content_id 内容ID（如 board_id,card_id 等）
  //content_type 内容类型（如 board , list, card, file, folder,flow等）
  //privilege_code 内容类型（如 read comment edit等）
  //user_ids 用户id, 多个用逗号隔开
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_privilege/set`,
    method: 'POST',
    data: {
      content_id,
      content_type,
      privilege_code,
      user_ids
    }
  })
}

//移除内容访问特权
export async function removeContentPrivilege(data) {
  const {content_id, content_type, user_id} = data
  //contend_id 内容ID（如 board_id,card_id 等）
  //content_type 内容类型（如 board , list, card, file, folder,flow等）
  //user_id 用户id
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/content_privilege/remove`,
    method: 'DELETE',
    data: {
      content_id,
      content_type,
      user_id
    }
  })
}

//移动项目到指定分组
export async function moveProjectToProjectGroup(data) {
  const {board_id, group_id} = data
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/group/move/${board_id}`,
    method: 'PUT',
    data: {
      group_id
    }
  })
}

//获取当前组织搜索树
export async function getProjectGroupSearchTree() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/group/tree`,
    method: 'GET',
  })
}

//获取当前分组项目列表
export async function getCurrentProjectGroupProjectList(params) {
  const {group_id = '', keyword = '', org_id = ''} = params
  //group_id  分组id
  //keyword   (participate|star|archived)
  //org_id  组织 id
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/list/by_param`,
    method: 'GET',
    params: {
      group_id,
      keyword,
      org_id
    }
  })
}

//获取项目分组树
export async function getProjectGroupTree() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/group`,
    method: 'GET'
  })
}

//新增项目分组树节点
export async function createProjectGroupTreeNode(data) {
  const {group_name, parent_id} = data
  //group_name 分组名称
  //parent_id  父节点分组id

  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/group`,
    method: 'POST',
    data: {
      group_name,
      parent_id
    }
  })
}

//更新项目分组名称
export async function updateProjectGroupTreeNodeName(data) {
  const {group_name, id} = data
  //group_name 项目分组名称
  //id 节点id
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/group/${id}`,
    method: 'PUT',
    data: {
      group_name
    }
  })
}

//删除项目分组树节点
export async function deleteProjectGroupTreeNode(id) {
   return request({
     url: `${REQUEST_DOMAIN_BOARD}/board/group/${id}`,
     method: 'DELETE'
   })
}

//获取项目列表
export async function getProjectList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'GET',
    params
  });
}
//获取app标
export async function getAppsList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/app`,
    method: 'GET',
    params
  });
}

//新增项目
export async function addNewProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'POST',
    data
  });
}

//更新项目
export async function updateProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'PUT',
    data
  });
}

//删除项目
export async function deleteProject(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/${id}`,
    method: 'DELETE',
  });
}

//项目归档
export async function archivedProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/archived`,
    method: 'PUT',
    data
  });
}

//取消收藏
export async function cancelCollection(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/cancel/${id}`,
    method: 'DELETE',
    data: {
      id
    }
  });
}

//项目详情
export async function projectDetail(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/detail/${id}`,
    method: 'POST',
    data: {
      id
    }
  });
}

//添加项目组成员
export async function addMenbersInProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/members/add`,
    method: 'POST',
    data
  });
}

// 退出项目
export async function quitProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/quit`,
    method: 'DELETE',
    data,
  });
}

// 收藏项目
export async function collectionProject(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/star/${id}`,
    method: 'POST',
    data: {
      id
    }
  }, { isNotLoading: true });
}

// 添加项目app
export async function addProjectApp(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/app/add`,
    method: 'POST',
    data
  });
}
// 编辑项目app
export async function editProjectApp(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/app/edit`,
    method: 'PUT',
    data
  });
}
