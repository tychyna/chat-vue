var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(express.static("public"));

server.listen("3000", function () {
    console.log("Server is working!");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
    console.log("New User has connected");

    socket.on("newMessage", function (userName, messageText, room) {
        console.log("There are new message: " + messageText);
        socket.to(room).emit("clientMessage", {
            "user": userName,
            "message": messageText,
            "type": "message"
        });
    });

    socket.on("joinRoom", function (roomName, userName) {

        socket.join(roomName);

        io.sockets.emit("clientMessage", {
            "clientsCount": socket.conn.server.clientsCount,
            "type": "online"
        });

        socket.to(roomName).emit("clientMessage", {
            "user": "Info",
            "message": userName + " join to room.",
            "type": "message"
        });
    });

    socket.on("leaveRoom", function (room, userName, roomName) {
        socket.to(room).emit("clientMessage", {
            "user": "Info",
            "message": userName + " leave to room: " + roomName,
            "type": "message"
        });
        socket.leave(room);
    });

    socket.on("disconnect", function () {
        io.sockets.emit("clientMessage", {
            "clientsCount": socket.conn.server.clientsCount,
            "type": "online"
        });
    });
})