//独立的部门  菜单   的选择弹出层

function openDeptSelecter(pid, callBack) {
    // callBack(1,'开发一部');
    layui.use(['form', 'table', 'layer', 'treeTable'], function () {
        var form = layui.form;
        var table = layui.table;
        var layer = layui.layer;
        var treeTable = layui.treeTable;
        var tableSelectIns;
        selDeptIndex = layer.open({
            type: 1,
            title: '选择部门',
            content: '<div style="padding:5px" ><table class="layui-hide" id="deptSelectTable" lay-filter="deptSelectTable"></table></div>',
            area: ['700px', '600px'],
            btn: ['<span class="layui-icon layui-icon-ok"></span>确定'],
            btnAlign: 'c',
            yes: function (index) {
                //得到选择的ID和名称
                var ckData = tableSelectIns.checkStatus();
                callBack(ckData[0].id, ckData[0].title);
                layer.close(selDeptIndex);
            },
            success: function (index) {
                tableSelectIns = treeTable.render({
                    tree: {
                        iconIndex: 2,  // 折叠图标显示在第几列
                        idName: 'id',  // 自定义id字段的名称
                        pidName: 'pid',  // 自定义标识是否还有子节点的字段名称
                        isPidData: true  // 是否是pid形式数据
                    },
                    elem: '#deptSelectTable',
                    cellMinWidth: true,
                    cols: [
                        {type: "numbers"},
                        {type: "radio"},
                        {field: 'title', title: '部门名称'},
                        {field: 'remark', title: '部门备注', align: "center"},
                        {field: 'address', title: '部门地址', align: "center"},
                    ],
                    reqData: function (data, callback) {
                        // 在这里写ajax请求，通过callback方法回调数据
                        $.get(api + 'dept/loadAllDept', function (res) {
                            callback(res.data);  // 参数是数组类型
                            tableSelectIns.setChecked(pid);  // 设置选中数据
                        });
                    }
                });
            }
        });

    });
}
//菜单的选择弹层
function openMenuSelecter(pid,callBack){
    layui.use(['form', 'table','layer','treeTable'], function () {
        var form = layui.form;
        var table = layui.table;
        var layer=layui.layer;
        var treeTable = layui.treeTable;
        var tableSelectIns;
        selDeptIndex=layer.open({
            type:1,
            title:'选择菜单',
            content:'<div style="padding:5px" ><table class="layui-hide" id="deptSelectTable" lay-filter="deptSelectTable"></table></div>',
            area:['700px','600px'],
            btn:['<span class="layui-icon layui-icon-ok"></span>确定'],
            btnAlign:'c',
            yes:function(index){
                //得到选择的ID和名称
                var ckData=tableSelectIns.checkStatus();
                // console.log(ckData);
                callBack(ckData[0].id,ckData[0].title);
                layer.close(selDeptIndex);
            },
            success:function(index){
                tableSelectIns=treeTable.render({
                    tree: {
                        iconIndex: 2,  // 折叠图标显示在第几列
                        idName: 'id',  // 自定义id字段的名称
                        pidName: 'pid',  // 自定义标识是否还有子节点的字段名称
                        isPidData: true  ,// 是否是pid形式数据
                        openName: 'spread'  // 自定义默认展开的字段名
                    },
                    elem: '#deptSelectTable',
                    cellMinWidth:true,
                    cols: [
                        {type: "numbers"},
                        {type: "radio"},
                        {field: 'title',  title: '菜单名称'},
                        {field: 'type',  title: '类型', align: "center",templet: function (d) {
                                if (d.type == 'topmenu') {
                                    return '<span class="layui-badge layui-bg-red">顶部菜单</span>';
                                }
                                if (d.type == 'leftmenu') {
                                    return '<span class="layui-badge layui-bg-blue">左侧菜单</span>';
                                } else {
                                    return '<span class="layui-badge layui-bg-green">权限</span>';
                                }
                            }
                        },
                        {field: 'typecode',  title: '编码', align: "center"}
                    ],
                    reqData: function(data, callback) {
                        // 在这里写ajax请求，通过callback方法回调数据
                        $.get(api+'menu/loadMenu', function (res) {
                            callback(res.data);  // 参数是数组类型
                            tableSelectIns.setChecked(pid);  // 设置选中数据
                        });
                    }
                });
            }
        });

    });
}
