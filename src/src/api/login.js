import request from '@/utils/request'

export function loginByUsername(username, password) {
	return request({
		url: '/account/login',
		method: 'post',
		params: {
			username,
			password
		}
	})
}

export function logout() {
	return request({
		url: '/account/logout',
		method: 'post'
	})
}

export function getUserInfo(token) {
	return request({
		url: '/account/GetUserRoles',
		method: 'get'
	})
}

