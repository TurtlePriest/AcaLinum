var express = require("express")
var app = express()
var http = require("http").createServer(app)
var io = require("socket.io")(http)
var mysql = require("mysql")
const {addUser, removeUser} = require('./users')
const {addPost, getPosts} = require('./posts')
const {addComment, getComments} = require('./comments')
const {fetchComments, fecthPosts} = require('./fetcher')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'acalinum'
})
con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log("Connected to database!")
  fecthPosts(con)
  fetchComments(con)
});


app.use("/static", express.static('./static/'));

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

  socket.on("open posts", (data) => {
    
    socket.emit("send post data", {posts: getPosts(), comments: getComments()})

  })


  socket.on("post", (data) => {
    let newPost = addPost(data.id, data.value, data.user)
    console.log(newPost)

      var sql = "INSERT INTO posts (id, message, username) VALUES" +
      "("+ mysql.escape(data.id)  +", " + mysql.escape(data.value) +", "+ mysql.escape(data.user) +")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Post inserted into database");
      });

    
    io.sockets.emit("post", {data : data, id : socket.id})
  })
  socket.on("comment", (data) => {
    let newComment = addComment(data.btnId, data.value, data.user)
    console.log(newComment)

    var sql = "INSERT INTO comments (id, message, username) VALUES" +
      "("+ mysql.escape(data.btnId)  +", " + mysql.escape(data.value) +", "+ mysql.escape(data.user) +")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Comment inserted into database");
      });

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