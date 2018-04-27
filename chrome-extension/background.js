const baseUrl = "http://localhost:9191/";
// const baseUrl = "https://ketao.antfact.com/";

let userData = null;
const Runtime = chrome.runtime;

Runtime.onMessage.addListener(function ({ name, data }, sender, sendResponse) {
    console.log(name, data);
    // sendResponse({
    //     loading: true
    // })
    switch (name) {
        case "login":
            handleLogin(data).then(result => {
                // handleLoading(false);
                userData = result;                           
                getUserPhoneNumber(userData.userid);
                Runtime.sendMessage({
                    name: "loginResult",
                    success: true
                })
            })
                .fail(({ responseJSON }) => {
                    // handleLoading(false);
                    $error.text(responseJSON.errorMsg);    
                    Runtime.sendMessage({
                        name: "loginResult",
                        success: false
                    })               
                });
            break;
        case "call":
            if (!userData) {
                sendResponse({
                    hasLogin: false
                });
            } else {
                getUserPhoneNumber(userData.userid);
                sendResponse({
                    hasLogin: true
                });
            }

        default:
            break;
    }
});

const handleLogin = data => $.ajax({
    url: baseUrl + "extensionLogin",
    type: "POST",
    data
});

const getUserPhoneNumber = user_id => {
    return $.ajax({
        url: baseUrl + 'rest/call/phone/' + user_id,
        dataType: 'json',
        type: 'get'
    })
};



