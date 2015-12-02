$('#regModal').find('.btn').on('click', function(){

  var formData = new FormData();
  formData.append('username', $('#username').val());
  formData.append('password', $('#password').val());
  formData.append('avatar', $('#avatar')[0].files[0]);

  $.ajax({
    url: '/users/add',
    type: 'post',
    data: formData,
    processData: false,
    contentType: false
  }).done(function(data){
    if(data.code == 1){
      $('#regBtnDiv').hide();
      $('#loginBtnDiv').hide();
      $('#myAvarar').attr('src', '/uploads/'+data.msg.avatarName);
      $('#myUsername').html(data.msg.username);
      $('#regInforDiv').show();
      console.log(data.msg);
    }else {
      console.log(data);
    }
  });
});
function logout(){
  $.ajax({
    url: '/users/logout',
    type: 'get'
  }).done(function(data){
    if(data.code == 1){
      $('#regBtnDiv').show();
      $('#loginBtnDiv').show();
      $('#regInforDiv').hide();
    }else {
      console.log(data.msg);
    }
  });
}

$('#loginModal').find('.btn').on('click', function(){
  var username = $('#username1').val();
  var password = $('#password1').val();
  $.ajax({
    url: '/users/login',
    type: 'post',
    data: {username: username, password: password}
  }).done(function(data){
    if(data.code == 1){
      $('#regBtnDiv').hide();
      $('#loginBtnDiv').hide();
      $('#myAvarar').attr('src', '/uploads/'+data.msg.avatarName);
      $('#myUsername').html(data.msg.username);
      $('#regInforDiv').show();
      console.log(data.msg);
    }else {
      console.log(data);
    }
  })
});