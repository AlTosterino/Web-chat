var socket = io("http://localhost:5000");
var username = null;

var username_container = document.getElementById("username_container");
var username_input = document.getElementById("username");
var username_submit = document.getElementById("username_submit");
var chat_container = document.getElementById("chat_container");

socket.on('connect', _ => {
    console.log("Connected");
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
            return;
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

function show_chat(){
    
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
                show_chat();
            }
        });  
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