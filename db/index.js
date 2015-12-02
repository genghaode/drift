var uuid = require('uuid');
var async = require('async');
var redis = require('redis');
var settings = require('../settings');

var pool = require('generic-pool').Pool({
  name: 'redisPool',
  create: function(callback){
    callback(null, redis.createClient(settings.port, settings.host));
  },
  destroy: function(client){
    client.quit();
  },
  max: 100,
  min: 5
});
module.exports.save = function(user, callback){
  user.userId = uuid.v4();
  pool.acquire(function(err, client){
    client.HMSET(user.username, user, function(err, result){
      if(err){
        callback(0);
      }else {
        delete user.password;
        callback(user);
      }
      pool.release(client);
    });
  });
};

module.exports.find = function(user, callback){
  pool.acquire(function(err, client){
    client.HGETALL(user.username, function(err, result){
      if(err){
        callback(0);
      }else {
        if(result.password === user.password){
          delete result.password;
          callback(result);
        }else {
          callback(0);
        }
      }
      pool.release(client);
    });
  });
};