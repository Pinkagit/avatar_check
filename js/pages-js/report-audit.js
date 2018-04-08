$(function(){

    var reportAuditViewModel = function() {
        this.dataList = ko.observableArray();
        this.serverList = ko.observableArray();
        this.selectedServer = ko.observable();
        this.id = ko.observable();
        this.reportId = ko.observable();
    }

    var newReportAuditModel = new reportAuditViewModel();
    ko.applyBindings(newReportAuditModel, $("#report").get(0));

    // 获取数据
    var pageClick = function (pageclickednumber) {
        $(".loading").css("display", "block");
        
        var jsonData = {
            type: 1,
            page: pageclickednumber
        }

        newReportAuditModel.id() ? $.extend(jsonData, { playerid: newReportAuditModel.id() }) : $.extend(jsonData, {});
        newReportAuditModel.selectedServer() ? $.extend(jsonData, { zoneid: newReportAuditModel.selectedServer() }) : $.extend(jsonData, {});
        // reportAuditViewModel.reportId() ? $.extend(jsonData, {  })
        
        console.log("jsonData: ", jsonData);

        $.ajax({
            type: "get",
            async: true,
            // url: "/reqreview",
            url: "/static/test.json",
            data: jsonData,
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function (data) {
                console.log("receive data: ", data);

                newReportAuditModel.dataList(data.test);

                $(".countDown").each(function (i) {
                    var countTimer = setInterval(() => {
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
    $(document).on("click", "#certain", function () {
        if (newReportAuditModel.id() || newReportAuditModel.selectedServer()) {
            pageClick(1);
        }
    })

    //批量忽略
    $(document).on("click", "#bulkIgnore", function () {
        var operData = [];

        $(".checks").each(function (i) {
            if ($(this).is(":checked")) {
                var uId = $(this).parent().siblings("td").eq(0).text();
                operData.push({ ID: uId, Valid: 1 });
            }
        })

        if (operData.length != 0) {
            operate(operData);
        }
    })
    //批量删除
    $(document).on("click", "#bulkDelete", function () {
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
    //删除头像
    $(document).on("click", ".delete", function () {
        var uId = $(this).parent().siblings("td").eq(1).text();

        operate([{ ID: uId, Valid: 0 }]);
    })
    //忽略举报
    $(document).on("click", ".ignore", function () {
        var uId = $(this).parent().siblings("td").eq(1).text();

        operate([{ ID: uId, Valid: 1 }]);
    })

    // 操作
    function operate(operData) {
        console.log("operData: ", operData);

        $(".loading").css("display", "block");
        
        $.ajax({
            type: "post",
            async: true,
            url: "/doreview",
            data: operData,
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("jqXHR: ", jqXHR);
                console.log("textStatus: ", textStatus);
                console.log("errorThrown: ", errorThrown);
            },
            success: function (data) {
                console.log(data);
            }
        })
    }
})