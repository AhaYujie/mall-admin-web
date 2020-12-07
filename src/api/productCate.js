import request from '@/utils/request'

export function fetchList(parentId, params) {
  return request({
    url: '/product-category/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteProductCate(id) {
  return request({
    url: '/product-category/delete/' + id,
    method: 'post'
  })
}

export function createProductCate(data) {
  return request({
    url: '/product-category/create',
    method: 'post',
    data: data
  })
}

export function updateProductCate(id, data) {
  return request({
    url: '/product-category/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProductCate(id) {
  return request({
    url: '/product-category/' + id,
    method: 'get',
  })
}

export function updateNavStatus(data) {
  return request({
    url: '/product-category/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren(params) {
  return request({
    url: '/product-category/list/withChildren',
    method: 'get',
    params: params
  })
}
