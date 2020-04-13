var api = 'http://127.0.0.1:8001/';

// 下次再发送ajax请求把token带到后台
let token = $.cookie("TOKEN");

// 设置全局ajax前置拦截
$.ajaxSetup({
   headers: {
       'TOKEN': token
   }
});

// 如果访问登陆页面之外的页面 并且还没有登陆成功之后写入cookie的token就转到登陆页面
if(token == undefined){
   if(window.location != "http://localhost:8888/ERP_WEB/login.html"){
      window.top.location = '/ERP_WEB/login.html';
   }
}else{
   if(window.location != "http://localhost:8888/ERP_WEB/login.html"){
      $.ajax({
         url: api + "login/checkLogin",
         async: true,// 同步处理
         type: "post",
         dataType: "json",
         success: function (res) {
            if(res.code == -1){
               window.top.location = '/ERP_WEB/login.html';
            }
         },
         error: function (res) {
            window.top.location = '/ERP_WEB/login.html';
         }
      });
   }
}
