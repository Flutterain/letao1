/**
 * Created by Flutterain on 2018/1/13.
 */
$(function(){
    var page= 1;
    var pageSize=5;
    var render = function(){
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
                $('tbody').html(template('secondTpl',info));

                //渲染分页
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(a, b,c,p){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        //修改page的值，重新渲染
                        page=p;
                        render();
                    }
                });
            }
        })
    };
    render();


    //点击添加分类按纽，模态框弹出
    $('.btn_add').on('click',function(){
        $('#addModal').modal('show');
        console.log(1);
        //点击button，显示一级分类的数据
        $.ajax({
            type:'get',
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(info){
                console.log(info);
                $('.dropdown-menu').html(template('menuTpl',info));
            }
        })
    });

    //下拉列表选中功能
    //给下拉列表中的a标签注册点击事件
    //获取点击的a的内容，设置给dropdown-text的内容
   $('.dropdown-menu').on('click','a',function(){
       var content = $(this).text();
       $('.dropdown-text').text(content);
   //    获取id，把id的值赋给categoryId的隐藏
       var id = $(this).data('id');
       $('#categoryId').val(id);

       //手动把categoryId设置为VALID状态
       $form.data('bootstrapValidator').updateStatus('categoryId','VALID');
   })

    //初始化文件上传功能
    $('#fileupload').fileupload({
        dataType:'json',
        //文件执行成功时，会执行回调函数
        done:function(e,data){
            //通过data.result可以获取到一个对象，这个对象的picAddr属性就是图片的地址
            console.log(data);
            var result = data.result.picAddr;
            $('.img_box img').attr('src',result);

            //修改隐藏域的value
            $('#brandLogo').val(result);
            // 让brandLogo改为VALID状态
            $form.data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });

    //表单验证
    var $form = $('form');
    $form.bootstrapValidator({
        //配置不做校验的内容，给空数组，目的是让隐藏的和禁用的都做校验
        excluded:[],
        //配置校验时显示的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置校验规则
        fields: {

            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },

            brandName:{
                validators: {
                    notEmpty:{
                        message:'请输入品牌名称'
                    }
                }
            },


            brandLogo:{
                validators: {
                    notEmpty:{
                        message:'请输入品牌logo'
                    }
                }
            }
        }
    });

    //给表单注册校验成功事件
    $form.on('success.form.bv',function(e){
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            success:function(info){
               if(info.success){
                   //隐藏模态框
                   $('#addModal').modal('hide');
                   //重新渲染第一页
                   page=1;
                   render();
                   //重置表单样式
                    $form.data('bootstrapValidator').resetForm(true);
                   //重置按钮的值，图片的值
                   //dropdown-text是一个span，不能用val，用text方法
                   $('.dropdown-text').text('请选择一级分类');
                   $('.img_box img').attr('src','images/none.png');
               }
            }
        })
    })


})