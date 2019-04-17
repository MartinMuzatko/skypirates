function api(options = {}) {
    options = {
        url: '',
        ...options
    }

    return {
        ...options,
        async join() {
            const response = await fetch(`${this.url}/api/join`, {
                method: 'POST'
            })
            return response.json()
        },
        async getWorld() {
            const response = await fetch(`${this.url}/api/world`)
            return response.json()
        },
    }
}

export default {
    install(Vue, options) {
        Vue.prototype.$api = api(options)
    }
}
