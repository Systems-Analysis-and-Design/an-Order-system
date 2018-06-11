(function() {
    $(function() {
        setOrderNum();
        $("#post").click(submitForm);
    });

    function getSearchString(key) {
        // 获取URL中?之后的字符
        var str = location.search;
        str = str.substring(1, str.length);

        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split("&");
        var obj = new Object();

        // 将每一个数组元素以=分隔并赋给obj对象    
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
    }

    function setOrderNum() {
        $("#orderNum").val(getSearchString("id"));
    }

    function submitForm() {
        $.ajax({ //采用ajax提交
            type: "POST",
            async: true,
            data: $("[name='evaluation']").serialize(),
            dataType: "json",
            url: "",
            success: function(result) {
                alert("评价提交成功！");
            }
        });
        return false; //阻止submit提交
    }
})();