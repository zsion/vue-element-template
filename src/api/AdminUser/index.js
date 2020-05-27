import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/admin-user/search',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/admin-user',
    method: 'post',
    data
  })
}

export function getConnect(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/connect-crm`,
    method: 'post',
    data
  })
}

export function getDisconnect(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/disconnect-crm`,
    method: 'post',
    data
  })
}

export function getGrant(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/role/grant`,
    method: 'post',
    data
  })
}

export function getRevoke(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/role/revoke`,
    method: 'post',
    data
  })
}

export function getHaveRole(adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/role`,
    method: 'get',
    params: { }
  })
}

export function getHaveRegion(adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/region`,
    method: 'get',
    params: { }
  })
}

export function getRegionGrant(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/region/grant`,
    method: 'post',
    data
  })
}

export function getRegionRevoke(data, adminUserId) {
  return request({
    url: `/api/admin-user/${adminUserId}/region/revoke`,
    method: 'post',
    data
  })
}
