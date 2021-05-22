let posts = []

function addPost(id, message, userName) {
    const post = {
        message: message,
        username: userName,
        ID: id
    }
    posts.push(post)
    return post
}

function removePost(id) {
    const getID = posts => posts.ID === id
    const index = posts.findIndex(getID)
    if (index !== -1) {
        return posts.splice(index, 1)[0]
    }
    
}

function printPosts() {
    console.log(posts)
}
module.exports ={addPost, removePost, printPosts}