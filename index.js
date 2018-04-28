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

    socket.on("newMessage", function (userName, messageText, room) {

        socket.to(room).emit("clientMessage", {
            user: userName,
            message: messageText,
            type: "message",
            clientMessage: true
        });
    });

    socket.on("joinRoom", function (roomName, userName) {

        socket.join(roomName);

        io.sockets.emit("clientMessage", {
            clientsCount: socket.conn.server.clientsCount,
            type: "online"
        });

        socket.to(roomName).emit("clientMessage", {
            user: "Info",
            message: userName + " join to room.",
            type: "message",
            infoMessage: true
        });
    });

    socket.on("leaveRoom", function (room, userName, roomName) {
        socket.to(room).emit("clientMessage", {
            user: "Info",
            message: userName + " leave to room: " + roomName,
            type: "message",
            infoMessage: true
        });
        socket.leave(room);
    });

    socket.on("disconnect", function () {
        io.sockets.emit("clientMessage", {
            clientsCount: socket.conn.server.clientsCount,
            type: "online"
        });
    });
})