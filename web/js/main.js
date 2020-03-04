var socket = io("http://localhost:5000");
var username = null;

var username_container = document.getElementById("username_container");
var username_input = document.getElementById("username");
var username_submit = document.getElementById("username_submit");

var current_user = document.getElementById("current_user");
var users = document.getElementById("user_list");
var new_user_mock = document.getElementById("new_user_mock");

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

socket.on("user_connect", (data) => {
    console.log("CONNECT")
    if(data.user){
        add_user_to_user_list(data.user);
    }
});

socket.on("user_disconnect", (data) => {
    console.log("DISCONNECT")
    if(data.user){
        document.querySelectorAll(`[data-username='${data.user}']`).forEach((element) => {
            element.remove();
        })
    }
});

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

function add_user_to_user_list(_user){
    console.log('dzialam')
    let user_mock = new_user_mock.cloneNode(true);
    user_mock.dataset.username = _user;
    user_mock.innerHTML = _user
    user_mock.style.display = "";
    users.appendChild(user_mock);
}

function fetch_users(){
    socket.emit('usernames', (data) => {
        if(data){
            data.forEach(add_user_to_user_list)
        }
    });
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
                current_user.innerHTML = `${_username} <span class="text-success">(You)</span>`
                fetch_users();
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

function clear_chat_message_input(){
    chat_message_input.value = "";
    document.getElementsByClassName("emojionearea-editor")[0].innerHTML = "<div><br></div><div><br></div>";
}

function check_message(_message){
    if(_message){
        broadcast_message(_message, username);
        show_message(_message, username, true);
        clear_chat_message_input();
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

chat_message_submit.addEventListener("click", _ => {
        check_message(chat_message_input.value);
});