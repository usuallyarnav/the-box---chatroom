const socket = io() //connect to server

let username = prompt("Enter your name")

socket.emit("join", username) // sending event to server that a user has joined

const chat = document.getElementById("chat")
const input = document.getElementById("messageInput")
const typingDiv = document.getElementById("typing")


function time(){

return new Date().toLocaleTimeString([],{  // creates cuttent time object and formats it to a string with hours and minutes
hour:"2-digit",
minute:"2-digit"
})

}

function addMessage(data){ //creates and displays messages in the chat UI

const div = document.createElement("div")

if(data.type==="system"){  //Checks if the message is a system message

div.className="system"
div.innerText=data.text

}else{

div.className="bubble"

if(data.user===username){
div.classList.add("userBubble")
}else{
div.classList.add("otherBubble")
}

div.innerHTML=`<b>${data.user}</b><br>${data.text}
<span class="timestamp">${time()}</span>`
}

chat.appendChild(div) // adds the message div to the chat container
chat.scrollTop=chat.scrollHeight // auto scroll 

}

function sendMessage(){

const message=input.value // get the message from the input field

if(message==="") return // prevent sending empty messages

socket.emit("chat message",{
user:username,
text:message
})

input.value=""

}

socket.on("chat message",(data)=>{ //sender receives chat message event from server and displays it in the chat UI
addMessage(data)
})

socket.on("system message",(msg)=>{ //system messages

addMessage({ //treat system messages differently by setting the type to "system"
type:"system",
text:msg
})
})

input.addEventListener("input",()=>{ //shows typing indicator 
socket.emit("typing",username)
})

socket.on("typing",(name)=>{
typingDiv.innerText=`${name} is typing...`
})

socket.on("stop typing",()=>{
typingDiv.innerText=""
})

input.addEventListener("keyup",()=>{ //stops typing indicator after user stops typing for 800ms
setTimeout(()=>{
socket.emit("stop typing")
},800)
})
