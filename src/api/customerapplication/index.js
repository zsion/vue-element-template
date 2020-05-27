import request from '@/utils/request'

export function quick_Search(data) {
  return request({
    url: '/api/customer-application/search',
    method: 'post',
    data
  })
}

export function do_complete(data, customerApplicationId) {
  return request({
    url: `/api/customer-application/${customerApplicationId}/complete`,
    method: 'post',
    data
  })
}

export function do_abandon(data, customerApplicationId) {
  return request({
    url: `/api/customer-application/${customerApplicationId}/abandon`,
    method: 'post',
    data
  })
}
