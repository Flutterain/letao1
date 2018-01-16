/**
 * Created by Flutterain on 2018/1/15.
 */
$(function(){
    $.ajax({
        type:'get',
        url:"/category/queryTopCategory",
        success:function(info){
            console.log(info);
            $('.category_left .mui-scroll').html(template('tpl_left',info));
            renderSecond(info.rows[0].id);
        }
    });


    function renderSecond(id) {
        $.ajax({
            type:'get',
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            success:function (info) {
                console.log(info);
                $(".category_right .mui-scroll").html( template("tpl_right", info) );
            }
        })
    }


    //点击一级分类，重新渲染对应的二级分类
    $('.category_left .mui-scroll').on('click','li',function(){
        //修改样式
        $(this).addClass('now').siblings().removeClass('now');
        var id = $(this).data('id');
        renderSecond(id);
        //让category_right .mui-scroll 滚回到0,0的位置
        mui(".mui-scroll-wrapper").scroll()[1].scrollTo(0,0,500);
    })
});