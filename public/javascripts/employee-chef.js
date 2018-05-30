(function() {
  $(function() {
    //定时刷新
    autoRefresh();
    $("tbody").on("click", ".cancelled", changeOrderState);
    $("tbody").on("click", ".completed", changeOrderState);
  });

  function autoRefresh() {
    // setTimeout(function() {
    //   window.location.reload();
    // }, 5000);
  }

  function changeOrderState() {
    var row = $(this).parents("tr");
    var rowJSON = "{";
    rowJSON += "\"orderNumber\":\"" + row.find("[name='orderNumber']").text() + "\",";
    rowJSON += "\"tabelNumber\":" + row.find("[name='tabelNumber']").text() + ",";
    rowJSON += "\"name\":\"" + row.find("[name='name']").text() + "\",";
    rowJSON += "\"note\":\"" + row.find("[name='note']").text() + "\",";
    if($(this).hasClass("cancelled")) {
      rowJSON += "\"op\":\"cancelled\"";
    }
    else if ($(this).hasClass("completed")) {
      rowJSON += "\"op\":\"completed\"";
    }
    rowJSON += "}";
    rowJSON = eval("(" + rowJSON + ")");
    $.ajax( {
        type: "POST",
        async: false,
        data: rowJSON,
        dataType: "json",
        url: "?op=changeOrderState",
        success: function(result) {
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
      });
  }
})();
