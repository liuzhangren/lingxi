//项目归档
import {REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

// 查看项目详情信息
export async function projectDetailInfo(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/detail/${id}`,
    method: 'GET',
    params: {
      id
    }
  });
}

// 更新项目
export async function updateProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'PUT',
    data
  });
}

// 移出项目成员
export async function removeMenbers(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/remove`,
    method: 'DELETE',
    data
  });
}

// 查询项目角色列表
export async function getProjectRoles(params) {
  return request({
    url: `${REQUEST_DOMAIN}/role/query`,
    method: 'GET',
    params
  });
}


// 给成员设置项目角色
export async function setMemberRoleInProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/user/set`,
    method: 'PUT',
    data
  });
}

// 获取项目成员列表
export async function getBoardMembers(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/user/${params.id}`,
    method: 'GET',
    params
  });
}













































