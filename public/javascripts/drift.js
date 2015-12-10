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

$('#throwModal').find('.btn').on('click', function(){
  var content = $('#content').val();
  $.ajax({
    url: '/bottle/throw',
    type: 'post',
    data: {content: content},
    dataType: 'json'
  }).done(function(data){
    console.log(data);
    if(data.code == 1){
      $('#throwTimes').html(Number($('#throwTimes').html())-1);
    }else {
      alert(data.msg);
    }
  })
});

$('#pickModal').on('show.bs.modal', function(){
  $.ajax({
    url: '/bottle/pick',
    type: 'get',
    dataType: 'json'
  }).done(function(data){
    if(data.code == 1){
      $('#pickName').html(data.msg.owner);
      $('#pickContent').html(data.msg.content);
      $('#pickTime').html(data.msg.time);
    }else {
      $('#pickModal').modal('hide');
      alert(data.msg);
    }
  });
});
$('#pickModal').find('.btn').on('click', function(){
  $('#pickTimes').html(Number($('#pickTimes').html())-1);
});
$('#myBottleModal').on('show.bs.modal', function(){
  $.ajax({
    url: '/bottle/myBottle',
    type: 'get',
    dataType: 'json'
  }).done(function(data){
    if(data.code == 1){
      console.log(data.msg);
      var html = '';
      for(var i=0; i<data.msg.length; i++){
        html += '<li>';
        html += '<div>内容：' +data.msg[i].content + '</div>';
        html += '<div>时间：' +data.msg[i].time + '</div>';
        html += '</li>';
      }
      $('#myBottleList').html(html);
    }else {
      $('#myBottleModal').modal('hide');
      alert(data.msg);
    }
  });
});
