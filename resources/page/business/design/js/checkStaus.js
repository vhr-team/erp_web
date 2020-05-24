layui.use(['layer', 'form'], function () {
    var layer = layui.layer
        , form = layui.form;
    var vm = new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            drawer: false,
            /*加载动画*/
            loading: true,
            page: 1,//页码
            pageSize: 10,//行数
            total: 0,//总记录数
            recordList: [],//展示的数据
            record: {//查询的条件
                productName: "",//产品名称
                registerTime: ""//建档时间
            },
            recordmessageList: {//点击的产品数据
            },

            addconstituteList: {
                record: {},
                archives: []

            },
            options: [],//物料下拉框数据

            reverse: true,
            activities: []
        },
        methods: {
            /*添加选项*/
            addrow() {
                this.addconstituteList.archives.push({});
            },
            /*删除选项*/
            deleteRow(index) {
                this.addconstituteList.archives.splice(index, 1);
            },
            /*查询物料名称*/
            selectByproId(proid) {
                /* axios.get(api1+"design_material/selectById?ID="+proid).then(res=>{
                 })*/
                this.addconstituteList.record.productId = this.recordmessageList.productId
            },
            /*添加组成*/
            addarchives() {
                this.fullscreenLoading = true;
                if (this.addconstituteList == null) {
                    vm.$message({//添加失败
                        showClose: true,
                        message: "请添加物料在提交",
                        type: 'error'
                    });
                    return;
                }
                $.ajax({
                    url: api1 + "material_archives/addarchives",
                    method: "post",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(this.addconstituteList),
                    success: function (data) {
                        if (data.success) {
                            vm.$message({//添加成功
                                showClose: true,
                                message: data.message,
                                type: 'success'
                            });
                            $("#closemotal").click();
                        } else {
                            vm.$message({//添加失败
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                            $("#closemotal").click();
                        }

                        vm.fullscreenLoading = false;
                    },
                    error: function () {
                        vm.$message({//异常
                            showClose: true,
                            message: "异常",
                            type: 'error'
                        });
                        $("#closemotal").click();
                        vm.fullscreenLoading = false;

                    }
                })
            },
            /*//获取点击的行数据*/
            recordmessage(row) {
                this.recordmessageList = row;//绑定到修改的实体
                axios.get(api1 + "material_archives/selectByproId?productId=" + row.productId).then(res => {
                    if (res.data != null) {
                        this.addconstituteList.archives = res.data;
                    }
                })
            },
            /*分页条件查询*/
            findPage() {
                axios.post(api1 + "design_record/notconstitute?page=" + this.page + "&pageSize=" + this.pageSize, this.record).then(res => {
                    this.total = res.data.total;
                    this.recordList = res.data.data;
                    this.loading = false;
                }).catch(err => {
                    vm.$message({//异常
                        showClose: true,
                        message: "获取超时，请检查网络",
                        type: 'error'
                    });
                })
            },
            /*设置行数*/
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            /*获取页码*/
            handleCurrentChange(page) {
                this.page = page;
                this.findPage();
            },
            /*全选*/
            toggleSelection(rows) {//全选选中
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            /*获取复选框选中的值*/
            handleSelectionChange(value) {
                this.deleterecords = value;
            },
            selectAll() {
                axios.get(api1 + "design_material/selectAll").then(res => {
                    this.options = res.data;
                }).catch()
            },
            /*查看审核详情*/
            selectcheckremark(value) {
                console.log(value.productId);
                axios.get(api1 + "design_record/selectcheckremarkAll?productId=" + value.productId).then(res => {
                    this.activities = res.data;
                }).catch()

            },

        },
        created() {
            /*页面加载*/
            this.findPage();
            /**/
            this.selectAll();
        }
    });
});
