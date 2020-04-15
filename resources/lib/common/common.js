let api = 'http://127.0.0.1:8001/';
let baseUrl = "http://39.106.71.75:8888/";

// 下次再发送ajax请求把token带到后台
let token = $.cookie("TOKEN");

// 设置全局ajax前置拦截
$.ajaxSetup({
    headers: {
        'TOKEN': token
    }
});

// 如果访问登陆页面之外的页面 并且还没有登陆成功之后写入cookie的token就转到登陆页面
if (token == undefined) {
    if (window.location != "http://localhost:8888/ERP_WEB/login.html") {
        window.top.location = '/ERP_WEB/login.html';
    }
} else {
    if (window.location != "http://localhost:8888/ERP_WEB/login.html") {
        $.ajax({
            url: api + "login/checkLogin",
            async: true,// 同步处理
            type: "post",
            dataType: "json",
            success: function (res) {
                if (res.code == -1) {
                    window.top.location = '/ERP_WEB/login.html';
                }
            },
            error: function (res) {
                window.top.location = '/ERP_WEB/login.html';
            }
        });
    }
}

let pers = localStorage.getItem("permissions");
let usertype = localStorage.getItem("usertype");
if (usertype == 1) {
    if (pers != null) {
        let permissions = pers.split(",");

        //部门权限开始
        if (permissions.indexOf("dept:add") < 0) {
            $(".btn_add").hide();
        }
        if (permissions.indexOf("dept:update") < 0) {
            $(".btn_update").hide();
        }
        if (permissions.indexOf("dept:delete") < 0) {
            $(".btn_delete").hide();
        }
        //部门权限结束

    } else {
        $(".btn_add").hide();
        $(".btn_update").hide();
        $(".btn_delete").hide();
        $(".btn_dispatch").hide();
        $(".btn_reset").hide();
    }
}

//给页面显示登陆用户名
let username = localStorage.getItem("username");
$(".login_name").html(username);
