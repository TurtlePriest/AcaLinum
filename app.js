var app = require("express")()
var http = require("http").createServer(app)
var io = require("socket.io")(http)
const {addUser, removeUser} = require('./users')

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
  
})
app.get("/chat", function (req, res) {
  res.sendFile(__dirname + "/chat.html")
})


let thisRoom = ""
io.on("connection", function (socket) {
  console.log("connected")

  socket.on("join room", (data) => {
    console.log("in room")
    let newUser = addUser(socket.id, data.username, data.roomName)
    
    socket.emit("send data", {id : socket.id, username : newUser.userName, roomname : newUser.roomName})

    thisRoom = newUser.roomName
    console.log(newUser)
    socket.join(newUser.roomName)
  })

  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", {data : data, id : socket.id})
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    console.log(user)
    if(user) {
      console.log(user.username + ' has left')
    }
    console.log("disconnected")

  });
})

http.listen(3000)