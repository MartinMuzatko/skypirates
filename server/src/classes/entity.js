import { bindObject } from '../util'
import shortid from 'shortid'

export default class Entity {
    constructor(options) {
        this.id = shortid.generate()
        this.attributes = {}
        this.triggers = {}
        Object.assign(this, options)
        this.triggers = bindObject(this.triggers, this)
        this.hooks = bindObject(this.hooks, this)
    }
}

const rock = new Entity({
    name: 'rock',
    attributes: {
        position: { x: 0, y: 0 },
    },
    triggers: {
        touch(event) {
            this.attributes.position.x += 1
        },
        hit() { }, // when hit with a spell/weapon

    },
    hooks: {
        destroyed(event) {}, // fired when removed from the world
        created(event) {}, // fired when set into world
        updated(event) {}, // fired when moved
    }
})
