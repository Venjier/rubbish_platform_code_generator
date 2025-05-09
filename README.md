## 说明

- 此插件可以将除了 App.vue 以外的其它所有 .vue 文件编译成运监平台所支持的 html、css、js 文件，在本地进行开发，插件会自动进行编译，在
  .vue 文件所在的同级目录下输出编译结果，直接复制到运监平台即可

## 目前支持

1. 将所有除 App.vue 以外的所有 Vue 编译成运监平台所支持的 html、css、js
2. 将 mounted 中的代码转移到 $com.method.init 中
3. 将 dom 中的 vue 指令所绑定的函数引用加上 $com.method 的前缀
4. 将 scss 语法转换成 css
5. 将 methods 中的所有函数移动到 method 下，并将所有函数转换成显式的 function 写法
6. 把 data 返回的对象全部转移到 custom 对象下
7. 把所有函数体中类似 this.list 的引用改为 this.custom.list 的形式
8. 把所有函数体中类似 this.getList 形式的方法调用改为 this.method.getList 的形式
9. js 代码编译时注入变量，可在 vite.config.js 中配置需要注入的变量，编译结果中会把这些变量注入到 custom 中，目前仅支持
   number、string、boolean 类型的注入

## 已知问题及后续升级计划

1. 目前 html 部分只支持闭合标签，不支持单标签，比如 `<input/>` 请写作 `<input></input>`
2. js 部分自己声明的变量名和方法名不支持使用 method、methods、data 等 vue 常见的配置名，这会导致插件编译时的识别错误
3. 暂不支持自定义组件的相互调用，请将一个页面的所有逻辑写在同一个 vue 组件内，element-ui 的全局注入组件可用
4. element-ui 的版本与运监平台的版本不一致，可能存在一些兼容问题，出现兼容问题时，暂时只能寻求其它方案，或使用不存在兼容问题的组件平替
5. 暂不支持 watch、computed 等语法
6. 暂不支持 import 其它 js 文件，来自其它 js 文件的通用方法请复制到 vue 文件的 methods 中调用
7. vue 的生命周期钩子只支持 mounted，它会被编译到 init 方法中，组件初始化期的所有逻辑请在 mounted 中执行

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

#### 创建新的项目

- 由于此插件是基于 vite 的插件，而运监平台使用的 vue 版本为 2.7.16，所以创建项目时需要手动创建

1. 创建项目 `npm init vite@2.9.5`
2. 输入项目名称，确定后选择 vanilla，注意这里不要选择 vue，因为 vite 默认不支持创建 vue2 项目，我们直接创建一个原生的空项目
3. 初始化项目，切换到项目根目录下，执行命令 `npm i`，或者使用 yarn
4. 安装 vite 对 vue2 的支持插件，执行命令 `npm i vite-plugin-vue`
5. 在项目根目录下创建 vue.config.js 文件，并写入以下内容

```javascript
import {createVuePlugin} from "vite-plugin-vue2";

export default {
    plugins: [createVuePlugin()]
}
```

6. 安装 vue2，执行命令 `npm i vue@2.7.16` 和 `npm i vue-template-compiler`
7. 在项目根目录下创建 src 文件夹，并创建 App.vue 文件，把 main.js 移动到 src 文件夹下，把 index.html 中对 main.js 的引用改为
   /src/main.js
8. 把 main.js 的内容改为如下内容

```javascript
import Vue from "vue";
import App from "./App.vue";

new Vue({render: h => h(App)}).$mount("#app");
```

9. 接下来就可以运行 `npm run dev` 命令，就可以看到项目运行了

#### 集成 element-ui

1. 安装 element-ui，执行命令 `npm i element-ui@2.7.2`，指定版本号，因为 element-ui 的版本过高会导致部分组件被 vite 编译后显示不出来
2. 在 main.js 中添加如下代码

```javascript
import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({render: h => h(App)}).$mount("#app");
```

#### 挂载全局对象

1. 安装 axios，执行命令 `npm i axios`
2. 把如下内容复制粘贴到 main.js，这样就可以在 vue 中使用和运监平台一样的代码来调用后端接口

