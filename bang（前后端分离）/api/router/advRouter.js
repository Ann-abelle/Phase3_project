const bodyParser = require( "body-parser" );
const fs = require( "fs" );
const formidable = require( "formidable" );
const db = require( "../modules/db" );
const {upPic} = require( "../modules/upPic" );//解构赋值
const common = require( "../modules/common" );
const mongodb = require( "mongodb" );


//添加数据信息
module.exports.addAdv = function( req,res ){
    upPic(req,"advPic",function( obj ){//返回对象
        if( obj.ok === 1 ){
            db.insertOne("advList",{
                advName:obj.params.advName,
                advType:obj.params.advType/1,
                advPic:obj.newPicName,
                advUrl:obj.params.advUrl,
                advTime:common.getNowTime(),
                orderBy:obj.params.orderBy/1
            },function(err,results){
                res.json({
                    ok:1,
                    msg:"success"
                })
            })
        }else{
            res.json({
                ok:2,
                msg:obj.msg
            })
        }
    })
}

//获取数据库中的信息
module.exports.getAdvList = function( req,res ){//分页显示的
    var pageIndex = req.query.pageIndex / 1;//当前页
    var pageNum = 5;//每页显示条数
    var pageSum = 1;//初始化为1页
    var whereObj = {};//没有限制条件  whereObj代表限制条件

    //按照关键字搜索
    var advType = req.query.advType / 1;//0,1,2,3,4
    if( advType > 0 ){
        whereObj.advType = advType;//加了限制条件
    }

    //按照排序搜索
    var advSort = req.query.advSort / 1;//分情况
    var sortObj = {//不加限制条件时，按照时间的倒序和orderBy的倒序
        advTime:-1,
        orderBy:-1
    }
    if( advSort === 2 ){
        sortObj = {
            orderBy:-1
        }
    }
    if( advSort === 3 ){
        sortObj = {
            advTime:-1
        }
    }
    if( advSort === 4 ){
        sortObj={
            advType:-1
        }
    }

    db.count("advList",whereObj,function( count ){
       pageSum = Math.ceil( count/pageNum );
        if( pageSum <= 0 )
            pageSum = 1;
        if( pageIndex > pageSum )
            pageIndex = pageSum;
        if( pageIndex < 0 )
            pageIndex = 1;
        db.find("advList",{
            whereObj,
            skipNum:(pageIndex - 1 ) * pageNum,
            limitNum:pageNum,
            sortObj
        },function( err,advList ){
            res.json({
                ok:1,
                advList,
                pageIndex,
                pageSum
            })
        })
    })
}

//获取数据库中所有的信息不分页
module.exports.getAdvListAll = function( req,res ){
    var whereObj = {};//没有限制条件  whereObj代表限制条件
        db.find("advList",{
            whereObj
        },function( err,advListAll ){
            res.json({
                ok:1,
                advListAll
            })
        })
}


//要修改的数据-->按照id来获取数据
module.exports.getAdvInfoById = function( req,res ){
    db.findOneById("advList",req.query.id,function( err,advInfo ){
        res.json({
            ok:1,
            advInfo
        })
    })
}

//更改数据信息
module.exports.upAdv = function( req,res ){
    function _call(obj){
        var upObj = {//未上传图片要更新的内容
            $set:{
                advName:obj.params.advName,
                advType:obj.params.advType,
                advUrl:obj.params.advUrl,
                orderBy:obj.orderBy
            }
        }
        if( obj.ok === 1 ){//上传成功
            upObj.$set.advPic = obj.newPicName;
        }
        db.updateOneById("advList",obj.params.id,upObj,function( err,results ){
            res.json({
                ok:1,
                msg:"success"
            });
        })

    }

    upPic(req,"advPic",function( obj ){//当图片不符合要求时  obj回调函数
        if( obj.ok === 2 ){
            res,json({
                ok:obj.ok,
                msg:obj.msg
            })
        }else{//当图片符合要求时
            if( obj.ok === 1 ){
                db.findOne("advList",req.query.id,function( err,advInfo ){
                    fs.unlink("./upload/" + advInfo.advPic,function( err ){
                        _call( obj );
                    })
                })
            }else{//当图片未上传
                _call( obj );
            }
        }
    })

}

//删除数据库信息
module.exports.delAdv = function( req,res ){
    db.findOne("advList",{_id:mongodb.ObjectId(req.query.id)},function( err,advInfo ){
        //console.log( mongodb.ObjectId(req.query.id));
        fs.unlink("./upload/" + advInfo.advPic,function( err ){
            db.deleteOneById("advList",req.query.id,function( err,results ){
                res.json({
                    ok:1,
                    msg:"删除成功"
                })
            })
        })
    })


}




