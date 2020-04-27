layui.config({
    base: '../design/js/'
}).use(['layer', 'util', 'treeTable', 'table', 'tree', 'form'], function () {
    var tree = layui.tree;
    var table = layui.table;
    var $ = layui.jquery;
    var form = layui.form;
    var layer = layui.layer;
    var util = layui.util;
    var treeTable = layui.treeTable;
    $('body').removeClass('layui-hide');
    treetableload();
    var name = "";
    var kindId = "";
    var pId = 0;//父级分类
    //添加分类
    addclassify();

    function addclassify() {
        kindName = "";
        form.on('switch(parentON)', function (data) {
            //开关是否开启，true或者false
            var checked = data.elem.checked;
            console.log(checked);
            console.log(data);
            if (checked) {//如果选中
                pId = "";//清空父级id 父级：否

                $.ajax({
                    url: api1 + 'design_classify/design_classifyAll',
                    success: function (result) {
                        var parentName = '<option value="">请选择</option>';
                        for (var i in result.data) {
                            if (result.data[i].pId === 0) {
                                parentName += "<option value=" + result.data[i].kindName + ">" + result.data[i].kindName + "</option>";
                            }
                        }
                        $("#addpId").html(parentName);
                        form.render();//没有写这个，操作后没有效果
                    },
                });
                $(".parenttrue").css("display", "block")
                form.on('select(addpId)', function (data) {
                    kindName = data.value;//获取父级名称
                    console.log(kindName);
                });
            } else {
                pId = 0;//父级：是
                kindName = "";
                $("#addpId").html("");
                form.render();//没有写这个，操作后没有效果
                $(".parenttrue").css("display", "none")
            }
        });
        /**
         * 添加分类选项
         */
        $("#addsubmit").click(function () {                                                             /*添加分类选项*/
            name = $("#addname").val();
            if (name === "" || name == null) {
                layer.msg("请输入分类名称")
            }
            var data = {pId: pId, kindName: kindName, name: name}

            $.ajax({
                url: api1 + 'design_classify/addclassify',
                data: JSON.stringify(data),
                type: "post",//post提交方式
                contentType: "application/json",//json提交
                success: function (result) {
                    layer.msg(result.message);
                    treetableload();
                },
                error: function (result) {
                    layer.msg(result.message)
                }

            });
        })


    }


    function treetableload() {                                          /*tree表格加载*/
        // 渲染表格
        var treeclassify = treeTable.render({
            elem: '#classifyTable',
            url: api1 + 'design_classify/design_classifyAll',
            toolbar: 'default',
            tree: {
                iconIndex: 2,
                isPidData: true,
                pidName: 'pId',  // pid的字段名
                childName: 'pId',  // children的字段名
            },
            parseData: function (res) { //res 即为原始返回的数据
                console.log(res);
                return {
                    "code": "0", //返回的code的值 成功：0
                    "total": res.total, //解析数据长度
                    "data": res.data, //解析数据列表
                };
            },
            defaultToolbar: ['filter', 'print', 'exports', {
                title: '提示',
                layEvent: 'LAYTABLE_TIPS',
                icon: 'layui-icon-tips'
            }],
            cols: [
                [
                    {type: 'numbers'},
                    {type: 'checkbox'},
                    {field: 'kindName', title: '分类名称', minWidth: 165},
                    {field: 'kindId', title: '级别'},
                    {field: 'id', title: '分类ID', minWidth: 165},
                    {align: 'center', toolbar: '#tbBar', title: '操作', width: 120}
                ]
            ],
            style: 'margin-top:0;'
        });


        // 工具列点击事件
        treeTable.on('tool(classifyTable)', function (obj) {
            var data = obj.data; //获得当前行数据
            var event = obj.event;
            if (event === 'del') {//删除
                if (data.kindId == "父级") {
                    layer.confirm('您删除的是父级分类，确定删除吗?', {icon: 3, title: '提示'}, function (index) { //删除分类
                        $.ajax({
                            url: api1 + "design_classify/deleteclassifyById",
                            type: "post",
                            data: {id: data.id, kindId: data.kindId},
                            success: function (res) {
                                layer.msg(res.message);
                                treetableload()
                            },
                            error: function (res) {
                                layer.msg(res.message)
                            }
                        });
                        layer.close(index);
                    });
                } else {
                    layer.confirm('您确定删除吗?', {icon: 3, title: '提示'}, function (index) {              //删除分类
                        $.ajax({
                            url: api1 + "design_classify/deleteclassifyById",
                            type: "post",
                            data: {id: data.id, kindId: data.kindId},
                            success: function (res) {
                                layer.msg(res.message);
                                treetableload();
                            },
                            error: function (res) {
                                layer.msg(res.message)
                            }
                        });
                        layer.close(index);
                    });
                }

            } else if (event === 'edit') {//修改
                selectload();
                $("#id").val(data.id)
                $("#kindName").val(data.kindName)
                kindId = data.kindId;
                if (kindId === "父级") {
                    $(".updateparent").css("display", "none")
                    // layer.msg("父级菜单不可修改");
                    // return false;
                } else {
                    $(".updateparent").css("display", "block")
                }
                layer.open({                                            //打开修改分类的模态框
                    maxmin: true,
                    type: 1,//类型 信息
                    area: ['600px', '350px'],//定义宽和高
                    title: '分类编辑',//题目
                    shadeClose: false,//点击遮罩层关闭
                    content: $('#updateclassify'),//打开的模态框
                    cancel: function (index, layero) {
                        layer.close(index)
                        return false;
                    }
                });
            }
        });
        // 头部工具栏点击事件
        treeTable.on('toolbar(classifyTable)', function (obj) {

            var data = obj; //获得当前行数据
            switch (obj.event) {
                case 'add':
                    layer.open({                                              //打开添加分类的模态框
                        maxmin: true,
                        type: 1,//类型 信息
                        area: ['600px', '450px'],//定义宽和高
                        title: '添加分类',//题目
                        shadeClose: false,//点击遮罩层关闭
                        content: $('#addclassify'),//打开的模态框
                        cancel: function (index, layero) {
                            layer.close(index)
                            return false;
                        }
                    });
                    break;
                case 'delete':
                    layer.msg('无效按钮');

                    break;
                case 'update':
                    layer.msg('无效按钮');
                    break;
                case 'LAYTABLE_TIPS':
                    layer.msg('无效按钮');
                    break;
            }
        });


        // 全部展开
        $('#btnExpandAll').click(function () {
            treeclassify.expandAll();
        });

        // 全部折叠
        $('#btnFoldAll').click(function () {
            treeclassify.foldAll();
        });


        $('#btnChecked').click(function () {
            treeclassify.expand(4);
            treeclassify.setChecked([4]);
        });

        $('#btnSearch').click(function () {
            var keywords = $('#edtSearch').val();
            if (keywords) {
                treeclassify.filterData(keywords);
            } else {
                treeclassify.clearFilter();
            }
        });

        $('#btnClearSearch').click(function () {
            treeclassify.clearFilter();
        });
        $('#btnReload').click(function () {
            treeclassify.reload();
        });
    }

    //选择框选中事件
    function selectload() {
        $.ajax({
            url: api1 + 'design_classify/design_classifyAll',
            success: function (result) {
                var parentName = '<option value="">请选择</option>';
                for (var i in result.data) {
                    if (result.data[i].pId === 0) {
                        parentName += "<option value=" + result.data[i].kindName + ">" + result.data[i].kindName + "</option>";
                    }
                }
                $("#pId").html(parentName);
                form.render();//没有写这个，操作后没有效果
            },

        });
    }

    //修改提交
    $("#submit").click(function () {

        submit();//修改提交
    })
    form.on('select(pId)', function (data) {
        kindName = data.value;//获取父级名称
    });

    function submit() {//修改提交
        if (kindId === "父级") {
            $(".updateparent").css("dislpay", "none")
            // return false;
        } else if (kindName === "" || kindName == null) {
            layer.msg("请选择父级分类");
            return false;
        }

        var Id = $("#id").val();
        name = $("#kindName").val();

        if (name === "" || name == null) {
            layer.msg("请选择输入分类名称");
            return false;
        }
        /*  */
        var classify = {id: Id, kindName: kindName, name: name}
        $.ajax({
            url: api1 + 'design_classify/updateclassify',
            data: JSON.stringify(classify),
            type: "post",//post提交方式
            contentType: "application/json",//json提交
            success: function (result) {
                layer.msg(result.message)
                treetableload();
            },
            error: function (result) {
                layer.msg(result.message)
            }

        });

    }

});
