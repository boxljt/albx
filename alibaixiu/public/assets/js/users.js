//主要是用于操作用户
// 将用户列表展示出来
var userArr = new Array();
// 发送请求 展示用户列表
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    $('tbody').html(str);
}


// 添加用户功能 玮哥写法
$('#userAdd').on('click', function () {
    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function (res) {
            userArr.push(res);
            render(userArr);
        }
    });
});


// 添加用户上传头像的功能
$('#avatar').on('change', function () {// 用户选择文件的时候
    //用户选择到的文件
    var formData = new FormData();
    formData.append('avatar', this.files[0]);

    // 发送ajax请求
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 高数$.ajax方法不要解析请求参数
        processData: false,
        // 高数$.ajax方法不要设置请求参数的类型
        contentType: false,
        success: function (response) {
            // 实现头像预览功能
            $('#preview').attr('src', response[0].avatar);
            // 将图片的地址添加到表单里面的隐藏域
            $('#hiddenAaatar').val(response[0].avatar);
        }
    })
})


// 获取修改所需要的id
var userId;
// 添加用户修改功能
$('tbody').on('click', '.edit', function () {
    // 保存当前被修改的这个用户的id
    userId = $(this).parents().attr('data-id');
    // 使用修改功能的时候改变标题
    $('#userForm > h2').text('修改用户');
    //现获取当前被点击这个元素的祖先 叫tr
    var trObj = $(this).parents('tr');
    //获取图片的地址
    var imgSrc = trObj.children(1).children('img').attr('src');
    //将图片的地址写入到隐藏域
    $('#hiddenAvatar').val(imgSrc);
    //判断imgSrc是否有值
    if (imgSrc) {
        $('#preview').attr('src', imgSrc);
    } else {
        $('#preview').attr('src', '../assets/img/default.png');
    }

    // 将对应的内容写入到左边的输入框里面
    //获取第二条数据也就是邮箱的数据
    $('#email').val(trObj.children().eq(2).text());
    //获取第三条数据也就是昵称的数据
    $('#nickName').val(trObj.children().eq(3).text());
    // 获取第三条 状态情况的数据
    var status = trObj.children().eq(4).text();
    // 判断当前状态是不说激活状态
    if (status == '激活') {
        $("#jh").prop('checked', true);
    } else {
        $("#wjh").prop('checked', true);
    }

    // 获取第五条数据 是超级管理员还是普通用户
    var role = trObj.children().eq(5).text();
    // 判断当前选中的是哪个
    if (role == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }

    // 当我们点击编辑按钮的时候 将添加按钮隐藏 同时将修改按钮 显示出来
    $('#userAdd').hide();//添加按钮隐藏
    $('#userEdit').show();//修改按钮显示
})

// 完善修改用户功能 吧修改完毕之后的数据更新到用户信息列表里面
$('#userEdit').on('click', function () {//给修改按钮注册点击事件
    // 发送ajax请求 需要传递id属性
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
            // 从 userArr这个数组中 将要修改的数据给找出出来
            var index = userArr.findIndex(item => item._id == userId);
            // 根据这个index找到数组的这个元素 将他的数据更新
            userArr[index] = res;
            // 调用render方法吧修改之后的数据渲染到页面上去
            render(userArr);
        }
    })
    // 修改之后让文本输入框内容清除
    $('.form-control').val('');
})

// 删除单个用户的功能
$('tbody').on('click', '.del', function () {
    // 弹出确认框
    if (window.confirm('真的要删')) {
        // 获取需要删除用户的id
        var id = $(this).parents().attr('data-id');
        // 用户确认删除之后发送ajax请求
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (res) {
                var index = userArr.findIndex(item => item._id == res._id)
                //调用splice()方法 删除当前id的内容
                userArr.splice(index, 1);
                //渲染页面
                render(userArr);
            }
        })
    }
})



// 删除多个用户的功能 
// 先实现 全选功能
$('thead input').on('click', function () {
    // 它的选中状态就直接决定下面的复选框的选中状态
    // prop('参数')   获取某个元素的指定属性的值
    // prop('key',value)   向某个元素设置属性 
    // 获取上面这个复选框的checked属性
    let flag = $(this).prop('checked');
    // 设置下面的复选框 下面的复选框的chenked属性值 就是由fiag变量的值来决定的
    $('tbody input').prop('checked', flag);

    // 批量删除按钮
    if (flag) {
        $('.btn-sm').show();//显示批量删除按钮
    } else {
        $('.btn-sm').hide();//隐藏批量删除按钮
    }
})

// 再给下面的复选框注册点击事件
$('tbody').on('click', 'input', function () {
    if ($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked', true);
    } else {
        $('thead input').prop('checked', false);
    }

    // 下面复选框选中的个数大于一 就让批量删除按钮显示 反之隐藏
    if ($('tbody input:checked').length > 1) {
        $('.btn-sm').show();//显示批量删除按钮
    } else {
        $('.btn-sm').hide();//隐藏批量删除按钮
    }
});

// 给批量删除按钮注册点击事件
$('.btn-sm').on('click', function () {
    var ids = [];
    // 想要获取被选中的元素的id属性值
    var checkUser = $('tbody input:checked');
    // 对checkUser对象进行遍历
    checkUser.each(function (k, v) {
        var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
        ids.push(id);
    });
    if (confirm('你真的确定要删除吗?')) {

    } $.ajax({
        type: 'delete',
        url: '/users/' + ids.join('-'),
        success: function () {
            location.reload();
        }
    })

    // $.ajax({
    //     type: 'delete',
    //     url: '/users/' + ids.join('-'),
    //     success: function (res) {
    //         res.forEach(e => {
    //             var index = userArr.findIndex(item => item._id == e._id);
    //             //调用splice()方法 删除当前id的内容
    //             userArr.splice(index, 1);
    //             //渲染页面
    //             render(userArr);
    //         })
    //     }
    // })
})

































// // 当表单发生提交行为的时候
// $('#userForm').on('submit', function () {
//     // 获取用户在表单中输入的内容并将内容格式化成字符串
//     var formData = $(this).serialize();
//     // 向服务器端发送添加用户的请求
//     $.ajax({
//         type: 'post',
//         url: '/users',
//         data: formData,
//         success: function () {
//             // 刷新页面
//             location.reload();
//         },
//         error: function () {
//             alert('用户添加失败')
//         }
//     })
//     // 阻止表单的默认提交行为
//     return false;

