//当修改密码表单发生提交行为的时候
$('#modifyForm').on('submit', function () {
    //获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // 调用接口
    $.ajax({
        url: '/users/password',
        type: 'put',
        data: formData,
        success: function () {
            location.href = "/admin/login.html"
        }
    })
    // 阻止默认提交行为
    return false;
})