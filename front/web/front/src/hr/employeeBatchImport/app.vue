<script>
    import cfg from './cfg.js'
    import newEmployee from './newEmployee'
    import changeEmployee from './changeEmployee'
    import changeEmployeeDraft from './changeEmployeeForDraft.vue'
    import privateRefer from './privateRefer.vue'

    export default {
        components: {
            newEmployee,
            changeEmployee,
            changeEmployeeDraft,
            privateRefer,
        },
        ready() {
            this.choiceTab(0)
            window.addEventListener('click', () => {
                this.openSelect = false
            })
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
                listObj: cfg.listCfg,
                tableData: [],
                checkboxObj: [],
                dCfg:{
                    show:false,
                    msg:'',
                    subMsg:'',
                    type:'success',
                    quite:false
                },
                importAlertCfg:{
                    show:false,
                    msg:'',
                    subMsg:'',
                    type:'success',
                    quite:false
                },
                addConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新增员工档案',
                },
                changeDraftModCfg:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '员工档案',
                },
                changeModCfg:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '员工档案',
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
                    page:'',
                    show:false,
                    title:'员工档案',
                    url:__URL.osiu + 'import/employee',
                    tmpUrl:__URL.osiu + 'download/employee',
                },
                batchDeleteCfg:{
                    show:false,
                    type:'warning',
                    msg:'',
                    subMsg:''
                },
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
                lastTableParam:{},
                importAllCfg:{
                    show:false,
                    msg:'请确认是否导入全部待导入数据?',
                    subMsg:'',
                    type:'warning',
                    quite:true
                },
                deleteAllCfg:{
                    show:false,
                    msg:'确定批量删除勾选的资料?',
                    subMsg:'',
                    type:'warning',
                    quite:true
                },
                firstTabNumber:'',
                importAllState: false,
                openSelect:false,
                count: 0,
                importCancelCfg:{
                    show: false,
                    type: 'warning',
                    msg: '该部门下没有可导入人员',
                    subMsg: '',
                    quite: false
                },
            }
        },
        methods: {
            //获取tab数量
            getTabNumber(){
                this.$http.post(__URL.osiu+ 'import/init/employee/findTabCount',{}).then(
                    (res)=>{
                        if(res.data.success){
                            for(let i=0;i<res.data.data.dataList.length;i++){
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
                let url
                let param
                if (this.activeTab !== 2) {
                    url = __URL.osiu + 'import/employee/detail/'
                    param = item.id
                } else {
                    url = __URL.hr + 'employee/find/code/'
                    param = item.employeeCode
                }
                if('edit' === type){
                    this.$http.get(url + param).then(
                        (res) => {
                            if(res.data.success){
                                this.changeData=res.data.data;
                                if (this.activeTab !== 2) {
                                    this.changeDraftModCfg.show=true
                                } else {
                                    this.changeModCfg.show=true
                                }
                            }else{
                                this.$warning({'type': 'warning','message': res.data.errMsg})
                            }
                        }
                    )
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
                if(item){
                    this.tableParams.pageIndex=item.pageIndex;
                    this.tableParams.pageSize=item.pageSize;
                    this.tableParams['firstDeptName'] = item['firstDeptName']
                    this.tableParams['secondDeptName'] = item['secondDeptName']
                }
                this.$http.post(__URL.osiu + 'import/employee/list', this.tableParams).then(
                    (res) => {
                        this.lastTableParam=this.tableParams;
                        if(res.data.success){
                            if(!item){
                                this.tableTotal=res.data.data.totalCount;
                            }
                            this.tableData = res.data.data.dataList;
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
                this.getTabNumber()
                if(text){
                    this.dCfg.msg=text;
                    this.dCfg.show=true;
                }
                this.$broadcast('_RESETLIST')
                this.tableData=[]
                this.tableTotal=0;
                this.getList()
                this.choiceTab(0)
            },
            //关闭新增页面
            closeNewEmployee(text){
                this.addConfig.show=false;
                this.refresh(text)
            },
            //正式导入
            importData(){
                if (this.count === 0) {
                    this.importModCfg.show = false
                    this.importCancelCfg.show = true
                    return
                }
                /* 未选择部门和人员时，新需求要导入全部 */
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
                this.importModCfg.show=true;
            },
            importAll(){
                if(this.firstTabNumber===0){
                    this.$warning({'type': 'warning','message': '没有可以导入的数据！'})
                    return
                }
                let param={
                    "ids":[],
                    "departmentCode": this.importDepartmentCode,
                    "departmentName": this.importDepartment,
                    "firstDeptName": this.importFirstDeptName,
                    "secondDeptName": this.importSecondDeptName,
                }
                this.$http.post(__URL.osiu + 'import/employee/formal',param).then(
                    (res) => {
                        if(res.data.success){
                            this.importModCfg.show=false;
                            this.$warning({'type': 'success','message': res.data.data})
                            this.enter=true
                            this.refresh()
                            this.choiceTab(0)
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            importSure(){
                if(this.importDepartment === ''){
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
                var idArr=[]
                for(var i=0;i<this.checkboxObj.length;i++){
                    idArr.push(this.checkboxObj[i].id)
                }
                let param={
                    "departmentCode": this.importDepartmentCode,
                    "departmentName": this.importDepartment,
                    "entCode": "",
                    "ids":idArr,
                    "userCode": "",
                    "firstDeptName": this.importFirstDeptName,
                    "secondDeptName": this.importSecondDeptName,
                }
                this.$http.post(__URL.osiu + 'import/employee/formal',param).then(
                    (res) => {
                        if(res.data.success){
                            this.importModCfg.show=false;
                            this.importAlertCfg.msg=res.data.data;
                            this.importAlertCfg.show=true;
                            this.enter=true
                            this.refresh()
                            this.choiceTab(0)
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
                this.departmentCfg.show=true
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
                if(this.checkboxObj.length==0){
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
                this.$http.post(__URL.osiu + 'import/employee/batchDel', param).then(
                    (res) => {
                        if(res.data.success){
                            this.refresh('删除成功!')
                            this.choiceTab(0)
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }

                    }
                )
            },
            add(){
                this.addConfig.show=true
            },
            addNew(){
                this.importCfg.show=true
            },
            //单个删除
            singleDelete(){
                this.singleDeleteCfg.msg='确认删除该条记录吗？'
                this.singleDeleteCfg.show=true;
            },
            singleDeleteSure(){
                this.$http.get(__URL.osiu + 'import/employee/delete/'+this.deleteData.id).then(
                    (res) => {
                        if(res.data.success){
                            this.refresh('删除成功')
                            this.choiceTab(0)
                        }else{
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            inputcb(){
                this.importCfg.show=false;
                this.$warning({'type': 'success','message': '上传成功'})
                this.refresh()
                this.choiceTab(0)
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
            //展开头部的下拉
            openselect(){
                this.openSelect=true;
            },
        },
        computed: {
            // 列表组件配置
            tabCfg () {
                return {
                    select: 'tab' + (this.activeTab + 1),
                    tabBarData: [{
                        id: 'tab1',
                        name: '草稿箱(' + this.listTabBar.tab0 + ')',
                    },{
                        id:'tab2',
                        name: '有异常(' + this.listTabBar.tab1 + ')',
                    },{
                        id:'tab3',
                        name: '已核准(' + this.listTabBar.tab2 + ')',
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
            }
        },
    }
</script>
<template>
    <container>
        <alert :config='deleteAllCfg' @cb='deleteAll'></alert>
        <alert :config='importAllCfg' @cb='importAll'></alert>
        <alert :config='importAlertCfg'></alert>
        <alert :config="dCfg"></alert>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a href="javascript:;"  @click='add' class='leftArr'>
                        <i class="icon-hp_list__add"></i>新增
                        <span class="arrow-close" @click.stop='openselect'></span>
                    </a>
                    <div class='select-option' v-if='openSelect'>
                        <a href="javascript:;" @click='add' >
                            <i class='icon-hp_list__add'></i>新增
                            <span class="arrow"></span>
                        </a>
                        <a href="javascript:;" @click='addNew' >
                            <i class="icon-hp_list__add"></i>上传文档
                        </a>
                    </div>
                    <!-- <a @click='add'><i class="icon-hp_list__add"></i>新增</a>
                    <a @click='addNew'><i class="icon-hp_list__add"></i>上传文档</a> -->
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

            <div :class="{'have_footer': tableTotal > pageCfg.pageSize}" class="right_item">
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
                <div v-if="tableTotal > pageCfg.pageSize" class="item_footer">
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                </div>
            </div>
        </div>
    </container>

    <inner :config='addConfig'>
        <new-employee @refresh='closeNewEmployee'></new-employee>
    </inner>

    <inner :config='changeDraftModCfg'>
        <change-employee-draft :config='changeDraftModCfg' :detail.sync='changeData' :active-tab="activeTab" @refresh='refresh'></change-employee-draft>
    </inner>

    <inner :config='changeModCfg'>
        <change-employee :config='changeModCfg' :detail.sync='changeData' :active-tab="activeTab" @refresh='refresh'></change-employee>
    </inner>


    <modal :config='importModCfg' @sure='importSure' @close='importClose'>
        <!--<div class='form-group'>-->
            <!--<label><span class="must-point">*</span>确认部门:</label>-->
            <!--<div class="s-input ic2">-->
                <!--<input placeholder='请选择部门'  readonly type="text" v-model='importDepartment'>-->
                <!--<i @click='clearDepartment' v-show='importDepartment' class="icon-modal__close r2" ></i>-->
                <!--<i @click='getDepartment' class="icon-search r1"></i>-->
            <!--</div>-->
        <!--</div>-->
        <div class="modal-text">是否确定批量导入已选中的数据？</div>
    </modal>

    <alert :config='singleDeleteCfg' @cb='singleDeleteSure'></alert>

    <alert :config='batchDeleteCfg' @cb='batchDeleteSure'></alert>

    <alert :config='importCancelCfg'></alert>

    <vimport :config="importCfg" @cb="inputcb"></vimport>

    <private-refer :config='departmentCfg' @cb='chioceDepartment'></private-refer>
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
    .arrow-close{
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #212121;
        border-bottom: 6px solid transparent;
        margin-left: 10px;
        -webkit-transform: translateY(30%);
        transform: translateY(30%);
    }
    .leftArr:hover .arrow-close{
        border-top: 6px solid #03a9f4;
    }
    .select-option{
        position: absolute;
        top:0;
        left: 0;
        background-color: #fff;
        box-shadow: 0 3px 3px 0 rgba(140,150,171,.41);
        line-height: 46px;
        z-index: 3;
        width: 150px;
        a{
            display: inline-block;
            padding: 0 12px;
            height: 46px;
            width: 126px;  
        }
        a:hover{
            color:#212121;
            background: #EBF7FD;
        }
        .arrow{
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid transparent;
            border-bottom: 6px solid #212121;
            margin-left: 10px;
            -webkit-transform: translateY(-30%);
            transform: translateY(-30%);
        }
    }
    .modal-text {
        padding: 30px;
        font-size: 16px;
        text-align: center;
    }
</style>
