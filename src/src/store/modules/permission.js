import { constantRouterMap } from '@/router';
import { getMenuRouterPermission } from '@/api/menu';
import Layout from '../../views/layout/Layout';
const _import = require('../../router/_import_' + process.env.NODE_ENV);

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        ReSetRouter({ commit }) {
            const data = JSON.parse(localStorage.getItem('cms_userRouters'));
            data.forEach(item => {
                item.component = Layout;
                if (item.children) {
                    item.children.forEach(child => {
                        child.component = _import(child.component);
                    });
                }
            });

            data.push({ path: '*', redirect: '/404', hidden: true })
            commit('SET_ROUTERS', data);
        },

        GenerateRoutes({ commit }) {
            return new Promise(resolve => {
                // const { roles } = data;
                getMenuRouterPermission().then(result => {
                    const data = result.data.data;

                    localStorage.setItem('cms_userRouters', JSON.stringify(data))

                    data.forEach(item => {
                        item.component = Layout;
                        if (item.children) {
                            item.children.forEach(child => {
                                child.component = _import(child.component);
                            });
                        }
                    });

                    data.push({ path: '*', redirect: '/404', hidden: true })

                    commit('SET_ROUTERS', data);

                    resolve()
                });
            })
        },
        getPagePermission({ state }, name) { // 获取页面权限
            let _permission = [];

            state.addRouters.forEach(item => {
                if (item.children) {
                    item.children.forEach(router => {
                        if (router.name === name) {
                            _permission = router.meta.permission;
                        }
                    });
                }
            });

            return _permission;
        }
    }
}

export default permission
