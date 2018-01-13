/**
 * Created by Flutterain on 2018/1/11.
 */

$(function(){

    var form = $('form');
    form.bootstrapValidator({

        //设置小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //设置校验规则
        fields:{
            //配置username的校验规则
            username:{
                //可以配置username的所有校验规则
                validators:{
                    //非空校验
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    callback:{
                        message:"用户名不存在"
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码必须是6-12位"
                    },
                    //用于校验失败后，提示信息
                    callback:{
                        message:"密码错误"
                    }
                }
            }

        }

    });
    //需要给表单一个校验成功的事件，这个事件在表单校验成功的时候触发
    form.on('success.form.bv',function(e){
        e.preventDefault();

        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            //dataType:"json",
            data:form.serialize(),//表单序列化
            success:function(info){
                //登录成功
                if(info.success){
                    location.href="index.html";
                }
                //当我们初始化好表单校验插件时，我们可以通过以下方法来获取表单校验的validator实例，
                // 通过validator实例调用一些方法来完成某些功能。
                //3个参数  updateStatus(field, status, validatorName)
                //1字段名 2状态 3现实哪个校验区的内容
                if(info.error === 1000){
                    form.data('bootstrapValidator').updateStatus("username", "INVALID","callback" );
                }

                if(info.error === 1001){
                    form.data('bootstrapValidator').updateStatus("password", "INVALID","callback" );
                }
            }

        })
    })

    //重置校验的样式
    $("[type='reset']").on('click',function(){
        form.data('bootstrapValidator').resetForm();
    })
});