```javascript
window.vbi = {
    system: {
        service: async ({url, method, headers = {}, data}) => {
            const config = {
                url,
                method,
                headers
            }
            if (data) config.data = data

            return (await axios.request(config)).data
        }
    },
    vue: {
        $utils: {
            cookies: {
                get(key) {
                    return ''
                }
            }
        }
    }
}
```

## 安装 rubbish_platform_code_generator

```shell
npm i rubbish_platform_code_generator
```

## 使用

- 在 vite.config.js 中，配置 RubbishPlatformCodeGenerator 安装插件

```javascript
import {createVuePlugin} from "vite-plugin-vue2";
import RubbishPlatformCodeGenerator from "rubbish_platform_code_generator";

export default {
    plugins: [createVuePlugin(), RubbishPlatformCodeGenerator()]
}
```

## 便捷化配置

在 vite.config.js 中，可以在安装插件时配置变量注入，目前只支持对 custom 的注入，这样做有一个好处，你可以在组件中调用后端接口时，给
BaseURL 设置一个空字符串，通过配置中的代理来进行与后端的联调，浏览器会自动拼接同源的 url。然后在插件中注入
BaseURL，编译结果中会把 BaseURL 赋值到 custom 中，这样，你无需额外修改代码，编译结果就可以直接复制到运监平台，调通接口。案例如下：

```javascript
// vite.config.js
import {createVuePlugin} from "vite-plugin-vue2";
import RubbishPlatformCodeGenerator from "rubbish_platform_code_generator";


export default {
    plugins: [createVuePlugin(), RubbishPlatformCodeGenerator({
        injection: {
            js: {
                custom: {baseURL: 'http://10.10.12.119:8080/yngxhyy'} // 这个变量会注入到每一个组件的 custom 中
            },
            css: {},
            html: {}
        }
    })],
    server: {
        proxy: {
            '/admin': 'http://192.168.8.122:8091', // 本地开发时，将代理转发到联调的后端地址
        }
    }
}
```

```html
<!-- 开发环境的 vue 文件中 -->
<script>

    export default {
        data() {
            return {
                baseURL: '' // 这里的 baseURL 是一个空串
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            async getList() {
                const res = await vbi.system.service({
                    url: this.baseURL + '/admin/test', // 开发环境中，baseURL 是空串，根据浏览器的同源策略，会请求前端的访问地址，然后通过代理，转发到联调的后端地址
                    method: 'GET',
                    headers: {Authorization: `Bearer ${vbi.vue.$utils.cookies.get('jhop5-token')}`}
                })
            }
        }
    }
</script>
```

```javascript
// 编译结果的 js 文件中
function main() {
    return {
        name: {
            value: "com-demo",
            CN: "示例组件"
        },
        method: {
            NFDW: function () {
            },
            init: function () {
                vbi.package.vue.creat(this);
                this.method.getList();
            },
            getList: async function () {
                const res = await vbi.system.service({
                    url: this.custom.baseURL + '/admin/test', // 这里拼接了 baseURL，调用后端接口
                    method: 'POST',
                    data: this.custom.params,
                    headers: {
                        Authorization: `Bearer ${vbi.vue.$utils.cookies.get('jhop5-token')}`
                    }
                });
            },
        },
        attribute: {
            class: ""
        },
        custom: {
            baseURL: "http://10.10.12.119:8080/yngxhyy", // 编译结果中，baseURL 被注入值，调用接口时拼接此地址，就可以在生产环境中调通接口
        },
        style: {
            width: "100%",
            height: "100%"
        },
        binds: {
            rows: {
                display: true,
                label: "行",
                info: ""
            },
            columns: {
                display: true,
                label: "列",
                info: ""
            },
            values: {
                display: true,
                label: "值",
                info: ""
            },
            wheres: {
                display: true,
                info: ""
            },
            orders: {
                display: true,
                info: ""
            },
            rowCount: {
                display: true,
                info: ""
            },
            options: {
                display: true,
                info: ""
            }
        },
        nIE: false
    };
}
```

