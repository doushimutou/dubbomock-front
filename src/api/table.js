import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function add(data){
  return request({
    url:'/table/add',
    method:'post',
    data
  })
}

export function edit(data){
  return request({
    url:'/table/edit',
    method:'post',
    data
  })
}

export function del(data){
  return request({
    url:'/table/delete',
    method:'post',
    params:{id:data}
    
  })
}

export function getAllProjectName(){
  return request({
    url:'/table/getAllProjectName',
    method:'get',
  })
}

export function creatWeekReport() {
  return request({
    url: '/table/createWeekport',
    method: 'get',
  })
}