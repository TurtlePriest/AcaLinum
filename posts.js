let posts = []

function addPost(message, userName, id) {
    const post = {
        message: message,
        username: userName,
        ID: id
    }
    posts.push(post)
    return post
}

function removePost(id) {
    const getID = posts => posts.postID === id
    const index = posts.findIndex(getID)
    if (index !== -1) {
        return posts.splice(index, 1)[0]
    }
    
}
module.exports ={addPost, removePost}