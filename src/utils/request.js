import axios from 'axios'
import {VueAxios} from './axios'
import {Notification} from 'element-ui'
import router from "../router";

let apiBaseUrl = process.env.VUE_APP_API_BASE_URL;

// 创建 axios 实例
const service = axios.create({
    baseURL: apiBaseUrl,
    timeout: 9000
});

const err = (error) => {
    //console.log('error', error)
    if (error) {
        let data = error;
        const token = localStorage.getItem('X-Access-Token');
        //console.log("------异常响应------", token);
        //console.log("------异常响应------", error);
        switch (error) {
            case 403:
                //console.log('拒绝访问');
                break;
            case 500:
                //console.log("------error.response------", error);
                break;
            case 404:
                //console.log('很抱歉，资源未找到!');
                break;
            case 504:
                //console.log('网络超时');
                break;
            case 401:
                //console.log('很抱歉，登录已过期，请重新登录');
                Notification.error({
                    title: '错误',
                    message: '很抱歉，登录已过期，请重新登录'
                });
                localStorage.removeItem('X-Access-Token')
                router.push('/')
                break;
            default:
                //console.log(data);
                break;
        }
        return error;
    }
};

service.interceptors.request.use((config) => {
    //console.log('config', config)
    const token = localStorage.getItem('X-Access-Token');
    if (token) {
        config.headers['X-Access-Token'] = `${token}`
    }
    return config;
});

service.interceptors.response.use((response) => {
    //console.log('response', response)
    if (response.data.code === 200) {
        return response.data
    } else {
        let error = err(response.data.code)
        //console.log(error)
        return error
    }
});

const installer = {
    vm: {},
    install(Vue, router = {}) {
        Vue.use(VueAxios, router, service)
    }
};

export {
    installer as VueAxios,
    service as axios
}
