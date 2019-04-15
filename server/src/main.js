import http from 'http'
import socketIO from 'socket.io'
import express from 'express'
import expressSession from 'express-session'
import sharedSession from 'express-socket.io-session'
import World from './classes/world'
import Player from './classes/entities/player'

const PORT = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketIO(server)

const world = new World(30, 30)

const api = express.Router()

function newPlayer() {
    const player = new Player()
    world.entities.push(player)
    return player
}


const session = expressSession({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true,
})

app.use(session)
io.use(sharedSession(session, {
    autoSave: true,
}))


app.use(express.json())
app.use('/api', api)

api.get('/world', (req, res) => {
    console.log(req.session.cookie)
    req.session.test = 333
    req.session.save()
    res.send(world)
})

api.post('/join', (req, res) => {
    const player = newPlayer()
    req.session.cookie.player = player.id
    req.session.save()
    console.log(req.session.cookie)
    res.send(player)

})

io.on('connection', socket => {
    socket.on('move', data => {
        console.log(socket.handshake.session.cookie)
        // world.entities[0] =
    })
    socket.on('connect', data => {
        // console.log('connect from', data)
    })
    socket.on('disconnect', () => {

    })
});
server.listen(PORT)

console.log(`listening to ${PORT}`)
