import request from '@/utils/request'

// 查询邮件分组列表
export function listGroup(query) {
    return request({
        url: '/email/group/list',
        method: 'get',
        params: query
    })
}

// 查询邮件分组详细
export function getGroup(id) {
    return request({
        url: '/email/group/' + id,
        method: 'get'
    })
}

// 新增邮件分组
export function addGroup(data) {
    return request({
        url: '/email/group',
        method: 'post',
        data: data
    })
}

// 修改邮件分组
export function updateGroup(data) {
    return request({
        url: '/email/group',
        method: 'put',
        data: data
    })
}

// 删除邮件分组
export function delGroup(id) {
    return request({
        url: '/email/group/' + id,
        method: 'delete'
    })
}

// 导出邮件分组
export function exportGroup(query) {
    return request({
        url: '/email/group/export',
        method: 'get',
        params: query
    })
}