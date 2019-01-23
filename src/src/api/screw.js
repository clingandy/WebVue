import request from '@/utils/request'
import download from '@/utils/download'

// 省市
export function getCityList(pid) {
    return request({
        url: '/common/getcitys',
        method: 'get',
        params: {
            pid
        }
    })
}

// 字典
export function getDictPageList(query) {
    return request({
        url: '/Dict/GetDictPageList',
        method: 'get',
        params: query
    })
}

// 字典类型key value
export function getDictByType(dictType, pDictKey) {
    return request({
        url: '/Dict/GetDictByTypeList',
        method: 'get',
        params: {
            dictType,
            pDictKey
        }
    })
}

// 字典类型
export function getDictType() {
    return request({
        url: '/Dict/GetDictType',
        method: 'get'
    })
}

// 添加修改字典
export function createOrModifyDict(data, type) {
    var url = type === 'create' ? '/Dict/AddDict' : '/Dict/ModifyDict';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: data
    })
}

// 获取客户信息
export function getClientPageList(params) {
    return request({
        url: '/Client/GetClientPageList',
        method: 'get',
        params: params
    })
}

// 获取客户信息
export function getClientNameIdByNameList(name) {
    return request({
        url: '/client/getClientNameIdByNameList',
        method: 'get',
        params: {
            name
        }
    })
}

// 添加修改客户
export function createOrModifyClient(data, type) {
    var url = type === 'create' ? '/Client/AddClient' : '/Client/ModifyClient';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: data
    })
}

// 获取客户地址
export function getClientAddressList(clientId) {
    return request({
        url: '/Client/GetClientAddressList',
        method: 'get',
        params: {
            clientId
        }
    })
}

// 添加修改客户地址
export function createOrModifyClientAddress(data, type) {
    var url = type === 'create' ? '/Client/AddClientAddress' : '/Client/ModifyClientAddress';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: data
    })
}

// 获取客户地址
export function delClientAddress(id) {
    return request({
        url: '/client/delClientAddress',
        method: 'post',
        params: {
            id
        }
    })
}

// 获取商品信息
export function getProductPageList(params) {
    return request({
        url: '/order/GetProductPageList',
        method: 'get',
        params: params
    })
}

// 添加修改商品
export function createOrModifyProduct(data, type) {
    var url = type === 'create' ? '/order/AddProduct' : '/order/ModifyProduct';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: data
    })
}

// 下载模板
export function downloadProductTemplate() {
    return download({
        url: '/order/downloadProductTemplate',
        method: 'get'
    })
}

// 获取商品历史
export function getProductHistoryPageList(params) {
    return request({
        url: '/order/GetProductHistoryPageList',
        method: 'get',
        params: params
    })
}

// 获取商品图片
export function GetProductImgAll(params) {
    return request({
        url: '/order/GetProductImgAll',
        method: 'get',
        params: params
    })
}

// 添加修改商品图片
export function createOrModifyProductImg(data, type) {
    var url = type === 'create' ? '/order/AddProductImg' : '/order/ModifyProductImg';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: data
    })
}

// 获取订单
export function getOrderPageList(params) {
    return request({
        url: '/order/GetOrderPageList',
        method: 'get',
        params: params
    })
}

// 获取订单状态
export function getOrderStatus() {
    return request({
        url: '/order/GetOrderStatus',
        method: 'get'
    })
}

// 添加修改商品
export function modifyOrder(data) {
    return request({
        url: '/order/ModifyCrmOrder',
        method: 'put',
        data: data
    })
}

// 添加修改商品
export function addOrder(order, orderItems) {
    return request({
        url: '/order/AddCrmOrder',
        method: 'post',
        data: {
            order: { order, orderItems }
        }
    })
}
