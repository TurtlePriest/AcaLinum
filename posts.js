let posts = []

function addPost(postId, userName) {
    const post = {
        postID: postId,
        username: userName,
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