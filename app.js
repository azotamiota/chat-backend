const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://the-millionaires-chat.netlify.app/",
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    })
    socket.on("send_message", (data) => {
        console.log('data arrived, to be emitted: ', data);
        io.emit('receive_message', data)
    })
})

server.listen(3000, () => {
    console.log('Server is listenint on port 3000');
})
