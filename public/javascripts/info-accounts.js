(function() {
  $(function() {
    $(".panel").each(setAttr);
    $("#accordion-accounts").on("click", ".panel-title a", iconRotate);
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

  function updateOverviewData() {
    var totalIncome = 0;
    var totalCost = 0;
    $("[name='accounts-in'] tbody tr").each(function() {
      var income = parseInt($(this).find("[name='income']").text());
      var cost = parseInt($(this).find("[name='cost']").text());
      totalIncome += income;
      totalCost += cost;
    });
    var totalNetIncome = totalIncome - totalCost;
    $(".IO-overview [name='totalIncome'] span").text(totalIncome);
    $(".IO-overview [name='totalCost'] span").text(totalCost);
    $(".IO-overview [name='totalNetIncome'] span").text(totalNetIncome);
  }
})();
