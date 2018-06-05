(function() {
  $(function() {
    $("#addRow").click(addRow);
    //提交表格
    $("tbody").on("click", ".deleteRow", deleteRow);
    $("tbody").on("dblclick", "td", editTd);
    $("tbody").on("blur", "td input", saveTd);
    $("input[name='menu']").click(saveTable);
    $("#uploadImg").change(previewImg);
    $(".referenceImg").each(fixImgSrc);
    $("[name='imgUpload']").submit(uploadImg);
  });

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
      $("#waitingImg").parents("tr").addClass("isUpdate");
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

  function check() {
    name = $(this).parent().attr("name");
    if(name != "name") {
      switch (name) {
        case "price":
        case "cost":
          if (parseInt($(this).text()) <= 0) {
            $(this).parents("tr").addClass("alert-danger");
          } else {
            $(this).parents("tr").removeClass("alert-danger");
          }
          break;
      }
    }
  }
  function fixImgSrc() {
    imgSrc = "http://" + window.location.host + "/" + $(this).attr("src");
    $(this).attr("src", imgSrc);
  }


  function hasCompletedLastRow() {
    var hasCompletedLastRow = true;
    $("tr").not(".delete").last().children().not(".btn-td").each(function() {
      if (($(this).attr("name") != 'img' && !$(this).text()) || ($(this).attr("name") == 'img' && !$(this).find("img").attr("src")) ) {
        hasCompletedLastRow = false;
      }
    });
    return hasCompletedLastRow;
  }

  function addRow() {
    //确保上一行已完成所有内容才能新增行
    if (hasCompletedLastRow()) {
      var lastId = parseInt($("tr").not(".delete").last().find("th").text());
      var id = isNaN(lastId) ? 1 : lastId + 1;
      $("tbody").append("<tr class='alert'>" +
                        //"<th scope='row'>" + id + "</th>" +
                        "<td name='img'><img class='referenceImg'></td>" + 
                        "<td name='class'><span></span><input type = 'text'></td>" + 
                        "<td name='name'><span></span><input type = 'text'></td>" + 
                        "<td name='ingredients'><span></span><input type = 'text'></td>" + 
                        "<td name='cost'><span></span><input type = 'text'></td>" + 
                        "<td name='price'><span></span><input type = 'text'></td>" + 
                        "<td class='btn-td'><div class ='btn-circle btn-circle-td'><div class='btn-line'></div><a href='#' class='deleteRow'><div class='btn-square'></div><img src='/images/cross.png'></a></div></td></tr>");
    } else {
      //反馈信息
    }
  }

  function deleteRow() {
    $(this).parents("tr").addClass("delete");
  }

  function editTd() {
    if ($(this).find("input").get(0) != null) {
      if ($(this).attr("name") != 'img') {
        $(this).find("input").show();
        $(this).find("span").hide();
        $(this).find("input").focus();
        $(this).find("input").val($(this).find("span").text());
      } else {
        $(this).find(".referenceImg").attr("id", "waitingImg");
        $("#imgUpload").modal('show');
      }
    }  
  }

  function saveTd() {
    $(this).hide();           //隐藏input
    $(this).prev().show();    //显示span
    if($(this).prev().text() != $(this).val()) {   //内容有修改
      $(this).prev().text($(this).val());
      //弱合法性检查
      $(this).prev().each(check);
      $(this).parents("tr").addClass("isUpdate");
    }
  }

  function saveTable() {
    //完成最后一行才能保存
    if (hasCompletedLastRow()) {
      //json化修改的数据
      var data = new Array();
      $(".isUpdate, .delete").each(function() {
        var len = ("http://" + window.location.host + "/").length;
        var imgSrc = $(this).find(".referenceImg").attr("src").slice(len);
        var rowJSON = "{";
        rowJSON += "\"name\":\"" + $(this).children("[name='name']").text() + "\",";
        rowJSON += "\"imgSrc\":\"" + imgSrc + "\",";
        rowJSON += "\"class\":\"" + $(this).children("[name='class']").text() + "\",";
        rowJSON += "\"ingredients\":\"" + $(this).children("[name='ingredients']").text() + "\",";
        rowJSON += "\"cost\":" + $(this).children("[name='cost']").text() + ",";
        rowJSON += "\"price\":" + $(this).children("[name='price']").text() + ",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
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
      //转换成JS对象
      data = eval("(" + data + ")");
      $.ajax( {
        type: "POST",
        async: true,
        data: data,
        dataType: "json",
        url: "?username=" + $(".head-contents a").first().text() + "&info=menu",
        success: function(result) {
          setTimeout(function () {
          window.location.reload();
           }, 1000);
        }
      });
    } else {
      //警告
    }
  }
})();

