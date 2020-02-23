var socket = io("http://192.168.0.169:5000");
var username = null;

var username_container = document.getElementById("username_container");
var username_input = document.getElementById("username");
var username_submit = document.getElementById("username_submit");

var chat_container = document.getElementById("chat_container");

var chat_message_input = document.getElementById("chat_message_input");
var chat_message_submit = document.getElementById("chat_message_submit");
var chat_message_mock = document.getElementById("chat_message_mock");
var chat_messages_container = document.getElementById("chat_messages_container");

socket.on("connect", _ => {
    console.log("Connected");
})

socket.on("message", (data) => {
    // Show message only if user has picked username
    if(username){
        show_message(data.message, data.username, false);
        chat_messages_container.scrollTop = chat_messages_container.scrollHeight;
    }
})


function username_not_avaiable(){
    document.getElementById("username_empty").style.display = "none";
    username_input.style.borderColor = "rgb(217, 30, 24)";
    username_input.style.boxShadow = "0 0 0 .2rem rgba(217, 30, 24, 0.4)";
    document.getElementById("username_not_avaiable").style.display = "";
    username_input.focus();
}

function username_empty(){
    document.getElementById("username_not_avaiable").style.display = "none";
    username_input.style.borderColor = "rgb(217, 30, 24)";
    username_input.style.boxShadow = "0 0 0 .2rem rgba(217, 30, 24, 0.4)";
    document.getElementById("username_empty").style.display = "";
    username_input.focus();
}

function hide_username_picker(){
    fade_out(username_container, 60).then(() => {
        fade_in(chat_container, 80).then(() => {
            chat_message_input.focus();
        })
    });
}

function fade_out(element, timeout){
    return new Promise((resolve, reject) => {
        let effect = setInterval(_ => {
            if (!element.style.opacity) {
                element.style.opacity = 1;
            }
            if (element.style.opacity > 0) {
                element.style.opacity -= 0.1;
            } else {
                element.style.display = "none";
                clearInterval(effect);
                resolve();
            }
        }, timeout);
    })
}

function fade_in(element, timeout){
    element.style.display = "";
    return new Promise((resolve, reject) => {
        let effect = setInterval(_ => {
            if (parseFloat(element.style.opacity) < 1) {
                element.style.opacity = parseFloat(element.style.opacity) + 0.1;
            } else {
                resolve();
                clearInterval(effect);
            }
        }, timeout);
    })
}

function check_username(_username){
    if(!_username){
        username_empty();
    } else {
        socket.emit('is_username_avaiable', _username, (data) => {
            if (data === false){
                username_not_avaiable();
            }else{
                username = _username;
                hide_username_picker();
            }
        });  
    }
}

function show_message(_message, _username, user){
    let message_mock = chat_message_mock.cloneNode(true);
    let chat_username = message_mock.querySelector(".chat_username");
    let chat_message = message_mock.querySelector(".chat_user_message");
    chat_username.innerHTML = _username;
    chat_message.innerHTML = _message;
    message_mock.style.display = "";
    if (user){
        message_mock.classList.add("justify-content-end");
    }
    chat_messages_container.appendChild(message_mock);
    chat_messages_container.scrollTop = chat_messages_container.scrollHeight;
    chat_message_input.focus();
}

function broadcast_message(_message){
    socket.emit('message', _message);
}

function check_message(_message){
    if(_message){
        broadcast_message(_message, username);
        show_message(_message, username, true);
        chat_message_input.value = "";
    }
}

username_input.addEventListener("keyup", function(event){
    // keyCode 13 is Enter
    if (event.keyCode == 13){
        check_username(username_input.value);
    }
});

username_submit.addEventListener("click", _ => {
    check_username(username_input.value);
});

chat_message_input.addEventListener("keyup", _ => {
    if (event.keyCode == 13){
        check_message(chat_message_input.value);
    }
});

chat_message_submit.addEventListener("click", _ => {
        check_message(chat_message_input.value);
});