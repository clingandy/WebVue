import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/system/GetAllSysRolePageList',
        method: 'get',
        params: query
    })
}

export function createOrModifyRole(role, type) {
    var url = type === 'create' ? '/System/AddSysRole' : '/System/ModifySysRole';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: role
    })
}

export function deleteRole(id) {
    return request({
        url: `/system/DelSysRoleById`,
        method: 'delete',
        params: {
            id
        }
    })
}

export function getAllSysRoleList() {
    return request({
        url: `/system/getAllSysRoleList`,
        method: 'get'
    })
}

export function getRolesByOrgId(orgId) {
    return request({
        url: `/system/GetSysRoleListByOrgId`,
        method: 'get',
        params: {
            orgId
        }
    })
}
