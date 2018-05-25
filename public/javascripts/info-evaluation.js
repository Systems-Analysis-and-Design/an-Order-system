(function() {
  $(function() {
    //提交表格
    $("tbody").on("click", ".deleteRow", deleteRow);
    $("input[name='evaluation']").click(saveTable);
  });

  function check() {
    //合法性检查
  }

  function hasCompletedLastRow() {
    var hasCompletedLastRow = true;
    $("tr:last").children().not(".btn-td").each(function() {
      if (!$(this).text()) {
        hasCompletedLastRow = false;
      }
    });
    return hasCompletedLastRow;
  }

  function deleteRow() {
    $(this).parents("tr").addClass("delete");
  }

  function saveTable() {
    //完成最后一行才能保存
    if (hasCompletedLastRow()) {
      //json化修改的数据
      var data = new Array();
      $(".isUpdate, .delete").each(function() {
        var rowJSON = "{";
        rowJSON += "\"serialNumber\":\"" + $(this).children("[name='serialNumber']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"orderDetails\":\"" + $(this).children("[name='orderDetails']").text() + "\",";
          rowJSON += "\"totalEvaluation\":\"" + $(this).children("[name='totalEvaluation']").text() + "\",";
          rowJSON += "\"taste\":\"" + $(this).children("[name='taste']").text() + "\",";
          rowJSON += "\"speedOfProduction\":\"" + $(this).children("[name='speedOfProduction']").text() + "\",";
          rowJSON += "\"serviceAttitude\":\"" + $(this).children("[name='serviceAttitude']").text() + "\",";
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
        url: "?username=" + $(".head-contents:first-child").text() + "&info=evaluation",
        success: function(result) {
          window.location.reload();
        }
      });
    } else {
      //警告
    }
  }
})();