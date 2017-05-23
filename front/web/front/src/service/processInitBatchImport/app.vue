<script>
    import cfg from './cfg.js'
    import changeProcess from './changeProcess'
    import changeProcessForArc from './changeProcessForArc'
    import privateRefer from './privateRefer.vue'
    import normalImport from './normalImport.vue'
    import initedPage from  '../customerInitBatchImport/initedTipPage.vue'
    export default {
        components: {
            changeProcess,
            changeProcessForArc,
            privateRefer,
            normalImport,
            initedPage
        },

        data() {
            return {
                // 正式导入配置和data
                normalCfg:{
                    show:false
                },
                normalImportData:{},
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
                listObj: cfg.listCfg,
                tableData: [],
                checkboxObj: [],
                changeModCfg:{
                    show: false,
                },
                changeArcModCfg:{
                    show: false,
                    width: '410px',
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
                    header: '导入工序档案',
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
                    title:'工序档案',
                    url:__URL.osiu + 'import/initProcess',
                    tmpUrl:__URL.osiu + 'download/initProcess',
                },
                batchDeleteCfg:{
                    show:false,
                    type:'warning',
                    msg:'',
                    subMsg:''
                },
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
                    msg:'请确认是否删除全部数据?',
                    subMsg:'',
                    type:'warning',
                    quite:true
                },
                importDepartmentCode:'',
                importDepartment:'',
                importListName:'',
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
                this.$http.get(__URL.osiu + 'get/next/2').then(
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
                this.$http.post(__URL.osiu+ 'import/init/process/findTabCount',{}).then(
                    (res)=>{
                        if(res.data.success){
                            for(let i=0;i<res.data.data.dataList.length;i++){
                                if(res.data.data.dataList[i].tableIndex===2){
                                    this.listTabBar.tab2 = res.data.data.dataList[i].count
                                }else if(res.data.data.dataList[i].tableIndex===1){
                                    this.listTabBar.tab1 = res.data.data.dataList[i].count
                                }else if(res.data.data.dataList[i].tableIndex===0){
                                    this.listTabBar.tab0 = res.data.data.dataList[i].count
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
                    "departmentCode": obj.departmentCode?obj.departmentCode:'',
                    "departmentName": obj.departmentName?obj.departmentName:'',
                    "entCode": obj.entCode?obj.entCode:'',
                    "pageIndex": obj.pageIndex?obj.pageIndex:'',
                    "pageSize": obj.pageIndex?obj.pageSize:'',
                    "tabIndex": obj.tabIndex
                }
                return init
            },
            // table返回的操作参数
            operate(type, item) {
                if('edit' === type){
                    if(this.activeTab === 2){
                        this.$http.post(__URL.arc + 'process/detail', {processCode: item.processCode, recordStatus: 1}).then(
                            (res) => {
                                if(res.data.success){
                                    this.changeData=res.data.data;
                                    this.changeArcModCfg.show=true;
                                }else{
                                    this.$warning({'type': 'warning','message': res.data.errMsg})
                                }
                            }
                        )
                    } else {
                        this.$http.get(__URL.osiu + 'import/init/process/detail/'+item.id).then(
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
                this.checkboxObj = [];
                this.importListName= item.departmentName;
            },
            /* 数据请求 */
            getList(item) {
                if (!item) return
                this.tableParams.firstDeptName = this.checkFirst.departmentName || ''
                this.tableParams.secondDeptName = this.checkSecond.departmentName || ''
                this.tableParams.pageIndex=item.pageIndex
                this.tableParams.pageSize=item.pageSize
                this.$http.post(__URL.osiu + 'import/init/process/list', this.tableParams).then(
                    (res) => {
                        if(res.data.success){
                            if(!item){
                                this.tableTotal=res.data.data.totalCount;
                            }
                            this.tableData = res.data.data.dataList;
                            if(this.activeTab === 2){
                                for(let i=0;i<res.data.data.dataList.length;i++){
                                    res.data.data.dataList[i].status=1
                                }
                            }
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            changePage(item){
                getList(item)
            },
            //刷新外页
            refresh(text){
                this.getTabNumber()
                if(text){
                    this.$warning({'type': 'success','message': text})
                }
                this.tableTotal=0;
                this.tableData=[];
                this.choiceTab(0)
            },
            //正式导入
            importData(){
                let param = {
                    firstDeptCode:this.checkFirst.departmentCode,
                    firstDeptName:this.checkFirst.departmentName,
                    secondDeptCode:this.checkSecond.departmentCode || '',
                    secondDeptName:this.checkSecond.departmentName || '',
                }
                this.normalImportData = param
                this.normalCfg.show = true
            },
            importSure(){
                if(this.listTabBar.tab0 === 0){
                    this.$warning({'type': 'warning','message': '没有可以导入的数据！'})
                    return
                }
                let param = {
                    ids: [],
                    parentDeptCode: this.importDepartmentCode,
                    parentDeptName: this.importDepartment,
                    departmentName: this.importListName,
                    firstDeptName:  this.checkFirst.departmentName || '',
                    secondDeptName: this.checkSecond.departmentName || '',
                }
                for(let i=0;i<this.checkboxObj.length;i++){
                    param.ids.push(this.checkboxObj[i].id)
                }
                this.$http.post(__URL.osiu + 'import/init/process/formal', param).then(
                    (res) => {
                        if(res.data.success){
                            this.importModCfg.show=false;
                            this.$warning({'type': 'success','message': res.data.data})
                            this.enter=true;
                            this.refresh();
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            importClose(){
                this.importModCfg.show=false
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
                this.importDepartment=val.name;
                this.importDepartmentCode=val.code;
                this.importFirstDeptName=val.firstDeptName
                this.importSecondDeptName=val.secondDeptName
                this.departmentCfg.show=false;
            },
            //批量删除
            batchDelete(){
                if(this.checkboxObj.length === 0){
                    this.deleteAllCfg.show=true;
                }else{
                    this.batchDeleteCfg.msg='确认删除勾选的'+this.checkboxObj.length+'行记录吗？'
                    this.batchDeleteCfg.show=true;
                }
            },
            deleteAllData(){
                this.batchDeleteSure()
            },
            batchDeleteSure(){
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
                this.$http.post(__URL.osiu + 'import/init/process/batchDel', param).then(
                    (res) => {
                        if(res.data.success){
                            this.refresh('删除成功!')
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }

                    }
                )
            },
            addNew(){
                this.importCfg.show=true;
            },
            //修改回调
            changeSure(val){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.osiu + 'import/init/process/update',val).then(
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
            changeArcSure(){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.arc + 'process/update',this.changeData).then(
                    (res) => {
                        if(res.data.success){
                            this.changeArcModCfg.show=false;
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
            changeArcClose(){
                this.changeArcModCfg.show=false;
            },
            //单个删除
            singleDelete(){
                this.singleDeleteCfg.msg='确认删除该条记录吗？'
                this.singleDeleteCfg.show=true;
            },
            singleDeleteSure(){
                this.$http.get(__URL.osiu + 'import/init/process/delete/'+this.deleteData.id).then(
                    (res) => {
                        if(res.data.success){
                            this.changeModCfg.show=false;
                            this.refresh('删除成功')
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            inputcb(){
                this.importCfg.show=false;
                this.$warning({'type': 'success','message': '上传成功'})
                this.refresh();
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
            autoGetData (item, level) {
                this.getDepData(item, level)
                this.actDepartment = item
            },
            // 获取列表的数据
            getTabData () {
                this.actDepartment = ''
                const params = cfg.leftItemCfg.tabCfg.tabBarData[this.activeTab].params.main.param
                this.$http.post(__URL.osiu + 'import/init/process/dept', params).then(
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
                if (level === 'first') {
                    this.checkFirst = item
                    this.checkSecond = ''
                } else if (level === 'second') {
                    this.checkSecond = item
                }
                this.paramOfLoadTable(this.activeTab, item)
                this.getFilter(item)
            },
            // 获取表格数据的参数配置的公共方法
            paramOfLoadTable (tabNum, item) {
                const param = cfg.leftItemCfg.tabCfg.tabBarData[tabNum].params.main.param
                item['tabIndex'] = param['tabIndex']
                item['pageIndex'] = param['pageIndex']
                item['pageSize'] = param['pageSize']
            },
            formalData(val){
                let checkArr = []
                this.checkboxObj.forEach(item=>{
                    checkArr.push(item.id)
                })
                val.ids = checkArr
                val.firstDeptName = this.checkFirst.departmentName || ''
                val.secondDeptName = this.checkSecond.departmentName || ''
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.osiu +'import/init/process/formal', val).then(
                    res=>{
                        if(res.data.success){
                            this.normalCfg.show = false
                            this.enter=true;
                            this.refresh('导入成功')
                            this.clickRepeatControl({type: 'unlock'})
                        }else{
                            this.$warning({'type': 'failure','message': res.data.errMsg})
                            this.clickRepeatControl({type: 'unlock'})
                        }
                    }
                )
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
                    "departmentCode": this.listObj.departmentCode?this.listObj.departmentCode:'',
                    "departmentName": this.listObj.departmentName?this.listObj.departmentName:'',
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
        <alert :config='deleteAllCfg' @cb='deleteAllData'></alert>

        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click='addNew'><i class="icon-hp_list__add"></i>上传草稿</a>
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
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                    <button v-if='enter' class="btn-xl-imp" @click="$router.go('/init/customerInitBatchImport')">下一步</button>
                </div>
            </div>
        </div>

        <!--编辑弹框-->
        <change-process :config='changeModCfg' :detail.sync='changeData' @cb="changeSure"></change-process>

        <!--正式导入-->
        <normal-import :config="normalCfg" :detail="normalImportData" @cb="formalData"></normal-import>

        <modal :config='changeArcModCfg' @sure='changeArcSure' @close='changeArcClose'>
            <change-process-for-arc :detail.sync='changeData'></change-process-for-arc >
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

        <vimport :config="importCfg" @cb="inputcb"></vimport>

        <private-refer :config='departmentCfg' @cb='chioceDepartment'></private-refer>
    </container>
    <inited-page v-if="isInited == true"></inited-page>

</template>

<style lang="less" scoped>
    .list-space {
        width:calc(~'100% - 40px');
        display: flex;
        justify-content: space-between;

        &.son {
            width:calc(~'100% - 16px');
        }
    }
</style>