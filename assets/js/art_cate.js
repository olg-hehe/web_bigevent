$(function () {
    var form = layui.form
    var layer = layui.layer
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //添加类别
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })
    $('body').on('submit', '#form-add', function (e) {
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //添加完文章，关闭时弹出层关闭
                layer.close(indexAdd)
            }
        })
    })
    //编辑修改
    var indexEdit = null;
    $('tbody').on('click', '#edit', function () {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })
        let id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }

        })
    })
    //更新分类数据
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }

                layer.msg('更新分类数据成功！')
                //添加完文章，关闭时弹出层关闭
                layer.close(indexEdit)
                initArtCateList()
            }
        })

    })
    //删除数据
    $('tbody').on('click','#del',function(){
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('是否要删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:"GET",
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    initArtCateList()
                }
            })
            layer.close(index);
          });
        
    })
})
