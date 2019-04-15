import Entity from '../entity'

export default class EntityPlayer extends Entity {
    constructor(player) {
        super({
            name: 'player',
            attributes: {
                position: { x: 0, y: 0 },
                direction: 'UP',
            },
            triggers: {
                move(event) {
                    this.attributes.direction = event.direction
                    this.attributes.position = moveDirectional(this)
                },
                touch(event) {
                    this.attributes.position.x += 1
                },
            },
            hooks: {
                destroyed(event) {}, // fired when removed from the world
                created(event) {}, // fired when set into world
                updated(event) {}, // fired when moved
            },
            ...player
        })
    }
}

function moveDirectional(movingObject) {
    const vectorMap = {
        UP: ({ x, y }) => ({ y: y + 1, x }),
        DOWN: ({ x, y }) => ({ y: y - 1, x }),
        RIGHT: ({ x, y }) => ({ y, x: x + 1 }),
        LEFT: ({ x, y }) => ({ y, x: x - 1 }),
    }
    return vectorMap[movingObject.attributes.direction](movingObject.attributes.position)
}
