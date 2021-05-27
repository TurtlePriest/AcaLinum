const {addPost, printPosts} = require('./posts')
const {addComment, printComments} = require('./comments')

function fecthPosts(con) {
    con.query("SELECT * FROM posts", function (err, result, fields) {
        if (err) throw err;
        var json = JSON.parse(JSON.stringify(result))

        for (let index = 0; index < json.length; index++) {
            addPost(json[index].id, json[index].message, json[index].username)
            
        }
        printPosts()

      })
}

function fetchComments(con) {
    con.query("SELECT * FROM comments", function (err, result, fields) {
        if (err) throw err;
        var json = JSON.parse(JSON.stringify(result))

        for (let index = 0; index < json.length; index++) {
            addComment(json[index].id, json[index].message, json[index].username)
            
        }
        printComments()

      })
    
}

module.exports ={fecthPosts, fetchComments}