const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    GetWebsiteId: state => state.app.websiteId,
    ChangeWebsite: state => state.app.websiteChange,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    status: state => state.user.status,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    errorLogs: state => state.errorLog.logs,
    orderItems: state => state.object.orderItems
}
export default getters
