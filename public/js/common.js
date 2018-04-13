var socket = io();

new Vue({
    el: "#app",
    data: {
        messageText: "",
        messages: []
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
            socket.emit("newMessage", this.messageText);
            this.messageText = "";
        }
    }
});