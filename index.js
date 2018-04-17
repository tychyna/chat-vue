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
        socket.to(room).emit("clientMessage", [userName, messageText]);
    });

    socket.on("joinRoom", function (roomName) {
        console.log("User join to room: " + roomName);
        socket.join(roomName);
    });

    socket.on("leaveRoom", function (roomName) {
        console.log("User leave room: " + roomName);
        socket.leave(roomName);
    });
})