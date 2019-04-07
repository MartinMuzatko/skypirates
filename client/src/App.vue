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
        const context = canvas.getContext('2d')
        context.strokeRect(10, 10, 160, 100)
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
