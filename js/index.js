$(function(){
    $(".container").load("../pages-html/head-audit.html")

    var asideArr = ["../pages-html/head-audit.html", "../pages-html/report-audit.html", "../pages-html/oper-record.html"]

    //aside 点击加载事件
    $("aside").find("li").each(function(i){
        $(this).on("click", function(){
            $(".container").load(asideArr[i]);
            $(this).siblings('li').find('a').removeClass('actived');
            $(this).find('a').addClass('actived');
        })
    })
    
    //表单样式
    $(document).on('focus', '.inputaddon', function(){
        $(this).prev('span').animate({top: '-45px'});
        $(this).css({
            "border-bottom-color":"lightskyblue"
        })
    }).on('focusout', '.inputaddon', function(){

        var index = $(".datetime").index($(this));
        
        var drop_flag = $(".dropdown-menu").eq(index-2).css('display');
        console.log(index, drop_flag)
        if (!$(this).val() && (drop_flag == "none" || !drop_flag )) {
            $(this).prev('span').animate({ top: '0' });
            $(this).css({
                "border-bottom-color": "#bccc"
            })
        } 

    })

    // certain
    $(document).on("click", '#certain', function () {
        $(".icon-opensearchkaifangsousuo").addClass('wobble certain_actived');
        setTimeout(() => {
            $(".icon-opensearchkaifangsousuo").removeClass('wobble certain_actived')
        }, 1000);
    })

    // remarks
    $(document).on("click", ".icon-pan_icon", function(){
        $(this).addClass('rotate');
        $(".remarks").animate({"width":"200px"}).focus()
    })

    $(document).on("focusout", ".remarks", function(){
        if ($(this).val()=="") {
            $(this).animate({"width":"0"});
            $(".icon-pan_icon").removeClass('rotate');
        }
    }).on("input", ".remarks", function () {
        $(this).parent().attr("title", $(this).val());
    })
    
    // mask
    $(".mask").on("click", function(){
        $(this).css("display", "none");
    })

    $(document).on("click", ".smallPic", function(){
        $(".mask").css("display", "block");
        $(".bigPic").attr("src", $(this).attr("src"));
    })
   
})