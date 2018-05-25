(function() {
  var public = {
    waitTime: 5
  }

  $(function() {
    $(".form-body input").blur(checkValidity)
    .blur();
    $(".form-header button").click(clearInfo);
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
      url: "?op=login",
      success: function(result) {
        $("#login .form-result").text("");
        switch(result) {
          case "success": success("登录");
            break;
          case "notFound": $("#login .form-result").text("该用户不存在！");
            showValidity(false, "username");
            break;
          case "wrongPassword": $("#login .form-result").text("密码错误！");
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
      url: "?op=regist",
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

  function clearInfo() {
    $(this).parent().siblings(".form-footer").find(".form-result").text("");
  }

  //响应success回调函数
  function success(operation) {    //登录或注册操作成功后禁止用户修改信息
      $(".form-body input").attr("readonly", "readonly");
      $(".form-footer input").attr("disabled", "disabled");
      countDownToJumpPage(operation);
  }

  function countDownToJumpPage(operation) {    //倒计时跳转页面
      if(public.waitTime-- <= 0) {
          clearTimeout(public.clock);
          //跳转到主页
          window.location.href = 'user/?username=' + ((operation == "登录") ? $("#username").val() : $("#upUsername").val()) + '&info=personal';
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
})();
