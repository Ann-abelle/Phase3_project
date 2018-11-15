/*上传图片的优化，因为获取和更新都运用到上传图片的部分，需要进行优化*/
/*1.上传
* 2.未上传*/
const formidable = require( "formidable" );
const fs = require( "fs" );
module.exports.upPic = function( req,picName,cb ) {//picName 文件name名 "advPic"
    var form = formidable.IncomingForm();
    form.uploadDir = "./upload";
    form.keepExtensions = true;
    form.encoding = "utf-8";
    form.parse(req, function (err, params, file) {
        if (err) {
            cb({
                ok: 2,
                msg: "网络连接错误"
            })
        }
        else {
            var picInfo = file[picName];
            if (picInfo.size > 0) {
                var nameArr = [".jpg", ".gif", ".png"];
                var keepName = picInfo.name.substr(picInfo.name.lastIndexOf("."));//扩展名
                if (nameArr.includes(keepName)) {

                    //如果图片符合要求，则加入数据库
                    var newPicName = Date.now() + keepName;//pic的完整名
                    fs.rename(picInfo.path, "./upload/" + newPicName, function (err, results) {
                        cb({
                            ok: 1,
                            params,
                            newPicName
                        })
                    })
                } else {//图片不符合要求
                    fs.unlink(picInfo.path, function (err) {
                        cb({
                            ok: 2,
                            msg: "请选择正确的图片格式，.jpg,.png,.gif"
                        })
                    })
                }
            } else {//图片未上传
                fs.unlink(picInfo.path, function (err) {
                    cb({
                        ok: 3,
                        params
                    })
                })
            }
        }
    })
}
