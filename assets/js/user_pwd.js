$(function(){
    var form = layui.form
    var layer = layui.layer
    form.verify({
      pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        samepwd:function(value){
           var pwd= $('#old').val()
          if(pwd.val()==value){
              return '新旧密码相同'
          }
        },
        repwd:function(value){
            var newpwd =$('#new').val()
            if( newpwd.val()!==value){
                return '密码不一致'
            }
        }
        
    })
    $('.layui-form').on('submit',function(e){
        //去除默认行为
       e.preventDefault();
       $.ajax({
           method:"POST",
           url:"/my/updatepwd",
           data:$(this).serialize(),
           success:function(res){
               if(res.status !==1){
                   return layer.msg("更新密码成功！")
               }
               layer.msg("更新密码失败！")
               $('.layui-form')[0].reset()
           }
       })
    })
})