<script>
    import cfg from './cfg.js'
    import checkEmployee from '../employee/checkEmployee'
    import transferDetail from './TransferDetail.vue'
    import partDetail from './partDetail.vue'

    export default {
        components: {
            cfg,
            checkEmployee,
            transferDetail,
            partDetail,
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
                    tab2: 0,
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
                transferDetailConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '员工调岗申请',
                },
                partDetailConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '员工兼岗申请',
                },
                filterModCfg:{
                    show: false,
                    width: '370px',
                    height: 'auto',
                    header: '筛选',
                    btn: [{
                        name: '关闭',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                msgCfg:{
                    type:'warning',
                    show:false,
                    content:''
                },
                tableData: [],
                employeeDetail:{},
                listDetail:[],
                totalCount:0,
                pageIndex:1,
                ckdCode:'',
                openCode:'',
                recordId:'',
                transferStatus:0,
                rejectStatus:0,
                consoleStatus:0,
            }
        },
        methods: {
            //获取tab数量
            getTabNumber(){
                this.$http.post(__URL.hr + 'employee/transfer/status-statistics',{}).then(
                    (res)=>{
                        if(res.data.success){
                            const obj = res.data.data
                            this.listTabBar.tab0 = obj.unaudited
                            this.listTabBar.tab1 = obj.rejected
                            this.listTabBar.tab2 = obj.confirmed
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            /* 重置对象 */
            initListObj(obj) {
                let filterObj=this.getFilterObject()
                let init = {
                    "pageIndex": 0,
                    "pageSize": 0,
                    "jobNumber": filterObj.jobNumber,
                    "employeeName": filterObj.employeeName,
                    "enterDateStart": filterObj.enterDateStart,
                    "enterDateEnd": filterObj.enterDateEnd,
                    "applicationDateStart": filterObj.applicationDateStart,
                    "applicationDateEnd": filterObj.applicationDateEnd,
                    "departmentCode": obj.departmentCode,
                    "transferStatus": this.transferStatus,
                    "rejectStatus": this.rejectStatus
                }
                return init
            },
            href (item, type) {
                if (type === 'empName') {
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
                }
            },
            operate(type,item){
                if (item.applyType === 0) {
                    this.transferDetailConfig.show = true
                } else {
                    this.partDetailConfig.show = true
                }
                this.recordId = item.recordId
            },
            //关闭查看页面
            closeCheckEmployee(){
                this.checkConfig.show=false
            },
            //关闭调岗内页
            closeTransfer(){
                this.choiceTab(0)
                this.transferDetailConfig.show=false
            },
            //关闭兼岗内页
            closePart(){
                this.choiceTab(0)
                this.partDetailConfig.show=false
            },
            //下面全是这个页面单独和list有关的内容
            filterMod(){
                this.filterModCfg.show = true;
                this.oldFilterConfig=this.filterCfg;
            },
            filterSure(){
                this.choiceTab(0)
                this.filterModCfg.show = false
            },
            filterClose() {
                this.filterModCfg.show = false
                this.filterCfg = this.oldFilterConfig;
            },
            getFilterObject(){
                let filterObj={}
                for(let i=0;i<this.filterCfg.length;i++){
                    filterObj[this.filterCfg[i].key]=this.filterCfg[i].value
                }
                return filterObj
            },
            getTable(item){
                let param=this.initListObj(item)
                this.$http.post(__URL.hr + 'employee/transfer/list', param).then(
                    (res) => {
                        if(res.data.success){
                            var dataList=res.data.data.dataList;
                            this.tableData=dataList
                            this.totalCount=res.data.data.totalCount;
                            this.consoleStatus = param.transferStatus
                            this.rejectStatus = param.rejectStatus
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            getFirst(type){
                let filterObj=this.getFilterObject()
                if(type === 'add'){
                    this.pageIndex++;
                }
                let param={
                    "pageIndex": 0,
                    "pageSize": 0,
                    "jobNumber": filterObj.jobNumber,
                    "employeeName": filterObj.employeeName,
                    "enterDateStart": filterObj.enterDateStart,
                    "enterDateEnd": filterObj.enterDateEnd,
                    "transferDateStart": filterObj.transferDateStart,
                    "transferDateEnd": filterObj.transferDateEnd,
                    "departmentCode": "",
                    "transferStatus": this.transferStatus,
                    "rejectStatus": this.rejectStatus,
                    "role":0
                }
                this.$http.post(__URL.hr + 'employee/transfer/department/list', param).then(
                    (res) => {
                        if(res.data.success){
                            if (type === 'refresh') {
                                this.listDetail.splice(0, this.listDetail.length);
                            }
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                this.listDetail.push(res.data.data.dataList[i])
                            }
                            this.totalCount=res.data.data.totalCount;
                            if(this.listDetail.length>0){
                                this.getTable(this.listDetail[0])
                            }
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            loadMore(){
                this.getFirst('add')
            },
            // 列表选项卡切换
            changeTab (id) {
                if(id === 'tab1'){
                    this.choiceTab(0)
                } else if (id === 'tab2') {
                    this.choiceTab(1)
                } else if (id === 'tab3') {
                    this.choiceTab(2)
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
                    url = 'employee/transfer/unaudited-transfer-dept-list'
                } else if (this.activeTab === 1) {
                    url = 'employee/transfer/rejected-transfer-dept-list'
                } else if (this.activeTab === 2) {
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
                    status = 0
                } else if (this.activeTab === 1) {
                    status = -1
                } else if (this.activeTab === 2) {
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
                        name: '待审核(' + this.listTabBar.tab0 + ')',
                    },{
                        id:'tab2',
                        name: '已驳回(' + this.listTabBar.tab1 + ')',
                    },{
                        id:'tab3',
                        name: '已通过(' + this.listTabBar.tab2 + ')',
                    }],
                }
            },
            // 表格配置
            tableCfg() {
                if (this.activeTab === 0) {
                    return cfg.tableCfg
                } else {
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
                    <vtable :config='tableCfg' @op="operate" :data='tableData' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!--筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg' @cb=''></filter>
    </modal>

    <!--查看内页-->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee>
    </inner>

    <!--调岗申请详情内页-->
    <inner :config='transferDetailConfig'>
        <transfer-detail :show.sync='transferDetailConfig.show' :id="recordId" :msg-cfg="msgCfg" @refresh='closeTransfer'></transfer-detail>
    </inner>

    <!--兼岗申请详情内页-->
    <inner :config='partDetailConfig'>
        <part-detail :show.sync='partDetailConfig.show' :id="recordId" :msg-cfg="msgCfg" @refresh='closePart'></part-detail>
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
</style>
