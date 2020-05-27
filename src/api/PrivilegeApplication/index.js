import request from '@/utils/request'

export function searchApplication(data) {
  return request({
    url: '/api/privilege-application/search',
    method: 'post',
    data
  })
}

export function editUser(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/user`,
    method: 'post',
    data
  })
}

export function getApplicationId(privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}`,
    method: 'get',
    params: { }
  })
}

export function editApplicationId(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}`,
    method: 'post',
    data
  })
}

export function submitApplicationId(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/submit`,
    method: 'post',
    data
  })
}

export function deleteApplicationId(privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}`,
    method: 'delete',
    params: { }
  })
}

export function getApprove(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/approve`,
    method: 'post',
    data
  })
}

export function getReject(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/reject`,
    method: 'post',
    data
  })
}

export function getAcknowledge(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/acknowledge`,
    method: 'post',
    data
  })
}

export function getDisable(data, privilegeApplicationId) {
  return request({
    url: `/api/privilege-application/${privilegeApplicationId}/disable`,
    method: 'post',
    data
  })
}

