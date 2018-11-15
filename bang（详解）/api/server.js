const express =require( "express" );
const app = express();
const advRouter = require( "../router/advRouter" );
const bodyParser = require( "body-parser" );
app.use( bodyParser.json() );
app.use( express.static( "../manage" ) );
app.use( express.static( "./upload" ) );
//数据添加
app.post("/addAdv",advRouter.addAdv);

//数据库获取数据
app.get( "/getAdvList",advRouter.getAdvList );

//要修改的数据-->按照id来获取数据
app.get( "/getAdvInfoById",advRouter.getAdvInfoById );

//更改数据库的信息
app.post("/upAdv",advRouter.upAdv);

//删除数据库信息
app.get( "/delAdvInfoById",advRouter.delAdv );

app.listen(80,function(){
    console.log( "success" );
})