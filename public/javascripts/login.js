(function() {
  $(function() {
    $(".modal-body input").blur(checkValidity)
    .blur();
    $("[name='login']").submit(submitLoginForm);
    $("[name='regist']").submit(submitRegistForm);
});

function submitLoginForm() {
    if(!isAllCorrect("login")) {    //不合要求则阻止提交
      $("#login .form-result").text("存在非法格式！");
      return false;
    }
    
    $.ajax({    //采用ajax提交
      type: "POST",
      async: true,
      data: $("[name='login']").serialize(),
      cache: false,
      url: "/",
      success: function(result) {
        $("#login form-result").text("");
        switch(result) {
          case "success": success("登录");
            break;
          case "notFound": $("#login #form-result").text("该用户不存在！");
            showValidity(false, "username");
            break;
          case "wrongPassword": $("#login #form-result").text("密码错误！");
            showValidity(false, "password");
            break;
          default: window.location.href = "/";
        }
      }
    });
    
    return false; //阻止submit提交
} 

function submitRegistForm() {
    if(!isAllCorrect("regist")) {    //不合要求则阻止提交
      $("#regist .form-result").text("存在非法格式！");
      return false;
    }
    
    $.ajax({    //采用ajax提交
      type: "POST",
      async: true,
      data: $("[name='regist']").serialize(),
      dataType: "json",
      url: "/regist",
      success: function(result) {
        switch(result) {
          case "success": success("注册");
                          break;
          case "exited": $("#regist .form-result").text("该用户已存在！");
                         showValidity(false, "username");
                         break;
          default: window.location.href = "/";
        }
      }
    });
    
    return false; //阻止submit提交
  }
})();
