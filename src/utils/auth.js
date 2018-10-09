import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, exp) {
  return Cookies.set(TokenKey, token, { expires: exp / 1440 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
