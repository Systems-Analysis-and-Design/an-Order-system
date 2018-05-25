(function() {
  $(function() {
    $(".form-body input").blur(checkValidity);
    $(".form-body input").blur();
    $(".form-body input").change(enableSubmit);
    $("form").submit(saveChange);
  });

  function enableSubmit() {
    $(this).parents(".form-body").next().find("input").removeAttr("disabled");
  }

  function saveChange() {
    if(!isAllCorrect("" + $(this).attr("name"))) {    //不合要求则阻止提交
      //提示错误
      return false;
    }

    $.ajax( {
        type: "POST",
        async: true,
        data: $(this).serialize(),
        dataType: "json",
        url: "?username=" + $(".head-contents:first-child").text() + "&info=" + $(this).attr("name"),
        success: function(result) {
          window.location.reload();
        }
    });
    return false;
  }

})();