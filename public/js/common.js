var socket = io();

new Vue({
    el: "#app",
    data: {
        messageText: "",
        messages: [],
        rooms: [
            "JavaScript",
            "Vue.js",
            "React.js",
            "Angular.js"
        ],
        room: "",
        showChat: false,
        userName: "",
        online: 0
    },
    mounted: function () {

        socket.on("clientMessage", function (data) {

            if (data.type == "message") {
                this.messages.push(data);
            } else if (data.type == "online") {
                this.online = data.clientsCount;
            }

        }.bind(this));

    },
    methods: {
        sendMessage: function () {
            socket.emit("newMessage", this.userName, this.messageText, this.room);

            this.messages.push({
                user: this.userName,
                message: this.messageText,
                myMessage: true
            });

            this.messageText = "";
        },

        joinRoom: function (roomName) {
            this.messages = [];

            if (this.room != "") {
                socket.emit("leaveRoom", this.room, this.userName, roomName);
            }

            socket.emit("joinRoom", roomName, this.userName);
            this.room = roomName;
        },

        userLogin: function () {
            this.userName = this.userName.trim();

            if (this.userName == "") {
                alert("Please enter your name.");
            } else {
                this.joinRoom("JavaScript");
                this.showChat = true;
            }
        }
    }
});