## 说明

- 此插件可以将除了 App.vue 以外的其它所有 .vue 文件编译成运监平台所支持的 html、css、js 文件，在本地进行开发，插件会自动进行编译，在
  .vue 文件所在的同级目录下输出编译结果，直接复制到运监平台即可

## 目前支持

1. 将所有除 App.vue 以外的所有 Vue 编译成运监平台所支持的 html、css、js
2. 将 mounted 中的代码转移到 $com.method.init 中
3. 将 dom 中的 vue 指令所绑定的函数引用加上 $com.method 的前缀
4. 将 scss 语法转换成 css
5. 将 methods 中的所有函数移动到 method 下，并将所有函数转换成显式的 function 写法
6. 把 data 返回的对象全部转移到 custom 对象下
7. 把所有函数体中类似 this.list 的引用改为 this.custom.list 的形式
8. 把所有函数体中类似 this.getList 形式的方法调用改为 this.method.getList 的形式
9. js 代码编译时注入变量，可在 vite.config.js 中配置需要注入的变量，编译结果中会把这些变量注入到 custom 中，目前仅支持
   number、string、boolean 类型的注入

## 已知问题及后续升级计划

1. 目前 html 部分只支持闭合标签，不支持单标签，比如 <input/> 请写作 <input></input>
2. js 部分自己声明的变量名和方法名不支持使用 method、methods、data 等 vue 常见的配置名，这会导致插件编译时的识别错误
3. 暂不支持自定义组件的相互调用，请将一个页面的所有逻辑写在同一个 vue 组件内，element-ui 的全局注入组件可用
4. element-ui 的版本与运监平台的版本不一致，可能存在一些兼容问题，出现兼容问题时，暂时只能寻求其它方案，或使用不存在兼容问题的组件平替
5. 暂不支持 watch、computed 等语法
6. 暂不支持 import 其它 js 文件，来自其它 js 文件的通用方法请复制到 vue 文件的 methods 中调用
7. vue 的生命周期钩子只支持 mounted，它会被编译到 init 方法中，组件初始化期的所有逻辑请在 mounted 中执行

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

#### 创建新的项目

- 由于此插件是基于 vite 的插件，而运监平台使用的 vue 版本为 2.7.16，所以创建项目时需要手动创建

1. 创建项目 `npm init vite@2.9.5`
2. 输入项目名称，确定后选择 vanilla，注意这里不要选择 vue，因为 vite 默认不支持创建 vue2 项目，我们直接创建一个原生的空项目
3. 初始化项目，切换到项目根目录下，执行命令 `npm i`，或者使用 yarn
4. 安装 vite 对 vue2 的支持插件，执行命令 `npm i vite-plugin-vue`
5. 在项目根目录下创建 vue.config.js 文件，并写入以下内容

```javascript
import {createVuePlugin} from "vite-plugin-vue2";

export default {
    plugins: [createVuePlugin()]
}
```

6. 安装 vue2，执行命令 `npm i vue@2.7.16` 和 `npm i vue-template-compiler`
7. 在项目根目录下创建 src 文件夹，并创建 App.vue 文件，把 main.js 移动到 src 文件夹下，把 index.html 中对 main.js 的引用改为
   /src/main.js
8. 把 main.js 的内容改为如下内容

```javascript
import Vue from "vue";
import App from "./App.vue";

new Vue({render: h => h(App)}).$mount("#app");
```

9. 接下来就可以运行 `npm run dev` 命令，就可以看到项目运行了

#### 集成 element-ui

1. 安装 element-ui，执行命令 `npm i element-ui@2.7.2`，指定版本号，因为 element-ui 的版本过高会导致部分组件被 vite 编译后显示不出来
2. 在 main.js 中添加如下代码

```javascript
import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({render: h => h(App)}).$mount("#app");
```

#### 挂载全局对象

1. 安装 axios，执行命令 `npm i axios`
2. 把如下内容复制粘贴到 main.js，这样就可以在 vue 中使用和运监平台一样的代码来调用后端接口

