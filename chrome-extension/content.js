
const REG = /(^1[3-9]\d{9}$)|(^0\d{2,3}-?\d{5,8}$)/;
// const REG = /(1[3-9]\d{9})|(0\d{2,3}-?\d{5,8})/ig;
//缓存chrome.runtime 防止在注入的代码中拿不到
const Runtime = chrome.runtime;
const DELAY_TIME = 1100;
const LOGIN_SUEESS_TIP_DELAY = 1200;//登陆成功后的提示停留时间
let phoneNumber = "";
const container = `
<div class="call-pop-container">
    <span class="btn-bar">        
        <button class="call-btn">拨打电话</button>
    </span>
    <span class="triangle"></span>
</div>
`;

const baseUrl = "http://localhost:9191/";
const loginUrl = "https://ketao.antfact.com/login";
const base64_prefix = "data:image/png;base64,";
let userData = null;
let errorMsg = "";
let hasCapche = false;

const modal = `
<div id=${loginUrl} class="content-login-modal hide" style="width: 230px">
    <span id="call-login-modal-back" class="content-login-modal-back"></span>
    <div class="modal-wrapper" id="call-login-modal">       
        <div class="modal-content">
            <span class="modal-title">
                <img class="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADDUlEQVRYR+3ZP0wTURwH8O/JaHEVxAFjUwMLDR1wwHgMKlE6leVYlETbARNEIDrYtIYF/8V2cCgmCIt1gK2DhsEj0UQSNGWBSNC4GJ3bc8Rn3ouv3r3e/ztDB97SNL2+93m/d+/3fr1KANAdl2W0IScBMn1/0I0AKvZx/1tVVSWKk9rw9qBRZuOTfQxJ3f2yKkk435JAgnXpVEImrYjjpkNg0NUJHMHeWBTtkaM41h5Bra5h49NWUJPh+76BF+VB3Ls9gZMnOgwdUuSL8gqKC8uhQH0BH+buYDQ5bAvY3t3DWGaKRTVI8ww0w+3sfkFN0zDQ32ewhIH0BNTj6tovLL5cYcupjxKN7GT6Gro6jzNsUKRroIhT0rfY4GaNbphyqYCe2OnASFdALzgODgvpCLTDdXV2IDs9gbOJOEszHzarKD5fxsbHKnOGgbQF2uF6YlGUS08ZQmyz+QdYrbwOBWkJ9Ivj2LCQpkAvuDX1PRb/7mSavCfTVxsBDQPZBPSC0wO4ii79q4UCO/5oC4o0ALPTNzGupFjHNM/pU4l4z5nh/gfSANxSK2zmQXBhIw1Aeg+lksMolpYaSdhL5MTdHMZy26aZIDirSGZmslhT37lOQZbAMHAcOa6MsoROGz2340PJRrCdkrkpMEwcl3zd/PfD8VxSwfcfP10hm4BOuAvyIDvS6pq3Ok8PvDJ2AztCoWEVSQPQCfcofxepkUtsmZTMVNMgVoUpnVTp8VwjffXJI66roAbQCUd7pHUePyncIsV+5548YzWkVRMjyYBucLxDHkV+w9tFUux3tfIGs/l5Sxz/QI+ULivXib4qsTshvCD94kSkVKtrxOzcdJqmGEma33gdOJCIs3uOl2JuIyeOSb8vEULYow83kRM70CP5ktNXfY3oF8fHYkA/OLPlFicQFEf7k2Zy84RXv07LavW5fnfTa2ixUSgt2e5Wt2M5/iZx21F7JILeM1F2+fbnPc+J3Gqc0IBuJ+L1ukOg14iJ17f+I+CWf4hOQ8r+hjiCfKs8TCcE6/iNPP0b4g86WpEdkgWGGwAAAABJRU5ErkJggg==">
                <span style="line-height:40px;font-size:14px;">请使用客套账户登录</span>
            </span>
            <form action=${loginUrl} method="post" autocomplete="off">
                <div class="input-container">
                    <div class="item-container">
                        <input placeholder="用户名/手机/邮箱" type="text" name="username" autocomplete="off" value="">
                        <span id="username-error" class="error-tip"></span>
                    </div>
                    <div class="item-container">
                        <input placeholder="密码" type="password" value="" name="password" autocomplete="off">
                        <span id="password-error" class="error-tip"></span>
                    </div>
                    <div class="item-container capche hide" id="capche">
                        <input placeholder="验证码" type="text" name="retcode" autoComplete="off" maxLength="4" />
                        <img id="capche-img" src="" width="120" height="40" title="看不清？点击换一张" />
                        <span id="retcode-error" class="error-tip"></span>
                    </div>
                </div>
                <input type="hidden" id="hidedInput">
                <button id="confirm" type="submit">
                    <span>登录</span>
                </button>
            </form>
            <span class="hide" id="success">
                登陆成功,右键点击电话号码可以拨打电话
            </span>
            <span class="hide" id="loading">
                登录中...
            </span>
            <span class="error-tip" id="error-container"></span>
        </div>
    </div>
</div>`;

