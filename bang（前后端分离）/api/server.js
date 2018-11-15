const express =require( "express" );
const app = express();
const advRouter = require( "./router/advRouter" );
const proRouter = require( "./router/proRouter" );
const shopRouter = require( "./router/shopRouter" );
const bodyParser = require( "body-parser" );
app.use( bodyParser.json() );
app.use( express.static( "../../bang_2" ) );
app.use( express.static( "../manage" ) );
app.use( express.static( "./upload" ) );

/*数据添加*/

//广告添加
app.post("/addAdv",advRouter.addAdv);
//商品添加
app.post( "/addPro",proRouter.addPro );


/*数据库获取数据*/

//广告数据获取
app.get( "/getAdvList",advRouter.getAdvList );
app.get( "/getAdvListAll",advRouter.getAdvListAll );
//商品数据获取
app.get( "/getProList",proRouter.getProList );
app.get( "/getProListAll",proRouter.getProListAll );

/*要修改的数据-->按照id来获取数据*/

//广告修改
app.get( "/getAdvInfoById",advRouter.getAdvInfoById );
//商品修改
app.get("/getProInfoById",proRouter.getProInfoById);

/*更改保存数据库的信息*/

//广告更改
app.post("/upAdv",advRouter.upAdv);
//商品更改
app.post("/upPro",proRouter.upPro);

/*删除数据库信息*/

//广告删除
app.get( "/delAdvInfoById",advRouter.delAdv );
//商品删除
app.get( "/delProInfoById",proRouter.delPro );

app.listen(80,function(){
    console.log( "success" );
})