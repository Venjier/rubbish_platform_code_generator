import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'

export const UseRubbishPlatformCodeGenerator = {
    install(Vue, options) {
        Vue.use(ElementUI)
        window.vbi = {
            system: {
                service: ({url, method, headers = {}, data}) => {
                    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
                    const config = {
                        url,
                        method,
                        mode: 'no-cors',
                        headers
                    }
                    if (data) config.data = data

                    return axios.request(config)
                }
            },
            vue: {
                $utils: {
                    cookies: {
                        get(key) {

                        }
                    }
                }
            }
        }
    }
}