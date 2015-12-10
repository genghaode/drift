var express = require('express');
var router = express.Router();
var model = require('../db');

router.post('/throw', function(req, res){
  var bottle = {};
  bottle.owner = req.session.user.username;
  bottle.time = new Date();
  bottle.content = req.body.content;
 	model.throw(bottle, function(result){
 		res.json(result);
 	});
});

router.get('/pick', function(req, res){
	model.pick(req.session.user.username, function(result){
		res.json(result);
	});
});

router.get('/myBottle', function(req, res){
	model.myBottle(req.session.user.username, function(result){
		res.json(result);
	});
});

module.exports = router;
