(function () {
    let ws = new SockJS("http://localhost:8080/websocket");

    let client = Stomp.over(ws);

    const connectCallback = data => {
        console.log(data);
        if (data) {
            document.querySelector("[data-connect]").disabled = true;
            document.querySelector("[data-disconnect]").disabled = false;
        }
        client.subscribe('/topic/greetings', function (data) {
            console.log(333, JSON.parse(data.body).content);
            document.querySelector("[data-greeting]").innerHTML = JSON.parse(data.body).content;
        });
    }
    const headers = {};

    //建立连接
    const creatConnect = () => {
        client.connect(headers, connectCallback);
    };

    //断开连接
    const destroyConnect = () => {
        client.connect(headers, function (data) {
            if (data) {
                document.querySelector("[data-connect]").disabled = false;
                document.querySelector("[data-disconnect]").disabled = true;
            }
        });
    };

    //send messages
    const send = () => {
        let value = document.querySelector("[data-input]").value.toString();
        client.send("/app/hello", {}, value);
    };

    document.querySelector("[data-connnect]").addEventListener("click", creatConnect);
    document.querySelector("[data-unconnnect]").addEventListener("click", destroyConnect);
    document.querySelector("[data-send]").addEventListener("click", send);
}())