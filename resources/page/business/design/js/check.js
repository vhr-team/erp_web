layui.use(['layer', 'form'], function () {
    var layer = layui.layer
        , form = layui.form;

    var vm = new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            activeName: '等待审核',
            /*加载动画*/
            loading: true,
            page: 1,//页码
            pageSize: 10,//行数
            total: 0,//总记录数
            recordList: [],//展示的数据
            record: {//查询的条件
                productName: "",//产品名称
                registerTime: "",//建档时间
                checkTag:"等待审核",//审核标志
            },
            proID:"",//产品id
            proName:"",//产品名称
            matarual_constitute:[],//物料组成
            checkers:{//审核的实体
                id:"",//产品序号
                productId:"",//商品id
                productName:"",//产品名称
                productClass:"",//产品档次
                register:"",//设计人
                registerTime:"",//登记时间
                checker:"",//审核人
                checkTag:"",//审核状态
            },
            productCheck:{
                productId:"",//商品id
                productName:"",//产品名称
                productCheck:"",
                checkRemark:"",
                checkPerson:""
            }
        },
        methods: {

            /*获取点击的tab*/
            handleClick(tab, event) {
                this.record.checkTag=tab.name;
                this.findPage();
            },
            /*//获取点击的行数据*/
            recordUpdateList(row) {
                this.recordUpdates = row;//绑定到修改的实体
            },
            /*分页条件查询*/
            findPage() {
                this.loading=true
                axios.post(api1 + "/design_record/findPagecheck?page=" + this.page + "&pageSize=" + this.pageSize, this.record).then(res => {
                    this.total = res.data.total;
                    this.recordList = res.data.data;
                    this.loading=false;
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
                this.deleterecords=value;
            },
            /*查看点击选中行*/
            show(value){
                /**/
                this.checkers.productId=value.productId;
                this.checkers.productName=value.productName;
                this.checkers.productClass=value.productClass;
                this.checkers.register=value.register;
                this.checkers.registerTime=value.registerTime;
                console.log(this.checkers);
                this.checkers.id=value.id;
                this.proID=value.productId
                this.proName=value.productName;
                var checker = $.parseJSON(window.localStorage.getItem("user"));
                this.checkers.checker = checker.name;
                axios.get(api1+"design_record/selectBymaterielArchivesId?materielArchivesId="+value.materielArchivesId).then(res=>{
                    this.matarual_constitute=res.data;
                }).catch(err=>{
                    vm.$message({//异常
                        showClose: true,
                        message: "获取超时，请检查网络",
                        type: 'error'
                    });
                })
            },
            checkrecord(value){//
                this.fullscreenLoading = true;
                this.checkers.checkTag=value;
                this.productCheck.productId=this.checkers.productId
                this.productCheck.productName=this.checkers.productName
                this.productCheck.productCheck=this.checkers.checkTag
                this.productCheck.checkPerson=this.checkers.checker
                var data={record:this.checkers,check:this.productCheck}
                if(this.checkers!=null){
                    if(this.productCheck.productCheck==="审核未通过"){
                        layer.prompt({
                            formType: 2,
                            value: '请输入理由',
                            title: '不通过的理由',
                            area: ['500', '150'] //自定义文本域宽高
                        }, function(value, index, elem){
                            vm.productCheck.checkRemark=value;
                            layer.close(index);
                            axios.post(api1+"design_record/updatecheck",data).then(res=>{
                                if(res.data.success){
                                    vm.$message({
                                        showClose: true,
                                        message: res.data.message,
                                        type: 'success'
                                    });
                                }else{
                                    vm.$message({
                                        showClose: true,
                                        message: res.data.message,
                                        type: 'error'
                                    });
                                }
                                vm.findPage();
                                vm.fullscreenLoading = false;
                            }).catch(err=>{
                                vm.$message({//异常
                                    showClose: true,
                                    message: "系统异常",
                                    type: 'error'
                                });
                                vm.fullscreenLoading = false;
                            })
                        });

                    }else{
                        this.productCheck.checkRemark="通过";
                        axios.post(api1+"design_record/updatecheck",data).then(res=>{
                            if(res.data.success){
                                vm.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'success'
                                });
                                vm.fullscreenLoading = false;
                            }else{
                                vm.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'error'
                                });
                                vm.fullscreenLoading = false;
                            }
                            vm.findPage();
                        }).catch(err=>{
                            vm.$message({//异常
                                showClose: true,
                                message: "系统异常",
                                type: 'error'
                            });
                            vm.fullscreenLoading = false;
                        })

                    }


                }
            }
        },
        created() {
            /*页面加载*/
            this.findPage();
        }
    });
});
