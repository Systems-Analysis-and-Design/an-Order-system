//待补全，仅支持注册和登录表单的检查
function checkValidity() {    //检查合法性
  if($(".form-result").text()) {    //清空#result里的内容
    $(".form-result").text("");
  }

  var value = $(this).val();
  if (value == "") return;
  var objId = $(this).attr("id"), flag;
  switch(objId) {
    case "mUsername":
    case "upUsername":
    case "emUsername":
    case "eUsername":
      flag = /^[a-zA-Z]\w{5,17}$/.test(value);
      break;
    case "mPassword":
    case "ePassword":
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
    //待修改
    case "storeName":
      flag = true;
      break;
    case "storeAddress":
      flag = true;
      break;
    case "name":
      flag = true;
      break;
    case "age":
      flag = true;
      break;
    case "post":
      flag = true;
      break;
  }
  showValidity(flag, objId);
}

function showValidity(flags, id) {    //显示是否合法的图标
  var icon = $("#" + id).next();
  icon.attr("src", "http://" + window.location.host + (flags ? "/images/correct.png" : "/images/error.png"));
  icon.css("opacity", 1);
}

function isAllCorrect(form) {    //全部合法才能提交
  var corrcetPath = "http://" +window.location.host + "/images/correct.png";
  var flag = true;
  $("[name='" + form + "'] .form-body img").each(function() {
    if($(this).attr("src") != corrcetPath) flag = false;
  });
  return flag;
}
