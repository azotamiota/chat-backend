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

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log('data arrived, to be emitted: ', data);
        io.emit('receive_message', data)
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    })

    socket.on('user_started_chat', (data) => {
        io.emit('user_joined_chat', data)
        console.log('data in io.on, userStarted chat and then emitted: ', data)
    })

    socket.on('refresh_users', (data) => {
        io.emit('update_users_list', data)
        console.log('data in io.on, userStarted chat and then emitted: ', data)
    })

    socket.on('all_users_online', (data) => {
        io.emit('updated_user_list', data)
        console.log('updated_user_list: ', data)
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
