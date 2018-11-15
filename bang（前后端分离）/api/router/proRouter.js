const fs = require( "fs" );
const formidable = require( "formidable" );
const db = require( "../modules/db" );
const common = require( "../modules/common" );
const mongodb = require( "mongodb" );
const {upPic} = require( "../modules/upPic" );//解构赋值
//商品添加
module.exports.addPro = function( req,res ){
    upPic(req,"proPic",function( obj ){
        if( obj.ok === 1 ){
            db.insertOne("proList",{
                proName:obj.params.proName,
                proType:obj.params.proType/1,
                proPic:obj.newPicName,
                proUrl:obj.params.proUrl,
                proPrice:obj.params.proPrice,
                orderBy:obj.params.orderBy/1,
                proTime:common.getNowTime()
            },function(){
                res.json({
                    ok:1,
                    msg:"success"
                })
            })
        }else{
            res.json({
                ok:obj.ok,
                msg:obj.msg
            })
        }
    })
}

//商品获取
module.exports.getProList = function( req,res ){
    var pageIndex = req.query.pageIndex / 1;//当前页
    var pageNum = 5;//每页显示条数
    var pageSum = 1;//初始化为1页
    var whereObj = {};//没有限制条件  whereObj代表限制条件

    //按照关键字搜索
    var proType = req.query.proType / 1;//0,1,2,3,4
    if( proType > 0 ){
        whereObj.proType = proType;//加了限制条件
    }

    //按照排序搜索
    var proSort = req.query.proSort / 1;//分情况
    var sortObj = {//不加限制条件时，按照时间的倒序和orderBy的倒序
        proTime:-1,
        orderBy:-1
    }
    if( proSort === 2 ){
        sortObj = {
            orderBy:-1
        }
    }
    if( proSort === 3 ){
        sortObj = {
            proTime:-1
        }
    }
    if( proSort === 4 ){
        sortObj={
            proType:-1
        }
    }

    db.count("proList",whereObj,function( count ) {
        pageSum = Math.ceil(count / pageNum);
        if (pageSum <= 0)
            pageSum = 1;
        if (pageIndex > pageSum)
            pageIndex = pageSum;
        if (pageIndex < 0)
            pageIndex = 1;
        db.find("proList", {
            whereObj,
            skipNum: (pageIndex - 1) * pageNum,
            limitNum: pageNum,
            sortObj
        }, function (err, proList) {
            res.json({
                ok: 1,
                proList,
                pageIndex,
                pageSum
            })
        })
    })
}

//获取数据库中所有的信息不分页
module.exports.getProListAll = function( req,res ){
    var whereObj = {};//没有限制条件  whereObj代表限制条件
    db.find("proList",{
        whereObj
    },function( err,proListAll ){
        res.json({
            ok:1,
            proListAll
        })
    })
}

//商品删除
module.exports.delPro = function( req,res ){
    db.findOne("proList",{_id:mongodb.ObjectId(req.query.id)},function( err,proInfo ){
        //console.log( mongodb.ObjectId(req.query.id));
        fs.unlink("./upload/" + proInfo.proPic,function( err ){
            db.deleteOneById("proList",req.query.id,function( err,results ){
                res.json({
                    ok:1,
                    msg:"删除成功"
                })
            })
        })
    })
}

//要修改的数据-->按照id来获取数据
module.exports.getProInfoById = function( req,res ){
    db.findOneById("proList",req.query.id,function( err,proInfo ){
        res.json({
            ok:1,
            proInfo
        })
    })
}

//更改商品信息
module.exports.upPro = function( req,res ){
    function _call(obj){
        var upObj = {//未上传图片要更新的内容
            $set:{
                proName:obj.params.proName,
                proSubtitle:obj.params.proSubtitle,
                proType:obj.params.proType,
                proUrl:obj.params.proUrl,
                proPrice:obj.params.proPrice,
                orderBy:obj.params.orderBy
            }
        }
        if( obj.ok === 1 ){//上传成功
            upObj.$set.proPic = obj.newPicName;
        }
        db.updateOneById("proList",obj.params.id,upObj,function( err,results ){
            res.json({
                ok:1,
                msg:"success"
            });
        })

    }

    upPic(req,"proPic",function( obj ){//当图片不符合要求时  obj回调函数
        if( obj.ok === 2 ){
            res,json({
                ok:obj.ok,
                msg:obj.msg
            })
        }else{//当图片符合要求时
            if( obj.ok === 1 ){
                db.findOne("proList",req.query.id,function( err,proInfo ){
                    fs.unlink("./upload/" + proInfo.proPic,function( err ){
                        _call( obj );
                    })
                })
            }else{//当图片未上传
                _call( obj );
            }
        }
    })

}