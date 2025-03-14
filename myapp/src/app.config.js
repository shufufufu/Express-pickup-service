export default defineAppConfig({
  pages: [
    'pages/order/index',
    'pages/deliver/index',
    'pages/personinfo/index',
    'pages/changeinfo/index',
    'pages/feedback/index',
    'pages/orderinfo/index',

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        'iconPath': './assets/order.png',
        'selectedIconPath': './assets/order_active.png',
        'pagePath': 'pages/order/index',
        'text': '订单'
      },
      {
        'iconPath': './assets/deliver.png',
        'selectedIconPath': './assets/deliver_active.png',
        'pagePath': 'pages/deliver/index',
        'text': '取快递'
      },
      {
        'iconPath': './assets/personinfo.png',
        'selectedIconPath': './assets/personinfo_active.png',
        'pagePath': 'pages/personinfo/index',
        'text': '个人信息'
      },
      
    ]
  }
})
