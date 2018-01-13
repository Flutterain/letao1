/**
 * Created by Flutterain on 2018/1/13.
 */
$(function(){
    //初始化实例
    var myChart = echarts.init(document.querySelector('.chart_left'));
    //指定图表的配置和各项数据
    var data = [
        {name:'1月',num:330},
        {name:'2月',num:200},
        {name:'3月',num:300},
        {name:'4月',num:250},
        {name:'5月',num:150},
        {name:'6月',num:450},
    ];

    var arr1 = data.map(function(e,i){
        return e.name;
    });
    var arr2 = data.map(function(e,i){
        return e.num;
    });

    var option={
        title: {
            text: '2017年注册人数'
        },
        tooltip: {},
        legend: {
            data: ['人数']
        },
        xAxis: {
            data: arr1
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: arr2
        }]
    };

    //使用配置项和图标
    myChart.setOption(option);

    var myChart1 = echarts.init(document.querySelector('.chart_right'));


    var option1={
        title: {
            text: '热门品牌销售',
            subtext:'2017年6月',
            x:'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克', '阿迪', '新百伦', '迪卡侬', '阿迪王']
        },
        series: [
            {
                name: '销售情况',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '耐克'},
                    {value: 310, name: '阿迪'},
                    {value: 234, name: '新百伦'},
                    {value: 135, name: '迪卡侬'},
                    {value: 1548, name: '阿迪王'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, .5)'
                    }
                }
            }
        ]
    };

    myChart1.setOption(option1);
})