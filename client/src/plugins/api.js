import io from 'socket.io-client'

function api(options = {}) {
    options = {
        url: '',
        socket: null,
        ...options
    }

    return {
        ...options,
        connectSocket() {
            this.socket = io(this.url);
        },
        move(direction) {
            this.socket.emit('move', direction)
        },
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
