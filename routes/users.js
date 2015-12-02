var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var uuid = require('uuid');
var fs = require('fs');
var myUtil = require('../util');
var path = require('path');
var model = require('../db');

router.post('/add', function(req, res){
 new formidable.IncomingForm().parse(req, function(err, fileds, files){
   var user = {};
   user.username = fileds.username;
   user.password = myUtil.md5(fileds.password);
   user.avatarName = uuid.v4()+path.extname(files.avatar.name);

   fs.createReadStream(files.avatar.path).pipe(fs.createWriteStream('../public/uploads/'+user.avatarName));
   req.session.user = {
     username: user.username,
     avatarName: '/uploads/'+user.avatarName,
     throwTime: 0,
     pickTime: 0
   }
   model.save(user, function(data){
     if(data){
       return res.json({code: 1, msg: data});
     }else {
       return res.json({code: 0, msg: '保存失败'});
     }
   });

 });
});

router.get('/logout', function(req, res){
  req.session.user = null;
  return res.json({code: 1, msg: '退出成功'});
});

router.post('/login', function(req, res){
  var user = req.body;
  user.password = myUtil.md5(user.password);
  model.find(user, function(data){
    if(data){
      return res.json({code: 1, msg: data});
    }else {
      return res.json({code: 0, msg: '登录失败'});
    }
  });
});


module.exports = router;
