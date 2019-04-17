<template>
    <div id="app">
        <canvas ref="tilecanvas" style="display:none"></canvas>
        <canvas ref="canvas"></canvas>
        <GlobalEvents
            @keydown.up="move('up')"
            @keydown.down="move('down')"
            @keydown.right="move('right')"
            @keydown.left="move('left')"
        />
    </div>
</template>

<script>
import GlobalEvents from 'vue-global-events'
import map from './world/map'
import tileset from './world/tileset'
import Entity  from '../../server/src/classes/entity'
import EntityPlayer from '../../server/src/classes/entities/player'

export default {
    name: 'app',
    components: { GlobalEvents },
    data: () => ({
        cx: 0,
        cy: 0,
        map: null,
    }),
    methods: {
        move(direction) {
            const moves = {
                up: (state) => state.cy -= 1,
                down: (state) => state.cy += 1,
                left: (state) => state.cx -= 1,
                right: (state) => state.cx += 1,
            }
            moves[direction](this)
        }
    },
    async mounted() {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        const { tilecanvas, canvas } = this.$refs
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        const c = canvas.getContext('2d')
        c.imageSmoothingEnabled = false
        
        tilecanvas.width = 16 * 40
        tilecanvas.height = 16 * 40
        const tc = tilecanvas.getContext('2d')
        tc.imageSmoothingEnabled = false

        this.map = map({
            canvas: c,
            tilecanvas: tc,
            tilesets: [
                await tileset({
                    offX: 0,
                    offY: 3,
                    file: require('./assets/tiles/Wall.png'),
                    tiles: [[1,1],[1,1],[2,2],[2,2],[0,2],[0,2],[1,0],[4,2],[0,1],[0,1],[2,0],[5,1],[0,0],[3,1],[4,0],[4,1]],
                    bitmaskEqual: true,
                }),
                await tileset({
                    offX: 0,
                    offY: 3,
                    file: require('./assets/tiles/Floor.png'),
                    tiles: [[1,1],[1,0],[0,1],[0,0],[2,1],[2,0],[3,1],[3,0],[1,2],[5,1],[0,2],[4,1],[2,2],[6,1],[3,2],[4,1]],
                    bitmaskEqual: false,
                })
            ],
            entityTilesets: [
                await tileset({
                    offX: 0,
                    offY: 0,
                    file: require('./assets/mobs/GoblinDude.png'),
                    tiles: [[0,0],[1,0]],
                }),
            ],
            scale: 4,
            tileWidth: 16,
        })

        try {
            await this.$api.join()
            const { tiles, entities } = await this.$api.getWorld()
            this.map.tiles = tiles
        } catch(error) {
            // no server connection, generating our own world
            this.map.generate(30, 30)
        }
        
        // Get entities here
        this.map.entities = [new EntityPlayer () ]
        this.map.entities[0].attributes.position = {x: 6, y: 4}
        this.map.drawTiles()
                
        const animate = () => {
            requestAnimationFrame(animate);
            this.map.drawTilemap(this.cx, this.cy)
            this.map.drawEntities(this.cx,this.cy)
        }
        const animateFrames = () => {
            if (this.map.frame == 0) {
                this.map.frame = 1
            } else {
                this.map.frame = 0
            }
        }
        
        setInterval(animateFrames, 500);
        animate()
    }
}
</script>

<style>
    html, body {
        height: 100%;
        margin: 0;
    }

    canvas {
        display: block;
        position: absolute;
        top: 0;
        left: 0
    }
</style>
