import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

// 常量保持的内置路由
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
            component: _import('dashboard/index'),
            name: 'dashboard',
            meta: { title: '首页', icon: 'dashboard', noCache: true }
        }]
    }
    // {
    //     path: '/article',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     meta: { title: '内容管理', icon: 'people' },

    //     children: [{
    //             path: 'category',
    //             component: _import('article/category'),
    //             name: 'article_category',
    //             meta: { title: '栏目管理', icon: 'table' }
    //         },
    //         {
    //             path: 'list',
    //             component: _import('article/list'),
    //             name: 'article_list',
    //             meta: { title: '资讯文章', icon: 'table' }
    //         }
    //     ]
    // }
]

export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [

]
