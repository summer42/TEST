const baseUrl = "http://localhost:9191/";
const base64_prefix = "data:image/png;base64,";
let userData = null;
let errorMsg = "";
let hasCapche = false;
const $error = $("#error-container");
const $capche = $("#capche");
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
                username: $("[name='username']").val(),
                password: md5($("[name='password']").val(), null),
                retcode: $("[name='retcode']").val()
            }
        };
        chrome.runtime.sendMessage(params, function (response) {
            
        });
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

$(document).ready(function () {
    $("#confirm").on("click", handleSubmit);

    //初始化验证码
    $("[name='username']").on("blur", getLoginCaptcha);

    //刷新验证码
    $("#capche-img").on("click", refreshCaptchaCode);
})





