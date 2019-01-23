import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 10000 // request timeout
})

// request interceptor 约定：post对象用dada普通类型用params
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (config.data) {
         config.data = qs.stringify(config.data) // 处理POST参数为FormData
    }
    if (config.params) {
        var urlParams = qs.stringify(config.params, { arrayFormat: 'indices' }) // 处理GET数组参数
        config.params = null;
        config.url = config.url + '?' + urlParams;
    }
    if (store.getters.token) {
        config.headers['Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        if (response.data.isOk) {
            return response;
        }
        if (response.data.code === 600) {
            Message({
                message: '登录超时！！！！',
                type: 'error',
                duration: 5 * 1000
            })
            store.dispatch('FedLogOut').then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
            return Promise.reject(response.data);
        }
        Message({
            message: response.data.msg,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(response.data);
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    })

export default service
