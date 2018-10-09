import request from '@/utils/request'

export function loginByUsername(query, email, password) {
  const data = {
    email,
    password
  }
  return request({
    url: query,
    method: 'post',
    data
  })
}

export function getUserInfo(query, token) {
  return request({
    url: query,
    method: 'get',
    params: { token }
  })
}

