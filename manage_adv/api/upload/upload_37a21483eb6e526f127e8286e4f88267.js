// 将所有与voteList相关的接口放到该模块当中
const fs=require("fs");
const common=require("./common");
const querystring=require("querystring");
module.exports.getVoteList=function(res,type,keyword){

    keyword = keyword || "";
    type =type || 0;
    fs.readFile("./data/voteList.json",function(err,results){
        var voteList=JSON.parse(results);
        if(type>0)
            voteList=voteList.filter(v=>v.voteType===type);
        if(keyword.length>0)
            voteList=voteList.filter(v=>v.voteName.includes(keyword));
        console.log(voteList);
        res.end(JSON.stringify({
            ok:1,
            voteList,
            voteTypeEnum:{
                "1":"大前端",
                "2":"JAVA",
                "3":"NODE",
                "4":"UI"
            }
        }))
    })
}

module.exports.addVoteList=function(req,res){
    var str="";
    // 事件：开始接收
    req.addListener("data",function(chunk){
        str+=chunk;
    });
    // 数据接收完毕
    req.addListener("end",function(){
        var query=querystring.parse(str);
        query.id=Date.now();
        query.voteType=query.voteType/1;
        query.voteNum=query.voteNum/1;
        query.addTime=common.getNowTime();// 当前时间
        fs.readFile("./data/voteList.json",function(err,reuslts){
            var arr=JSON.parse(reuslts);
            arr.unshift(query);
            fs.writeFile("./data/voteList.json",JSON.stringify(arr),function(err){
                if(err){
                    common.end(res);
                }else{
                    common.end(res,1,"添加成功");
                }
            })
        })

    })
}
//根据ID获得投票信息
module.exports.getVoteInfoByID=function(res,id){
    fs.readFile("./data/voteList.json",function(err,results){
        var arr=JSON.parse(results);
        var voteInfo=arr.find(v=>v.id===id);
        res.end(JSON.stringify({
            ok:1,
            voteInfo
        }))
    })
}
// 修改投票信息
module.exports.upVoteList=function(req,res,id){
    // get post delete put
    // get 获取数据
    // id
    fs.readFile("./data/voteList.json",function(err,results){
        var arr=JSON.parse(results);
        // var index=arr.findIndex(v=>v.id===id);
        var index=-1;
        for(var i=0;i<arr.length;i++){
            if(arr[i].id===id){
                index=i;
                break;
            }
        }
        // arr.forEach((v,i)=>{
        //     if(v.id===id){
        //         index==i;
        // }
        // })



        // 接收
        var str="";
        // 尝试：=
        // 大批量
        //  data不是目录 事件的名字 订阅 发布
        req.on("data",function(chunk){
            console.log(22222,chunk.toString());
            str+=chunk;
        })

        // 会在数据接完毕之后调用 。
        req.on("end",function(){
            var query=querystring.parse(str);
            arr[index].voteName=query.voteName;
            arr[index].voteType=query.voteType/1;
            arr[index].voteNum=query.voteNum/1;
            arr[index].votePic=query.votePic;
            // * 一般在做数据库设计 时，关于时间会有两个，一个是添加时间一个是修改时间
            fs.writeFile("./data/voteList.json",JSON.stringify(arr),function(err){
                common.end(res,1,"修改成功");
            })
        })



    })
}