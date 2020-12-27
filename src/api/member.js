import request from '@/utils/request'

export function queryByUsername(params) {
  return request({
    url: '/member/query/username',
    method: 'get',
    params: params
  })
}