$(document).ready(function () {
    $('body').append(modal);
    const $loginModal = $(`[id="${loginUrl}"]`);
    const $error = $(`[id="${loginUrl}"]`).find("#error-container");
    const $capche = $(`[id="${loginUrl}"]`).find("#capche");
    

    //处理popover
    $('body').append(container);
    const $pop = $(".call-pop-container");
    

    // window.addEventListener("click", e => {
    //     let text = e.target.innerText;
    //     const phoneNumber = parsePhone($.trim(text));
    //     if (phoneNumber) {
    //         handlePhoneDom(e.target, phoneNumber)
    //     }
    // });   

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
                },
                phoneNumber: $loginModal.find("#hidedInput").val()
            };
            chrome.runtime.sendMessage(params, function (response) {

            });
        }
    }

    const openLoginModal = (phone) => {
        if (phone) {
            $loginModal.find("#hidedInput").val(phone);
        }
        $loginModal.removeClass("hide");
    };

    const closeLoginModal = () => {
        $loginModal.addClass("hide");
    }

    const parsePhone = value => {
        const values = REG.exec(value);
        return values && values[0];
    };

    const handlePhoneDom = (dom, phoneNumber) => {
        const $dom = $(dom);
        $dom.append(container);
        $(".call-btn").on("click", (e) => {
            handlePhoneNumber(phoneNumber);
            return e.preventDefault();
        })
        $(".call-pop-back").on("click", function (e) {
            $dom.find(".call-pop-container").remove();
        });
    };

    const handlePopPosition = ({ x, y }) => {
        $pop.css({ "left": x + "px", "top": y + "px" }).removeClass("hide");
    };

    const handlePhoneNumber = value => {
        console.log(value);
        Runtime.sendMessage({
            name: "call",
            data: {
                value
            }
        }, function (response) {
            if (!response.hasLogin) {
                openLoginModal(value);
            } else {
                closeLoginModal();
            }
        });
    };

    $("#confirm").on("click", handleSubmit);

    //初始化验证码
    $("[name='username']").on("blur", getLoginCaptcha);

    //刷新验证码
    $("#capche-img").on("click", refreshCaptchaCode);

    $("#call-login-modal-back").on("click", function () {
        closeLoginModal();
    });
    
    $loginModal.find("#call-login-modal").on("click", e => e.preventDefault());

    $(".call-btn").on("click", (e) => {
        handlePhoneNumber(phoneNumber);
        return e.preventDefault();
    });

    let timer = null;
    $(window).on("mouseover", e => {
        if (timer) {
            clearTimeout(timer);
        }
        setTimeout(function () {
            let text = e.target.innerText;
            phoneNumber = parsePhone($.trim(text));
            if (phoneNumber) {
                const pos = {
                    x: e.pageX,
                    y: e.pageY - 40//为了在鼠标上方显示
                };
                handlePopPosition(pos);
                //鼠标在pop中时，pop不消失
            } else if (!["call-pop-container", "call-btn"].includes(e.target.className)) {
                $pop.addClass("hide");
            }
            return
        }, DELAY_TIME)
    });


    Runtime.onMessage.addListener(function (data, sender, sendResponse) {
        switch (data.name) {
            case "loginResult":
                if (data.success) {
                    $loginModal.find("#success").removeClass("hide");
                    $loginModal.find("#loading").addClass("hide");
                    setTimeout(() => {
                        $loginModal.addClass("hide");
                    }, LOGIN_SUEESS_TIP_DELAY);
                }
                break;
            case "loginError":

                break;
            default:
                break;
        }
    })
})
