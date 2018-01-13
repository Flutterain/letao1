/**
 * Created by Flutterain on 2018/1/13.
 */
$(function(){

    var page = 1;
    var pageSize=5;

    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);

                var result = template('userTpl',info);
            //    将返回结果渲染到页面
                $("tbody").html(result);

                //渲染分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:page,
                    totalPage:Math.ceil(info.total / info.size),
                    numberOfPages:5,
                    onPageClicked:function(a,b,c,p){
                       page = p;//让当前页码变成p
                       render();
                    }
                });
            }
        });
    }

    //用户启用禁用功能
    $('tbody').on('click','.btn',function(){
        $('#userModal').modal('show');
        console.log(1);
        //获取到id
        var id = $(this).parent().data('id');
        //获取到是否禁用 如果是btn-success类，说明需要启用这个用户，需要传1
        var isDelete = $(this).hasClass('btn-success')?1:0;

        $('.btn_confirm').off().on('click',function(){
            $.ajax({
                type:'post',
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(info){
                   if(info.success){
                       $('#userModal').modal('hide');
                       render();
                   }
                }
            })
        })
    })

})