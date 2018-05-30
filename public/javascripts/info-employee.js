(function() {
  $(function() {
    $(".panel").each(setPanel);
    $("#accordion-employee").on("dblclick", ".info-item", editInfo);
    $("#accordion-employee").on("blur", ".info-item", saveInfo);
    $("#accordion-employee").on("click", ".panel-title a", iconRotate);
    $("#accordion-employee").on("click", ".deleteCard", deleteCard);
    $("[name='newEmployee']").submit(newEmployee);
    $("input[name='employee']").click(saveChanges);
    $("#uploadImg").change(previewImg);
    $("[name='imgUpload']").submit(uploadImg);
    $(".avatar").each(fixImgSrc);
    $("#accordion-employee").on("click", ".avatar", function(e) {
      e.stopPropagation();
      $(this).attr("id", "waitingImg");
      $("#imgUpload").modal('show');
    });
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
      $(this).parents(".panel").addClass("isUpdate");
    }
  }

  function fixImgSrc() {
    imgSrc = "http://" + window.location.host + "/" + $(this).attr("src");
    $(this).attr("src", imgSrc);
  }

  function previewImg() {
    var img = $(this).get(0).files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function() {
      $(".previewImg").attr("src", reader.result);
    }, false);
    if($(this).get(0).files.length) {
      reader.readAsDataURL(img);
    } else {
      $(".previewImg").removeAttr("src");
    }
  }

  function uploadImg() {
    if($("#uploadImg").get(0).files[0] != undefined) {
      $("#waitingImg").parents(".panel").addClass("isUpdate");
      var formData = new FormData();
      formData.append('img', $("#uploadImg").get(0).files[0]);
      $.ajax({
        type: "POST",
        cache: false,
        async: false,
        data: formData,
        processData: false,   //必须false才会避开jQuery对 formdata 的默认处理 
        contentType: false,   //必须false才会自动加上正确的Content-Type 
        url: "?username=" + $(".head-contents a").first().text() + "&op=uploadImg",
        success: function(result) {
          //返回在服务器的存储路径
          $("#imgUpload").modal('hide');
          $("#waitingImg").attr("src", "http://" + window.location.host + "/" + result);
          $("#waitingImg").removeAttr("id");
        }
      });
    }
    return false;
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
    $(".isUpdate, .delete").each(function () {
      var len = ("http://" + window.location.host + "/").length;
      var imgSrc = $(this).find(".avatar").attr("src").slice(len);
        var rowJSON = "{";
        rowJSON += "\"imgSrc\":\"" + imgSrc+ "\",";
        rowJSON += "\"username\":\"" + $(this).find("[name='username']").text() + "\",";
        rowJSON += "\"post\":\"" + $(this).find("[name='post']").text() + "\",";
        rowJSON += "\"name\":\"" + $(this).find("[name='name']").text() + "\",";
        rowJSON += "\"age\":" + $(this).find("[name='age']").text() + ",";
        rowJSON += "\"phone\":\"" + $(this).find("[name='phone']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"op\":\"save\"";
        }
        rowJSON += "}";
        console.log(rowJSON);
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
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
      });
  }

})();
