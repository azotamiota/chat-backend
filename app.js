const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
require('dotenv').config()
app.use(cors())

app.get('/', (reg, res) => {
    res.json({message: 'Welcome to millionare chat app'})
})

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://chat-simple.netlify.app",
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

const port = process.env.PORT || 3000
console.log(port)
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
