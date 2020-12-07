import request from '@/utils/request'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}

export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data
  })
}
