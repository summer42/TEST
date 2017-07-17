(function(){
    let ws = new SockJS("localhost");
    let client = Stomp.over(ws);
}())