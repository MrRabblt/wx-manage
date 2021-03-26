import request from '@/utils/request'

// 查询广告列表
export function listAdvertisement(query) {
  return request({
    url: '/system/advertisement/list',
    method: 'get',
    params: query
  })
}

// 查询广告详细
export function getAdvertisement(adId) {
  return request({
    url: '/system/advertisement/' + adId,
    method: 'get'
  })
}

// 新增广告
export function addAdvertisement(data) {
  return request({
    url: '/system/advertisement',
    method: 'post',
    data: data
  })
}

// 修改广告
export function updateAdvertisement(data) {
  return request({
    url: '/system/advertisement',
    method: 'put',
    data: data
  })
}

// 删除广告
export function delAdvertisement(adId) {
  return request({
    url: '/system/advertisement/' + adId,
    method: 'delete'
  })
}

// 导出广告
export function exportAdvertisement(query) {
  return request({
    url: '/system/advertisement/export',
    method: 'get',
    params: query
  })
}