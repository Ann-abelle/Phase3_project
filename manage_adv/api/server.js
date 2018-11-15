const express=require("express");
const advRouter=require("./router/advRouter")
const app=express();
app.use(express.static("../manage"));
app.use(express.static("./upload"));
app.post("/addAdv",advRouter.addAdv);
app.post("/upAdv",advRouter.upAdv);
app.get("/getAdvList",advRouter.getAdvList);
// 根据TYPE来获得广告信息
app.get("/getAdvListByType",advRouter.getAdvListByType);
app.get("/getAdvInfoById",advRouter.getAdvInfoById);
app.listen(80,function(){
    console.log("success");
})