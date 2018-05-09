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
            url:"test.json",
            data: jsonData,
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function (data) {
                console.log("receive data: ", data);

                for (let i = 0, len = data.reviewlist.length; i < len; i++) {
                    data.reviewlist[i].addtime = parseInt(data.reviewlist[i].addtime + "000");
                }
                newHeadAuditModel.dataList(data.reviewlist);

                $(".countDown").each(function(i){

                    var countTimer = setInterval( () => {
                        var countTime = countdown($(this).attr("time"), 0);
                        $(this).text(countTime);
                        if (countTime == "已自动拒绝" || countTime == "已自动忽略" ) {

                            var uId = parseInt($(this).siblings(".uid").text());
                            var thisArray = [];

                            thisArray.push($(this).siblings(".oper"));

                            operate([{ id: uId, valid: 0 }], thisArray, 0); //
                            
                            clearInterval(countTimer);
                        }
                        if ($(this).siblings(".oper").text() == "已通过" || $(this).siblings(".oper").text() == "已拒绝") {
                            clearInterval(countTimer);

                            $(this).text("-- 小时 -- 分 -- 秒");
                        }
                    }, 1000);
                })

                $(".remarks").each(function(i){
                    if ($(this).val() != "") {
                        $(this).parent().siblings(".icon-pan_icon").trigger('click')
                    }
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
        var thisArray = [];

        $(".checks").each(function(i){
            if ($(this).is(":checked")) {
                thisArray.push($(this).parent().siblings(".oper"));
                
                var uId = parseInt($(this).parent().siblings(".uid").text());
                operData.push({ID: uId, Valid: 1});
            }
        })

        if (operData.length != 0) {
            operate(operData, thisArray, 1);
        }
    })
    //批量拒绝
    $(document).on("click", "#bulkReject", function () {
        var operData = [];
        var thisArray = [];

        $(".checks").each(function (i) {
            if ($(this).is(":checked")) {
                thisArray.push($(this).parent().siblings(".oper"));
                
                var uId = parseInt($(this).parent().siblings(".uid").text());
                operData.push({ ID: uId, Valid: 0 });
            }
        })

        if (operData.length != 0) {
            operate(operData, thisArray, 0);
        }
    })
    //拒绝
    $(document).on("click", ".reject", function () {
        var uId = parseInt($(this).parent().siblings(".uid").text());
        var thisArray = [];

        thisArray.push($(this).parent());
        
        operate([{ id: uId, valid: 0 }], thisArray, 0);
    })
    //通过
    $(document).on("click", ".pass", function (){
        var uId = parseInt($(this).parent().siblings(".uid").text());
        var thisArray = [];

        thisArray.push($(this).parent());

        operate([{ id: uId, valid: 1 }], thisArray, 1);
    })

    // 操作
    function operate(operData, thatArray, _index) {
        operData = { "reviewreqlist": operData }
        operData = JSON.stringify(operData);

        console.log("operData: ", operData);
        
        $(".loading").css("display", "block");
        
        $.ajax({
            type:"post",
            async: true,
            url: "/doreview",
            data: operData,
            contentType: 'application/json',
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function(data) {
                console.log(data);
                
                if (data == "success") {
                    for (let i = 0, len = thatArray.length; i < len; i++) {
                        thatArray[i].siblings("td").eq(0).find("input").attr("disabled", "disabled");
                        if (_index == 0) {
                            thatArray[i].text("已拒绝");
                        } else if (_index == 1) {
                            thatArray[i].text("已通过");
                        }
                    }
                    $(".checks").attr("checked", false);
                }
            }
        })
    }
    
})