

const routerList = [{
	path: '/permission',
	redirect: '/permission/index',
	meta: { roles: ['admin'] }, // you can set roles in root nav
	children: [{
		path: 'index',
		component:'permission/index',
		name: 'permission',
		meta: {
			title: 'permission',
			icon: 'lock',
			roles: ['admin'], // or you can only set roles in sub nav
			permission: {'canAdd': false}
		}
	}]
},
{
	path: '/error',
	redirect: 'noredirect',
	name: 'errorPages',
	meta: {
		title: 'errorPages',
		icon: '404'
	},
	children: [
		{ path: '401', component: 'errorPage/401', name: 'page401', meta: { title: 'page401', noCache: true }},
		{ path: '404', component: 'errorPage/404', name: 'page404', meta: { title: 'page404', noCache: true }}
	]
}]

module.exports = {
	list: body => {
		return routerList;
	}
}
