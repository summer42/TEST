const baseUrl = "http://localhost:9191";
// const baseUrl = "https://ketao.antfact.com/";

let userData = null;
const Runtime = chrome.runtime;

//用于同content通信(short connect, sendResponse 只能触发一次onMessage)
Runtime.onMessage.addListener(function (params, sender, sendResponse) {
    console.log(params.name, params.data);
    switch (params.name) {
        case "login":
            handleLogin(params.data).then(result => {
                userData = result;
                chrome.tabs.query({
                    active: true,
                }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        name: "loginResult",
                        success: true
                    }, function (response) {

                    });
                });
                getUserPhoneNumber(userData.userid).then(result => {
                    userData.phone_order = result.phone_order;
                    if (params.phoneNumber) {
                        return handleCall(params.phoneNumber)
                    }
                }).then(result => {
                    console.log(result);
                }).cathc(err => console.log(err));

            })
                .fail(({ responseJSON }) => {
                    // handleLoading(false);
                    $error.text(responseJSON.errorMsg);
                    chrome.tabs.sendMessage(tabs[0].id, {
                        name: "loginResult",
                        success: false
                    }, function (response) {

                    });
                });
            break;
        case "call":
            if (!userData) {
                sendResponse({
                    hasLogin: false
                });
            } else {
                getUserPhoneNumber(userData.userid)
                    .then(result => {
                        userData.phone_order = result.phone_order;
                        return handleCall(params.data.value)
                    }).then(result => {
                        console.log(result)
                    });
                sendResponse({
                    hasLogin: true
                });
            }

        default:
            break;
    }
});

//用于同popup通信(long connect)
chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");    
    port.onMessage.addListener(function(params) {
         if (params.name == "login") {
            handleLogin(params.data).then(result => {
                userData = result;
                return getUserPhoneNumber(userData.userid)
            }).then(result => {
                userData.phone_order = result.phone_order;
                port.postMessage({
                    success: true
                });
            })
         } else if (params.name == "isLogin") {
            port.postMessage({
                hasLogin: userData
            });
         }         
    });
})

const handleLogin = data => $.ajax({
    url: baseUrl + "/extensionLogin",
    type: "POST",
    data
});

const getUserPhoneNumber = user_id => {
    return $.ajax({
        url: baseUrl + '/rest/call/phone/' + user_id,
        dataType: 'json',
        type: 'get'
    })
};

const handleCall = phone => {
    if (!userData || !userData.phone_order) return;
    const data = {
        from: userData.phone_order,
        to: phone
    }
    return $.ajax({
        url: baseUrl + "/rest/call/out",
        data,
        type: 'post'
    })
}



