### 项目介绍
技术选型：taro+react+taroify+zustand
版本控制：
- taro：4.0.9
- taroify：0.6.4
- react：18

### 开发进度

###### 3.2~3.6
基础taro小程序了解和学习

###### 3.7~3.8
配置路由
寻找合适组件库

###### 3.9~3.10
项目初始化 Nutui tailwind 配置环境是真的折磨人

完成了订单界面的初开发

###### 3.11
放弃Nutui组件库
转头选择更加适配react的taroify

完成简单的step步骤条控制，但是没用使用组件提供的步骤条
发现组件提供步骤条自定义化太低

###### 3.12
基本完成step组件
![[Pasted image 20250312125455.png]]


跨域问题解决
**别连vpn、别挂梯子**
后端全局配置
测试代码
```jsx
import { useEffect, useState } from "react";

export default function FetchTest() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch("http://26.81.202.205:8080/user/login", {
      credentials: "include", // 允许携带 Cookie
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Fetch CORS Test</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
```

![[Pasted image 20250312223330.png]]


###### 3.13
先把订单页面写活

下拉刷新，调用taroify组件
一开始写成组件，只能下拉组件里的一行字，orderbox无法刷新且下拉
放弃写成组件，写到index里，把orderbox包在组件里，实现
使用useEffect模拟请求数据


实现个人信息头像名字部分
实现个人信息修改部分

###### 3.14
优化修改个人信息页面，加上了个人信息保护法提示

在个人中心页面添加了历史记录和联系客服，待完善

基本完成表单提交页面，使用的taroify的组件
缺点：文件提交模块似乎有bug，转而手写，tailwind样式有点不生效，使用的内嵌

替换步骤条icon

意见反馈页面基本完成

taroify表单组件重置和图片上传修复

发现图片在taroify组件中处理的是url返回的是文件对象
而按照正常情况应该传递字节流，所以将图片上传和普通字段上传分开，普通字段依旧是json，用request，文件则未multipart/form-data，用uploadFile

订单详情页初构建

尝试写微信授权登录给app写炸了，幸好能从git上回退版本:）还好今天不是一天一传

###### 3.15
登录模块初实现
感觉会是一个大山

上来先配一个小时的项目，昨天晚上还能打开，白天就打不开了
修了一下午，好了
登录模块以外的简单，taro还是集成了挺多的


###### 3.16

zustand维护登录状态

优化未登录状态
- 未登录不展示提交订单页面
- 修复一个bug，展开讲讲
> 先渲染了所有页面之后在别的页面登录了，个人中心不会渲染加载，但是我用全局状态管理了，一直找不到原因，后来发现是只获取了最新状态但是没有更新ui，这点还是比较坑的，useEffect依赖于`useAuthStore.getState().needLogin`，但 `useAuthStore.getState()` 只是获取一次值，不会触发重新渲染，在testlogin中一样，在 `testLogin` 里用 `useAuthStore.getState().setNeedLogin(true)` 修改状态，但 `getState()` 只是获取状态，**不会触发 UI 更新**，
> 解决办法：
> 使用修改语法而非获取语法
> `const needLogin = useAuthStore((state) => state.needLogin);
> `const setNeedLogin = useAuthStore((state) => state.setNeedLogin);

完成轻提示的组件替换

修改个人信息页面初步完善

###### 3.17
修改个人信息页面完善
- 保存提交
- 下拉选择框
- 电话正则校验
- 头像选择

###### 3.18
反馈提交优化，本地解决一天只能提交一次

优化订单时间
优化step组件颜色

###### 3.19
倒也不是说怠惰了，因为买新电脑了

今天优化了一点点接口和页面设计

###### 3.20
github 仓库配置

mac 成功拉取项目

###### 3.21
修复时间错误
因为使用路由传递参数全部都会转化成字符串
![[Pasted image 20250321111331.png]]
这就导致格式化时间错误
需要手动转成数字型
`Number(ordertime)`

###### 3.23
确定历史订单页面使用流式懒加载
配合筛选功能
应该是一座大山

历史订单列表页面构建
历史订单详情页面初构建


###### 3.24
页面样式解决
手写 navbar

修了一晚上 bug，真的一晚上
还没修改
判断出来是路由跳转的问题，但是 完完全全一样的逻辑，一个有问题一个没问题，
还不知道怎么办，只能慢慢想了，感觉时间都浪费在这种事情上了

###### 3.25
现在是凌晨0：24 本来刚刚打算放弃了，然后误打误撞修好了
不过完全不知道因为什么

而react 310 错误是因为useEffect中setTimeout中的setLoading(false)导致的
具体原因是
useReady这个hook的缘故
> 错误 #310 常见原因之一是组件在渲染过程中 Hook 的调用顺序不一致。在你的代码中，当 loading 为 true 时，组件提前返回了 Loading 的 JSX，而此时 useReady 没有被调用；而当 loading 为 false 时，又会调用 useReady。这就导致了 Hook 调用顺序的不一致，从而触发了错误。
>解决方案是确保所有 Hook 都在组件顶层始终被调用，也就是说，不能在条件判断（例如 if(loading)）之后再调用 Hook。你可以将 useReady 调用移动到条件判断之前，即在组件一开始就调用它，这样无论 loading 状态如何，都能保证 Hook 的调用顺序一致。


基础搭建完毕
流式懒加载核心实现

懒加载配合虚拟列表无法实现，
其实是两个功能都实现了，但是有冲突
虚拟列表适合死数据
懒加载时候活数据，也就是一直请求
这就导致一个问题，每次懒加载请求数据就会导致虚拟列表重新渲染
就会从头开始，体验极差
现在决定分开，只使用懒加载
