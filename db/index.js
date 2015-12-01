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