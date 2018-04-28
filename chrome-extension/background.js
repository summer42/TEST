const baseUrl = "http://192.168.51.5:9191";
// const baseUrl = "https://ketao.antfact.com/";

let userData = null;
const Runtime = chrome.runtime;
//用于同content通信(short connect, sendResponse 只能触发一次onMessage)
Runtime.onMessage.addListener(function (params, sender, sendResponse) {
    console.log(params.name, params.data);
    switch (params.name) {
        case "login":
            handleLogin(params.data)
                .fail(({ responseJSON }) => {
                    chrome.tabs.query({
                        active: true,
                    }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            name: "loginResult",
                            data: {
                                success: false,
                                errorMsg: responseJSON
                            }
                        }, function (response) {

                        });
                    })
                })
                .then(result => {
                    userData = result;
                    chrome.tabs.query({
                        active: true,
                    }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            name: "loginResult",
                            data: {
                                success: true
                            }
                        }, function (response) {

                        });
                    });
                    return getUserPhoneNumber(userData.userid);
                })
                .then(result => {
                    userData.phone_order = result.phone_order;
                    if (params.phoneNumber) {
                        return handleCall(params.phoneNumber)
                    }
                })
                .then(result => {
                    chrome.tabs.query({
                        active: true,
                    }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            name: "callResult",
                            data: result
                        });
                    });
                })
                .catch(err => console.log(err));;
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
chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected .....");
    port.onMessage.addListener(function (params) {
        if (params.name == "login") {
            handleLogin(params.data).then(result => {
                userData = result;
                return getUserPhoneNumber(userData.userid)
            }).then(result => {
                userData.phone_order = result.phone_order;
                port.postMessage({
                    name: "loginResult",
                    data: {
                        success: true
                    }
                });
            }).fail(err => {
                port.postMessage({
                    name: "loginResult",
                    data: {
                        success: false,
                        errorMsg: err.errorMsg
                    }
                });
            })
        } else if (params.name == "isLogin") {
            port.postMessage({
                name: "hasLogin",
                data: userData
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