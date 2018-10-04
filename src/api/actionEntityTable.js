import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query, page) {
  return request({
    url: query,
    method: 'get',
    params: page,
    paramsSerializer: params => qs.stringify(page, { arrayFormat: 'brackets' })
  })
}
export function fetchEntity(query, id) {
  return request({
    url: `${query}/${id}`,
    method: 'get',
    params: ''
  })
}
export function createEntity(row, query) {
  return request({
    url: query,
    method: 'post',
    params: row,
    paramsSerializer: params => qs.stringify(row, { arrayFormat: 'brackets' })
  })
}
export function deleteEntity(row, query) {
  return request({
    url: `${query}/${row.id}`,
    method: 'delete',
    params: row,
    paramsSerializer: params => qs.stringify(row, { arrayFormat: 'brackets' })
  })
}

export function updateEntity(row, query) {
  return request({
    url: `${query}/${row.id}`,
    method: 'put',
    params: row,
    paramsSerializer: params => qs.stringify(row, { arrayFormat: 'brackets' })
  })
}
