/**
 * Created by Flutterain on 2018/1/14.
 */
$(function(){
    //渲染列表
    var page = 1;
    var pageSize = 5;
    var imgArr=[];//储存上传的图片的结果

    var render= function(){
        $.ajax({
            type:'get',
            url:'/product/queryProductDetailList',
            data:{
                page:1,
                pageSize:5
            },
            success:function(info){
                console.log(info);
                //渲染模板
                $('tbody').html(template('productTpl',info));

                //渲染分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:page,
                    totalPages:Math.ceil(info.total/info.size),
                    size:'normal',//设置控件的大小
                    //type: 具体的页码，返回page  首页-->first  上一页-->prev  下一页-->next  最后一页-->last
                    //这个函数的返回值，就是按钮的内容
                    itemTexts:function(type,page,current){
                        //console.log(type, page, current);
                        switch (type){
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            case "page":
                                return page;
                        }
                    },

                    tooltipTitles: function(type,page,current){
                        //根据type的不同，返回不同的字符串
                        //console.log(type, page, current);
                        switch (type){
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            case "page":
                                return "去第"+ page +"页";
                        }
                    },
                    useBootstrapTooltip:true,//使用boostrap的tooltip

                    onPageClick:function(a, b,c,p){
                        page=p;
                        render();
                    }
                });
            }

        });
    };
    render();

    //添加商品
    //点击按纽，显示模态框
    $('.btn_add').on('click',function(){
        $('#addModal').modal('show');

        //渲染下拉框组件
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            success:function(info){
                console.log(info);
                $('.dropdown-menu').html(template('menuTpl',info));
            }
        });
    });

    //给dropdown中的所有a注册点击事件
    $('.dropdown-menu').on('click','a',function(){

        //获取到a的内容，修改给dropdown-text
        $('.dropdown-text').text($(this).text());

        //获取到id，给brandId
        $('#brandId').val($(this).data('id'));
        //手动添加状态，通过验证时
        $form.data("bootstrapValidator").updateStatus("brandId","VALID");

    });

    //初始化文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {

            if(imgArr.length>3){
                return;
            }
            console.log(data.result);
            //显示图片，
            $('.img_box').append('<img src="'+ data.result.picAddr +'" width="100" height="100" alt="">');
            //把上传的结果储存到一个数组中
            //判断数组的长度可以判断上传图片的张数
            //添加商品时，可以通过数组拼接出我们要传递给后台的信息
            imgArr.push(data.result);
            console.log(imgArr);

            //根据数组的长度，对productLogo进行校验
            if(imgArr.length===3){
                //校验通过，手动添加
                $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
            }else{
                $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
            }
        }

    });

    //表单校验
    var $form = $("form");
    $form.bootstrapValidator({
        //配置隐藏域校验
        excluded: [],
        //配置校验时显示的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields: {

            brandId: {
                validators: {
                    notEmpty: {
                        message: "二级分类不能为空"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "商品名称不能为空"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "商品描述不能为空"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "商品库存不能为空"
                    },
                    //正则：只能有数字组成，并且第一位不能是0
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: "请输入合法的库存"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "商品尺码不能为空"
                    },
                    //正则：只能有数字组成，并且第一位不能是0
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "请输入合法的尺码，比如(32-44)"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "商品原价不能为空"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "商品价格不能为空"
                    }
                }
            },
            productLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            },

        }

    });
    
    //表单校验成功时
    $form.on('success.form.bv',function(e){
        e.preventDefault();

        var param = $form.serialize();
        //需要拼接上图片的picName和picAddr
        param += "picName1=" + imgArr[0].picName + "picAddr1" + imgArr[0].picAddr ;
        param += "picName2=" + imgArr[1].picName + "picAddr2" + imgArr[1].picAddr ;
        param += "picName3=" + imgArr[2].picName + "picAddr3" + imgArr[2].picAddr ;

        console.log(param);

        //发送ajax请求
        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:param,
            success:function(info){
                if(info.success){
                    $('#addModal').modal('hide');
                    //渲染页面
                    page=1;
                    render();
                    //重置表单
                    $form.data('bootstrapValidator').resetForm(true);
                    $('.dropdown-text').text('请选择二级分类');
                    $('.img_box img').remove();

                    //清空数组
                    imgArr=[];

                }
            }
        })

    })

})