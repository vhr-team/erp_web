
layui.use(['layer', 'form'], function () {
    var layer = layui.layer
        , form = layui.form;

    var vm = new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            /*加载动画*/
            loading: true,
            /*产品档次*/
            productClassSelect: [
                {
                    value: '高档',
                    label: '高档'
                }, {
                    value: '中档',
                    label: '中档'
                }, {
                    value: '低档',
                    label: '低档'
                }
            ],
            /*//修改的表单实体*/
            recordUpdates: {
                productName: '',
                factoryName: '',
                productClass: '',
                warranty: '',
                listPrice: '',
                realCostPrice: '',
                amountUnit: '',
                responsiblePerson: '',
                productDescribe: '',
                register: ''
            },
            recordUpdate: false,//修改模态框默认关闭
            recordAdd: false,//添加模态框默认关闭
            page: 1,//页码
            pageSize: 10,//行数
            total: 0,//总记录数
            recordList: [],//展示的数据
            record: {//查询的条件
                productName: "",//产品名称
                registerTime: ""//建档时间
            },
            recordAdds: {},//添加的实体
            deleterecords: [],//删除的id
            recovernum: 0,//回收站数量
            proID: "",//产品id
            proName: "",//产品名称
            matarual_constitute: []//物料组成
        },
        methods: {
            /*查看物料组成*/
            show(value) {
                this.proID = value.productId
                this.proName = value.productName;
                axios.get(api1 + "design_record/selectBymaterielArchivesId?materielArchivesId=" + value.materielArchivesId).then(res => {
                    this.matarual_constitute = res.data;
                }).catch(err => {

                })
            },
            /*获取当前用户名*/
            getUser() {
                var register = $.parseJSON(window.localStorage.getItem("user"));
                this.recordAdds.register = register.name;

            },
            /*//获取点击的行数据*/
            recordUpdateList(row) {
                this.recordUpdates = row;//绑定到修改的实体
            },
            /*分页条件查询*/
            findPage() {
                axios.post(api1 + "/design_record/findPage?page=" + this.page + "&pageSize=" + this.pageSize, this.record).then(res => {
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
            /*关闭修改模态框*/
            recordUpdateClose(done) {
                done();
            },
            /*获取复选框选中的值*/
            handleSelectionChange(value) {
                this.deleterecords = value;
            },
            /*关闭添加的模态框*/
            recordAddClose(done) {
                done();//关闭添加模态框
                vm.recordAdds = {}//清空添加文本框
            },
            /*修改档案*/
            updaterecord() {
                this.fullscreenLoading = true;
                var data = this.recordUpdates;
                /*验证非空*/
                if (data.productName == null || data.productName === "") {
                    vm.$message({showClose: true, message: "请输入商品名称", type: 'error'});
                    return;
                }
                if (data.factoryName == null || data.factoryName === "") {
                    vm.$message({showClose: true, message: "请输入厂商", type: 'error'});
                    return;
                }
                if (data.productClass == null || data.productClass === "") {
                    vm.$message({showClose: true, message: "请选择档次", type: 'error'});
                    return;
                }
                if (data.warranty === "" || data.warranty === "") {
                    vm.$message({showClose: true, message: "请输入保修期", type: 'error'});
                    return;
                }
                if (data.listPrice == null || data.listPrice === "") {
                    vm.$message({showClose: true, message: "请输入市场单价", type: 'error'});
                    return;
                }
                if (data.realCostPrice == null || data.realCostPrice === "") {
                    vm.$message({showClose: true, message: "请输入成本单价", type: 'error'});
                    return;
                }
                if (data.amountUnit == null || data.amountUnit === "") {
                    vm.$message({showClose: true, message: "请输入单位", type: 'error'});
                    return;
                }
                if (data.responsiblePerson == null || data.responsiblePerson === "") {
                    vm.$message({showClose: true, message: "请输入产品经理", type: 'error'});
                    return;
                }
                layer.confirm('请确认数据无误！', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1 + "design_record/updaterecord", data).then(res => {
                        if (res.data.success) {
                            vm.findPage();
                            vm.$message({//修改成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//修改失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.fullscreenLoading = false;
                        }
                        this.fullscreenLoading = false;
                    }).catch(err => {//系统异常
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.fullscreenLoading = false;
                    })
                    layer.close(index);
                    vm.recordUpdate=false;
                });
            },
            /*添加档案*/
            addrecord() {
                this.fullscreenLoading = true;
                var data = this.recordAdds;//获取数据
                /*验证非空*/
                if (data.productName == null || data.productName === "") {
                    vm.$message({showClose: true, message: "请输入商品名称", type: 'error'});
                    return;
                }
                if (data.factoryName == null || data.factoryName === "") {
                    vm.$message({showClose: true, message: "请输入厂商", type: 'error'});
                    return;
                }
                if (data.productClass == null || data.productClass === "") {
                    vm.$message({showClose: true, message: "请选择档次", type: 'error'});
                    return;
                }
                if (data.warranty === "" || data.warranty === "") {
                    vm.$message({showClose: true, message: "请输入保修期", type: 'error'});
                    return;
                }
                if (data.listPrice == null || data.listPrice === "") {
                    vm.$message({showClose: true, message: "请输入市场单价", type: 'error'});
                    return;
                }
                if (data.realCostPrice == null || data.realCostPrice === "") {
                    vm.$message({showClose: true, message: "请输入成本单价", type: 'error'});
                    return;
                }
                if (data.amountUnit == null || data.amountUnit === "") {
                    vm.$message({showClose: true, message: "请输入单位", type: 'error'});
                    return;
                }
                if (data.responsiblePerson == null || data.responsiblePerson === "") {
                    vm.$message({showClose: true, message: "请输入产品经理", type: 'error'});
                    return;
                }
                if (data.register == null || data.register === "") {
                    vm.$message({showClose: true, message: "请输入登记人信息", type: 'error'});
                    return;
                }
                /*添加*/
                layer.confirm('再次确认数据！', {icon: 3, title: '提示'}, function (index) {
                    axios.post(api1 + "design_record/addrecord", data).then(res => {
                        if (res.data.success) {
                            vm.findPage();
                            vm.$message({//添加成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//添加失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.recordAdd();
                            vm.fullscreenLoading = false;
                        }
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.recordAdd();
                        vm.fullscreenLoading = false;
                    })
                    layer.close(index);
                });

            },
            /*回收·档案*/
            deleterecord(value) {
                this.fullscreenLoading = true;
                layer.confirm('删除后将会进入回收站', {icon: 3, title: '确定删除吗？'}, function (index) {
                    axios.post(api1 + "/design_record/deleterecord", value).then(res => {
                        if (res.data.success) {

                            vm.$message({//回收成功
                                showClose: true,
                                message: res.data.message,
                                type: 'success'
                            });
                            vm.findPage();
                            vm.fullscreenLoading = false;
                        } else {
                            vm.$message({//回收失败
                                showClose: true,
                                message: res.data.message,
                                type: 'error'
                            });
                            vm.fullscreenLoading = false;
                        }
                        vm.seachrecycle();
                    }).catch(err => {
                        vm.$message({//异常
                            showClose: true,
                            message: "系统异常",
                            type: 'error'
                        });
                        vm.fullscreenLoading = false;
                    })

                    layer.close(index);
                },function () {//取消
                    vm.fullscreenLoading = false;
                });
            },
            /*跳转到回收页面*/
            recycle() {
                $(location).prop('href', 'record_recycle.html');
            },
            /*跳转到回收页面*/
            matarual_herf() {
                $(location).prop('href', 'matarual_constitute.html');
            },
            /*查询已回收的数量*/
            seachrecycle() {
                axios.get(api1 + "design_record/recovernum").then(res => {
                    this.recovernum = res.data;
                }).catch()
            }

        },
        created() {
            /*页面加载*/
            this.findPage();
            /*登记人信息*/
            this.getUser();
            /*获取回收站信息*/
            this.seachrecycle();
        }
    });
});
