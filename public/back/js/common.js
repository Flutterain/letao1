/**
 * Created by Flutterain on 2018/1/11.
 */


$(function(){
   //进度条功能
    NProgress.configure({ showSpinner: false });//禁用进度环
    $(document).ajaxStart(function(){
        NProgress.start() ;//— 显示进度条
    });

    $(document).ajaxStop(function(){
        setTimeout(function(){
            NProgress.done();
        },1000);
    })

    //在非登录页面，发送ajax请求，询问用户是否已登录，如果没登陆就跳转登录页面
    if(location.href.indexOf("login.html")== -1){
        $.ajax({
            type:"get",
            url:"/employee/checkRootLogin",
            success:function(info){
                if(info.error===400){
                    location.href="login.html"
                }
            }
        })
    }

})