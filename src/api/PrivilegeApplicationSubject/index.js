import request from '@/utils/request'

export function searchMajor(data) {
  return request({
    url: '/api/privilege-application-subject/search-major',
    method: 'post',
    data
  })
}

export function createSubject(data) {
  return request({
    url: '/api/privilege-application-subject',
    method: 'post',
    data
  })
}

export function getSubjectId(privilegeApplicationSubjectId) {
  return request({
    url: `/api/privilege-application-subject/${privilegeApplicationSubjectId}`,
    method: 'get',
    params: { }
  })
}

export function editSubject(data, privilegeApplicationSubjectId) {
  return request({
    url: `/api/privilege-application-subject/${privilegeApplicationSubjectId}`,
    method: 'post',
    data
  })
}

export function getHistory(privilegeApplicationSubjectId) {
  return request({
    url: `/api/privilege-application-subject/${privilegeApplicationSubjectId}/history`,
    method: 'get',
    params: { }
  })
}

export function getsubsubject(privilegeApplicationSubjectId) {
  return request({
    url: `/api/privilege-application-subject/${privilegeApplicationSubjectId}/sub-subject`,
    method: 'get',
    params: { }
  })
}
