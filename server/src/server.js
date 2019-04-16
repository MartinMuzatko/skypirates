import http from 'http'
import socketIO from 'socket.io'
import express from 'express'
import expressSession from 'express-session'
import sharedSession from 'express-socket.io-session'

const COOKIE_SECRET = 'asojduia9sh7847'

export default function (settings = {}) {
    settings = {
        port: process.env.PORT || 3000,
        ...settings,
        session: {
            secret: COOKIE_SECRET,
            resave: true,
            saveUninitialized: true,
            ...settings.session || {},
        },
    }

    const app = express()
    const server = http.createServer(app)
    const io = socketIO(server)
    const session = expressSession(settings.session)

    app.use(session)
    app.use(express.json())

    io.use(
        sharedSession(session, {
            autoSave: true,
        })
        )

    const api = express.Router()
    app.use('/api', api)

    server.listen(settings.port)
    console.log(`listening to ${settings.port}`)

    return {
        io,
        api,
    }

}


