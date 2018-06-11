(function() {

    $(function() {
        $("#code-data").children("li").each(fixClassify);
        $(".tab-content").on("click", ".addNum", addNum);
        $(".tab-content").on("click", ".decreaseNum", decreaseNum);
        $(".img-responsive").each(fixSrc);
    });
    // 动态生成菜品加入html模块
    function fixClassify() {
        //获取菜品模块代码，通过传入菜品对象绑定类别加入相应tab内容
        var itemClass = $(this).find(".code-class").text();
        console.log($(this).html());
        $("#" + itemClass).append($(this).html());
    }
    // 点击 + 操作
    function addNum() {
        var oldNum = parseInt($(this).prev().find("label").text());
        $(this).prev().find("label").text(oldNum + 1);
    }
    // 点击 - 操作
    function decreaseNum() {
        var oldNum = parseInt($(this).next().find("label").text());
        if (oldNum <= 0) return;
        $(this).next().find("label").text(oldNum - 1);
    }
    // 固定
    function fixSrc() {
        var src = $(this).attr("src");
        console.log(src);
        $(this).attr("src", "http://" + window.location.host + "/" + src);
    }
})();