// 获取到浏览器地址栏中的搜索关键字
var key = getUrlParams('key');
// 根据搜索关键字调用搜索接口 获取搜索结果
$.ajax({
    type: 'get',
    url: '/posts/search/' + key,
    success: function (response) {
        console.log(response);
        
        // 吧搜索获取到的值进行拼接然后渲染到页面
        var html = template('searchTpl', { data: response });
        $("#listBox").html(html);

    }
})