//数据获取
var advType = 0;
getAdvList();
getProList();
//获取广告

var arrSliderBot=[];
function getAdvList(){
    var xhr = new XMLHttpRequest();
    xhr.open( "get","getAdvListAll" );
    xhr.send();
    xhr.onload = function(){
        var obj = JSON.parse( xhr.responseText );
        if( obj.ok === 1 ){
            //console.log(xhr.responseText);//获取的是所有的信息
            for( var i = 0;i<obj.advListAll.length;i ++ ) {
                //console.log(obj.advListAll.length);
                //轮播图
                if (obj.advListAll[i].advType === 1) {
                    document.querySelector(".banner").innerHTML = baidu.template("banner", {
                        advList: obj.advListAll[i]
                    })
                }
                //轮播图的底部
                else if (obj.advListAll[i].advType === 2) {
                    arrSliderBot.unshift(obj.advListAll[i]);
                }
                //热门回收
                else if (obj.advListAll[i].advType === 4) {
                    document.querySelector(".back").innerHTML = baidu.template("back", {
                        advList: obj.advListAll[i]
                    })
                }
                //优品精选
                else if (obj.advListAll[i].advType === 3) {
                    //console.log(obj.advListAll[i].advType);
                    document.querySelector(".pretty").innerHTML = baidu.template("pretty", {
                        advList: obj.advListAll[i]
                    })
                }
            }
            //轮播图底部的渲染
            document.querySelector(".phone_top").innerHTML = baidu.template("slider_bot", {
                advList:arrSliderBot
            });
            //console.log(arr);
        }else{
            alert(obj.msg);
        }
    }
}

//获取商品
var arrHotBack = [];
var arrPretty=[];
function getProList(){
    var xhr = new XMLHttpRequest();
    xhr.open( "get","getProListAll" );
    xhr.send();
    xhr.onload = function() {
        var obj = JSON.parse(xhr.responseText);
        if (obj.ok === 1) {
            for (var i = 0; i < obj.proListAll.length; i++) {
                //热门手机回收
                if (obj.proListAll[i].proType === 3) {
                    arrHotBack.unshift(obj.proListAll[i]);
                }
                //优品精选
                if( obj.proListAll[i].proType === 2 ){
                    arrPretty.unshift(obj.proListAll[i]);
                }
            }
            //商品热门手机回收
            document.querySelector( ".proBack" ).innerHTML = baidu.template("proBack",{
                proList:arrHotBack
            });
            //商品优品精选
            document.querySelector( ".proPretty" ).innerHTML = baidu.template("proPretty",{
                proList:arrPretty
            });
        }else{
            alert(obj.msg);
        }
    }
}

//获取店铺




