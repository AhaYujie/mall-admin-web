import request from '@/utils/request'

export function fetchList(data, pageNum, pageSize) {
  return request({
    url: '/order/list/' + pageNum + '/' + pageSize,
    method: 'post',
    data: data
  })
}

export function deliveryOrder(data) {
  return request({
    url: '/order/deliver',
    method: 'post',
    data: data
  });
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}
