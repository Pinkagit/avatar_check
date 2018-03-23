$(function(){

    // 配置datepick
    $('#startTime').fdatepicker({
        // format: 'yyyy-mm-dd hh:ii',
        format: 'yyyy-mm-dd',
        pickTime: false             //二级时间
    });

    $("#endTime").fdatepicker({
        format: "yyyy-mm-dd",
        pickTime: false
    })

    
    
})