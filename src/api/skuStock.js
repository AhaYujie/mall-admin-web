import request from '@/utils/request'

export function fetchList(pid, params) {
  return request({
    url: '/product/sku/query/' + pid,
    method: 'get',
    params: params
  })
}
