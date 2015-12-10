var uuid = require('uuid');
var async = require('async');
var redis = require('redis');
var settings = require('../settings');

var pool = require('generic-pool').Pool({
  name: 'redisPool',
  create: function(callback){
    var rd = redis.createClient(settings.port, settings.host);
    rd.auth(settings.auth);
    callback(null, rd);
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
module.exports.throw = function(bottle, callback){
  var bottleId = uuid.v4();
  var expTime = 3600*24;
  pool.acquire(function(err, client){
    async.waterfall([function(cb){
      client.SELECT(2, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.GET(bottle.owner, function(err, result){
        if(result && result >= 6){
          return cb({code: 0, msg: '今天扔瓶子次数用完'});
        }else {
          cb(null, 'success');
        }
      });
    }, function(msg, cb){
      client.INCR(bottle.owner, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.SELECT(1, function(){
        cb(null, 'sucess');
      });
    }, function(msg, cb){
      client.HMSET(bottleId, bottle, function(err, result){
        if(err){
          return cb({code: 0, msg: '没扔成功'});
        }
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.EXPIRE(bottleId, expTime, function(){
        pool.release(client);
        cb(null, {code: 1, msg: '瓶子已经飘向远方'});
      });
    }], function(err, result){
      if(err){
        callback(err);
      }else {
        callback(result);
      }
    });
  });
};
module.exports.getTimes = function(username, callback){
  async.parallel({throwTimes: function(cb){
    pool.acquire(function(err, client){
      client.SELECT(2, function(){
        client.GET(username, function(err, throwTimes){
          cb(null, throwTimes);
        });
      });
    });
  }, pickTimes: function(cb){
    pool.acquire(function(err, client){
      client.SELECT(3, function(){
        client.GET(username, function(err, pickTimes){
          cb(null, pickTimes);
        });
      });
    });
  }}, function(err, result){
    callback(null, result);
  });
};
module.exports.pick = function(owner, callback){
  pool.acquire(function(err, client){
    async.waterfall([function(cb){
      client.SELECT(3, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.GET(owner, function(err, result){
        if(result && result >= 3){
          return cb({code: 0, msg: '今天捞瓶子次数用完'});
        }else {
          cb(null, 'success');
        }
      })
    }, function(msg, cb){
      client.INCR(owner, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.SELECT(1, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.RANDOMKEY(function(err, result){
        if(err){
          return cb({code: 0, msg: '没有瓶子'});
        }
        cb(null, result);
      });
    }, function(msg, cb){
      client.HGETALL(msg, function(err, result){
        if(err){
          return cb({code: 0, msg: '数据获取失败'});
        }
        cb(null, result);
      });
    }], function(err, result){
      if(err){
        callback(err);
      }else {
        callback({code: 1, msg: result});
      }
    })
    
  })
};

module.exports.myBottle = function(owner, callback){
  pool.acquire(function(err, client){
    async.waterfall([function(cb){
      client.SELECT(1, function(){
        cb(null, 'success');
      });
    }, function(msg, cb){
      client.KEYS('*', function(err, result){
        if(err){
          return cb({code: 0, msg: '查询失败'});
        }
        cb(null, result);
      })
    }, function(msg, cb){
      var arr = [];
      async.each(msg, function(item, c){
        client.HGETALL(item, function(err, result){
          if(result.owner == owner){
            arr.push(result);
          }
          c();
        })
      }, function(){
        cb(null, arr);
      })
    }], function(err, result){
      if(err){
        callback(err);
      }else {
        callback({code: 1, msg: result});
      }
    });
  });
};
