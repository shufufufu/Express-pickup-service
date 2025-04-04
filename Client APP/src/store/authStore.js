import { create } from 'zustand'
import { checkLoginStatus } from '../utils/auth'

const useAuthStore = create((set) => ({
  // 登录状态
  needLogin: !checkLoginStatus(),
  
  // 更新登录状态
  updateLoginStatus: () => {
    const isLoggedIn = checkLoginStatus()
    console.log('登录状态更新：', isLoggedIn ? '已登录' : '未登录')
    set({ needLogin: !isLoggedIn })
  },
  
  // 设置登录状态
  setNeedLogin: (value) => set({ needLogin: value })
}))

export default useAuthStore