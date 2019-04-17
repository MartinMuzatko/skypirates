import Entity from '../entity'

export default class EntityPlayer extends Entity {
    constructor(player) {
        super({
            name: 'player',
            attributes: {
                position: { x: 0, y: 0 },
                direction: 'UP',
                tileset: 0,
                dimensions: {w: 16, h: 16, d: 2},
            },
            triggers: {
                move(event) {
                    if (!DIRECTIONS.includes(event.direction)) return
                    this.attributes.direction = event.direction
                    if (!event.canMove) return
                    this.attributes.position = moveDirectional(this)
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

const DIRECTIONS = [
    'UP',
    'DOWN',
    'RIGHT',
    'LEFT',
]

function moveDirectional(movingObject) {
    const vectorMap = {
        UP: ({ x, y }) => ({ y: y + 1, x }),
        DOWN: ({ x, y }) => ({ y: y - 1, x }),
        RIGHT: ({ x, y }) => ({ y, x: x + 1 }),
        LEFT: ({ x, y }) => ({ y, x: x - 1 }),
    }
    return vectorMap[movingObject.attributes.direction](movingObject.attributes.position)
}
