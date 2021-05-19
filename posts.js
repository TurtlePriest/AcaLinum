let posts = []

function addPost(postId, userName, message) {
    const post = {
        postID: postId,
        username: userName,
        text: message
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