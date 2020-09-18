const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room})=>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //Check for existing User
    const existingUser = users.find((user)=>{
            return user.username === username && user.room === room
    })

    //validate username
    if(existingUser)
    {
        return {
            error: 'Username is in Use!'
        }
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index!==-1)
    {
      return  users.splice(index, 1)[0]
    }

}

const getUser = (id)=>{
   return users.find((user)=>{
        return user.id === id
    })

}

const getUserInRoom = (room)=>{
    room = room.trim().toLowerCase()

    let usersInRoom = []
    usersInRoom  = users.filter((user)=>{
        return user.room === room
    }) 

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}