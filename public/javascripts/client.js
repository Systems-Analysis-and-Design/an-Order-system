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
    $(this).attr("src", "http://" + window.location.host + "/" + src);
  }

  //获取查询字符串各属性
  function getSearchString(key) {
    // 获取URL中?之后的字符
    var str = location.search;
    str = str.substring(1,str.length);
    
    // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
    var arr = str.split("&");
    var obj = new Object();
    
    // 将每一个数组元素以=分隔并赋给obj对象    
    for(var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  }

  //购物车删除菜品后同时清空页面内的相应的菜品的数量
  function cleanNum(itemName) {
    $(".menu-item .tit").each(function() {
      if($(this).text() == itemName) {
        $(this).siblings(".count").find(".label-num").text(0);
        return;
      }
    });
  }
})();
