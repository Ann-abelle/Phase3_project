const formidable=require("formidable");
const fs=require("fs");
const db=require("../modules/db");
const common=require("../modules/common");
module.exports.addAdv=function(req,res){
    var form=new formidable.IncomingForm();
    form.uploadDir="./upload";
    form.keepExtensions=true;// 保留扩展名
    form.encoding="utf-8";
    form.parse(req,function(err,params,file){
        if(file["advPic"].size>0){
            var nameArr=[".jpg",".png",".gif"];
            var picName=file["advPic"].name;
            var keepName=picName.substr(picName.lastIndexOf("."))// 扩展名
            if(nameArr.includes(keepName)){
                // 数据库当中
                var newPicName=Date.now()+keepName;
                fs.rename(file["advPic"].path,"./upload/"+newPicName,function(err,results){
                    db.insertOne("advList",{
                        advName:params.advName,
                        advType:params.advType/1,
                        advPic:newPicName,
                        advUrl:params.advUrl,
                        addTime:common.getNowTime(),
                        orderBy:params.orderBy/1
                    },function(err,results){
                        res.json({
                            ok:1,
                            msg:"success"
                        })
                    })
                })

            }else{
                fs.unlink(file["advPic"].path,function(err){
                    res.json({
                        ok:2,
                        msg:"请选择正确的图片格式：.gif,.png,.jpg"
                    })
                });

            }

        }else{
            fs.unlink(file["advPic"].path,function(err){
                res.json({
                    ok:2,
                    msg:"请选择要上传的文件111"
                })
            })

        }
        // console.log(file);

    })

}
module.exports.getAdvList=function(req,res){
    var pageIndex=req.query.pageIndex/1;
    var sortType=req.query.type/1;
    var sortObj={
        orderBy:-1,
        addTime:-1
    };
    if(sortType===2){
        sortObj={
            orderBy:-1
        }
    }else  if(sortType===3){
        sortObj={
            addTime:-1
        }
    }else  if(sortType===4){
        sortObj={
            advType:-1
        }
    }
    var pageNum=5;
    var pageSum=1;

    var whereObj={};
    var advType=req.query.advType/1;
    if(advType>0){
        whereObj.advType=advType
    }

    // var a=new RegExp("lslsl");
    // advName:a

    db.count("advList",whereObj,function(count){
        pageSum=Math.ceil(count/pageNum);
        if(pageSum<1)
            pageSum=1;
        if(pageIndex>pageSum)
            pageIndex=pageSum;
        if(pageIndex<1)
            pageIndex=1;
        db.find("advList",{
            whereObj,
            skipNum:(pageIndex-1)*pageNum,
            limitNum:pageNum,
            sortObj
        },function(err,advList){
            res.json({
                ok:1,
                advList,
                pageIndex,
                pageSum
            })
        })
    })
}
module.exports.upAdv=function(req,res){
    var form=new formidable.IncomingForm();
    form.uploadDir="./upload";
    form.keepExtensions=true;// 保留扩展名
    form.encoding="utf-8";
    form.parse(req,function(err,params,file){
        // 上传了图片
        if(file["advPic"].size>0){
            var nameArr=[".jpg",".png",".gif"];
            var picName=file["advPic"].name;
            var keepName=picName.substr(picName.lastIndexOf("."))// 扩展名
            if(nameArr.includes(keepName)){
                // 数据库当中
                var newPicName=Date.now()+keepName;
                /*1、将之前 的图片删除掉
                * 2、更新数据*/
                db.findOneById("advList",params.id,function(err,advInfo){
                    fs.unlink("./upload/"+advInfo.advPic,function(err){
                        fs.rename(file["advPic"].path,"./upload/"+newPicName,function(err){
                            db.updateOneById("advList",params.id,{
                                $set:{
                                    advName:params.advName,
                                    advType:params.advType/1,
                                    advPic:newPicName,
                                    advUrl:params.advUrl,
                                    orderBy:params.orderBy/1
                                }
                            },function(err,results){
                                res.json({
                                    ok:1,
                                    msg:"success"
                                })
                            })
                        })

                    })
                })

            }else{
                fs.unlink(file["advPic"].path,function(err){
                    res.json({
                        ok:2,
                        msg:"请选择正确的图片格式：.gif,.png,.jpg"
                    })
                });
            }
        }else{// 未上传图片
            fs.unlink(file["advPic"].path,function(err){
                db.updateOneById("advList",params.id,{
                    $set:{
                        advName:params.advName,
                        advType:params.advType/1,
                        advUrl:params.advUrl,
                        orderBy:params.orderBy/1
                    }
                },function(err,results){
                    res.json({
                        ok:1,
                        msg:"success"
                    })
                })
            })

        }
        // console.log(file);

    })
}

// 根据ID来获得信息
module.exports.getAdvInfoById=function(req,res){
    db.findOneById("advList",req.query.id,function(err,advInfo){
        res.json({
            ok:1,
            advInfo
        })
    })
}



module.exports.getAdvListByType=function(req,res){
    var limitNum=req.query.limitNum/1;
    var advType=req.query.advType/1;
    db.find("advList",{
        whereObj:{
            advType
        },
        sortObj:{
            orderBy:-1,
            addTime:-1
        },
        limitNum
    },function(err,advList){
        if(limitNum>1)
            res.json({
                ok:1,
                advList
            })
        else
            res.json({
                ok:1,
                advInfo:advList.length>0?advList[0]:{}
            })
    })
}