### 项目介绍
技术选型：taro+react+taroify+zustand
版本控制：
- taro：4.0.9
- taroify：0.6.4
- react：18

### 开发进度

3.2~3.6
基础taro小程序了解和学习

3.7~3.8
配置路由
寻找合适组件库

3.9~3.10
项目初始化 Nutui tailwind 配置环境是真的折磨人

完成了订单界面的初开发

3.11
放弃Nutui组件库
转头选择更加适配react的taroify

完成简单的step步骤条控制，但是没用使用组件提供的步骤条
发现组件提供步骤条自定义化太低



3.12

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





3.13
先把订单页面写活

下拉刷新，调用taroify组件
一开始写成组件，只能下拉组件里的一行字，orderbox无法刷新且下拉
放弃写成组件，写到index里，把orderbox包在组件里，实现
使用useEffect模拟请求数据



实现个人信息头像名字部分
 实现个人信息修改部分
