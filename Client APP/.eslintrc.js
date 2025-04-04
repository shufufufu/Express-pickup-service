module.exports = {
  parserOptions: {
    requireConfigFile: false,  // 让 ESLint 忽略 Babel 配置
    ecmaVersion: 2021,
    sourceType: "module",  // 指定 ECMAScript 版本
  ecmaFeatures: {
    jsx: true          // 允许 JSX 语法
  }
},

};
