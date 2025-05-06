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

1. 将 mounted 中的代码转移到 $com.method.init 中
2. 将 dom 中的 v-on 指定绑定的函数引用加上 $com.method 的前缀
3. 将 scss 语法转换成 css
4. 将 methods 中的所有函数移动到 $com.method 下，并将所有函数转换成显式的 function 写法
5. 把 data 返回的对象全部转移到 custom 对象下