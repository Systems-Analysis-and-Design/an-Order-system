(function() {
  $(function() {
    $(".panel").each(setAttr);
    $("#accordion-accounts").on("click", ".panel-title a", iconRotate);
    $("tbody").on("dblclick", "td", editTd);
    $("tbody").on("blur", "td input", saveTd);
    $("tbody").on("click", ".deleteRow", deleteRow);
    $("input[name='accounts']").click(saveTable);
    $(".addRow").click(addRow);
    updateOverviewData();
  });

  var panelIndex = 0;
  function setAttr() {
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
        case "soldNum":
          if (parseInt($(this).text()) < 0) {
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
    $("#editingTable tr").not(".delete").last().children().not(".btn-td").each(function() {
      if (!$(this).text()) {
        hasCompletedLastRow = false;
      }
    });
    return hasCompletedLastRow;
  }

  function addRow() {
    $(this).parents(".collapse").find("tbody").attr("id", "editingTable");
    //确保上一行已完成所有内容才能新增行
    if (hasCompletedLastRow()) {
      var tableName = $("#editingTable").parent().attr("name");
      if (tableName == 'accounts-in') {
        var lastId = parseInt($("#editingTable tr").not(".delete").last().find("th").text());
        var id = isNaN(lastId) ? 1 : lastId + 1;
        $("#editingTable").append("<tr class='alert'>" +
                      "<th scope='row'>" + id + "</th>" +
                      "<td name='name'><span></span><input type = 'text'></td>" + 
                      "<td name='cost'><span></span><input type = 'text'></td>" + 
                      "<td name='price'><span></span><input type = 'text'></td>" + 
                      "<td name='soldNum'><span></span><input type = 'text'></td>" + 
                      "<td name='income'><span></span></td>" + 
                      "<td name='netIncome'><span></span></td>" + 
                      "<td class='btn-td'><div class ='btn-circle btn-circle-td'><div class='btn-line'></div><a href='#' class='deleteRow'><div class='btn-square'></div><img src='/images/cross.png'></a></div></td>");
      } else if (tableName == 'accounts-out'){
        $("#editingTable").append("<tr class='alert'>" +
                      "<td name='id'><span></span><input type = 'text'></td>" +
                      "<td name='event'><span></span><input type = 'text'></td>" + 
                      "<td name='note'><span></span><input type = 'text'></td>" + 
                      "<td name='cost'><span></span><input type = 'text'></td>" + 
                      "<td class='btn-td'><div class ='btn-circle btn-circle-td'><div class='btn-line'></div><a href='#' class='deleteRow'><div class='btn-square'></div><img src='/images/cross.png'></a></div></td>");
      }
    } else {
      //反馈信息
    }
    $("#editingTable").removeAttr("id");
  }

  function deleteRow() {
    $(this).parents("tr").addClass("delete");
    //更新往后的ID
    $(this).parents("tr").nextAll().each(function() {
      $(this).find("th").text(parseInt($(this).find("th").text()) - 1);
    });
    updateOverviewData();
  }

  function updateOverviewData() {
    var totalIncome = 0;
    var totalCost = 0;
    $("[name='accounts-in'] tbody tr").not(".delete").each(function() {
      var income = parseInt($(this).find("[name='income']").text());
      var cost = parseInt($(this).find("[name='cost']").text()) * parseInt($(this).find("[name='soldNum']").text());
      if(isNaN(income) || isNaN(cost)) return false;
      totalIncome += income;
      totalCost += cost;
    });
    $("[name='accounts-out'] tbody tr").not(".delete").each(function() {
      var cost = parseInt($(this).find("[name='cost']").text());
      if (isNaN(cost)) return false;
      totalCost += cost;
    });
    var totalNetIncome = totalIncome - totalCost;
    $(".IO-overview [name='totalIncome'] span").text(totalIncome);
    $(".IO-overview [name='totalCost'] span").text(totalCost);
    $(".IO-overview [name='totalNetIncome'] span").text(totalNetIncome);
  }
  //更新本地的收入
  function updateRowData() {
    var cost = parseInt($("#editingRow [name='cost']").text());
    var price = parseInt($("#editingRow [name='price']").text());
    var soldNum = parseInt($("#editingRow [name='soldNum']").text());
    if (isNaN(cost) || isNaN(price) || isNaN(soldNum)) return;
    var income = price * soldNum;
    var netIncome = (price - cost) * soldNum;
    $("#editingRow [name='income']").text(income);
    $("#editingRow [name='netIncome']").text(netIncome);
    $("#editingRow").removeAttr("id");
    updateOverviewData();
  }

  function editTd() {
    //禁止手动修改收入
    if($(this).attr("name") != 'income' && $(this).attr("name") != 'newIncome') {
      $(this).find("input").show();
      $(this).find("span").hide();
      $(this).find("input").focus();
      $(this).find("input").val($(this).find("span").text());
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
      var tdName = $(this).parent().attr("name");
      var tbName = $(this).parents("table").attr("name");
      if(tbName == "accounts-in" && tdName != 'name') {
        $(this).parents("tr").attr("id", "editingRow");
        updateRowData();
      }
      else if(tbName == "accounts-out" && tdName == 'cost') {
        updateOverviewData();
      }
    }
  }

  function saveTable() {
    var allData = "";
    //"收入详情表格"
    $("[name='accounts-in']").attr("id", "editingTable");
    if (hasCompletedLastRow()) {
      //json化修改的数据
      var data = new Array();
      $("#editingTable .isUpdate, #editingTable .delete").each(function() {
        var rowJSON = "{";
        rowJSON += "\"name\":\"" + $(this).children("[name='name']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"cost\":" + $(this).children("[name='cost']").text() + ",";
          rowJSON += "\"price\":" + $(this).children("[name='price']").text() + ",";
          rowJSON += "\"soldNum\":" + $(this).children("[name='soldNum']").text() + ",";
          rowJSON += "\"income\":" + $(this).children("[name='income']").text() + ",";
          rowJSON += "\"netIncome\":" + $(this).children("[name='netIncome']").text() + ",";
          rowJSON += "\"op\":\"save\"";
        }
        rowJSON += "}";
        data.push(rowJSON);
      });
      //判断有无修改
      if(data.length == 0) {
        //无修改警告
        return;
      }
      allData += "{\"in\":[" + data + "],";
      $("#editingTable").removeAttr("id");
    } else {
      //未完成的行警告
      return
    }
    //"支出详情表格"
    $("[name='accounts-out']").attr("id", "editingTable");
    if (hasCompletedLastRow()) {
      //json化修改的数据
      var data = new Array();
      $("#editingTable .isUpdate, #editingTable .delete").each(function() {
        var rowJSON = "{";
        rowJSON += "\"id\":\"" + $(this).children("[name='id']").text() + "\",";
        if ($(this).hasClass("delete")) {
          rowJSON += "\"op\":\"delete\"";
        } else {
          rowJSON += "\"event\":\"" + $(this).children("[name='event']").text() + "\",";
          rowJSON += "\"note\":\"" + $(this).children("[name='note']").text() + "\",";
          rowJSON += "\"cost\":" + $(this).children("[name='cost']").text() + ",";
          rowJSON += "\"op\":\"save\"";
        }
        rowJSON += "}";
        data.push(rowJSON);
      });
      //判断有无修改
      if(data.length == 0) {
        //无修改警告
        return;
      }
      allData += "\"out\":[" + data + "]}";
      $("#editingTable").removeAttr("id");
    } else {
      //未完成的行警告
      return
    }
    //转换成JS对象
    allData = eval("(" + allData + ")");
    $.ajax( {
      type: "POST",
      async: true,
      data: allData,
      dataType: "json",
      url: "?username=" + $(".head-contents a").first().text() + "&info=accounts",
      success: function(result) {
        window.location.reload();
      }
    });
  }
})();
