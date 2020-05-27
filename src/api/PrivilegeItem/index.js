import request from '@/utils/request'

export function getItem() {
  return request({
    url: '/api/privilege-item',
    method: 'get',
    params: { }
  })
}

export function addItem(data) {
  return request({
    url: '/api/privilege-item',
    method: 'post',
    data
  })
}

export function deleteItem(privilegeItemId) {
  return request({
    url: `/api/privilege-item/${privilegeItemId}`,
    method: 'delete',
    params: { }
  })
}
