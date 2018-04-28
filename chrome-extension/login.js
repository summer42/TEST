$(document).ready(function () {
    const port = chrome.extension.connect({
        name: "login connect"
    });
    //询问background是否登录
    port.postMessage({
        name: "isLogin"
    });
    port.onMessage.addListener(function (params) {
        switch (params.name) {
            case "hasLogin":
                //监听background的是否登录消息
                if (params.data) {
                    $loginModal.addClass("hide");
                    $("#success").removeClass("hide");
                } else {
                    $loginModal.removeClass("hide");
                    $("#success").addClass("hide");
                }
                break;
            case "loginResult":
                //监听登录成功消息
                if (params.data.success) {
                    handleLoginSuccess();
                } else {
                    handleLoginError(data.errorMsg);
                }
                break;            
        }
    });
    const baseUrl = "http://192.168.51.5:9191";
    const base64_prefix = "data:image/png;base64,";

    let errorMsg = "";
    let hasCapche = false;
    const $error = $("#error-container");
    const $capche = $("#capche");
    const Runtime = chrome.runtime;
    const $loginModal = $("#login-form");
    const handleSubmit = e => {
        e.preventDefault();
        const valid = handleInput("username", "请输入用户名")
            && handleInput("password", "请输入密码")
            && (!hasCapche || handleInput("retcode", "请输入验证码"));
        if (valid) {
            handleLoading(true);
            const params = {
                name: "login",
                data: {
                    username: $loginModal.find("[name='username']").val(),
                    password: md5($loginModal.find("[name='password']").val(), null),
                    retcode: $loginModal.find("[name='retcode']").val()
                }
            };
            //发送登录事件
            port.postMessage(params);
        }
    }

    //发送事件通知content登录结果
    const handleLoginResult = (status, data) => {
        chrome.runtime.sendMessage({ name: status, data });
    }

    const handleLoginSuccess = () => {
        $("#success").removeClass("hide");
        $("#loading").addClass("hide");
        $loginModal.addClass("hide");
    }

    const handleLoginError = errorMsg => {
        $("#loading").addClass("hide");
        $error.text(errorMsg);
    }

    const handleLoading = loading => {
        if (loading) {
            $("#loading").removeClass("hide");
            $("#confirm").attr("disabled", true);
        } else {
            $("#loading").addClass("hide");
            $("#confirm").attr("disabled", false);
        }
    }

    const getLoginCaptcha = () => {
        const username = $("[name='username']").val();
        if (!username) {
            return;
        }
        $.ajax({
            url: baseUrl + "loginCaptcha",
            dataType: 'json',
            data: {
                username,
            },
            success: (data) => {
                if (data) {
                    hasCapche = true;
                    $capche.removeClass("hide");
                    $capche.find("#capche-img").attr("src", base64_prefix + data)
                } else {
                    hasCapche = false;
                    $capche.addClass("hide");
                }
            },
            error: () => {
                handleLoginError("网络繁忙，请稍后重试")
            },
        });
    }

    const refreshCaptchaCode = () => {
        const username = $("[name='username']").val();
        if (!username) {
            return;
        }
        $.ajax({
            url: baseUrl + "refreshCaptcha",
            dataType: 'json',
            data: {
                username,
            },
            success: (data) => {
                if (data) {
                    hasCapche = true;
                    $capche.removeClass("hide");
                    $capche.find("#capche-img").attr("src", base64_prefix + data)
                } else {
                    hasCapche = false;
                    $capche.addClass("hide");
                }
            },
            error: () => {
                handleLoginError("网络繁忙，请稍后重试")
            }
        });
    }

    const handleInput = (id, text) => {
        const $Input = $(`[name=${id}]`);
        const $error = $(`#${id}-error`);
        if (!$Input.val()) {
            $error.text(text);
            return false
        } else {
            $error.text("");
            return true
        }
    }



    $("#confirm").on("click", handleSubmit);

    //初始化验证码
    $("[name='username']").on("blur", getLoginCaptcha);

    //刷新验证码
    $("#capche-img").on("click", refreshCaptchaCode);


})





