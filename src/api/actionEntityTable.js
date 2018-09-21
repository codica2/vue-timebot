import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: query,
    method: 'get',
    params: ''
  })
}
export function createEntity(row, query) {
  const entity = {
    project: {
      alias: row.attributes.alias,
      name: row.attributes.name,
      team_id: 1
    }
  }
  return request({
    url: query,
    method: 'post',
    params: entity,
    paramsSerializer: params => qs.stringify(entity, { arrayFormat: 'brackets' })
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
  const entity = {
    project: {
      alias: row.attributes.alias,
      name: row.attributes.name,
      team_id: 1
    }
  }
  return request({
    url: `${query}/${row.id}`,
    method: 'put',
    params: entity,
    paramsSerializer: params => qs.stringify(entity, { arrayFormat: 'brackets' })
  })
}
