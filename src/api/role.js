import request from '@/utils/request'



/**
 * 新增时获取所有角色下拉数据
 */
export function getRoles() {
  return request({
    url: 'role/list',
    method: 'get'
  })
}



export function add(data){
  return request({
    url:'role/add',
    method:'post',
    data
  })
}

export function edit(data){
  return request({
    url:'role/edit',
    method:'post',
    data
  })
}

export function del(data){
  return request({
    
    url:'role/delete',
    method:'post',
    params:{name:data}
  })
}