(function() {


    $(function() {
        $("#code-data").children("li").each(fixClassify);
        $(".tab-content").on("click", ".addNum", addNum);
        $(".tab-content").on("click", ".decreaseNum", decreaseNum);
        $(".img-responsive").each(fixSrc);
    });

    function fixClassify() {
        var itemClass = $(this).find(".code-class").text();
        console.log($(this).html());
        $("#" + itemClass + " ul").append($(this).html());
    }

    function addNum() {
        var oldNum = parseInt($(this).prev().find("label").text());
        $(this).prev().find("label").text(oldNum + 1);
    }

    function decreaseNum() {
        var oldNum = parseInt($(this).next().find("label").text());
        if (oldNum <= 0) return;
        $(this).next().find("label").text(oldNum - 1);
    }

    function fixSrc() {
        var src = $(this).attr("src");
        console.log(src);
        $(this).attr("src", "http://" + window.location.host + "/" + src);
    }
})();