```javascript
window.vbi = {
    system: {
        service: async ({url, method, headers = {}, data}) => {
            const config = {
                url,
                method,
                headers
            }
            if (data) config.data = data

            return (await axios.request(config)).data
        }
    },
    vue: {
        $utils: {
            cookies: {
                get(key) {
                    return ''
                }
            }
        }
    }
}
```

## 安装 rubbish_platform_code_generator

```shell
npm i rubbish_platform_code_generator
```

## 使用

- 在 vite.config.js 中，配置 RubbishPlatformCodeGenerator 安装插件

```javascript
import {createVuePlugin} from "vite-plugin-vue2";
import RubbishPlatformCodeGenerator from "rubbish_platform_code_generator";

export default {
    plugins: [createVuePlugin(), RubbishPlatformCodeGenerator()]
}
```

## 便捷化配置

在 vite.config.js 中，可以在安装插件时配置变量注入，目前只支持对 custom 的注入，这样做有一个好处，你可以在组件中调用后端接口时，给
BaseURL 设置一个空字符串，通过配置中的代理来进行与后端的联调，浏览器会自动拼接同源的 url。然后在插件中注入
BaseURL，编译结果中会把 BaseURL 赋值到 custom 中，这样，你无需额外修改代码，编译结果就可以直接复制到运监平台，调通接口。案例如下：

```javascript
// vite.config.js
import {createVuePlugin} from "vite-plugin-vue2";
import RubbishPlatformCodeGenerator from "rubbish_platform_code_generator";


export default {
    plugins: [createVuePlugin(), RubbishPlatformCodeGenerator({
        injection: {
            js: {
                custom: {baseURL: 'http://10.10.12.119:8080/yngxhyy'} // 这个变量会注入到每一个组件的 custom 中
            },
            css: {},
            html: {}
        }
    })],
    server: {
        proxy: {
            '/admin': 'http://192.168.8.122:8091', // 本地开发时，将代理转发到联调的后端地址
        }
    }
}
```

```html
<!-- 开发环境的 vue 文件中 -->
<script>

    export default {
        data() {
            return {
                baseURL: '' // 这里的 baseURL 是一个空串
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            async getList() {
                const res = await vbi.system.service({
                    url: this.baseURL + '/admin/test', // 开发环境中，baseURL 是空串，根据浏览器的同源策略，会请求前端的访问地址，然后通过代理，转发到联调的后端地址
                    method: 'GET',
                    headers: {Authorization: `Bearer ${vbi.vue.$utils.cookies.get('jhop5-token')}`}
                })
            }
        }
    }
</script>
```

```javascript
// 编译结果的 js 文件中
function main() {
    return {
        name: {
            value: "com-demo",
            CN: "示例组件"
        },
        method: {
            NFDW: function () {
            },
            init: function () {
                vbi.package.vue.creat(this);
                this.method.getList();
            },
            getList: async function () {
                const res = await vbi.system.service({
                    url: this.custom.baseURL + '/admin/test', // 这里拼接了 baseURL，调用后端接口
                    method: 'POST',
                    data: this.custom.params,
                    headers: {
                        Authorization: `Bearer ${vbi.vue.$utils.cookies.get('jhop5-token')}`
                    }
                });
            },
        },
        attribute: {
            class: ""
        },
        custom: {
            baseURL: "http://10.10.12.119:8080/yngxhyy", // 编译结果中，baseURL 被注入值，调用接口时拼接此地址，就可以在生产环境中调通接口
        },
        style: {
            width: "100%",
            height: "100%"
        },
        binds: {
            rows: {
                display: true,
                label: "行",
                info: ""
            },
            columns: {
                display: true,
                label: "列",
                info: ""
            },
            values: {
                display: true,
                label: "值",
                info: ""
            },
            wheres: {
                display: true,
                info: ""
            },
            orders: {
                display: true,
                info: ""
            },
            rowCount: {
                display: true,
                info: ""
            },
            options: {
                display: true,
                info: ""
            }
        },
        nIE: false
    };
}
```