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

    //二级菜单的显示和影藏功能
    $('.second').prev().on('click',function(){
       $(this).next().slideToggle();
    })

    //侧边栏显示与隐藏
    $('.icon_menu').on("click",function(){
        $('.lt_aside').toggleClass('now');
        $('.lt_main').toggleClass('now');
    })

  //退出功能，模态框
    $('.icon_logout').on('click',function(){
        $('#logoutModal').modal('show');
    })

    $('.btn_logout').off().on("click",function(){
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            success:function(info){
                if(info.success){
                    location.href="login.html";
                }
            }
        });
    })


})