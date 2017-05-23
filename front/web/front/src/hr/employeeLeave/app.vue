<script>



import cfg from './cfg.js'
import newEmployeeLeave from './newEmployeeLeave'
import editEmployeeLeave from './editEmployeeLeave'
import lookEmployeeLeave from './lookEmployeeLeave'
import lookEmployee from '../employee/checkEmployee'

export default {
    components: {
        newEmployeeLeave,
        editEmployeeLeave,
        lookEmployeeLeave,
        lookEmployee
    },
    ready() {
        this.getTabNumber();
        this.choiceTab(0);
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            filterCfg:cfg.leftItemCfg.filterCfg,
            oldFilterConfig:{},
            tableData: [],
            openCode:'',
            leftTabList:[],
            employeeDetail:{},
            ckdCode:'',
            activeTab:0,
            addEmployeeLeaveConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工离职登记'
            },
            editEmployeeLeaveConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工离职登记'
            },
            lookEmployeeLeaveConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '查看员工离职登记'
            },
            lookEmployeeConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案'
            },
            filterModCfg:{
                show: false,
                width: '370px',
                height: 'auto',
                header: '筛选',
                btn: [{
                    name: '取消',
                    emit: 'close'
                }, {
                    name: '确定',
                    emit: 'sure'
                }]
            },
            tableCount:{
                count0:0,
                count1:0,
                count2:0
            },
            tipsCfg:{
                show:false,
                content:''
            },
            departmentName:'',
            roleName:'',
            jobNumber:'',
            totalCount:0,
            pageIndex:1,
            tabCount:{
                pending:0,
                unaudited:0,
                audit:0
            }
        }
    },
    methods: {
        //点击一级
        openFirst(item, index) {
            //选中事件
            this.ckdCode = item.departmentCode;
            //展开事件
            if (this.openCode === item.departmentCode) {
                this.openCode = ''
            } else {
                this.openCode = item.departmentCode
            }
            this.getRightTableList(item);
        },
        getTabNumber(){
            this.$http.post(__URL.hr+ 'employee/dimission/procedure/findDimiisonTabCount').then(
                (res)=>{
                if(res.data.success){
                    for(var i=0;i<res.data.data.dataList.length;i++){
                        if(res.data.data.dataList[i].tableIndex===2){
                            this.tableCount.count2=res.data.data.dataList[i].count
                        }else if(res.data.data.dataList[i].tableIndex===1){
                            this.tableCount.count1=res.data.data.dataList[i].count
                        }else if(res.data.data.dataList[i].tableIndex===0){
                            this.tableCount.count0=res.data.data.dataList[i].count
                        }
                    }
                }else{
                    this.setWarningSuccess('failure',res.data.errMsg)
                }
            }
        )
        },
        serchEmployRefer(code,item,type){
            this.$http.get(__URL.hr + 'employee/find/code/'+ code).then(
                res => {
                    if (res.data.success) {
                        this.departmentName = res.data.data.departmentName;
                        this.roleName = res.data.data.roleName;
                        this.jobNumber = res.data.data.jobNumber;
                        this.getDetail(item,type);
                    } else {
                        this.msgconfig.show = true
                        this.msgconfig.content = res.data.errMsg
                        this.repeatSubmit = false;
                    }
                }
            )
        },
        /* 公用方法 */
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        /* 重置对象 */
        initTabListObj(obj) {
            var filterObj = this.getFilterObject();
            let init = {
                "departmentCode": obj.departmentCode,
                "employeeName": filterObj.employeeName,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": filterObj.phone,
                "startDate": filterObj.startDate,
                "endDate": filterObj.endDate,
                "type": this.activeTab
            }
            return init
        },
        href(item, type) {
            this.serchEmployRefer(item.employeeCode,item,type);
        },
        lookInfo(type,item){
            this.serchEmployRefer(item.employeeCode,item,type);
        },
        getDetail(item,type){
            if('查看详情' == type && 0==this.activeTab){
                this.addEmployeeLeaveDialog(item);
            } else if ('name' == type){
                this.$http.get(__URL.hr + 'employee/find/code/'+item.employeeCode).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail = res.data.data;
                            this.lookEmployeeConfig.show = true;
                        }else{
                            this.tipsCfg.show = true;
                            this.tipsCfg.content = res.data.errMsg;
                        }
                    }
                )
            } else if('查看详情' == type && 1==this.activeTab){
                this.editEmployeeLeaveDialog(item);
            } else if ('查看详情' == type && 2==this.activeTab){
                this.lookEmployeeLeaveDialog(item);
            }
        },
        getFilter(item) {
            this.getList('refresh');
        },
        filterMod(){
            this.filterModCfg.show = true;
            this.oldFilterConfig=this.filterCfg;
        },
        filterSure(){
            this.filterModCfg.show = false;
            this.choiceTab(0);
            this.tableData=[];
        },
        //关闭筛选框重置条件
        filterClose() {
            this.filterModCfg.show = false
            this.filterCfg = this.oldFilterConfig;
        },
        //设置过滤条件值
        getFilterObject(){
            var filterObj = {};
            for(var i = 0;i < this.filterCfg.length; i++){
                filterObj[this.filterCfg[i].key] = this.filterCfg[i].value;
            }
            return filterObj;
        },
        //切换tab
        choiceTab(index){
            this.activeTab = index;
            this.tableData = [];
            this.getFirst('refresh');
        },
        //获取数据
        getFirst(type){
            var filterObj=this.getFilterObject();
            if(type=='add'){
                this.pageIndex++;
            }
            var param={
                "departmentCode": '',
                "employeeName": filterObj.employeeName,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": filterObj.phone,
                "startDate": filterObj.startDate,
                "endDate": filterObj.endDate,
                "type": this.activeTab
            }
            this.$http.post(__URL.hr + 'employee/dimission/register/find/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.leftTabList.splice(0, this.leftTabList.length);
                        }
                        for(var i=0;i< res.data.data.dataList.length;i++){
                            this.leftTabList.push(res.data.data.dataList[i])
                        }
                        this.totalCount = res.data.data.totalCount;
                        if(this.leftTabList.length>0){
                            this.openFirst(this.leftTabList[0])
                        }
                    }else{
                        this.tipsCfg.show = true;
                        this.tipsCfg.type='failure';
                        this.tipsCfg.content = res.data.errMsg;
                    }
                }
            )
        },
        //加载更多
        loadMore(){
            this.getFirst('add');
        },
        //点击一级部门
