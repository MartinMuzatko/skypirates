import { loopTimer } from '../util'

export default class World {
    constructor(w, h, entities = []) {
        this.width = w
        this.height = h
        this.generate()
        this.timer = loopTimer({
            timeout: 1000,
            operation: timer => {
                this.entities
                    .filter(entity => typeof entity.nextTick == 'function')
                    .map(entity => {
                        entity.nextTick()
                        console.log(entity.attributes)
                        entity.nextTick = null
                    })
            }
        })
        this.timer.next()
        this.entities = entities
    }

    getTile(x, y) {
        const map = this.tiles.reverse()
        const coordinate = map[y] && map[y][x]
        return Number.isInteger(coordinate) ? coordinate : 9
    }

    getSection(xStart, yStart, xEnd, yEnd) {
        if (xStart > xEnd) throw new Error(`xStart is higher than xEnd`)
        if (yStart > yEnd) throw new Error(`yStart is higher than yEnd`)
        const xCoordinates = Array.from(Array(xEnd - xStart + 1)).map((value, index) => index + xStart)
        const yCoordinates = Array.from(Array(yEnd - yStart + 1)).map((value, index) => index + yStart)
        const map = this.tiles.reverse()
        return yCoordinates.map(y => xCoordinates.map(x => this.getTile(x, y))).reverse()
    }

    generate() {
        this.tiles = this.mapTiles(() => (Math.random() < 0.66 ? 0 : 1))
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
