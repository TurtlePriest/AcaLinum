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

module.exports ={addComment, printComments}