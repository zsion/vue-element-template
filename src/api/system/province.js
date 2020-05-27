import request from '@/utils/request'

export function getProvince() {
  return request({
    url: '/api/system/province',
    method: 'get',
    params: { }
  })
}
