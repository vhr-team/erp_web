let api = 'http://127.0.0.1:8001/';
let baseUrl = "http://39.106.71.75:8888/";
let loginUrl = 'http://localhost:8888/ERP_WEB/login.html';

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
    if (window.location != loginUrl) {
        window.top.location = loginUrl;
    }
} else {
    if (window.location != loginUrl) {
        $.ajax({
            url: api + "login/checkLogin",
            async: true,// 同步处理
            type: "post",
            dataType: "json",
            success: function (res) {
                if (res.code == -1) {
                    window.top.location = loginUrl;
                }
            },
            error: function (res) {
                window.top.location = loginUrl;
            }
        });
    }
}

let pers = localStorage.getItem("permissions");
let usertype = localStorage.getItem("usertype");
let auditBtn = null;

if (usertype == 1) {
    if (pers != null) {
        let permissions = pers.split(",");

        auditBtn = permissions.indexOf("order:audit");
        // 部门权限开始
        if (permissions.indexOf("dept:add") < 0) {
            $(".btn_add").hide();
        }
        if (permissions.indexOf("dept:update") < 0) {
            $(".btn_update").hide();
        }
        if (permissions.indexOf("dept:delete") < 0) {
            $(".btn_delete").hide();
        }
        // 部门权限结束

        // 角色权限开始
        if (permissions.indexOf("role:add") < 0) {
            $(".roleBtn_add").hide();
        }
        if (permissions.indexOf("role:update") < 0) {
            $(".roleBtn_update").hide();
        }
        if (permissions.indexOf("role:delete") < 0) {
            $(".roleBtn_delete").hide();
        }
        if (permissions.indexOf("role:assignpermissions") < 0) {
            $(".roleBtn_empowerment").hide();
        }
        if (permissions.indexOf("role:batchdelete") < 0) {
            $(".roleBtn_batchdelete").hide();
        }
        // 角色权限结束

        // 菜单和权限
        if (permissions.indexOf("menu:add") < 0) {
            $(".menubtn_add").hide();
        }
        if (permissions.indexOf("menu:update") < 0) {
            $(".menubtn_update").hide();
        }
        if (permissions.indexOf("menu:delete") < 0) {
            $(".menubtn_delete").hide();
        }
        // 菜单和权限

        // 用户
        if (permissions.indexOf("user:add") < 0) {
            $(".userBtn_add").hide();
        }
        if (permissions.indexOf("user:update") < 0) {
            $(".userBtn_update").hide();
        }
        if (permissions.indexOf("user:delete") < 0) {
            $(".userBtn_delete").hide();
        }
        if (permissions.indexOf("user:distributionrole") < 0) {
            $(".userBtn_distributionrole").hide();
        }
        if (permissions.indexOf("user:resetpassword") < 0) {
            $(".userBtn_resetpassword").hide();
        }
        // 用户

    } else {
        $(".btn_add").hide();
        $(".btn_update").hide();
        $(".btn_delete").hide();

        $(".menubtn_add").hide();
        $(".menubtn_update").hide();
        $(".menubtn_delete").hide();

        $(".roleBtn_add").hide();
        $(".roleBtn_update").hide();
        $(".roleBtn_delete").hide();
        $(".roleBtn_empowerment").hide();
        $(".roleBtn_batchdelete").hide();

        $(".userBtn_add").hide();
        $(".userBtn_update").hide();
        $(".userBtn_delete").hide();
        $(".userBtn_distributionrole").hide();
        $(".userBtn_resetpassword").hide();

        $(".btn_dispatch").hide();
        $(".btn_reset").hide();
    }
}

//给页面显示登陆用户名
let user = JSON.parse(localStorage.getItem("user"));
$("#userInfoABtn").append(user.name);

$("#userImages").attr("src",baseUrl+user.imgpath);
$("#user-avatar").attr("src",baseUrl+user.imgpath);
