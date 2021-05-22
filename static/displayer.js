// import { getPosts } from '../posts.js'
// import { getComments } from '../comments.js'
const {getPosts} = require('../posts')
const {getComments} = require('../comments')

posts = getPosts()
comments = getComments()

function displayDbPosts() {
    
    for (let i = 0; i < posts.length; i++) {
        let authorClass = "post"
        const div = document.createElement("div")
        div.className = "postDiv";
        div.id = "post-" + posts[i].id
        const li = document.createElement("li")
        div.innerHTML =
          '<p class="' +
          authorClass +
          '" style= "font-weight:bold; font-size:18px">' +
          posts[i].username +
          "</p>" +
          '<p class="message"> ' +
          posts[i].message +
          "</p>" + 
          "<hr style= 'border: 1.5px solid black'>" +
          "<ul id='comments"+i+"'></ul>" +
            "<input type='text' id='postComment-"+ i +"' class='commentText' />" + 
            "<input type='button' id='commentButton-"+ i +"' value='submit' />";
        li.appendChild(div)
  
        document.getElementById("posts").appendChild(li)
        
    }
    
      window.scrollTo(0, document.body.scrollHeight)
}

function displayDbComments() {
    for (let i = 0; i < comments.length; i++) {
        let authorClass = "me"
        const div = document.createElement("div")
        div.innerHTML =
            '<p class="' +
            authorClass +
            '" style= "font-weight:bold; font-size:16px">' +
            comments.username +
            "</p>" +
            '<p class="message"> ' +
            comments.message +
            "</p>";

        document.getElementById("comments" + comments.id).appendChild(div)

    }
    window.scrollTo(0, document.body.scrollHeight)
    
}