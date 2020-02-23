import request from '@/utils/request'

/**
 * 新增时查询父级菜单下拉数据
 */
export function getMenuTree() {
  return request({
    url: 'menus/tree',
    method: 'get'
  })
}

export function add(data){
  return request({
    url:'menus/add',
    method:'post',
    data
  })
}

export function edit(data){
  return request({
    url:'menus/edit',
    method:'post',
    data
  })
}

export function del(data){
  return request({
    url:'menus/delete',
    method:'post',
    params:{id:data}
  })
}