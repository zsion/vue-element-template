import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/user/search',
    method: 'post',
    data
  })
}

export function user_quick_Search(data) {
  return request({
    url: '/api/user/quick-search',
    method: 'post',
    data
  })
}

export function customerList(data) {
  return request({
    url: '/api/customer/search',
    method: 'post',
    data
  })
}

export function registerUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function editUser(data, userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'post',
    data
  })
}

export function editMobile(data, userId) {
  return request({
    url: `/api/user/${userId}/mobile`,
    method: 'post',
    data
  })
}

export function editEmail(data, userId) {
  return request({
    url: `/api/user/${userId}/email`,
    method: 'post',
    data
  })
}

export function editPassword(data, userId) {
  return request({
    url: `/api/user/${userId}/password`,
    method: 'post',
    data
  })
}

export function editEnable(data, userId) {
  return request({
    url: `/api/user/${userId}/enable`,
    method: 'post',
    data
  })
}

export function editisVip(data, userId) {
  return request({
    url: `/api/user/${userId}/vip`,
    method: 'post',
    data
  })
}

export function getuserId(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'get',
    params: { }
  })
}
