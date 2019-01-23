import request from '@/utils/request'

export function fetchDeptList() {
    return request({
        url: '/System/GetAllSysOrgList',
        method: 'get'
    })
}

export function GetParentDeptList(query) {
    return request({
        url: '/System/GetAllSysOrgList',
        method: 'get',
        params: query
    })
}

export function getDeptOption(query) {
    return request({
        url: '/System/GetSysOrgByStatusList',
        method: 'get',
        params: query
    })
}

export function createDepartmen(model, type) {
    var url = type === 'create' ? '/System/AddSysOrg' : '/System/ModifySysOrg';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: model
    })
}

export function deleteDept(id) {
    return request({
        url: `/System/DelSysOrgById`,
        method: 'delete',
        params: {
            id
        }
    })
}
