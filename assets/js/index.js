$(function () {
  getUserInfo();
  $('#btnLogout').on('click', function () {
    layer.confirm('is not?', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index);
    });
  })
})
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: '/my/userinfo',
    // headers:{Authorization:localStorage.getItem('token') || ""},
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取个人信息失败');
      }
      renderAvatar(res.data)

    },
    // complete: function (res) {
      
    //   console.log(res);
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })

}
function renderAvatar(user) {
  var name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide();
  } else {
    $('.layui-nav-img').hide()
    $('.text-avatar').html(name[0].toUpperCase()).show()
  }
}