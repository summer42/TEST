$(document).ready(function () {
    const port = chrome.extension.connect({
        name: "login connect"
    });
    //询问background是否登录
    console.log("isLogin")
    port.postMessage({
        name: "isLogin"
    });
    port.onMessage.addListener(function (data) {
        if (data.hasLogin) {
            $loginModal.addClass("hide");
            $("#success").removeClass("hide");
        }
        if (data.success) {
            $("#success").removeClass("hide");
            $("#loading").addClass("hide");
            $loginModal.addClass("hide");
        }
        //todo error
    });
    const baseUrl = "http://localhost:9191/";
    const loginUrl = "https://localhost:9191/login";
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

            port.postMessage(params);
        }
    }

    //发送事件通知content登录结果
    const handleLoginResult = (status, data) => {
        chrome.runtime.sendMessage({ name: status, data });
    }

    const handleLoginError = errorMsg => {
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
                //todo 获取验证码失败
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
                //todo 获取验证码失败
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





