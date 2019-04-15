import { loopTimer } from '../util'

export default class World {
    constructor(w, h, entities = []) {
        this.width = w
        this.height = h
        this.tiles = this.mapTiles(() => Math.random() < .5 ? 0 : 1)
        this.timer = loopTimer({
            timeout: 1000,
            operation: timer => {
                // this.entities.map(entity => {

                // })
            }
        })
        this.timer.next()
        this.entities = entities
    }

    destroy() {
        this.timer.stop()
    }

    toJSON() {
        return {
            entities: this.entities
        }
    }

    mapTiles(mapFunction) {
        return Array.from(Array(this.width)).map((value, x) =>
            Array.from(Array(this.height)).map((value, y) =>
                mapFunction(x + 1, y + 1)
            )
        )
    }
}
