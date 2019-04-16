export default class EntityEvent {
    constructor(world, id, action = {}) {
        this.world = world
        this.entity = world.entities.find(entity => entity.id == id)
        Object.assign(this, action)
    }

    get canMove() {
        if (!this.direction) return
        const mapBoundaries = {
            UP: ({ y }, { height }) => y < height,
            RIGHT: ({ x }, { width }) => x < width,
            DOWN: ({ y }) => y > 0,
            LEFT: ({ x }) => x > 0,
        }
        const wallBoundaries = {
            UP: ({ x, y }, world) => !world.getTile(y + 1, x),
            RIGHT: ({ x, y }, world) => !world.getTile(y, x + 1),
            DOWN: ({ x, y }, world) => !world.getTile(y - 1, x),
            LEFT: ({ x, y }, world) => !world.getTile(y, x - 1),
        }
        const position = this.entity.attributes.position
        const mapBoundary = mapBoundaries[this.direction](position, this.world)
        if (!mapBoundary) return false
        const {x, y} = position
        const wallBoundary = wallBoundaries[this.direction](position, this.world)
        console.log(this.world.getSection(x - 1, y - 1, x + 1, y + 1).map(c => c.toString()).join('\n'))
        console.log(wallBoundary)
        return wallBoundary
    }
}
