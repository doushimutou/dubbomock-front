import request from '@/utils/request'



export function add(data) {
  return request({
    url: 'user/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'user/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'user/delete',
    method: 'post',
    params: { id: data }
  })
}

export function isActive(id,status) {
  return request({
    url: 'user/isactive',
    method: 'post',
    params: {
      userId: id,
      status: status
    }
  })
}