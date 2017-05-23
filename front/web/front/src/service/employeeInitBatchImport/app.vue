<script>
    import cfg from './cfg.js'
    import changeEmployee from './changeEmployee'
    import changeEmployeeForHr from './changeEmployeeForHr'
    import privateRefer from './privateRefer.vue'
    import initedPage from '../customerInitBatchImport/initedTipPage.vue'
    export default {
        components: {
            changeEmployee,
            changeEmployeeForHr,
            privateRefer,
            initedPage
        },

        data() {
            return {
                //存储当前选中的一级，和二级
                checkFirst:'',
                checkSecond:'',
                listData: [],
                listTabBar: {
                    tab0: 0,
                    tab1: 0,
                    tab2: 0,
                },
                // 列表选项卡当前项的索引
                activeTab: 0,
                actDepartment: '',
                // 点击列表一级是存储 firstDeptName 以便点二级时传参
                firstDeptNameSave: '',
                listObj: {},
                tableData: [],
                checkboxObj: [],
                changeModCfg:{
                    show: false,
                    width: '575px',
                    height: 'auto',
                    header: '编辑修改',
                    btn: [{
                        name: '关闭',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }],
                },
                importModCfg:{
                    show: false,
                    width: '400px',
                    height: 'auto',
                    header: '导入员工档案',
                    btn: [{
                        name: '关闭',
                        emit: 'close',
                    }, {
                        name: '确认导入',
                        emit: 'sure',
                    }],
                },
                changeData:{},
                deleteData:{},
                singleDeleteCfg:{
                    show:false,
                    type:'warning',
                    msg:'',
                    subMsg:''
                },
                importCfg:{
                    page:'service',
                    show:false,
                    title:'员工档案',
                    url:__URL.osiu + 'import/initEmployee',
                    tmpUrl:__URL.osiu + 'download/initEmployee',
                },
                batchDeleteCfg:{
                    show:false,
                    type:'warning',
                    msg:'',
                    subMsg:''
                },
                parentName: '',
                importDepartment:'',
                importDepartmentCode:'',
                importFirstDeptName: '',
                importSecondDeptName: '',
                importDepartmentSave:'',
                importDepartmentSaveCode:'',
                importFirstDeptNameSave: '',
                importSecondDeptNameSave: '',
                departmentCfg:{
                    show:false,
                    data:{}
                },
                enter:false,
                tableTotal:0,
                pageCfg:{
                  'pageSize': 50,
                  'pageIndexName': 'pageIndex',
                  'pageSizeName': 'pageSize',
                  'jump':true
                },
                deleteAllCfg:{
                    show:false,
                    msg:'确定批量删除勾选的资料?',
                    subMsg:'',
                    type:'warning',
                    quite:true
                },
                employeeDetail:{},
                changeConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '修改员工档案',
                },
                firstTabNumber:'',
                importAllState: false,
                count: 0,
                importCancelCfg:{
                    show: false,
                    type: 'warning',
                    msg: '该部门下没有可导入人员',
                    subMsg: '',
                    quite: false
                },
                // 按钮重复点击控制
                clickRepeatStatus: false,
                //是否初始化完成
                isInited:'xxx'
            }
        },
        ready() {
            this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
                res=>{
                    if(res.data.success){
                        if(res.data.data.step == 0){
                            this.isInited = true
                        }else{
                            this.isInited =false
                            this.getNextState()
                            this.choiceTab(0)
                        }
                    }
                }
            )
        },
        methods: {
            //初始化判断是非出现下一步
            getNextState(){
                this.$http.get(__URL.osiu + 'get/next/1').then(
                    res=>{
                        if(res.data.success){
                            this.enter=res.data.data;
                        }else{
                            this.enter=false;
                        }
                    }
                )
            },
            //获取tab数量
            getTabNumber(){
                this.$http.post(__URL.osiu+ 'import/init/employee/findTabCount',{}).then(
                    (res)=>{
                        if(res.data.success){
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                if(res.data.data.dataList[i].tableIndex===2){
                                    this.listTabBar.tab2 = res.data.data.dataList[i].count
                                }else if(res.data.data.dataList[i].tableIndex===1){
                                    this.listTabBar.tab1 = res.data.data.dataList[i].count
                                }else if(res.data.data.dataList[i].tableIndex===0){
                                    this.listTabBar.tab0 = res.data.data.dataList[i].count
                                    this.firstTabNumber=res.data.data.dataList[i].count
                                }
                            }
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            /* 重置对象 */
            initListObj(obj) {
                let init = {
                    "departmentCode": obj.departmentCode ? obj.departmentCode: '',
                    "departmentName": obj.departmentName ? obj.departmentName: '',
                    "pageIndex": obj.pageIndex ? obj.pageIndex : '',
                    "pageSize": obj.pageIndex ? obj.pageSize : '',
                    "entCode": obj.entCode ? obj.entCode : '',
                    "tabIndex": obj.tabIndex,
                    "firstDeptName": obj.firstDeptName,
                    "secondDeptName": obj.secondDeptName,
                    "count": obj.count
                }
                return init
            },
            // table返回的操作参数
            operate(type, item) {
                if('edit' === type){
                    //区分期初和正式
                    if(this.activeTab === 2){
                        this.$http.get(__URL.hr + 'employee/find/code/'+item.employeeCode).then(
                        (res) => {
                            if(res.data.success){
                                this.employeeDetail=res.data.data
                                this.changeConfig.show=true
                            }else{
                                this.$warning({'type': 'warning','message': res.data.errMsg})
                            }
                        }
                    )
                    }else{
                        this.$http.get(__URL.osiu + 'import/init/employee/detail/'+item.id).then(
                            (res) => {
                                if(res.data.success){
                                    this.changeData=res.data.data;
                                    this.changeModCfg.show=true;
                                }else{
                                    this.$warning({'type': 'warning','message': res.data.errMsg})
                                }
                            }
                        )
                    }
                }else if('delete' === type){
                    this.deleteData=item;
                    this.singleDelete();
                }
            },
            getFilter(item) {
                this.listObj = this.initListObj(item);
                this.getList(item);
                /* bug2326 导入档案-确认部门中，默认部门更改为当前选择数据的部门 */
                this.checkboxObj = [];
                if (!item.secondDeptName) {
                    this.parentName = ''
                } else {
                    this.parentName = item.firstDeptName
                }
                this.count = this.listObj.count
                this.importDepartment = this.listObj.departmentName;
                this.importDepartmentCode = this.listObj.departmentCode;
                this.importFirstDeptName = this.listObj.firstDeptName
                this.importSecondDeptName = this.listObj.secondDeptName
                if (this.importDepartment !== '') this.importDepartmentSave = this.importDepartment
                if (this.importDepartmentCode !=='') this.importDepartmentSaveCode = this.importDepartmentCode
                if (this.importFirstDeptName !== '') this.importFirstDeptNameSave = this.importFirstDeptName
                if (this.importSecondDeptName !=='') this.importSecondDeptNameSave = this.importSecondDeptName
            },
            /* 数据请求 */
            getList(item) {
                if (!item) return
                this.tableParams.pageIndex=item.pageIndex;
                this.tableParams.pageSize=item.pageSize;
                this.tableParams['firstDeptName'] = item['firstDeptName']
                this.tableParams['secondDeptName'] = item['secondDeptName']
                this.$http.post(__URL.osiu + 'import/init/employee/list', this.tableParams).then(
                    (res) => {
                        if(res.data.success){
                            if(!item){
                                this.tableTotal=res.data.data.totalCount;
                            }
                            this.tableData = res.data.data.dataList;
                            //添加分析通过属性
                            if(this.activeTab === 2){
                                for(var i=0;i<res.data.data.dataList.length;i++){
                                    res.data.data.dataList[i].status=1
                                }
                            }
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            //分页
            changePage(item){
                this.getList(item)
            },
            //刷新外页
            refresh(text){
                if(text){
                    this.$warning({'type': 'success','message': text})
                }
                this.getTabNumber()
                this.tableData=[]
                this.tableTotal=0;
                this.getList();
                this.choiceTab(0)
                this.$broadcast('reloadDep')
            },
            //正式导入
            importData(){
                if (this.count === 0) {
                    this.importModCfg.show = false
                    this.importCancelCfg.show = true
                    return
                }
                /* 未选择部门和人员时，新需求要导入全部并且不要传部门 */
                if(this.importDepartmentSave === '' || this.checkboxObj.length === 0){
                    this.importAllState=true
                    this.importModCfg.show=true
                    return
                } else {
                    this.importAllState=false
                }
                this.importDepartment = this.checkboxObj[0].departmentName || this.importDepartmentSave;
                this.importDepartmentCode=this.checkboxObj[0].importDepartmentCode || this.importDepartmentSaveCode
                this.importFirstDeptName =this.checkboxObj[0].importFirstDeptName || this.importFirstDeptNameSave
                this.importSecondDeptName =this.checkboxObj[0].importSecondDeptName || this.importSecondDeptNameSave
                this.importModCfg.show=true
            },
            importAll(){
                if(this.firstTabNumber===0){
                    this.$warning({'type': 'warning','message': '没有可以导入的数据！'})
                    return
                }
                let param={
                    ids: [],
                    departmentCode: this.importDepartmentCode,
                    departmentName: this.importDepartment,
                    firstDeptName: this.importFirstDeptName,
                    secondDeptName: this.importSecondDeptName,
                    parentName: this.parentName,
                }
                this.$http.post(__URL.osiu + 'import/init/employee/formal', param).then(
                    (res) => {
                        if(res.data.success){
                            this.importModCfg.show=false;
                            this.$warning({'type': 'success','message': res.data.data})
                            this.enter=true
                            this.refresh()
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            importSure(){
                if(this.importDepartment===''){
                    this.$warning({'type': 'warning','message': '请选择部门'})
                    return
                }
                if (this.importAllState === true) {
                    this.importAll()
                    return
                }
                this.afterCheck()
            },
            afterCheck(){
                let idArr=[]
                for(let i=0;i<this.checkboxObj.length;i++){
                    idArr.push(this.checkboxObj[i].id)
                }
                let param = {
                    departmentCode: this.importDepartmentCode,
                    departmentName: this.importDepartment,
                    entCode: "",
                    ids: idArr,
                    userCode: "",
                    firstDeptName: this.importFirstDeptName,
                    secondDeptName: this.importSecondDeptName,
                    parentName: this.parentName,
                }
                this.$http.post(__URL.osiu + 'import/init/employee/formal', param).then(
                    (res) => {
                        if(res.data.success){
                            this.importModCfg.show=false;
                            this.$warning({'type': 'success','message': res.data.data})
                            this.enter=true
                            this.refresh()
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            importClose(){
                this.importModCfg.show=false;
            },
            clearDepartment(){
                this.importDepartment=''
                this.importDepartmentCode=''
                this.importFirstDeptName=''
                this.importSecondDeptName=''
            },
            getDepartment(){
                this.departmentCfg.show=true;
            },
            chioceDepartment(val){
                this.parentName = val.parentName
                this.importDepartment=val.departmentName
                this.importDepartmentCode=val.departmentCode
                if (!this.checkSecond) {
                    this.importFirstDeptName=this.checkFirst.firstDeptName
                    this.importSecondDeptName=this.checkFirst.secondDeptName
                } else {
                    this.importFirstDeptName=this.checkSecond.firstDeptName
                    this.importSecondDeptName=this.checkSecond.secondDeptName
                }
                this.departmentCfg.show=false;
            },
            //批量删除
            batchDelete(){
                if(this.checkboxObj.length===0){
                    this.deleteAllCfg.show=true;
                }else{
                    this.batchDeleteCfg.msg='确认删除勾选的'+this.checkboxObj.length+'行记录吗？'
                    this.batchDeleteCfg.show=true;
                }
            },
            deleteAll(){
                this.batchDeleteSure();
            },
            batchDeleteSure(){
                //区分期初和正式
                if(this.activeTab === 2){
                    //需求改了，暂时没得
                }else{
                    const param = {
                        status: '',
                        ids: [],
                        firstDeptName: '',
                        secondDeptName: '',
                    }
                    if (this.activeTab === 0) {
                        param.status = 1
                    } else if (this.activeTab === 1) {
                        param.status = 0
                    }
                    for(let i=0;i<this.checkboxObj.length;i++){
                        param.ids.push(this.checkboxObj[i].id)
                    }
                    param.firstDeptName = this.checkFirst.departmentName || ''
                    param.secondDeptName = this.checkSecond.departmentName || ''
                    this.$http.post(__URL.osiu + 'import/init/employee/batchDel', param).then(
                        (res) => {
                            if(res.data.success){
                                this.refresh('删除成功!')
                            }else{
                                this.$warning({'type': 'warning','message': res.data.errMsg})
                            }

                        }
                    )
                }
            },
            addNew(){
                this.importCfg.show=true;
            },
            //修改回调
            changeSure(){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.osiu + 'import/init/employee/update',this.changeData).then(
                    (res) => {
                        if(res.data.success){
                            this.changeModCfg.show=false;
                            this.refresh('保存成功')
                            this.clickRepeatControl({type: 'unlock'})
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                            this.clickRepeatControl({type: 'unlock'})
                        }
                    }
                )
            },
            changeClose(){
                this.changeModCfg.show=false;
            },
            //单个删除
            singleDelete(){
                this.singleDeleteCfg.msg='确认删除该条记录吗？'
                this.singleDeleteCfg.show=true;
            },
            singleDeleteSure(){
                //区分期初和正式
                if(this.activeTab === 2){
                    //需求改了，暂时没得
                }else{
                    this.$http.get(__URL.osiu + 'import/init/employee/delete/'+this.deleteData.id).then(
                        (res) => {
                            if(res.data.success){
                                this.changeModCfg.show=false;
                                this.refresh('删除成功')
                            }else{
                                this.$warning({'type': 'warning','message': res.data.errMsg})
                            }
                        }
                    )
                }
            },
            inputcb(){
                this.importCfg.show=false;
                this.$warning({'type': 'success','message': '上传成功'})
                this.refresh();
            },
            //关闭修改页面
            closeChangeEmployee(text){
                this.changeConfig.show=false;
                this.refresh(text)
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
            // 列表选项卡切换
            choiceTab (index) {
                this.tableData = []
                this.activeTab = index
                this.getTabData()
                this.getTabNumber()
            },
            // 自动获取第一栏的数据
            autoGetData (item, level) {
                this.getDepData(item, level)
                this.actDepartment = item
            },
            // 获取列表的数据
            getTabData () {
                this.actDepartment = ''
                const params = cfg.leftItemCfg.tabCfg.tabBarData[this.activeTab].params.main.param
                this.$http.post(__URL.osiu + 'import/init/employee/department', params).then(
                    (res) => {
                        if (res.data.success) {
                            this.listData = res.data.data.dataList
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
                            if (this.listData.length) this.autoGetData(this.listData[0], 'first')
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            // 获取选项的表格数据
            getDepData (item, level) {
                let state
                if (level === 'first') {
                    state = false
                    this.checkFirst = item
                    this.checkSecond = ''
                } else if (level === 'second') {
                    state = true
                    this.checkSecond = item
                }
                this.paramOfLoadTable(this.activeTab, item, state)
                this.getFilter(item)
            },
            // 列表项加载表格数据前的参数配置的公共方法
            paramOfLoadTable (tabNum, item, isMult) {
                if (!isMult) {
                    const param = cfg.leftItemCfg.tabCfg.tabBarData[tabNum].params.main.param
                    item['tabIndex'] = param['tabIndex']
                    item['pageIndex'] = param['pageIndex']
                    item['pageSize'] = param['pageSize']
                    item['firstDeptName'] = item['departmentName']
                    this.firstDeptNameSave = item['departmentName']
                    item['secondDeptName'] = ''
                } else {
                    const param = cfg.leftItemCfg.tabCfg.tabBarData[tabNum].params.main.param
                    item['tabIndex'] = param['tabIndex']
                    item['pageIndex'] = param['pageIndex']
                    item['pageSize'] = param['pageSize']
                    item['firstDeptName'] = this.firstDeptNameSave
                    item['secondDeptName'] = item['departmentName']
                }
            },
            // 按钮重复点击控制
            clickRepeatControl (cfg) {
                if (!cfg) return
                let {type} = cfg
                if (type === 'lock') {
                    this.clickRepeatStatus = true
                    setTimeout(() => {
                        this.clickRepeatStatus = false
                    }, 1000)
                    return
                }
                if (type === 'unlock') {
                    setTimeout(() => {
                        this.clickRepeatStatus = false
                    }, 500)
                    return
                }
            },
        },
        computed: {
            // 列表组件配置
            tabCfg () {
                return {
                    select: 'tab' + (this.activeTab + 1),
                    tabBarData: [{
                        id: 'tab1',
                        name: '待正式导入(' + this.listTabBar.tab0 + ')',
                    },{
                        id:'tab2',
                        name: '有异常(' + this.listTabBar.tab1 + ')',
                    },{
                        id:'tab3',
                        name: '已导入(' + this.listTabBar.tab2 + ')',
                    }],
                }
            },
            // 表格配置
            tableCfg () {
                if (this.activeTab !== 2) {
                    return cfg.tableCfg1
                } else {
                    return cfg.tableCfg2
                }
            },
            tableParams() {
                let param = {
                    "departmentCode": this.listObj.departmentCode,
                    "departmentName": this.listObj.departmentName,
                    "entCode": this.listObj.entCode,
                    "tabIndex":this.listObj.tabIndex,
                    "pageIndex":this.listObj.pageIndex,
                    "pageSize":this.listObj.pageSize
                }
                return param
            },

        },
    }
</script>

<template>
    <container v-if="isInited == false">
        <alert :config='deleteAllCfg' @cb='deleteAll'></alert>

        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click='addNew'><i class="icon-hp_list__add"></i>上传文档</a>
                </div>

                <div class="item_body">
                    <tab-bar :config="tabCfg" @cb="changeTab"></tab-bar>
                    <menu :default-opened="[actDepartment.menuCode]" :default-active="actDepartment.menuCode">
                        <submenu v-for="(index, item) in listData" @cb="getDepData(item, 'first')"
                                 :index="item.menuCode" :has-children="item.children.length > 0">
                            <template slot="title">
                                <div class="list-space">
                                    <div>{{item.departmentName}}</div>
                                    <div>{{item.count}}</div>
                                </div>
                            </template>
                            <menu-item v-for="sonItem in item.children" @cb="getDepData(sonItem, 'second')"
                                       :index="sonItem.menuCode">
                                <div class="list-space son">
                                    <div>{{sonItem.departmentName}}</div>
                                    <div>{{sonItem.count}}</div>
                                </div>
                            </menu-item>
                        </submenu>
                    </menu>
                </div>
            </div>

            <div class="right_item have_footer">
                <div class="item_head btn-ic">
                    <a @click='importData' href="javascript:;" v-if="activeTab === 0">
                        <i class='icon-hr_files__import'></i>正式导入
                    </a>
                    <a @click='batchDelete' href="javascript:;" v-if="activeTab !== 2">
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxObj' :config='tableCfg' :data='tableData' @op='operate'></vtable>
                </div>
                <div class="item_footer">
                    <pagination  :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                    <button v-if='enter' class="btn-xl-imp" @click="$router.go('/init/processInitBatchImport')">下一步</button>
                </div>
            </div>
        </div>

        <!-- 修改内页-->
        <inner :config='changeConfig'>
            <change-employee-for-hr :employee-detail='employeeDetail' @refresh='closeChangeEmployee'></change-employee-for-hr>
        </inner>

        <modal :config='changeModCfg' @sure='changeSure' @close='changeClose'>
            <change-employee :detail.sync='changeData'></change-employee>
        </modal>

        <modal :config='importModCfg' @sure='importSure' @close='importClose'>
            <div class='form-group'>
                <label><span class="must-point">*</span>确认部门:</label>
                <div class="s-input ic2">
                    <input placeholder='请选择部门' readonly type="text" v-model='importDepartment'>
                    <i @click='clearDepartment' v-show='importDepartment' class="icon-close__round r2"></i>
                    <i @click='getDepartment' class="icon-search r1"></i>
                </div>
            </div>
        </modal>

        <alert :config='singleDeleteCfg' @cb='singleDeleteSure'></alert>

        <alert :config='batchDeleteCfg' @cb='batchDeleteSure'></alert>

        <alert :config='importCancelCfg'></alert>

        <vimport :config="importCfg" @cb="inputcb"></vimport>

        <private-refer :config='departmentCfg' @cb='chioceDepartment'></private-refer>
    </container>

    <inited-page v-if="isInited == true"></inited-page>

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
