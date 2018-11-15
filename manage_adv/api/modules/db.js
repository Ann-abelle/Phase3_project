// 对数据库操作的方法
const mongodb=require("mongodb");
const mongoClient=mongodb.MongoClient;
function _connect(cb){
    mongoClient.connect("mongodb://127.0.0.1:27017",{ useNewUrlParser: true },function(err,client) {
        cb(client.db("bang")) ;
    });
}
/*增加一条记录
* coll:指定集合
* obj:添加的内容
* cb：回调函数*/
module.exports.insertOne=function(coll,obj,cb){
    _connect(function(db){
        db.collection(coll).insertOne(obj,cb)
    })
}
/*获取文档信息*/
module.exports.find=function(coll,obj,cb){
    obj.whereObj=obj.whereObj || {};
    obj.sortObj=obj.sortObj || {};
    obj.limitNum=obj.limitNum || 0;
    obj.skipNum=obj.skipNum || 0;

    _connect(function(db){
        db.collection(coll).find(obj.whereObj).sort(obj.sortObj).limit(obj.limitNum).skip(obj.skipNum).toArray(cb);
    })
}
/* 根据条件获得一条记录 */
module.exports.findOne=function(coll,whereObj,cb){
    _connect(function(db){
        db.collection(coll).findOne(whereObj,cb);
    })
}
/* 根据ID获得一条记录 */
module.exports.findOneById=function(coll,id,cb){
    _connect(function(db){
        db.collection(coll).findOne({
            _id:mongodb.ObjectId(id)
        },cb);
    })
}

/*根据条件求总文档数*/
module.exports.count=function(coll,whereObj,cb){
    _connect(function(db){
        db.collection(coll).countDocuments(whereObj).then(cb)
    })
}

/*根据ID删除文档*/
module.exports.deleteOneById=function(coll,id,cb){
    _connect(function(db){
        db.collection(coll).deleteOne({
            _id:mongodb.ObjectId(id)
        },cb);
    })
}

/*根据ID进行更新*/
module.exports.updateOneById=function(coll,id,upObj,cb){
    _connect(function(db){
        db.collection(coll).updateOne({
            _id:mongodb.ObjectId(id)
        },upObj,cb);
    })
}



