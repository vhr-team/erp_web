layui.use(['layer', 'form'], function () {
    var layer = layui.layer
        , form = layui.form;

    var vm = new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            /*加载动画*/
            loading: true,

            /*修改的实体*/
            materialUpdates: {},
            materialUpdate: false,//修改模态框默认关闭
            materialAdd: false,//添加模态框默认关闭
            page: 1,//页码
            pageSize: 10,//行数
            total: 0,//总记录数
            materialList: [],//展示的数据
            material: {//查询的条件
                productName: "",//产品名称
                date: ""//建档时间
            },
            /*添加的实体*/
            materialAdds: {
                marterialPerson: ""//登记人
            },
        },
        methods: {
            /*查询当前用户名*/
            getUser() {
                var marterialPerson = $.parseJSON(window.localStorage.getItem("user"));
                this.materialAdds.marterialPerson = marterialPerson.name;
            },
            /*分页条件查询*/
            findPage() {
                axios.post(api1 + "design_material/materialpage?page=" + this.page + "&pageSize=" + this.pageSize, this.material).then(res => {
                    this.total = res.data.total;
                    this.materialList = res.data.data;
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
            /*关闭添加的模态框*/
            materialAddClose(done) {
                done();//关闭添加模态框
                vm.recordAdds = {}//清空添加文本框
            },
            /*添加物料*/
            addmaterial() {
                this.fullscreenLoading = true;
                var data = this.materialAdds;
                if (data.productName == null || data.productName === "") {
                    vm.$message({showClose: true, message: "请输入物料名称", type: 'error'});
                    return;
                }
                if (data.type == null || data.type === "") {
                    vm.$message({showClose: true, message: "请输入用途类型", type: 'error'});
                    return;
                }
                if (data.amountUnit == null || data.amountUnit === "") {
                    vm.$message({showClose: true, message: "请输入物料单位", type: 'error'});
                    return;
                }
                if (data.costPrice == null || data.costPrice === "") {
                    vm.$message({showClose: true, message: "请输入物料单价", type: 'error'});
                    return;
                }
                if (data.marterialPerson == null || data.marterialPerson === "") {
                    vm.$message({showClose: true, message: "请输入登记人", type: 'error'});
                    return;
                }
                layer.confirm('请确认数据无误', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1 + "design_material/addmaterial", data).then(res => {
                        if (res.data.success) {
                            vm.findPage();
                            vm.$message({//添加成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });
                            vm.materialAdd=false;
                            this.materialAdds={};
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//添加失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.materialAdd=false;
                            this.materialAdds={};
                            vm.fullscreenLoading = false;
                        }
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.materialAdd=false;
                        vm.fullscreenLoading = false;
                    });

                    layer.close(index);
                });
            },
            /*获取修改数据*/
            Update(value) {
                this.materialUpdates = value;//绑定修改的实体
            },
            /*修改物料*/
            updatematerial() {
                this.fullscreenLoading = true;
                var data = this.materialUpdates;
                if (data.productName == null || data.productName === "") {
                    vm.$message({showClose: true, message: "请输入物料名称", type: 'error'});
                    return;
                }
                if (data.type == null || data.type === "") {
                    vm.$message({showClose: true, message: "请输入用途类型", type: 'error'});
                    return;
                }
                if (data.amountUnit == null || data.amountUnit === "") {
                    vm.$message({showClose: true, message: "请输入物料单位", type: 'error'});
                    return;
                }
                if (data.costPrice == null || data.costPrice === "") {
                    vm.$message({showClose: true, message: "请输入物料单价", type: 'error'});
                    return;
                }
                if (data.marterialPerson == null || data.marterialPerson === "") {
                    vm.$message({showClose: true, message: "请输入登记人", type: 'error'});
                    return;
                }
                layer.confirm('请确认数据无误', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1 + "design_material/updatematerial", data).then(res => {
                        if (res.data.success) {
                            vm.findPage();
                            vm.$message({//修改成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });
                            vm.materialUpdate=false;
                        } else {
                            vm.$message({//修改失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                        vm.fullscreenLoading = false;
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.materialUpdate=false;
                    })
                    layer.close(index);
                });
            }
        },
        created() {
            /*页面加载*/
            this.findPage();
        }
    });
});
