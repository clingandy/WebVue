import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (store.getters.token) {
        config.headers['Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    config.responseType = 'arraybuffer' // 设置返回格式
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        var fileDownload = require('js-file-download'); // 使用js-file-download插件
        const disposition = response.headers['content-disposition'];
        const fileName = decodeURI(disposition.substring(disposition.indexOf("''") + 2)); // 处理格式
        fileDownload(response.data, fileName);
    },
    error => {
        console.log(error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    })

export default service
