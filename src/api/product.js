import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params: params
  })
}

export function search(data) {
  return request({
    url: '/product/query',
    method: 'post',
    data: data
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/product/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/product/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/update/product/' + id,
    method: 'post',
    data: data
  })
}

export function updateParam(id, data) {
  return request({
    url: '/product/update/param/' + id,
    method: 'post',
    data: data
  })
}

export function updateSpecification(id, data) {
  return request({
    url: '/product/update/specification/' + id,
    method: 'post',
    data: data
  })
}

export function updateSku(id, data) {
  return request({
    url: '/product/update/sku/' + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: '/product/info/' + id,
    method: 'get',
  })
}

