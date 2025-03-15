import { useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import useAuthStore from './store/authStore'
import './app.less'

function App(props) {
  useDidShow(() => {
    // 在页面显示时更新登录状态
    useAuthStore.getState().updateLoginStatus()
  })

  return props.children
}

export default App