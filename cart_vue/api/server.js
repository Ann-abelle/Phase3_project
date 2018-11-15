const express=require("express");
const bodyParser=require("body-parser");
const db=require("./modules/db");
const app=express();
app.use(bodyParser.json());
app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    next();
});
//获取商品信息
app.get("/getGoodsList",function(req,res){
   /* console.log( req.query.a );
    res.end();*/
   db.find("goodsList",{
        sortObj:{
            addTime:-1
        }
    },function(err,goodsList){
        res.json({
            ok:1,
            goodsList
        })
    })
});

//添加用户信息
app.post("/login",function( req,res ){
    //登录  手机号码  验证码---8888
    if( req.body.code === "8888" ){//验证码正确，验证用户手机号
        db.findOne("login",{
            phoneId:req.body.phoneId
        },function( err,userInfo ){//有该用户
            if( userInfo ){
                res.json({
                    ok:1,
                    phoneId:userInfo.phoneId//找到该用户获取phoneId
                })
            }else {//没有此用户，进行添加
                db.insertOne("login", {
                    phoneId:req.body.phoneId,
                    createTime:Date.now()
                },function( err,results ){
                    res.json({
                        ok:1,
                        phoneId:req.body.phoneId//添加用户后获取phoneId
                    })
                })
            }
        })
    }else{
        res.json({
            ok:2,
            msg:"验证码不正确"
        })
    }
})

//添加购物车
app.get("/joinCart",function( req,res ){
    /*验证库存是否充足：
    * 1.不充足返回信息，告诉不充足
    * 2.充足
    *   1.商品存在
    *       1.有：加1，库存减一
    *       2.无：增加商品，库存减一
    */
   var phoneId = req.query.phoneId;
   var goodsId = req.query.goodsId;
   db.findOneById("goodsList",goodsId,function( err,goodsInfo ){//根据id找符合条件的商品
        if( goodsInfo.storeNum <= 0 ){
            res.json({
                ok:2,
                msg:"该商品库存不足"
            })
        }else{//商品有库存，购物车中有商品进行库存减一
            db.findOne("cartList",{
                goodsId,
                phoneId
            },function( err,cartInfo ){//cartInfo 该id商品库存的一条信息
                //库存减一
                db.updateOneById("goodsList",goodsId,{
                    $inc:{
                        storeNum:-1
                    }
                },function(err,results){
                    if(cartInfo){//如果商品存在，数量加一
                        db.updateOne("cartList",{_id:cartInfo._id},{//根据id进行更新操作
                            $inc:{
                                buyNum:1
                            }
                        },function( err,results ){
                            res.json({
                                ok:1,
                                msg:"加入购物车成功"
                            })
                        })
                    }else{//如果购物车中商品不存在，就进行插入新数据
                        db.insertOne("cartList",{
                            phoneId,
                            goodsId,
                            goodsName:goodsInfo.goodsName,
                            goodsPrice:goodsInfo.goodsPrice,
                            buyNum:1,
                            buyTime:Date.now(),
                            isOk:1
                        },function( err,results ){
                            res.json({
                                ok:1,
                                msg:"加入购物车成功"
                            })
                        })
                    }
                })
            })
        }
   })
})

//获取购物车信息
app.get("/getCartList",function( req,res ){
    var phoneId = req.query.phoneId;
    db.find("cartList",{phoneId:phoneId},function( err,cartList ){
        res.json({
            ok:1,
            cartList
        })
    })
})

//点亮购物车商品
app.get("/changeCartInfo",function( req,res ){
    var id = req.query.id;
    var isOk = req.query.isOk/1;
    db.updateOneById("cartList",id,{
        $set:{
            isOk:isOk === 1?0:1 //isOk存在，点击后不存在，isOk不存在，点击后存在
        }
    },function(err,results){
        res.json({
            ok:1,
            msg:"成功"
        })
    })
})

//全选
app.get("/changeAllIsOk",function( req,res ){
    var phoneId = req.query.phoneId;
    var allIsOk = req.query.allIsOk;
    //console.log(allIsOk);
    db.updateMany("cartList",{
        phoneId
    },{
        $set:{
            isOk:allIsOk/1 === 1?0:1
        }
    },function(){
        res.json({
            ok:1,
            msg:"成功"
        })
    })
})

//减少购物车商品数量
app.get("/buyNumRem",function( req,res ){
    var goodsId = req.query.goodsId;
    //console.log(goodsId);
    db.findOneById("cartList",goodsId,function( err,goodsInfo ){
        if( goodsInfo.buyNum <= 0 ){
            db.deleteOneById("cartList",goodsId,function( err,results ){
                res.json({
                    ok:1,
                    msg:"删除成功"
                })
            })
        }else{
            db.updateOneById("cartList",goodsId,{
                $inc:{
                    buyNum:-1
                }
            },function( err,results ){
                res.json({
                    ok:1,
                    msg:"成功"
                })

            })
        }
    })
})

//增加购物车商品数量
app.get("/buyNumAdd",function( req,res ){
    var cartId = req.query.goodsId;
    //console.log(cartId);
    //根据购物车商品id找到该商品，购物车中的goodsId找到商品集合里的该商品
    //根据商品集合的商品id找到该商品
    db.findOneById("cartList",cartId,function( err,cartInfo ){
        console.log(cartInfo);
        db.updateOneById("cartList", cartId, {
            $inc: {
                buyNum: 1
            }
        }, function (err, results){
            var _id = cartInfo.goodsId;
            db.findOneById("goodsList",_id,function( err,goodsInfo ){
                console.log(goodsInfo);
                if( goodsInfo.storeNum > 0 ){
                    db.updateOneById("goodsList",_id,{
                        $inc:{
                            storeNum:-1
                        }
                    },function( err,goodsInfo ) {
                        res.json({
                            ok: 1,
                            msg: "成功"
                        })
                    })
                }else{
                    res.json({
                        ok:2,
                        msg:"该商品库存不足，不能继续添加"
                    })
                }
            })
        })
     })
})


app.listen(80,function(){
    console.log( "success" );
})