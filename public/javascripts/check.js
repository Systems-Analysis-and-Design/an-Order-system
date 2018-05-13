var public = {
    waitTime: 5
}

function checkValidity() {    //检查合法性
    if($(".form-result").text()) {    //清空#result里的内容
        $(".form-result").text("");
    }
    
    var value = $(this).val();
    if (value == "") return;
    var objId = $(this).attr("id"), flag;
    switch(objId) {
        case "username":
        case "upUsername":
            flag = /^[a-zA-Z]\w{5,17}$/.test(value);
            break;
        case "password":
        case "upPassword":
            flag = /[a-zA-Z_0-9-]{6,12}/.test(value);
            break;
        case "repassword":
            flag = (value == $("#upPassword").val()) && /[a-zA-Z_0-9-]{6,12}/.test(value);
            break;
        case "phone":
            flag = /^[1-9]\d{10}$/.test(value);
            break;
        case "email":
            flag = /^[a-zA-Z_\-0-9]+@(([a-zA-Z_\-0-9])+\.)+[a-zA-Z0-9]{2,4}$/.test(value);
            break;
    }
    showValidity(flag, objId);
}

function showValidity(flags, id) {    //显示是否合法的图标
    var icon = $("#" + id).next();
    icon.attr("src", flags ? "./images/correct.png" : "./images/error.png");
    icon.css("opacity", 1);
}

function isAllCorrect(form) {    //全部合法才能提交
    var corrcetPath = "./images/correct.png";
    var flag = true;
    $("#" + form + " .modal-body img").each(function() {
        if($(this).attr("src") != corrcetPath) flag = false;
    });
    return flag;
}

function success(operation) {    //登录或注册操作成功后禁止用户修改信息
    console.log("tner");
    $(".modal-body input").attr("readonly", "readonly");
    $(".modal-footer input").attr("disabled", "disabled");
    countDownToJumpPage(operation);
}

function countDownToJumpPage(operation) {    //倒计时跳转页面
    if(public.waitTime-- <= 0) {
        clearTimeout(public.clock);
        //跳转到主页
        window.location.href = '/?username=' + (operation == "登录") ? $("#username").val() : $("#upUsername").val();
        return;
    }
    var result;
    if(operation == "登录") {
        result = $("#login .form-result");
    } else {
        result = $("#regist .form-result");
    }
    result.text(operation + "成功！" + public.waitTime + "秒后跳转页面");
    public.clock = setTimeout(countDownToJumpPage.bind(null, operation), 1000);
}
