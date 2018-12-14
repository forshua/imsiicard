(function () {
    window.UTIL = {};
    /**
     * url 需要iframe的url
     * callback 回调函数
     */
    UTIL.loadiframe = function (url, callback) {
        var body = document.getElementsByTagName('body')[0];
        // document.title = title;
        var iframe = document.createElement("iframe");
        iframe.title = '';
        iframe.width = 400;
        iframe.height = 200;
        iframe.setAttribute("src", url);
        iframe.addEventListener('load', function () {
            setTimeout(function () {
                // iframe.removeEventListener('load');
                document.body.removeChild(iframe);
                // 如果穿了回调执行回调
                if (callback) {
                    callback();
                }
            }, 100);
        });
        document.body.appendChild(iframe);
    }

    UTIL.imsicard = function (imsi, card, callback) {
        // imsi登录
        UTIL.loadiframe('http://h5.nty.tv189.com/api/portal/user/tysx-userlogin?imsiid='+imsi, function () {
            // 激活卡
            UTIL.loadiframe('http://h5.nty.tv189.com/my/api/cardactivate?carNum='+card, function () {
                // 注销
                UTIL.loadiframe('http://h5.nty.tv189.com/api/portal/user/logout', function () {
                    if(callback){
                        callback()
                    }
                })
            })
        })
    }
})()

var accList = [];
var total = 0;
var pause = false;
$(function () {
    var oper = function(){
        if(pause){
            alert('目前是暂停状态');
            return;
        }
        if(accList.length === 0){
            alert('已经全部激活完了');
            return;
        }
        var sarr = accList.shift().split(',');
        if(sarr.length>1){
            UTIL.imsicard(sarr[0],sarr[1],function(){
                $('#acc_ed').html(total - accList.length);
                oper();
            });
        }else{
            //直接读取下一条
            $('#acc_ed').html(total - accList.length);
            oper();
        }
        
    }
    $("#my_file").on('change', function (source) {
        var file = $('#my_file')[0].files[0];
        //            console.log(file);
        var reader = new FileReader();
        //将文件以文本形式读入页面
        reader.readAsText(file, "gb2312");
        reader.onload = function (e) {
            accList = e.target.result.split("\n");
            total = accList.length;
            $('#acc_total').html(total);
            console.log(accList);
        }
    });
    $('#start').on('click', function () {
        pause = false;

        if (accList.length <= 0) {
            alert('请先选择文件');
            return;
        }
        if (accList.length > 0 && $('#acc_ed') > 0) {
            alert('正在处理中，请不要重复操作');
            return;
        }
        oper();
        // loadIframe();
        // timer = setInterval(function () {
        //     loadIframe();
        // }, 5000);
    });
    $('#pause').on('click',function(){
        // 暂停
        pause = true;

    })
    window.onbeforeunload = function () {
        return "你确定要离开吗";
    };
})