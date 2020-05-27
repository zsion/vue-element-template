import request from '@/utils/request'

export function searchPack(data) {
  return request({
    url: '/api/privilege-pack/search',
    method: 'post',
    data
  })
}

export function getPack(privilegeTagId) {
  return request({
    url: '/api/privilege-pack',
    method: 'get',
    params: { onlyAvailable: true, privilegeTagId: privilegeTagId }
  })
}

export function addPack(data) {
  return request({
    url: '/api/privilege-pack',
    method: 'post',
    data
  })
}

export function getPackId(privilegePackId) {
  return request({
    url: `/api/privilege-pack/${privilegePackId}`,
    method: 'get',
    params: { }
  })
}

export function editPackId(data, privilegePackId) {
  return request({
    url: `/api/privilege-pack/${privilegePackId}`,
    method: 'post',
    data
  })
}

export function postRelease(data, privilegePackId) {
  return request({
    url: `/api/privilege-pack/${privilegePackId}/release`,
    method: 'post',
    data
  })
}

export function postWithdraw(data, privilegePackId) {
  return request({
    url: `/api/privilege-pack/${privilegePackId}/withdraw`,
    method: 'post',
    data
  })
}

