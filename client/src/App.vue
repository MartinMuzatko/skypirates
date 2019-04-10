<template>
    <div id="app">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>

export default {
    name: 'app',
    mounted() {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        const { canvas } = this.$refs
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        const c = canvas.getContext('2d')
        c.imageSmoothingEnabled = false
        //context.strokeRect(10, 10, 160, 100)


        const TILE_WIDTH = 16
        const SCALE = 4;


        var floorTileset = {
            offX: 0,
            offY: 3,
            texture: wallTex,
            tiles: [[1,1],[1,0],[0,1],[0,0],[2,1],[2,0],[3,1],[3,0],[1,2],[5,1],[0,2],[4,1],[2,2],[6,1],[3,2],[4,1]]
        }
        var wallTileset = {
            offX: 0,
            offY: 3,
            texture: wallTex,
            tiles: [[1,1],[1,1],[2,2],[2,2],[0,2],[0,2],[1,0],[4,2],[0,1],[0,1],[2,0],[5,1],[0,0],[3,1],[4,0],[4,1]]
        }
        var map = {
            width: 8,
            height: 8,
            tiles: [[]],
            generate (w,h) {
                this.width = w
                this.height = h

                for (var x = 0; x < w;x++) {
                    var nc = []
                    for (var y = 0; y < h;y++) {                
                        if (Math.random() < 0.5) {
                            nc.push(3)
                        } else {
                            nc.push(1)
                        }
                        
                    }
                    this.tiles.push(nc)
                }
            },

            getTile (x,y) {
                x = Math.min(Math.max(x,0),this.width-1)
                y = Math.min(Math.max(y,0),this.height-1)

                return this.tiles[x][y]
            },
            bitmask4 (x,y,type,equalSearch) {
                var value = 0
                if (equalSearch) {
                    if (this.getTile(x,y-1)==type) {value += 1}
                    if (this.getTile(x-1,y)==type) {value += 2}
                    if (this.getTile(x+1,y)==type) {value += 4}
                    if (this.getTile(x,y+1)==type) {value += 8}
                } else {
                    if (this.getTile(x,y-1)!=type) {value += 1}
                    if (this.getTile(x-1,y)!=type) {value += 2}
                    if (this.getTile(x+1,y)!=type) {value += 4}
                    if (this.getTile(x,y+1)!=type) {value += 8}
                }
                return value
            },
            bitmask8 (x,y,type,equalSearch) {
                var value = bitmask4(x,y,type,equalSearch)
                if (equalSearch) {
                    if (getTile(x-1,y-1)==type) {value += 16}
                    if (getTile(x+1,y-1)==type) {value += 32}
                    if (getTile(x-1,y+1)==type) {value += 64}
                    if (getTile(x+1,y+1)==type) {value += 128}
                } else {
                    if (getTile(x-1,y-1)!=type) {value += 16}
                    if (getTile(x+1,y-1)!=type) {value += 32}
                    if (getTile(x-1,y+1)!=type) {value += 64}
                    if (getTile(x+1,y+1)!=type) {value += 128}
                }
                return value
            },
            drawTile (x,y,cx,cy) {
                var img
                var source = [1,4]
                var sourceOff = [0,0]
                switch (this.getTile(x,y)) {
                    case 3:
                        img = floorTex
                        source = floorTileset.tiles[this.bitmask4(x,y,1,true)] 
                        sourceOff[0] = floorTileset.offX
                        sourceOff[1] = floorTileset.offY
                        break;
                    default:
                        img = wallTex
                        source = wallTileset.tiles[this.bitmask4(x,y,1,true)] 
                        sourceOff[0] = wallTileset.offX
                        sourceOff[1] = wallTileset.offY
                        break;
                }
                //c = document.getElementById('canvas').getContext('2d')
                c.drawImage(img,(source[0]+sourceOff[0])*TILE_WIDTH,(source[1]+sourceOff[1])*TILE_WIDTH,TILE_WIDTH,TILE_WIDTH,(x*TILE_WIDTH-cx)*SCALE,(y*TILE_WIDTH-cy)*SCALE,TILE_WIDTH*SCALE,TILE_WIDTH*SCALE)
            },
            drawTiles (cx, cy) {
                for (var x = 0; x < this.width;x++) {
                    for (var y = 0; y < this.height;y++) {
                        this.drawTile(x,y,cx,cy)
                    }
                }  
            }
        }

        var lc = 2
        map.generate(40,40)
        var cx = 0
        var cy = 0


        var floorTex = new Image()
        floorTex.src = 'Floor.png'
        floorTex.addEventListener('load',assetLoaded())
        var wallTex = new Image()
        wallTex.src = 'Wall.png'
        wallTex.addEventListener('load', assetLoaded())


        function assetLoaded () {
            lc--
        }

        function animate() {
            requestAnimationFrame(animate);
            if (lc == 0) {
                map.drawTiles(cx,cy)
            }
        }

        document.addEventListener('keydown', function(event) {
            if(event.keyCode == 37) {
                cx--
            }
            if(event.keyCode == 39) {
                cx++
            }
            if(event.keyCode == 38) {
                cy--
            }
            if(event.keyCode == 40) {
                cy++
            }
        });

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
