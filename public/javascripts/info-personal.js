(function() {
  $(function() {
    $(".form-body input").blur(checkValidity);
    $(".form-body input").blur();
    $(".form-body input").change(enableSubmit);
    $("form").submit(saveChange);
    $("[name='createQRcode']").click(getQRcode);
  });

  function getQRcode() {
    var siteUrl = "http://" + window.location.host + "/" + $(".head-contents a").eq(0).text() + "/client?tableID=" + $("[name='tableID']").val();
    var QRCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + siteUrl;
    $(".QRCodeBody img").attr('src', QRCodeUrl);
  }

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
        url: "?username=" + $(".head-contents a").first().text() + "&info=" + $(this).attr("name"),
        success: function(result) {
          window.location.reload();
        }
    });
    return false;
  }

})();
