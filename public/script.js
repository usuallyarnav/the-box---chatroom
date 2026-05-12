const socket = io() // connecting to server wia websockets if fails falls to HTTP long polling

let username = prompt("Enter your name")

// Checks for the username
if (!username || username.trim() === "") {
    username = "Anonymous"
}

username = username.trim().slice(0, 20)
//reduces username
socket.emit("join", username)
//this part announces the joining of someone using socket.io
const chat = document.getElementById("chat")
// finds the corresponding html element
const input = document.getElementById("messageInput")
const typingDiv = document.getElementById("typing")

function time() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
}  // same as previous commit

//messaging
function addMessage(data) {

    const div = document.createElement("div")
// creates a division in memory not visible on screen yet
    if (data.type === "system") {
        div.className = "system"
        div.textContent = data.text

    } else {

        div.className = "bubble"

        if (data.user === username) {
            div.classList.add("userBubble")
        } else {
            div.classList.add("otherBubble")
        }

        // Username
        const user = document.createElement("b")
        user.textContent = data.user // using textcontent instead of inner html as we dont know what the user might type
// this prevents xss attacks or what I was reffering to as "attacks on the message prompt in the earlier convo" 
        // Line break
        const br = document.createElement("br")

        // Message text
        const text = document.createTextNode(data.text)

        // Timestamp
        const timestamp = document.createElement("span")
        timestamp.className = "timestamp"
        timestamp.textContent = time()

        div.appendChild(user)
        div.appendChild(br)
        div.appendChild(text)
        div.appendChild(timestamp)
    }

    chat.appendChild(div)
    chat.scrollTop = chat.scrollHeight
}

function sendMessage() {

    let message = input.value.trim()

    // Prevent empty messages
    if (message === "") return

    // Limit message length
    if (message.length > 500) {
        alert("Message too long (max 500 characters)")
        return
    }

    // Send ONLY message text
    // Server should attach username
    socket.emit("chat message", {
        text: message
    })

    input.value = ""
}

// Receive messages
socket.on("chat message", (data) => {
    addMessage(data)
})

// System messages 
socket.on("system message", (msg) => {

    addMessage({
        type: "system",
        text: msg
    })
})

// Typing indicator with debounce
let typingTimeout

input.addEventListener("input", () => {

    clearTimeout(typingTimeout)

    socket.emit("typing")

    typingTimeout = setTimeout(() => {
        socket.emit("stop typing")
    }, 800)

})

// Show typing 
socket.on("typing", (name) => {
// like to see that I myself is typing is useless
    if (name !== username) {
        typingDiv.innerText = `${name} is typing........`
    }age({ //treat system messages differently by setting the type to "system"
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

})

// Hide typing
socket.on("stop typing", () => {
    typingDiv.innerText = ""
})
