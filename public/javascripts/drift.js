$('#regModal').on('hidden.bs.modal', function(){

  var formData = new FormData();
  formData.append('username', $('#username').val());
  formData.append('password', $('#password').val());
  formData.append('avatar', $('#avatar')[0].files[0]);

  $.ajax({
    url: '/users/add',
    type: 'post',
    data: formData,
    procesData: false,
    contentTYpe: false
  }).done(function(data){
    if(data['code'] == 1){

    }else {

    }
  })
});
