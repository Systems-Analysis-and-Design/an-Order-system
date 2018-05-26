(function() {
  $(function() {
    $(".panel").each(setPanel);
    $("#accordion-employee").on("dblclick", ".info-item", editInfo);
    $("#accordion-employee").on("blur", ".info-item", saveInfo);
    $("#accordion-employee").on("click", ".panel-title a", iconRotate);
    $("#accordion-employee").on("click", ".deleteCard", deleteCard);
    $("[name='newEmployee']").submit(newEmployee);
    $("input[name='employee']").click(saveChanges);
  });
  
  var panelIndex = 0;
  function setPanel() {
    $(this).find(".panel-heading").attr("id", "heading-" + panelIndex);
    $(this).find(".panel-title a").attr("href", "#collapse-" + panelIndex);
    $(this).find(".panel-collapse").attr("id", "collapse-" + panelIndex);
    $(this).find(".panel-heading .icon").attr("id", "icon-" + panelIndex);
    panelIndex++;
  }

  var open = new Array(panelIndex).fill(false);
  function setImgSrc(id) {
    var index = parseInt(id.slice(5));
    //不同同时开两个
    if (!open[index]) {
      $("#" + id).attr("src", "/images/up.png");
      open[index] = true;
    } else {
      $("#" + id).attr("src", "/images/down.png");
      open[index] = false;
    }
    $("#" + id).removeClass("img-rotate");
  }

  function iconRotate() {
    $(this).find("img.icon").addClass("img-rotate");
    //延迟执行
    setTimeout(setImgSrc.bind(null, $(this).find("img.icon").attr("id")), 500);
  }

  function check() {
    //$(this).addClass("alert-danger");
  }

  function editInfo() {
    $(this).find("input").show();
    $(this).find("span").hide();
    $(this).find("input").focus();
    $(this).find("input").val($(this).find("span").text());
  }

  function saveInfo() {
    $(this).find("input").hide();           //隐藏input
    $(this).find("span").show();    //显示span
    if($(this).find("span").text() != $(this).find("input").val()) {   //内容有修改
      $(this).find("span").text($(this).find("input").val());
      //弱合法性检查
      $(this).find("span").each(check);
      $(this).parent().addClass("isUpdate");
    }
  }

  function deleteCard() {
    $(this).parents(".panel").addClass("delete");
  }

  function newEmployee() {
    //合法性检查
    $.ajax({    //采用ajax提交
      type: "POST",
      async: true,
      data: $("[name='newEmployee']").serialize(),
      dataType: "json",
      url: "?username=" + $(".head-contents a").first().text() + "&info=employee&op=new",
      success: function(result) {
        window.location.reload();
      }
    });
    return false; //阻止submit提交
  }

  function saveChanges() {
    var data = new Array();
      $(".isUpdate, .delete").each(function() {
        var rowJSON = "{";
        rowJSON += "\"id\":\"" + $(this).find("[name='id']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"username\":\"" + $(this).find("[name='username']").text() + "\",";
          rowJSON += "\"post\":\"" + $(this).find("[name='post']").text() + "\",";
          rowJSON += "\"name\":\"" + $(this).find("[name='name']").text() + "\",";
          rowJSON += "\"age\":" + $(this).find("[name='age']").text() + ",";
          rowJSON += "\"phone\":\"" + $(this).find("[name='phone']").text() + "\",";
          rowJSON += "\"op\":\"save\"";
        }
        rowJSON += "}";
        data.push(rowJSON);
      });
      //判断有无修改
      if(data.length == 0) {
        //警告
        return;
      }
      //封装成JSON数组
      data = "{\"data\":[" + data + "]}";
      console.log(data);
      //转换成JS对象
      data = eval("(" + data + ")");
      $.ajax( {
        type: "POST",
        async: true,
        data: data,
        dataType: "json",
        url: "?username=" + $(".head-contents a").first().text() + "&info=employee&op=save",
        success: function(result) {
          window.location.reload();
        }
      });
  }

})();
