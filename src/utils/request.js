import axios from 'axios'
import {VueAxios} from './axios'

let apiBaseUrl = process.env.VUE_APP_API_BASE_URL;

// 创建 axios 实例
const service = axios.create({
    baseURL: apiBaseUrl,
    timeout: 9000
});

const err = (error) => {
    if (error.response) {
        let data = error.response.data;
        const token = localStorage.getItem('X-Access-Token');
        console.log("------异常响应------", token);
        console.log("------异常响应------", error.response.status);
        switch (error.response.status) {
            case 403:
                console.log('拒绝访问');
                break;
            case 500:
                console.log("------error.response------", error.response);
                break;
            case 404:
                console.log('很抱歉，资源未找到!');
                break;
            case 504:
                console.log('网络超时');
                break;
            case 401:
                console.log('很抱歉，登录已过期，请重新登录');
                break;
            default:
                console.log(data.message);
                break
        }
    } else if (error.message) {
        if (error.message.includes('timeout')) {
            console.log('网络超时')
        } else {
            console.log(error.message)
        }
    }
    return Promise.reject(error)
};

service.interceptors.request.use((config) => {
    const token = localStorage.getItem('X-Access-Token');
    if (token) {
        config.headers['X-Access-Token'] = `${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error)
});

service.interceptors.response.use((response) => {
    return response.data
}, err);

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
