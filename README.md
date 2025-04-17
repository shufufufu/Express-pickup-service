# 项目功能

提供校园快递代取业务
支持微信小程序客户端和 web 的商户后台

**本地预览：**
`git clone git@github.com:shufufufu/Express-pickup-service.git`

小程序端：（请提前下载微信开发者工具）
`cd Client APP`
`npm install`
`npm run dev:weapp`

web 端：
`cd Web Merchant`
`npm install`
`npm run dev`

# 项目技术选型

### 前端

#### 小程序

技术选型：taro+react+taroify+zustand+tailwindcss
版本控制：

- taro：4.0.9
- taroify：0.6.4
- react：18
- tailwindcss：3.4.1
- zustand：4.4.1

##### 项目目录

```txt
├── src
│   ├── components      # 公共组件
│   ├── assets          # 静态资源
│   ├── pages           # 页面
│   ├── apis            # 网络请求部分
│   ├── store           # 全局状态
│   ├── utils           # 工具函数
│   ├── app.js
│   ├── app.css
│   ├── app.less
│   ├── app.config.js
│   └── index.html
├── README.md
├── node_modules
├── package.json
├── .editorconfig
├── .env.development
├── .env.production
├── .env.test
├── .eslintrc
├── .eslintrc.js
├── babel.config.js
├── package-lock.json
├── postcss.config.js
├── project.config.json
├── project.private.config.json
├── tailwind.config.js

```

**pages 下也会有 style 和 component 目录，对应相应页面独有的组件和样式**

#### web 端

技术选型：vite+react+antd+zustand+tailwindcss
版本控制：

- react：18
- antd：5.24.6
- zustand：5.0.3
- vite：5.1.4
- tailwindcss：3.4.1

##### 项目目录

```txt
├── src
│   ├── router          # 路由
│   ├── assets          # 静态资源
│   ├── pages           # 页面
│   ├── apis            # 网络请求部分
│   ├── store           # 全局状态
│   ├── utils           # 工具函数
│   ├── main.jsx
│   ├── index.css
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── postcss.config.js
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
├── index.html
├── jsconfig.json
```

**pages 下也会有 style 和 component 目录，对应相应页面独有的组件和样式**

### 后端

技术选型：SpringBoot+redis+mysql
版本控制：

- SpringBoot 3.4.3
- redis 5.0.4
- mysql 8.0.38

# Git 规范

### 提交规范

- 添加新功能  `git commit -m ":new: [feat]: $新功能`
- 修改 bug `git commit -m ":bug: [fix]: $修改内容"`
- 代码重构(功能重构) `git commit -m ":hammer: [refactor] $重构内容"`
- 修改样式(样式重构) `git commit -m ":art: [fix]" $修改内容`

上面是基本规范，关于更多的，包括添加测试、升级依赖版本、等请参阅  [git 开发规范](https://juejin.cn/post/6844903635533594632)，[git Emoji](https://github.com/liuchengxu/git-commit-emoji-cn)。

合作开发时的[pr 教程](https://juejin.cn/post/6949848117072101384)

# 开发规范

遵循页面开发规范

# 技术要点

暂不补充

# 迭代点

1. 新需求的添加，如拼单，成为骑手等
2. 前端路由向[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)迭代
3. 使用 websocket 和 indexDB 实现客服聊天
