export default (options) => ({
    canvas: null,
    tilecanvas: null,
    tilesets: {
        wall: null,
        floor: null,
    },
    tileWidth: 16,
    scale: 4,
    width: 8,
    height: 8,
    tiles: [[]],
    x: 10,
    generate(w, h) {
        this.width = w
        this.height = h
        this.tiles = this.mapTiles(() => Math.random() < .5 ? 3 : 1)
    },
    mapTiles(mapFunction) {
        return Array.from(Array(this.width)).map((value, x) =>
            Array.from(Array(this.height)).map((value, y) =>
                mapFunction(x, y)
            )
        )
    },
    getTile(x, y) {
        x = Math.min(Math.max(x, 0), this.width - 1)
        y = Math.min(Math.max(y, 0), this.height - 1)

        return this.tiles[x][y]
    },
    bitmask4(x, y, type, equalSearch) {
        var value = 0
        if (equalSearch) {
            if (this.getTile(x, y - 1) == type) { value += 1 }
            if (this.getTile(x - 1, y) == type) { value += 2 }
            if (this.getTile(x + 1, y) == type) { value += 4 }
            if (this.getTile(x, y + 1) == type) { value += 8 }
        } else {
            if (this.getTile(x, y - 1) != type) { value += 1 }
            if (this.getTile(x - 1, y) != type) { value += 2 }
            if (this.getTile(x + 1, y) != type) { value += 4 }
            if (this.getTile(x, y + 1) != type) { value += 8 }
        }
        return value
    },
    bitmask8(x, y, type, equalSearch) {
        var value = bitmask4(x, y, type, equalSearch)
        if (equalSearch) {
            if (getTile(x - 1, y - 1) == type) { value += 16 }
            if (getTile(x + 1, y - 1) == type) { value += 32 }
            if (getTile(x - 1, y + 1) == type) { value += 64 }
            if (getTile(x + 1, y + 1) == type) { value += 128 }
        } else {
            if (getTile(x - 1, y - 1) != type) { value += 16 }
            if (getTile(x + 1, y - 1) != type) { value += 32 }
            if (getTile(x - 1, y + 1) != type) { value += 64 }
            if (getTile(x + 1, y + 1) != type) { value += 128 }
        }
        return value
    },
    getBitmaskedTile(tileset, x, y) {
        return {
            ...tileset,
            source: tileset.tiles[this.bitmask4(x, y, 1, true)]
        }
    },
    drawTile(x, y, cx, cy) {
        //const source = [1, 4]
        const tilemaps = {
            '3': () => this.getBitmaskedTile(this.tilesets.floor, x, y),
            'default': () => this.getBitmaskedTile(this.tilesets.wall, x, y),
        }
        const tile = this.getTile(x, y)
        const { offX, offY, texture, source } = tilemaps[tile] && tilemaps[tile]() || tilemaps.default()
        this.tilecanvas.drawImage(
            texture,
            (source[0] + offX) * this.tileWidth,
            (source[1] + offY) * this.tileWidth,
            this.tileWidth,
            this.tileWidth,
            (x * this.tileWidth),
            (y * this.tileWidth),
            this.tileWidth,
            this.tileWidth
        )
    },
    drawTiles() {
        this.mapTiles((x, y) => this.drawTile(x, y))
    },
    drawTilemap(cx, cy) {
        this.canvas.drawImage(
            this.tilecanvas.canvas,
            cx,
            cy,
            window.innerWidth/this.scale,
            window.innerHeight/this.scale,
            0,
            0,
            window.innerWidth,
            window.innerHeight
        )
    },
    ...options,
})
