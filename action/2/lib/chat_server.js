const socketio = require("socket.io");
let io;
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};
const allRooms = new Set(["Lobby"]);

exports.listen = function (server) {
    "use strict";
    io = socketio(server);
    io.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, "Lobby");
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function () {
            socket.emit("rooms", [...allRooms])
            // socket.emit("rooms",io.socket.manager.rooms)
        });
        handleClientDisconnection(socket, nickNames, namesUsed);
    })
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    "use strict";
    let name = "Guest" + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {success: true, name});
    namesUsed.push(name);
    return guestNumber + 1
}

function joinRoom(socket, room) {
    "use strict";
    socket.join(room); // 进入对应的房间  socket.join 其实webSocket 分割了不同的域?
    // console.log(socket.rooms);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room});
    socket.broadcast.to(room).emit("message", {
        text: `${nickNames[socket.id]} has joined ${room}.`
    });

    io.in(room).clients(function (error, userInRoom) {
        // console.log(userInRoom);
        if (userInRoom.length > 1) {
            let userInroomSummary = `User currently in ${room} : `;
            for (let index of userInRoom) {
                const userSocketId = index;
                if (userSocketId !== socket.id) {
                    if (index > 0) {
                        userInroomSummary += ", ";
                    }
                    userInroomSummary += nickNames[userSocketId];
                }
            }
            userInroomSummary += ".";
            socket.emit("message", {text: userInroomSummary});
        }
        // io.clients(function(error,userInRoom){
        //     console.log(userInRoom);
        //     if (userInRoom.length > 1) {
        //         let userInroomSummary = `User currently in ${room} : `;
        //         for (let index of userInRoom) {
        //             const userSocketId = userInRoom[index].id;
        //             if (userSocketId !== socket.id) {
        //                 if (index > 0) {
        //                     userInroomSummary += ", ";
        //                 }
        //                 userInroomSummary += nickNames[userSocketId];
        //             }
        //         }
        //         userInroomSummary += nickNames[userSocketId];
        //         socket.emit("message", {text: userInroomSummary});
        //     }
        // });

        /*
        const userInRoom = io.sockets.clients(room);

        if (userInRoom.length > 1) {
            let userInroomSummary = `User currently in ${room} : `;
            for (let index of userInRoom) {
                const userSocketId = userInRoom[index].id;
                if (userSocketId !== socket.id) {
                    if (index > 0) {
                        userInroomSummary += ", ";
                    }
                    userInroomSummary += nickNames[userSocketId];
                }
            }
            userInroomSummary += nickNames[userSocketId];
            socket.emit("message", {text: userInroomSummary});
        }
        */
    })
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    "use strict";
    socket.on("nameAttempt", function (name) {
        if (name.includes("Guest")) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest"'
            });
        } else {
            if (namesUsed.includes(name)) {
                socket.emit("nameResult", {
                    success: false,
                    message: "That name is already in use"
                })
            } else {
                const previousName = nickNames[socket.id];
                const previousIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousIndex];
                socket.emit("nameResult", {
                    success: true,
                    name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: `${previousName} is now known as ${name}.`
                })
            }

        }
    })
}

function handleMessageBroadcasting(socket) {
    "use strict";
    socket.on("message", function (message) {
        socket.broadcast.to(message.room).emit("message", {
            text: nickNames[socket.id] + ": " + message.text
        })
    })
}


function handleRoomJoining(socket) {
    "use strict";
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom)
    })
}

function handleClientDisconnection(socket) {
    "use strict";
    socket.on("disconnect", function () {
        const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id]
    })
}