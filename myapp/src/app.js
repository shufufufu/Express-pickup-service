import { Component } from 'react'
import Taro from '@tarojs/taro'
import { checkLoginStatus } from './utils/auth'
import './app.less'

class App extends Component {
  constructor(props) {
    super(props)
    // 应用全局数据
    this.globalData = {
      needLogin: false // 登录状态标志
    }
  }

  componentDidMount() {
    // 检查登录状态
    this.checkIfNeedLogin()
  }

  // 检查是否需要登录
  checkIfNeedLogin() {
    const isLoggedIn = checkLoginStatus()
    
    console.log('当前登录状态:', isLoggedIn ? '已登录' : '未登录')
    
    // 更新全局状态
    this.globalData.needLogin = !isLoggedIn
  }

  // 在入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
