/**
 * Created by Flutterain on 2018/1/13.
 */


$(function(){
    var page=1;
    var pageSize=5;
    var render = function(){
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
                var result = template('firstTpl',info);
                $('tbody').html(result);

                //分页渲染
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked:function(a,b,c,p){
                        //修改当前页，重新渲染
                        page = p;
                        render();
                    }
                })
            }

        })
    }
    render();

    //添加功能
    $('.btn_add').on('click',function(){
        $('#addModal').modal('show');
    })

    //表单校验功能功能
    var $form = $('form');
    $form.bootstrapValidator({
        //配置校验时显示的图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置校验的规则
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"一级分类的名称不能为空"
                    }
                }
            }
        }
    });
    //给表单注册校验成功的事件
    $form.on('success.form.bv',function(e){
        //阻止默认提交
        e.preventDefault();

        //发送ajax进行提交
        $.ajax({
            type:"post",
            url:'/category/addTopCategory',
            data:$form.serialize(),
            success:function(info){
                console.log(info);
                //关闭模态框
                if(info.success){
                    $('#addModal').modal('hide');
                    //因为添加的数据显示在第一页，重新渲染第一页
                    page=1;
                    render();
                    //重置表单
                    $form.data('bootstrapValidator').resetForm(true);

                }
            }
        });
    });











});

