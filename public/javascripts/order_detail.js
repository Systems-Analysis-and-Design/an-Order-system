(function() {
    $(function() {
        $("#post").click(turnToFinish);
    });

    function turnToFinish() {
        window.location.href += "&finish=true";
    }
})();
