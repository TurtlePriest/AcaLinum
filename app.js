var app = require("express")()
var http = require("http").createServer(app)
var io = require("socket.io")(http)
var mysql = require("mysql")
const {addUser, removeUser} = require('./users')
const {addPost, removePost} = require('./posts')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
})
con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})
app.get("/chat", function (req, res) {
  res.sendFile(__dirname + "/chat.html")
})
app.get("/post", function (req, res) {
  res.sendFile(__dirname + "/post.html")
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


  socket.on("post", (data) => {
    let newPost = addPost(data.value, data.user, data.id)
    console.log(newPost)
    io.sockets.emit("post", {data : data, id : socket.id})
  })
  socket.on("comment", (data) => {
    io.sockets.emit("comment", {data : data, id : socket.id})
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