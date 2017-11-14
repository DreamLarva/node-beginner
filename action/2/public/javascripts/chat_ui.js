function divEscapedContentElement(message) {
    "use strict";
    return $('<div></div>').text(message)
}

function divSystemContentElement(message) {
    "use strict";
    return $("<div></div>").html(`<i>${message}</i>>`)
}

function processUserInput(chatApp, socket) {
    "use strict";
    const message = $('#send-message').val();
    let systemMessage;
    if (message.charAt(0) === "/") {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage))
        }
    } else {
        chatApp.sendMessage($("#room").text(), message);
        $("#messages").append(divEscapedContentElement(message));
        $("#message").scrollTop($("messages").prop("scrollHeight"))
    }
    $("#send-message").val("");
}


var socket = io();
$(document).ready(function () {
    "use strict";
    var chatApp = new Chat(socket);
    socket.on('nameResult', function (result) {
        var message;
        if (result.success) {
            message = `You are now known as ${result.name}.`
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message))
    });

    socket.on('joinResult',function(result){
        $("#room").text(result.room);
        $("#messages").append(divSystemContentElement("Room changed."))
    });

    socket.on('message',function(message){
        var newElement = $('<div></div>').text(message.text);
        $("#messages").append(newElement);
    });
    socket.on("rooms",function (rooms) {
        $('#room-list').empty();
        for(let  room of rooms){
            room = room.substring(1,room.length);
            if(room !== ""){
                $("#room-list").append(divEscapedContentElement(room))
            }
        }
        $("#room-list").find("div").click(function(){
            chatApp.processCommand(`/join ${$(this).text()}`);
            $("#send-message").focus()
        })
    });

    setInterval(function(){
        socket.emit('rooms');
    },1000);
    $('#send-message').focus();
    $('#send-form').submit(function(){
        processUserInput(chatApp,socket);
        return false
    })
});
