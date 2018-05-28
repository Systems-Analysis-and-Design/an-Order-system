(function() {
  $(function() {
    $("[name='stock'] span").each(check);   //检查库存
    $("#addRow").click(addRow);
    //提交表格
    $("tbody").on("click", ".deleteRow", deleteRow);
    $("tbody").on("dblclick", "td", editTd);
    $("tbody").on("blur", "td input", saveTd);
    $("input[name='ingredients']").click(saveTable);
  });

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
        case "stock":
          if (parseInt($(this).text()) <= 0) {
            $(this).parents("tr").addClass("alert-warning");
          } else {
            $(this).parents("tr").removeClass("alert-warning");
          }
          break;
      }
    }
  }

  function hasCompletedLastRow() {
    var hasCompletedLastRow = true;
    $("tr").not(".delete").last().children().not(".btn-td").each(function() {
      if (!$(this).text()) {
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
                        "<th scope='row'>" + id + "</th>" +
                        "<td name='name'><span></span><input type = 'text'></td>" + 
                        "<td name='price'><span></span><input type = 'text'></td>" + 
                        "<td name='cost'><span></span><input type = 'text'></td>" + 
                        "<td name='stock'><span></span><input type = 'text'></td>" + 
                        "<td class='btn-td'><div class ='btn-circle btn-circle-td'><div class='btn-line'></div><a href='#' class='deleteRow'><div class='btn-square'></div><img src='/images/cross.png'></a></div></td>");
    } else {
      //反馈信息
    }
  }

  function deleteRow() {
    $(this).parents("tr").addClass("delete");
    //更新往后的ID
    $(this).parents("tr").nextAll().each(function() {
      $(this).find("th").text(parseInt($(this).find("th").text()) - 1);
    });
  }

  function editTd() {
    $(this).find("input").show();
    $(this).find("span").hide();
    $(this).find("input").focus();
    $(this).find("input").val($(this).find("span").text());
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
        var rowJSON = "{";
        rowJSON += "\"name\":\"" + $(this).children("[name='name']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"price\":" + $(this).children("[name='price']").text() + ",";
          rowJSON += "\"cost\":" + $(this).children("[name='cost']").text() + ",";
          rowJSON += "\"stock\":" + $(this).children("[name='stock']").text() + ",";
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
        url: "?username=" + $(".head-contents a").first().text() + "&info=ingredients",
        success: function(result) {
          setTimeout(function () {
            window.location.reload();     
                   }, 800);
        }
      });
    } else {
      //警告
    }
  }
})();
