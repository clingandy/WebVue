import request from '@/utils/request'

export function getusers(query) {
    return request({
        url: '/system/GetAllSysUserList',
        method: 'get',
        params: query
    })
}

export function deleteUser(userid) {
    return request({
        url: `/system/delUser?userId=${userid}`,
        method: 'delete'
    })
}

export function modifySysUserByPwd(model) {
    return request({
        url: `/account/ModifySysUserByPwd`,
        method: 'put',
        params: model
    })
}

export function resetPwd(model) {
    return request({
        url: `/system/ResetSysUserByPwd`,
        method: 'put',
        params: model
    })
}

export function createOrModifyUser(user, type) {
    var url = type === 'create' ? '/System/AddSysUser' : '/System/ModifySysUser';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: user
    })
}
