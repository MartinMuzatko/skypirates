<template>
    <div id="app">
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
        const { canvas } = this.$refs
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        const c = canvas.getContext('2d')
        c.imageSmoothingEnabled = false

        this.map = map({
            canvas: c,
            tilesets: {
                wall: await tileset({
                    offX: 0,
                    offY: 3,
                    file: require('./assets/Wall.png'),
                    tiles: [[1,1],[1,1],[2,2],[2,2],[0,2],[0,2],[1,0],[4,2],[0,1],[0,1],[2,0],[5,1],[0,0],[3,1],[4,0],[4,1]]
                }),
                floor: await tileset({
                    offX: 0,
                    offY: 3,
                    file: require('./assets/Floor.png'),
                    tiles: [[1,1],[1,0],[0,1],[0,0],[2,1],[2,0],[3,1],[3,0],[1,2],[5,1],[0,2],[4,1],[2,2],[6,1],[3,2],[4,1]]
                })
            },
            scale: 4,
            tileWidth: 16,
        })

        this.map.generate(40,40)

        const animate = () => {
            requestAnimationFrame(animate);
            this.map.drawTiles(this.cx, this.cy)
        }

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
    }
</style>
