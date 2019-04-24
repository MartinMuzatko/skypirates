import server from './server'
import World from './classes/world'
import Player from './classes/entities/player'
import EntityEvent from './classes/entityEvent'

const {io, api} = server()

api.get('/world', (req, res) => {
    console.log(req.session.player)
    res.send(world)
})

api.post('/join', (req, res) => {
    if (req.session.player) return res.status(412).end()
    const player = newPlayer()
    req.session.player = player.id
    req.session.save()
    console.log(req.session)
    res.send(player)
})

io.on('connection', socket => {
    socket.on('move', direction => {
        movePlayer(socket.handshake.session.player, direction)
    })
    socket.on('connect', data => {
        // console.log('connect from', data)
    })
    socket.on('disconnect', () => { })
})


const world = new World(10, 10)

console.log(world.tiles)

const x = newPlayer()
setInterval(() => {
    movePlayer(x.id, ['UP', 'RIGHT'][Math.random() * 2 | 0])
}, 100)

function newPlayer() {
    const player = new Player({
        attributes: {
            position: { x: (Math.random() * world.width) | 0, y: (Math.random() * world.height) | 0 },
        },
    })
    world.entities.push(player)
    return player
}

function movePlayer(id, direction) {
    const player = world.getEntity(id)
    if (!player) return
    player.tick(() => player.triggers.move(new EntityEvent(world, id, {direction})))
}
