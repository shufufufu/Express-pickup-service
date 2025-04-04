import Taro from '@tarojs/taro'

/**
 * 检查用户是否已登录
 * @returns {Boolean} 是否已登录
 */
export function checkLoginStatus() {
  const token = Taro.getStorageSync('token')
  const userId = Taro.getStorageSync('userId')
  const userInfo = Taro.getStorageSync('userInfo')
  return !!token && !!userInfo && !!userId
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息或null
 */
export function getCurrentUser() {
  return Taro.getStorageSync('userInfo') || null
}

/**
 * 获取授权Token
 * @returns {string|null} token或null
 */
export function getToken() {
  return Taro.getStorageSync('token') || null
}

/**
 * 获取授权userId
 * @returns {string|null} userId或null
 */
export function getUserId() {
  return Taro.getStorageSync('userId') || null
}


/**
 * 保存登录信息
 * @param {string} token 登录token
 * @param {string} id 用户ID
 * @param {Object} user 用户信息
 */
export function saveLoginInfo(token, id, user) {
  Taro.setStorageSync('token', token)
  Taro.setStorageSync('userId', id)
  Taro.setStorageSync('userInfo', user)
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  Taro.removeStorageSync('token')
  Taro.removeStorageSync('userId')
  Taro.removeStorageSync('userInfo')
}

/**
 * 退出登录
 * @param {boolean} redirect 是否重定向到登录页
 */
export function logout(redirect = true) {
  clearLoginInfo()
  
  if (redirect) {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }
}