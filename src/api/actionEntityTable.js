import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query, payload) {
  console.log(payload)
  return request({
    url: query,
    method: 'get',
    params: payload,
    paramsSerializer: params => qs.stringify(payload, { arrayFormat: 'brackets' })
  })
}
export function fetchEntity(query, id) {
  return request({
    url: `${query}/${id}`,
    method: 'get',
    params: ''
  })
}
export function fetchEntityByName(query, param) {
  return request({
    url: `${query}/search?by_name=${param}`,
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
export function batchAction(row, query) {
  return request({
    url: query,
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
