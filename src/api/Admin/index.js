import request from '@/utils/request'

export function getRole() {
  return request({
    url: `/api/admin/role`,
    method: 'get',
    params: { }
  })
}

export function getRegion() {
  return request({
    url: `/api/admin/region`,
    method: 'get',
    params: { }
  })
}

export function authSearch(data) {
  return request({
    url: '/api/admin/auth-user/quick-search',
    method: 'post',
    data
  })
}

export function crmSearch(data) {
  return request({
    url: '/api/admin/crm-user/quick-search',
    method: 'post',
    data
  })
}

