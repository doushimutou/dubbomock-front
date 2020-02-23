import request from '@/utils/request'

//专供列表查询使用
export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}
