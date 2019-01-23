const object = {
    state: {
        orderItems: []
    },
    mutations: {
        ADD_ORDER_ITEM: (state, orderItem) => {
            var d = state.orderItems.find(d => {
                return d.productId === orderItem.productId;
            })
            if (!d) {
                var data = JSON.parse(JSON.stringify(orderItem)); // 复制赋值，防止引用问题
                state.orderItems.push(data)
            }
        },
        REMOVE_ORDER_ITEM: (state, productId) => {
            state.orderItems.splice(state.orderItems.findIndex(item => item.productId === productId), 1)
        },
        CLEAN_ORDER_ITEM: (state) => {
            state.orderItems = []
        }
    },
    actions: {
        addOrderItem({ commit }, orderItem) {
            commit('ADD_ORDER_ITEM', orderItem)
        },
        removeOrderItem({ commit }, productId) {
            commit('REMOVE_ORDER_ITEM', productId)
        },
        cleanOrderItem({ commit }) {
            commit('CLEAN_ORDER_ITEM')
        }
    }
}

export default object
