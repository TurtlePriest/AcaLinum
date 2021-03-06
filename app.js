var express = require("express")
var app = express()
var http = require("http").createServer(app)
var io = require("socket.io")(http)
var mysql = require("mysql")
const {addUser, removeUser} = require('./Scripts/users')
const {addPost, getPosts} = require('./Scripts/posts')
const {addComment, getComments} = require('./Scripts/comments')
const {fetchComments, fecthPosts} = require('./Scripts/fetcher')

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
  res.sendFile(__dirname + "/Html/index.html")
})
app.get("/chat", function (req, res) {
  res.sendFile(__dirname + "/Html/chat.html")
})
app.get("/post", function (req, res) {
  res.sendFile(__dirname + "/Html/post.html")
})


let thisRoom = ""
io.on("connection", function (socket) {
  console.log("new socket connected: " + socket.id);

  socket.on("join room", (data) => {
    console.log("in room")
    let newUser = addUser(socket.id, data.username, data.roomName)
    
    socket.emit("send data", {id : socket.id, username : newUser.username, roomname : newUser.roomname})

    thisRoom = newUser.roomname
    console.log(newUser)
    socket.join(newUser.roomname)
  })

  socket.on("chat message", (data) => {
    io.to(data.roomName).emit("chat message", {data : data, id : socket.id})
    console.log(thisRoom)
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