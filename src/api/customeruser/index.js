import request from '@/utils/request'

export function getUser(customerId) {
  return request({
    url: `/api/customer/${customerId}/user`,
    method: 'get',
    params: { }
  })
}

export function doBind(data, customerId) {
  return request({
    url: `/api/customer/${customerId}/user/bind`,
    method: 'post',
    data
  })
}

export function doUnbind(data, customerId) {
  return request({
    url: `/api/customer/${customerId}/user/unbind`,
    method: 'post',
    data
  })
}

