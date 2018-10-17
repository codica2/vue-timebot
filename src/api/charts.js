import request from '@/utils/request'
import qs from 'qs'

export function fetchChartByDate(query, params) {
  return request({
    url: query,
    method: 'get',
    params: params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
  })
}
