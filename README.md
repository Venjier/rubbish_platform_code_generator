## node 

- node 18.20.4
- npm 10.7.0

## 插件依赖

- babel/generator: 7.27.1
- babel/parser: 7.27.1
- babel/preset-env: 7.27.1
- babel/traverse: 7.27.1
- babel/core: 7.27.1
- babel/types: 7.27.1
- parse5: 7.3.0
- sass: 1.87.0

## 项目

- 推荐 vue 2.7.16、vite 4.5.13、element-ui 2.7.2

## 安装

```shell
npm i rubbish_platform_code_generator
```

## 使用

在 vite.config.js 中

```javascript
import {createVuePlugin} from "vite-plugin-vue2";
import RubbishPlatformCodeGenerator from "rubbish_platform_code_generator";

export default {
    plugins: [createVuePlugin(), RubbishPlatformCodeGenerator()]
}
```

## 目前支持

1. 将所有除 App.vue 以外的所有 Vue 编译成运监平台所支持的 html、css、js
2. 将 mounted 中的代码转移到 $com.method.init 中
3. 将 dom 中的 vue 指令所绑定的函数引用加上 $com.method 的前缀
4. 将 scss 语法转换成 css
5. 将 methods 中的所有函数移动到 method 下，并将所有函数转换成显式的 function 写法
6. 把 data 返回的对象全部转移到 custom 对象下
7. 把所有函数体中类似 this.list 的引用改为 this.custom.list 的形式
8. 把所有函数体中类似 this.getList 形式的方法调用改为 this.method.getList 的形式
9. js 代码编译时注入变量，可在 vite.config.js 中配置需要注入的变量，编译结果中会把这些变量注入到 custom 中，目前仅支持 number、string、boolean 类型的注入

## 已知问题及后续升级计划

1. 目前 html 部分只支持闭合标签，不支持单标签，比如 <input/> 请写作 <input></input>
2. js 部分自己声明的变量名和方法名不支持使用 method、methods、data 等 vue 常见的配置名，这会导致插件编译时的识别错误
3. 暂不支持自定义组件的相互调用，请将一个页面的所有逻辑写在同一个 vue 组件内，element-ui 的全局注入组件可用
4. element-ui 的版本与运监平台的版本不一致，可能存在一些兼容问题，出现兼容问题时，暂时只能寻求其它方案，或使用不存在兼容问题的组件平替
5. 暂不支持 watch、computed 等语法
6. 暂不支持 import 其它 js 文件，来自其它 js 文件的通用方法请复制到 vue 文件的 methods 中调用
7. vue 的生命周期钩子只支持 mounted，它会被编译到 init 方法中，组件初始化期的所有逻辑请在 mounted 中执行