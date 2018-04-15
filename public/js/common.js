var socket = io();

new Vue({
    el: "#app",
    data: {
        messageText: "",
        messages: [],
        room: "",
        showChat: false,
        userName: ""
    },
    mounted: function () {        
        socket.on("clientMessage", function (data) {
            var data = data.trim();

            if (data) {
                this.messages.push(data);
            }
            return;

        }.bind(this));
    },
    methods: {
        sendMessage: function () {
            socket.emit("newMessage", this.messageText, this.room);
            this.messages.push(this.messageText);
            this.messageText = "";
        },

        joinRoom: function (roomName) {
            this.messages = [];

            if (this.room != "") {
                socket.emit("leaveRoom", this.room);
            }

            socket.emit("joinRoom", roomName);
            this.room = roomName;
        },

        userLogin: function () {
            this.userName = this.userName.trim();

            if (this.userName == "") {
                alert("Please enter your name.");
            } else {
                this.joinRoom("General");
            }
        }
    }
});