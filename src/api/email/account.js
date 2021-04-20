import request from '@/utils/request'

// 查询邮件发送记录列表
export function listAccount(query) {
  return request({
    url: '/wx/email/account/list',
    method: 'get',
    params: query
  })
}