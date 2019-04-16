// binds objects methods to a specific context
// useful when binding nested objects to their main object context
export function bindObject(methods, context) {
    return Object
        .entries(methods)
        .map(([key, value]) => [key, value.bind(context)])
        .reduce((acc, [key, val]) => Object.assign(acc, { [key]: val }), {})
}

export function loopTimer(loop = {}) {
    if (typeof loop != 'object') throw new Error('Loop only accepts objects')
    return {
        tick: 0,
        timeout: 300,
        stopNextCycle: false,
        operation() { },
        timer: null,
        next() {
            this.timer = setTimeout(async () => {
                this.tick += 1
                try {
                    typeof this.operation == 'function' && await this.operation(this)
                } catch (error) {
                    console.error(error)
                }
                if (!this.stopNextCycle) this.next()
            }, this.timeout)
        },
        stop() {
            this.stopNextCycle = true
            clearTimeout(this.timer)
        },
        ...loop,
    }
}
