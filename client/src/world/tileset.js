async function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export default async function(options) {
    if (!options.tiles) throw new Error('Tiles have to be defined')
    if (!options.file) throw new Error('Texture is required for Tileset')
    const texture = await loadImage(options.file)
    return {
        offX: 0,
        offY: 0,
        tiles: [],
        ...options,
        texture,
    }
}
