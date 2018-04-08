$(function(){

    
    var headAuditViewModel = function() {
        this.dataList = ko.observableArray();
        this.serverList = ko.observableArray();
        this.selectedServer = ko.observable();
        this.id = ko.observable();
    }

    var newHeadAuditModel = new headAuditViewModel();
    ko.applyBindings(newHeadAuditModel, $("#audit").get(0));
    
    // 获取数据
    var pageClick = function(pageclickednumber) {
        $(".loading").css("display", "block");
        
        var jsonData = {
            type: 1,
            page: pageclickednumber
        }
        
        newHeadAuditModel.id() ? $.extend(jsonData, { playerid: newHeadAuditModel.id() }) : $.extend(jsonData, {});
        newHeadAuditModel.selectedServer() ? $.extend(jsonData, { zoneid: newHeadAuditModel.selectedServer() }) : $.extend(jsonData, {});

        console.log("jsonData: ", jsonData);
        
        $.ajax({
            type: "get",
            async: true,
            // url: "/reqreview",
            url:"/static/test.json",
            data: jsonData,
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function (data) {
                console.log("receive data: ", data);

                newHeadAuditModel.dataList(data.test);

                $(".countDown").each(function(i){
                    var countTimer = setInterval( () => {
                        var countTime = countdown($(this).attr("time"), 0);
                        $(this).text(countTime);

                        if (countTime == "已自动拒绝" || countTime == "已自动忽略") {
                            clearInterval(countTimer)
                        }
                        
                    }, 1000);
                })
                
                $("#pager").pager({ pagenumber: pageclickednumber, pagecount: data.pagenum, buttonClickCallback: pageClick });
            }
        })
    }
    pageClick(1);

    // 筛选
    $(document).on("click", "#certain", function(){
        if (newHeadAuditModel.id() || newHeadAuditModel.selectedServer()) {
            pageClick(1);
        }
    })

    //批量通过
    $(document).on("click", "#bulkPass", function () {
        var operData = [];

        $(".checks").each(function(i){
            if ($(this).is(":checked")) {
                var uId = $(this).parent().siblings("td").eq(0).text();
                operData.push({ID: uId, Valid: 1});
            }
        })

        if (operData.length != 0) {
            operate(operData);
        }
    })
    //批量拒绝
    $(document).on("click", "#bulkReject", function () {
        var operData = [];

        $(".checks").each(function (i) {
            if ($(this).is(":checked")) {
                var uId = $(this).parent().siblings("td").eq(0).text();
                operData.push({ ID: uId, Valid: 0 });
            }
        })

        if (operData.length != 0) {
            operate(operData);
        }
    })
    //拒绝
    $(document).on("click", ".reject", function () {
        var uId = $(this).parent().siblings("td").eq(1).text();

        operate([{ ID: uId, Valid: 0 }]);
    })
    //通过
    $(document).on("click", ".pass", function (){
        var uId = $(this).parent().siblings("td").eq(1).text();

        operate([{ ID: uId, Valid: 1 }]);
    })

    // 操作
    function operate(operData) {
        console.log("operData: ", operData);

        $(".loading").css("display", "block");
        
        $.ajax({
            type:"post",
            async: true,
            url: "/doreview",
            data: operData,
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function(data) {
                console.log(data);
            }
        })
    }
    
})