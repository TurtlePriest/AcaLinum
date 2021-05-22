let comments = []

function addComment(id, message, userName) {
    const comment = {
        message: message,
        username: userName,
        ID: id
    }
    comments.push(comment)
    return comment
}

function printComments() {
    console.log(comments)
}

function getComments() {
    return comments
}


module.exports ={addComment, printComments, getComments}