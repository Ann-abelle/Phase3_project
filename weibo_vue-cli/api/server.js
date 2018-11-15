const express=require("express");
const db=require("./modules/db");
const common = require( "./modules/common );
const bodyParser=require("body-parser");
const app=express();
app.use(bodyParser.json());
app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    // res.header("Access-Control-Allow-Methods","POST,OPTIONS");
    res.header("Access-Control-Allow-Headers","content-type");
    next();
})
// app.post("/post",function(req,res){
//     console.log(req.body);
//     res.end();
// })

//添加微博信息
app.post("/addweibo",function(req,res) {
    var context = req.body.context;
    db.findOne("contextList", {context: context}, function (err,contextInfo) {
        //console.log( contextInfo );
        if (contextInfo) {
            console.log(11);
            res.json({
                ok: 2,
                msg: "不能重复添加内容"
            })
        } else {
            db.insertOne("contextList", {
                context: req.body.context,
                topNum: 0,
                downNum: 0,
                addTime: common.getNowTime()
            }, function (err, results) {
                res.json({
                    ok: 1,
                    msg: "成功"
                })
            })
        }
    })
})

//获取微博信息
app.get("/getweibo",function(req,res){
    var pageIndex = req.query.pageIndex;
    var pageNum = 5;//每页的数量
    var pageSum = 1;//第一页开始
    db.count("contextList",{},function( count ){
        pageSum = Math.ceil(count/pageNum);
        if( pageSum < 1 )
            pageSum = 0 ;
        if( pageIndex > pageSum )
            pageIndex = pageSum;
        if( pageIndex < 1 )
            pageIndex = 1;
        db.find("contextList",{
            skipNum:( pageIndex - 1 )*pageNum,
            limitNum:pageNum,
            sortObj:{
                addTime:-1
            }
        },function(err,contextList){
            res.json({
                ok:1,
                contextList,
                pageIndex,
                pageSum
            })
        })
    })

})

//删除微博信息
app.get("/delweibo",function( req,res ){
    var id = req.query.id;
    //console.log( id );
    db.deleteOneById("contextList",id,function( err,contextInfo ){
        //console.log(contextInfo);
        res.json({
            ok:1,
            msg:"成功"
        })
    })
})

//顶和踩
app.get("/typeweibo",function( req,res ){
    var type = req.query.typeWeibo/1;
    var id = req.query.id;
        if( type === 1 ){
            db.updateOneById("contextList",id,{
                $inc:{
                    topNum:1
                }
            },function( err,results ){
                res.json({
                    ok:1,
                    msg:"更新成功"
                })
            })
        }else{
            db.updateOneById("contextList",id,{
                $inc:{
                    downNum:1
                }
            },function( err,results ){
                res.json({
                    ok:1,
                    msg:"更新成功"
                })
            })
        }
})






app.get("/sum",function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.json({
        ok:1,
        sum:req.query.num/1+req.query.num2/1
    })
})
app.listen(80,function(){
    console.log("success");
})