//        openFirst(item, index) {
//            this.getRightTableList(item);
//        },
        //点击二级部门
        choiceSec(first,sec) {
            this.ckdCode = first.departmentCode.toString() + sec.departmentCode.toString();
            this.getRightTableList(sec);
        },
        //获取右侧列表数据
        getRightTableList(item){
            var filterObj=this.getFilterObject();
            var param = {
                "departmentCode": item.departmentCode,
                "employeeName": filterObj.employeeName,
                "jobNumber": filterObj.jobNumber,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": filterObj.phone,
                "startDate": filterObj.startDate,
                "endDate": filterObj.endDate,
                "type": this.activeTab
            }
            this.$http.post(__URL.hr+'employee/dimission/register/find/detail/list', param).then(
                (res) => {
                    this.tableData = res.data.data.dataList;
                }
            );
        },
        //新增离职登记弹框事件
        addEmployeeLeaveDialog(item){
            this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                (res) => {
                    let obj = cfg.employeeLeaveCfg;
                    cfg.employeeLeaveCfg = Object.assign(obj, res.data.data);
                    cfg.employeeLeaveCfg.departmentName =this.departmentName;
                    cfg.employeeLeaveCfg.roleName =this.roleName;
                    cfg.employeeLeaveCfg.jobNumber =this.jobNumber;
                    this.addEmployeeLeaveConfig.show = true;
                }
            );
        },
        //编辑离职登记弹框事件
        editEmployeeLeaveDialog(item){
            this.employeeLeave = {};
            this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                (res) => {
                    let obj = cfg.employeeLeaveCfg
                    cfg.employeeLeaveCfg = Object.assign(obj, res.data.data);
                    cfg.employeeLeaveCfg.departmentName =this.departmentName;
                    cfg.employeeLeaveCfg.roleName =this.roleName;
                    cfg.employeeLeaveCfg.jobNumber =this.jobNumber;
                    this.editEmployeeLeaveConfig.show = true;
                }
            );
        },
        lookEmployeeLeaveDialog(item){
            this.employeeLeave = {};
            this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                (res) => {
                    cfg.employeeLeaveCfg = res.data.data;
                    cfg.employeeLeaveCfg.departmentName =this.departmentName;
                    cfg.employeeLeaveCfg.roleName =this.roleName;
                    cfg.employeeLeaveCfg.jobNumber =this.jobNumber;
                    this.lookEmployeeLeaveConfig.show = true;
                }
            );
        },
        //关闭添加离职登记内页
        closeAddEmployeeLeave(val){
            this.addEmployeeLeaveConfig.show = false;
            if(val != ''){
                this.tipsCfg.type='success';
                this.tipsCfg.content=val;
                this.tipsCfg.show=true;
            }
            this.reset();
            this.getTabNumber();
        },
        //关闭编辑离职登记内页
        closeEditEmployeeLeave(val){
            this.editEmployeeLeaveConfig.show = false;
            if(val != ''){
                this.tipsCfg.type='success';
                this.tipsCfg.content=val;
                this.tipsCfg.show=true;
            }
            this.reset();
            this.getTabNumber();
        },
        //关闭查看离职登记内页
        closeLookEmployeeLeave(val){
            this.lookEmployeeLeaveConfig.show = false;
        },
        //关闭查看人员信息弹窗
        closeLookEmployee(){
            this.lookEmployeeConfig.show=false;
        },
        //重置并刷新数据
        reset() {
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        pendingTableCfg(){
            return cfg.pendingTableCfg
        },
        unauditedTableCfg(){
            return cfg.unauditedTableCfg
        },
        auditTableCfg(){
            return cfg.auditTableCfg
        },
        tableParams() {

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
                    <a></a>
                    <a href="javascript:;" @click='filterMod'>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab'>
                            <a href="javascript:;" @click='choiceTab(0)' :class="{ckd:0==activeTab}">
                                待处理({{tableCount.count0}})
                            </a>
                            <a href="javascript:;" @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                已驳回({{tableCount.count1}})
                            </a>
                            <a href="javascript:;" @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                已通过({{tableCount.count2}})
                            </a>
                        </div>
                        <div class='list_content'>
                            <ul class='listbox'>
                                <li class='first_li' v-for='(index,firstLv) in leftTabList'>
                                    <a :class='{ckd:firstLv.departmentCode==ckdCode}' @click='openFirst(firstLv,index)'
                                       href="javascript:;">
                                        <i v-show='firstLv.children.length > 0 && firstLv.departmentCode!=openCode'
                                           class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length > 0 && firstLv.departmentCode==openCode'
                                           class='icon-hp_list__dropdown'
                                           :class='{childchoice:firstLv.departmentCode != ckdCode && firstLv.departmentCode==openCode}'></i>
                                        <p :class='{childchoice:firstLv.departmentCode != ckdCode && firstLv.departmentCode==openCode}'
                                           class='main'>{{firstLv.departmentName}}</p>
                                        <span class='tip_number'>{{firstLv.employeeCount}}</span>
                                    </a>
                                    <ul v-if='firstLv.children.length > 0' v-show='firstLv.departmentCode==openCode'
                                        class='sec_ul'>
                                        <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li'
                                            :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.departmentCode.toString() + secLv.departmentCode.toString() == ckdCode}'
                                            v-for='(index,secLv) in firstLv.children'>
                                            <p class='main'>{{secLv.departmentName}}</p>
                                            <span class='tip_number'>{{secLv.employeeCount}}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class='list_loadmore' v-show='hasMore' @click='loadMore'>
                            加载更多...
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <template v-if="activeTab == 0">
                        <vtable :config='pendingTableCfg' :data='tableData' @op='lookInfo' @link='href'></vtable>
                    </template>
                    <template v-if="activeTab == 1">
                        <vtable :config='unauditedTableCfg' :data='tableData' @op='lookInfo' @link='href'></vtable>
                    </template>
                    <template v-if="activeTab == 2">
                        <vtable :config='auditTableCfg' :data='tableData' @op='lookInfo' @link='href'></vtable>
                    </template>
                </div>
            </div>
        </div>
    </container>

    <!-- 筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg'></filter>
    </modal>

    <!-- 添加离职登记内页-->
    <inner :config='addEmployeeLeaveConfig'>
        <new-employee-leave @refresh='closeAddEmployeeLeave'></new-employee-leave>
    </inner>

    <!-- 编辑离职登记内页-->
    <inner :config='editEmployeeLeaveConfig'>
        <edit-employee-leave @refresh='closeEditEmployeeLeave'></edit-employee-leave>
    </inner>

    <!-- 查看离职登记内页-->
    <inner :config='lookEmployeeLeaveConfig'>
        <look-employee-leave @refresh='closeLookEmployeeLeave'></look-employee-leave>
    </inner>

    <!-- 查看人员内页-->
    <inner :config='lookEmployeeConfig'>
        <look-employee :employee-detail='employeeDetail' @refresh='closeLookEmployee'></look-employee>
    </inner>

    <!-- 操作成功提示 -->
    <warning :config="tipsCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .item_head:hover {
        cursor: pointer;
    }

</style>
