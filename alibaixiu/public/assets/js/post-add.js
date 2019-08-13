// 向服务器发送请求 获取文字分类数据
$.ajax({
    url: '/categories',
    type: 'get',
    success: function (res) {
        // 吧获取到的内容进行拼接
        var html = template('categoryTpl', { data: res });
        // 吧拼接之后的内容输入到页面上
        $('#category').html(html);
    }
});

// 当管理员选择文件的时候触发事件
$('#feature').on('change', function () {
    // 获取管理员选择到的文件
    var file = this.files[0];
    console.log(file);

    // 创建formData对象 实现二进制文件上传
    var formData = new FormData();
    // 将管理员选择到的文件追加到formData对象中
    formData.append('cover', file);
    // 实现文章封面图片上传
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉$.ajax不要处理data属性对应的参数
        processData: false,
        // 告诉$.ajax方法不要设置参数类型
        contentType: false,
        success: function (res) {
            console.log(res);
            $('#thumbnail').val(res[0].cover)
        }
    })
});

// 当添加文章表单提交的时候
$('#addForm').on('submit', function () {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 实现添加文章功能
    $.ajax({
        type: 'post',
        url: '/posts',
        data: formData,
        success: function () {
            // 文章添加成功跳转页面
            location.href = '/admin/posts.html'
        }
    })
    // 阻止表单默认提交行为
    return false;
});


// 调用函数 获取浏览器地址栏中的id参数
var id = getUrlParams('id');
// 当前管理员是在做修改文章操作
if (id != -1) {
    // 根据id获取文章的详细信息
    $.ajax({
        type: 'get',
        url: '/posts/' + id,
        success: function (response) {
            $.ajax({
                url: '/categories',
                type: 'get',
                success: function (categories) {
                    response.categories = categories;
                    // console.log(response);
                    var html = template('modifyTpl', response);
                    $("#parentBox").html(html);
                }
            });
        }
    })
}


// 当修改表单信息发送提交行为的时候
$('#parentBox').on('submit', '#modifyForm', function () {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 获取管理员正在修改的文章的id值
    var id = $(this).attr('data-id');
    // 发送ajax请求
    $.ajax({
        type: 'put',
        url: '/posts/' + id,
        data: formData,
        success: function () {
            location.href = '/admin/posts.html'
        }
    })
    // 阻止表单默认提交行为
    return false;

})



// 设置从浏览器的地址栏中获取查询参数
function getUrlParams(name) {
    // console.log(location.search.substr(1).split('&'));
    //    获取到想要获取的id值
    var paramsAry = location.search.substr(1).split('&');
    // 循环数据
    for (var i = 0; i < paramsAry.length; i++) {
        var tmp = paramsAry[i].split('=');
        if (tmp[0] == name) {
            return tmp[1];
        }
    }
    return -1;
}




