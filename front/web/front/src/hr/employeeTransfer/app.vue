<script>
    import cfg from './cfg.js'
    import checkEmployee from '../employee/checkEmployee'
    export default {
        components: {
            cfg,
            checkEmployee,
        },
        ready() {
            this.choiceTab(0)
        },
        data() {
            return {
                listData: [],
                listTabBar: {
                    tab0: 0,
                    tab1: 0,
                },
                // 列表选项卡当前项的索引
                activeTab: 0,
                actDepartment: '',
                listObj: cfg.listParam,
                filterCfg:cfg.leftItemCfg.filterCfg,
                oldFilterConfig:'',
                checkConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '员工档案',
                },
                modalConfig: {
                    show: false,
                    width: '460px',
                    height: 'auto',
                    header: '调岗',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                viceModalConfig: {
                    show: false,
                    width: '460px',
                    height: 'auto',
                    header: '兼岗',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                filterModCfg:{
                    show: false,
                    width: '370px',
                    height: 'auto',
                    header: '筛选',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                tableData: [],
                detailData: '',
                employeeDetail:{},
                listDetail:[],
                totalCount:0,
                pageIndex:1,
                ckdCode:'',
                openCode:'',
                recordId:'',
                transferStatus:0,
                rejectStatus:0,
                consoleStatus:1,
            }
        },
        methods: {
            //获取tab数量
            getTabNumber(){
                this.$http.post(__URL.hr + 'employee/transfer/status-statistics', {}).then(
                    (res)=>{
                        if(res.data.success){
                            const obj = res.data.data
                            this.listTabBar.tab0 = obj.audited
                            this.listTabBar.tab1 = obj.confirmed
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            href (item, type) {
                console.log(item)
                if(type === 'empName'){
                    this.$http.get(__URL.hr + 'employee/find/code/'+item.empCode).then(
                        (res) => {
                            if(res.data.success){
                                this.employeeDetail=res.data.data
                                this.checkConfig.show=true
                            }else{
                                this.$warning({'type': 'warning','message': res.data.errMsg})
                            }
                        }
                    )
                }else if(item.applyType === 0){
                    this.getDetail(item.recordId)
                    this.openUpdateRoleModal();
                }else{
                    this.getDetail(item.recordId)
                    this.openUpdateViceModal();
                }
            },
            //关闭查看页面
            closeCheckEmployee(){
                this.checkConfig.show=false
                this.choiceTab(0)
            },
            //下面全是这个页面单独和list有关的内容
            filterMod(){
                this.oldFilterConfig=this.filterCfg;
                this.filterModCfg.show = true;
            },
            filterSure(){
                this.filterModCfg.show = false
                this.choiceTab(0)
            },
            filterClose() {
                this.filterCfg = this.oldFilterConfig;
                this.filterModCfg.show = false
            },
            getDetail(item){
                this.$http.get(__URL.hr+'employee/transfer/detail/' + item).then(
                    res => {
                        if (res.data.success) {
                            this.detailData = res.data.data
                            if(this.detailData.applyType == 0){
                                this.modalConfig.header = this.detailData.empName + '/调岗'
                            }else{
                                this.viceModalConfig.header = this.detailData.empName + '/兼岗'
                            }

                        } else {
                            this.$warning({'type': 'failure','message': res.data.errMsg})
                        }
                    }
                )
            },
            openUpdateRoleModal() {
                this.modalConfig.show = true;
            },
            openUpdateViceModal() {
                this.viceModalConfig.show = true;
            },
            doTransfer(){
                this.$http.post(__URL.hr + 'employee/transfer/confirm', this.detailData).then(
                    (res) => {
                        if(res.data.success){
                            this.$warning({'type': 'success','message': '调岗成功'})
                            this.refresh()
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            refresh(){
                this.modalConfig.show = false;
                this.viceModalConfig.show = false;
                this.choiceTab(0)
            },
            // 列表选项卡切换
            changeTab (id) {
                if(id === 'tab1'){
                    this.choiceTab(0)
                } else if (id === 'tab2') {
                    this.choiceTab(1)
                }
            },
            choiceTab (index) {
                this.tableData = []
                this.activeTab = index
                this.getTabData()
                this.getTabNumber()
            },
            // 自动获取第一栏的数据
            autoGetData (item) {
                this.getDepData(item)
                this.actDepartment = item
            },
            // 获取列表的数据
            getTabData () {
                this.actDepartment = ''
                let url
                if (this.activeTab === 0) {
                    url = 'employee/transfer/audited-transfer-dept-list'
                } else if (this.activeTab === 1) {
                    url = 'employee/transfer/confirmed-transfer-dept-list'
                }
                this.$http.post(__URL.hr + url, {}).then(
                    (res) => {
                        if (res.data.success) {
                            this.listData = res.data.data
                            // 为在menu中使用的唯一性标识
                            let menuCode = 0
                            this.listData = this.listData.map(val => {
                                val.menuCode = menuCode++
                                if (val.children.length) {
                                    val.children.map(childVal => {
                                        childVal.menuCode = menuCode++
                                    })
                                }
                                return val
                            })
                            // 为在menu中使用的唯一性标识 end
                            if (this.listData.length) this.autoGetData(this.listData[0])
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            // 获取选项的表格数据
            getDepData (item) {
                if (!item) return
                let status
                if (this.activeTab === 0) {
                    status = 1
                } else if (this.activeTab === 1) {
                    status = 2
                }
                const params = {
                    deptCode: item.departmentCode,
                    transferStatus: status
                }
                this.$http.post(__URL.hr + 'employee/transfer/transfer-list', params).then(
                    (res) => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
        },
        computed: {
            // 列表组件配置
            tabCfg () {
                return {
                    select: 'tab' + (this.activeTab + 1),
                    tabBarData: [{
                        id: 'tab1',
                        name: '待处理(' + this.listTabBar.tab0 + ')',
                    },{
                        id:'tab2',
                        name: '已处理(' + this.listTabBar.tab1 + ')',
                    }],
                }
            },
            tableCfg () {
                if (this.activeTab === 0) {
                    return cfg.tableCfg
                } else if (this.activeTab === 1) {
                    return cfg.lookTableCfg
                }
            },
            tableParams() {
                let param = {
                    "audit": this.listObj.audit,
                    "beginCreateTime": "",
                    "docNo": "",
                    "endCreateTime": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                    "supplierCode": this.listObj.supplierCode,
                    "supplierName": this.listObj.supplierName,
                    "yearWeek": this.listObj.yearWeek
                }
                return param
            },
            hasMore:function(){
                if(this.totalCount>this.pageIndex && this.pageIndex<(this.totalCount/20)){
                    return true
                }else{
                    return false
                }
            }
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click=''><!--<i class="icon-hp_list__add"></i>新增--></a>
                    <a href="javascript:;"  @click='filterMod'><!--<i class="icon-filter-two"></i>筛选--></a>
                </div>

                <div class="item_body">
                    <tab-bar :config="tabCfg" @cb="changeTab"></tab-bar>
                    <menu :default-opened="[actDepartment.menuCode]" :default-active="actDepartment.menuCode">
                        <submenu v-for="(index, item) in listData" @cb="getDepData(item)"
                                 :index="item.menuCode" :has-children="item.children.length > 0">
                            <template slot="title">
                                <div class="list-space">
                                    <div>{{item.departmentName}}</div>
                                    <div>{{item.employeeCount}}</div>
                                </div>
                            </template>
                            <menu-item v-for="sonItem in item.children" @cb="getDepData(sonItem)"
                                       :index="sonItem.menuCode">
                                <div class="list-space son">
                                    <div>{{sonItem.departmentName}}</div>
                                    <div>{{sonItem.employeeCount}}</div>
                                </div>
                            </menu-item>
                        </submenu>
                    </menu>
                </div>
            </div>

            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 调岗弹框系列 -->
    <modal :config.sync='modalConfig' @sure='doTransfer' @close='modalConfig.show=false'>
        <div class="pd-10 inline-flex">
            <div class='form-group'>
                <label>调整前部门:</label>
                <div class="s-input ic2">
                    <p>{{detailData.preDeptName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label>调整前岗位:</label>
                <div class="s-input ic2">
                    <p>{{detailData.preRoleName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label>调整后部门:</label>
                <div class="s-input ic2">
                    <p>{{detailData.postDeptName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label>调整后岗位:</label>
                <div class="s-input ic2">
                    <p>{{detailData.postRoleName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>生效日期:</label>
                <date-picker :config='dateCfg' :date.sync='detailData.transferDate'></date-picker>
            </div>
        </div>
    </modal>

    <!-- 兼岗弹框 -->
    <modal :config.sync='viceModalConfig' @sure='doTransfer' @close='viceModalConfig.show=false'>
        <div class="pd-10 inline-flex">
            <div class='form-group'>
                <label>部门:</label>
                <div class="s-input ic2">
                    <p>{{detailData.preDeptName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label>岗位:</label>
                <div class="s-input ic2">
                    <p>{{detailData.preRoleName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label>兼岗类别:</label>
                <div class="s-input ic2">
                    <p v-show="detailData.applyType == 1">增加兼任岗位</p>
                    <p v-show="detailData.applyType == 2">移除兼任岗位</p>
                </div>
            </div>
            <div class='form-group'>
                <label>兼任岗位:</label>
                <div class="s-input ic2">
                    <p>{{detailData.postDeptName}}-{{detailData.postRoleName}}</p>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>生效日期:</label>
                <date-picker :config='dateCfg' :date.sync='detailData.transferDate'></date-picker>
            </div>
        </div>
    </modal>

    <!--筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg' @cb=''></filter>
    </modal>

    <!--查看内页-->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee>
    </inner>
</template>

<style lang='less' scoped>
    .list-space {
        width:calc(~'100% - 40px');
        display: flex;
        justify-content: space-between;

        &.son {
            width:calc(~'100% - 16px');
        }
    }

    .inline-flex {
        .form-group:nth-last-of-type(n+2) {
            display: inline-flex;
            width: 48%;
        }
    }
</style>
