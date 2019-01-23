import request from '@/utils/request'

export function getMenuRouterPermission() {
    return request({
        url: `/Account/GetMenuRouterPermission`,
        method: 'get'
    })
}

export function getmenulist() {
    return request({
        url: `/System/GetAllSysMenuList`,
        method: 'get'
    })
}

export function getMenuAndPermissionList(roleId) {
    if (!roleId) roleId == null;
    return request({
        url: `/System/getMenuIdAndPermissionIdList`,
        method: 'get',
        params: {
            roleId
        }
    })
}

export function ModifyMenuPermission(mId, permission) {
    return request({
        url: `/System/ModifyMenuPermission`,
        method: 'put',
        data: {
            permission
        },
        params: {
            mId
        }
    })
}

export function deleteMenu(id) {
    return request({
        url: '/System/DelSysMenuById',
        method: 'delete',
        params: {
            id
        }
    })
}

export function createOrModifyMenu(menu, type) {
    var url = type === 'create' ? '/System/AddSysMenu' : '/System/ModifySysMenu';
    return request({
        url: url,
        method: type === 'create' ? 'post' : 'put',
        data: menu
    })
}

export function allocPermission(roleId, menuIds, permissionIds) {
    return request({
        url: `/System/AddSysRoleMenu`,
        method: 'post',
        data: {
            roleId,
            menuIds,
            permissionIds
        }
    })
}
