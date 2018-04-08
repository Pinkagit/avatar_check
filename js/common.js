// countdown
function countdown(old_time, flag) {

    var now_time = new Date().getTime();
    var differ_Time = parseInt(old_time) + (1000 * 60 * 60 * 24) - parseInt(now_time);

    if (differ_Time > 0) {
        var _hour = checkTime(Math.floor(differ_Time / (1000 * 60 * 60)));
        var _minute = checkTime(Math.floor(differ_Time % (1000 * 60 * 60) / (1000 * 60)));
        var _seconds = checkTime(Math.floor(differ_Time % (1000 * 60 * 60) % (1000 * 60) / 1000));

        return _hour + " 时 " + _minute + " 分 " + _seconds + " 秒 ";

    } else if (flag == 0) {
        return "已自动拒绝";
    } else if (flag == 1) {
        return "已自动忽略";
    }
    
}

function checkTime(i) { //将0-9的数字前面加上0
    if (i < 10) {
        i = "0" + i;
    }
    return i;
} 