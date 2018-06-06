(function() {
    $(function() {
        $("#post").click(turnToFinish);
    });

    function turnToFinish() {
        var name = "lg"
        $.ajax({ //采用ajax提交
            type: "POST",
            async: true,
            data: name,
            dataType: "json",
            url: "",
            success: function(result) {
                window.location.href += "&finish=true";
            }
        });
        return false; //阻止submit提交
    }

})();
