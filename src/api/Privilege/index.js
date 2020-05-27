import request from '@/utils/request'

export function getTag() {
  return request({
    url: '/api/privilege/tag',
    method: 'get',
    params: { }
  })
}
