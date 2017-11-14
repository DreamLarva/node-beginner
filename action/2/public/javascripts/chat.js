class Chat{
    constructor(socket){
        this.socket = socket
    }
    sendMessage(room,text){
        this.socket.emit("message",{room,text})
    }
    changeRoom(room){
        this.socket.emit("join",{
            newRoom:room
        })
    }
    processCommand(command){
        let words = command.split(" ");
        let command = words[0]
            .substring(1,words[0].length)
            .toLowerCase();
        let message = false;
        switch(command){
            case "join":
                words.shift();
                var room = words.join(" ");
                this.changeRoom(room);
                break;
            case 'nick':
                words.shift();
                var name = words.join(" ");
                this.socket.emit("nameAttempt",name);
                break;
            default:
                message = 'Unrecongnized command.';
                break;
        }
        return message;
    }
}