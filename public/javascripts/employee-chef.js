(function() {
  $(function() {
    autoRefresh();
    $("tbody").on("click", ".completed", changeOrderState);
  });

  function autoRefresh() {
    setTimeout(function() {
      window.location.reload();
    }, 5000);
  }

  function changeOrderState() {
    var row = $(this).parents("tr");
    var rowJSON = "{";
    rowJSON += "\"orderNumber\":\"" + row.find("[name='orderNumber']").text() + "\",";
    if ($(this).hasClass("completed")) {
      rowJSON += "\"op\":\"completed\"";
    }
    rowJSON += "}";
    rowJSON = eval("(" + rowJSON + ")");
    $.ajax( {
        type: "POST",
        async: false,
        data: rowJSON,
        dataType: "json",
        url: window.location.href,
        success: function(result) {
          setTimeout(function () {
            window.location.reload();
          }, 500);
        }
      });
  }
})();
