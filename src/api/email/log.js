import request from '@/utils/request'

// 查询邮件发送记录列表
export function listLog(query) {
  return request({
    url: '/wx/email/log/list',
    method: 'get',
    params: query
  })
}

// 查询邮件发送记录详细
export function getLog(id) {
  return request({
    url: '/wx/email/log/' + id,
    method: 'get'
  })
}

// 新增邮件发送记录
export function addLog(data) {
  return request({
    url: '/wx/email/log',
    method: 'post',
    data: data
  })
}

// 修改邮件发送记录
export function updateLog(data) {
  return request({
    url: '/wx/email/log',
    method: 'put',
    data: data
  })
}

// 删除邮件发送记录
export function delLog(id) {
  return request({
    url: '/wx/email/log/' + id,
    method: 'delete'
  })
}

// 导出邮件发送记录
export function exportLog(query) {
  return request({
    url: '/wx/email/log/export',
    method: 'get',
    params: query
  })
}