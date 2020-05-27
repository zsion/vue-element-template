import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/customer/search',
    method: 'post',
    data
  })
}

export function quick_Search(data) {
  return request({
    url: '/api/customer/quick-search',
    method: 'post',
    data
  })
}

export function getCustomerId(customerId) {
  return request({
    url: `/api/customer/${customerId}`,
    method: 'get',
    params: { }
  })
}

export function applyList(data) {
  return request({
    url: '/api/customer-application/search',
    method: 'post',
    data
  })
}
