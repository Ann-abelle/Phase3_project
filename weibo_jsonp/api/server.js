var http = require( "http" );
var url = require( "url" );
var fs = require( "fs" );
function getNowTime(){
		var date = new Date();
		return date.getFullYear() + "-"
		+(date.getMonth() + 1).toString().padStart(2,"0") + "-"
		+ date.getDate().toString().padStart(2,"0")
		+ " " + date.getHours().toString().padStart(2,"0")
		+ ":" + date.getMinutes().toString().padStart(2,"0")
		+ ":" +date.getSeconds().toString().padStart(2,"0");
	}
http.createServer(function( req,res ){
	
	/*1.确定路径
	 *2.接收参数context
	 *3.将接收的参数追加到json文件当中
	 *4.返回添加的结果
	 */
	var pathname = url.parse( req.url ).pathname;
	var query =url.parse(req.url,true).query;
	if( pathname =="/addweibo" ){
		var context = url.parse( req.url,true ).query.context;
		//要读取数据文件
		//数据信息去重
		
		fs.readFile( "../data.json",function( err,results ){
			console.log(1111,results);
			//读取到的文件转换为数组的形式，放在数组里			
			var arr = JSON.parse( results );
			//根据下标进行判断，发现重复，则下标为-1
			var index = arr.findIndex( v => v.context === context );
			if( index < 0 ){
				arr.unshift({
					id:new Date().getTime(),//时间戳
					context,
					topNum:0,
					downNum:0,
					addTime:getNowTime()
				});
				fs.writeFile("../data.json",JSON.stringify( arr ),function( err ){
					if( err )
					res.end( url.parse(req.url,true).query.cb + "(" + JSON.stringify({
						ok:2,
						msg:"网络连接错误"
					}) + ");")
					else
					res.end( url.parse(req.url,true).query.cb + "(" + JSON.stringify({
						ok:1,
						msg:"成功"
					}) + ");")
				})
			}else{
				res.end( url.parse( req.url,true ).query.cb + "(" + JSON.stringify({
					ok:2,
					msg:"请不要输入重复信息"
				}) + ")")
			}
			
			//写入文件，将数组里数据转化为字符串（转为字符串写入）
			
		})
	}
	//获取微博信息
	else if(pathname=="/getweibo"){
		fs.readFile("../data.json",function(err,results){
			if(err)
				res.end(";"+url.parse(req.url,true).query.cb+"("+JSON.stringify({
					ok:2,
					msg:"网络连接错误！"
				})+")")
			else				
				res.end(";"+url.parse(req.url,true).query.cb+"("+JSON.stringify({
					ok:1,
					contextList:JSON.parse(results)
				})+")")			
		})
	}
	
	//删除微博信息
	else if( pathname == "/deleteweibo" ){
		fs.readFile( "../data.json",function( err,results ){
			var arr = JSON.parse( results );
			//v是数组中的值  v.id是值中的属性
			var index = arr.findIndex( v => v.id === query.id/1 )//将字符串快速转为数字
			arr.splice( index,1 );//找到id后根据下标删除该条内容
			//读取json数据后再写入更新后的数据
			fs.writeFile( "../data.json",JSON.stringify( arr ),function( err ){
				if( err ){
				res.end( ";" + query.cb + "(" + JSON.stringify({
					ok:2,
					msg:"网络连接错误！"
				})+ ")" );
			}else{
					res.end( ";" + query.cb + "(" + JSON.stringify({
						ok:1,
						msg:"删除成功！"
					})+ ")");
				}
			})			
		})
	}
	
	//更新数据
	else if( pathname === "/topordown" ){
		//首先读取数据
		//再写入数据
		fs.readFile( "../data.json",function( err,results ){
			var arr = JSON.parse( results );
			var index = arr.findIndex( v => v.id === query.id/1 );//根据数组中的元素的id属性找下标
			if( query.type/1 === 1 ){
				arr[index].topNum += 1;
			}else{
				arr[index].downNum += 1;
			}
			//点击事件发生更新数据后再进行写入数据
			fs.writeFile( "../data.json",JSON.stringify( arr ),function( err ){
				if( err ){
					//fn(...)
					res.end( ";" + query.cb + "(" + JSON.stringify({
						ok:2,
						msg:"网络连接错误！"
					}) +")");
				}else{
					res.end( ";" + query.cb + "(" + JSON.stringify({
						ok:1,
						msg:"成功"
					}) +")");
				}
			})
		})
	}
	else{
		res.end( "404" );
	}
}).listen(80,function(){
	console.log( "success" );
})
