const app = require('express')()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
require('dotenv').config()
app.use(cors())

app.get('/', (reg, res) => {
    res.json({message: 'Welcome to my simple chat app'})
})

const server = http.createServer(app)

// const url = "https://chat-simple.netlify.app"
const url = "http://localhost:5173"

const io = new Server(server, {
    cors: {
        origin: url,
        methods: ['GET', 'POST']
    }
})

const onlineUsers = []

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id} `);
    // console.log('socket obj: ', socket.handshake.time);
    
    socket.on('user_started_chat', (data) => {
        onlineUsers.push(data)
        io.emit('updated_online_users', onlineUsers )
    })
    
    socket.on("send_message", (data) => {
        console.log('data arrived, to be emitted: ', data);
        io.emit('receive_message', data)
    })
    socket.on('disconnect', (data) => {
        console.log(`User ${socket.id} disconnected`);
        console.log('disconnected user: ', data);
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
