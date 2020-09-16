$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }
    initTable()
    initCate()

    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                //渲染template模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //// 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    // function renderPage(total) {
    //     laypage.render({
    //         elem: 'pageBox', // 分页容器的 Id
    //         count: total, // 总数据条数
    //         limit: q.pagesize, // 每页显示几条数据
    //         curr: q.pagenum ,// 设置默认被选中的分页
    //             // 分页发生切换的时候，触发 jump 回调
    //         jump:function(obj){
    //             q.pagenum = obj.curr
    //         }
    //     })
    // }
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize =obj.limit
               
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //删除功能
    $("tbody").on('click','#delete',function(){
        //获得id
       var id =$(this).attr('data-id')

       var length = $("#delete").length
        layer.confirm('确定是否删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
               method:"GET",
               url:'/my/article/delete/'+id,
               success:function(res){
                   if(res.status!==0){
                       return layer.msg('删除文章失败！')
                     
                   }
                   if(length ==1){
                    q.pagenum=q.pagenum===1? 1:q.pagenum-1
                }
                   layer.msg('删除文章成功！')
                   initTable()
                   
               }
            })
            layer.close(index);
          
          });
    })

})