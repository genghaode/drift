exports.md5 = function(val){
  return require('crypto').createHash('md5').update(val).digest('hex');
};
exports.checkLogin = function(req, res, next){
  if(!req.session.user){
    req.flash('error', '未登录');
    return res.redirect('/users/login');
  }
  next();
}
exports.checkNotLogin = function(req, res, next){
  if(req.session.user){
    req.flash('error', '已登录');
    return res.redirect('back');
  }
  next();
}