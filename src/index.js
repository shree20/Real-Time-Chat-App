const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage } = require('./utils/messages.js')

const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users.js')

const app = express()
const server = http.createServer(app) 
const io = socketio(server)

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')


io.on('connection', (socket)=>{
    console.log('New WebSocket connection')

     
    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUser({id: socket.id, username, room}) 

        if (error) {
         return  callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))  

        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)  
        })
        callback()

        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit,  socket.broadcast.to.emit

    })


    socket.on('sendMessage', (message, callback)=>{

        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', ({latitude, longitude}, callback)=>{
            const user = getUser(socket.id)

            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
            callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            socket.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })

})

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))



server.listen(port,()=>{
    console.log(`Server is up and running on ${port}`)
})