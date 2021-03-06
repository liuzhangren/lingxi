//项目归档
import {REQUEST_DOMAIN_FILE} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";
import { func } from "prop-types";

//文件列表包括文件夹
export async function getFileList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file`,
    method: 'GET',
    params,
  });
}

// 复制文件到某一个文件夹
export async function fileCopy(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/copy`,
    method: 'PUT',
    data,
  });
}

//文件下载
export async function fileDownload(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/download`,
    method: 'GET',
    params,
  });
}

//文件预览
export async function filePreview(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/preview`,
    method: 'GET',
    params,
  });
}

// 把文件文件夹 放入回收站
export async function fileRemove(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/remove`,
    method: 'POST',
    data,
  });
}
// 把文件文件夹 移入到某一个文件夹
export async function fileMove(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/remove`,
    method: 'PUT',
    data,
  });
}

// 文件上传
export async function fileUpload(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/upload`,
    method: 'PUT',
    data,
  });
}

//文件版本列表
export async function fileVersionist(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/version_list`,
    method: 'GET',
    params,
  });
}

//回收站列表
export async function recycleBinList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/recycle_bin`,
    method: 'GET',
    params,
  });
}

//删除文件/文件夹
export async function deleteFile(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/recycle_bin`,
    method: 'POST',
    data,
  });
}
//还原文件/文件夹
export async function restoreFile(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/recycle_bin/restore`,
    method: 'POST',
    data,
  });
}


//文件夹树形列表
export async function getFolderList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/folder`,
    method: 'GET',
    params,
  });
}
//新建文件夹
export async function addNewFolder(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/folder`,
    method: 'POST',
    data,
  });
}
//更新文件夹
export async function updateFolder(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/folder`,
    method: 'PUT',
    data,
  });
}

//获取评论列表
export async function getPreviewFileCommits(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment/list`,
    method: 'GET',
    params,
  });
}

//新增文件评论
export async function addFileCommit(data) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment`,
    method: 'POST',
    data,
  });
}

//删除评论
export async function deleteCommit(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment/${params.id}`,
    method: 'DELETE',
    params,
  });
}

//获取图评点的列表
export async function getFileCommitPoints(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment/point/${params.id}`,
    method: 'GET',
    params,
  });
}


//文件预览-通过file_id, 从分享url里面获取
export async function filePreviewByUrl(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/preview/${params.id}`,
    method: 'GET',
    params,
  });
}
//文件信息-通过file_id, 从分享url里面获取, 查询文件信息，包括预览信息、版本列表
export async function fileInfoByUrl(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/info/${params.id}`,
    method: 'GET',
    params,
  });
}
//文件信息-通过file_id, 从分享url里面获取, 查询文件信息，包括预览信息、版本列表和路径(fileId)
export async function fileInfoByUrl_2(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/info`,
    method: 'GET',
    params,
  });
}

//获取pdf信息
export async function getFilePDFInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/pdf/getAnnotationEditUrl/${params.id}`,
    method: 'GET',
    params,
  });
}

//获取文件详情的动态
export async function getFileDetailIssue(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment`,
    method: 'GET',
    params
  })
}

// 所有动态
export async function getCardCommentListAll(params) {
  return request({
    url: `${REQUEST_DOMAIN_FILE}/file/comment`,
    method: 'GET',
    params
  })
}