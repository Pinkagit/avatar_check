$(function(){
    var IndexViewModel = function() {
        this.tip_msg = ko.observable();
    }

    var newIndexViewModel = new IndexViewModel();
    ko.applyBindings(newIndexViewModel, $("#main_container").get(0));
    
    $(".container").load("pages-html/head-audit.html")

    var asideArr = ["pages-html/head-audit.html", "pages-html/report-audit.html", "pages-html/oper-record.html"]

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

    //expand_filter
    $(document).on("click", "#expand_filter", function() {
        $("#expand_filter").css("display", "none");
        
        $("nav").slideDown();
        $("nav").css("display", "flex");
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
        $(this).next().children().animate({"width":"200px"}).focus();
    })

    $(document).on("focusout", ".remarks", function(){
        if ($(this).val()=="") {
            $(this).animate({"width":"0"});
            $(this).parent().prev().removeClass('rotate');
        } else {
            var jsonData = {
                id: parseInt($(this).parents('td').siblings(".uid").text()),
                comment: $(this).val()
            }
            $(this).parent().attr("title", $(this).val());      // 给a标签的添加提示
            console.log(jsonData)
            
            $.ajax({
                type:"get",
                async: true,
                url:"/comment",
                data: jsonData,
                error: function(err){
                    console.log(err)
                },
                success: function(data) {
                    console.log("remarks data:", data);
                }
            })
        }
    }).on("input", ".remarks", function () {
        $(this).parent().attr("title", $(this).val());      // 给a标签的添加提示
    })
    
    // mask
    $(".mask").on("click", function(){
        $(this).css("display", "none");
    })

    $(document).on("click", ".smallPic", function(){
        $(".mask").css("display", "block");
        $(".bigPic").attr("src", $(this).attr("src"));
    })
   
    // 全局ajax
    $(document).ajaxSuccess(function(event, jqxhr, settings){
        // 关闭loading图片
        $(".loading").css("display", "none");

        $(".modal").removeClass("fadeInRight");
        $(".modal").addClass("fadeOutRight");
        
        if (jqxhr.responseText == "fail" || jqxhr.responseText == "success") {
            setTimeout(() => {
                //显示提示框
                $(".modal").removeClass("fadeOutRight");
                $(".modal").addClass("fadeInRight");
                $(".modal").css("display", "block");

                newIndexViewModel.tip_msg(jqxhr.responseText)
            }, 500);
            
        }
    })
    
    $(document).ajaxError(function(event, jqxhr, settings) {
        //关闭loading图片
        $(".loading").css("display", "none");

        $(".modal").removeClass("fadeInRight");
        $(".modal").addClass("fadeOutRight");
        
        if (jqxhr.responseText == "fail" || jqxhr.responseText == "success") {
            setTimeout(() => {
                //显示提示框
                $(".modal").removeClass("fadeOutRight");
                $(".modal").addClass("fadeInRight");
                $(".modal").css("display", "block");

                newIndexViewModel.tip_msg(jqxhr.responseText)
            }, 500);
            
        }

    })

    // 手动关闭提示框
    $(".modal_btn").on("click", function(){
        $(".modal").removeClass("fadeInRight");
        $(".modal").addClass("fadeOutRight");
    })

    
})