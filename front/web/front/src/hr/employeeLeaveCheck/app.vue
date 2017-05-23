<script>



import cfg from './cfg.js'
import checkEmployeeLeave from './checkEmployeeLeave'
import lookEmployeeLeave from './lookEmployeeLeave'
import lookEmployee from '../employee/checkEmployee'
export default {
    components: {
        checkEmployeeLeave,
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
            leftTabList:[],
            employeeDetail:{},
            activeTab:0,
            checkEmployeeLeaveConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工离职手续复核'
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
                    name: '关闭',
                    emit: 'close'
                }, {
                    name: '确定',
                    emit: 'sure'
                }]
            },
            tipsCfg:{
                show:false,
                content:''
            },
            totalCount:0,
            pageIndex:1,
            tabCount:{
                pending:0,
                reject:0,
                pass:0
            },
            ckdCode: '',
            openCode:'',
            review:"待复核(0)",
            reject:"已驳回(0)",
            pass:"已通过(0)"
        }
    },
    methods: {
        /* 公用方法 */
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        //获取tab数量
        getTabNumber(){
            this.$http.post(__URL.hr+ 'employee/dimission/procedure/findTabCount',{}).then(
                (res)=>{
                    if(res.data.success){
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            if(res.data.data.dataList[i].tableIndex===0){
                                this.review = '待复核('+res.data.data.dataList[i].count+')'
                            }else if(res.data.data.dataList[i].tableIndex===1){
                                this.reject='已驳回('+res.data.data.dataList[i].count+')'
                            }else if(res.data.data.dataList[i].tableIndex===2){
                                this.pass='已通过('+res.data.data.dataList[i].count+')'
                            }
                        }
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
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
            if ('name' == type){
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
            }
        },
        operate(type,item){
          if(type == 'look'){
              this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                  (res) => {
                      let obj = cfg.employeeLeaveCfg;
                      cfg.employeeLeaveCfg = Object.assign(obj, res.data.data);
                      this.lookEmployeeLeaveConfig.show = true;
                  }
              );
          }else if (type == 'audit'){
              this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                  (res) => {
                      let obj = cfg.employeeLeaveCfg;
                      cfg.employeeLeaveCfg = Object.assign(obj, res.data.data);
                      this.checkEmployeeLeaveConfig.show = true;
                  }
              );
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
            this.ckdCode = ''
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
            this.$http.post(__URL.hr + 'employee/dimission/procedure/find/department/list', param).then(
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
        //设置提示信息
        setWarningSuccess(type,data){
            this.msgconfig.show = true
            this.msgconfig.content = data
            this.msgconfig.type = type
        },
        //加载更多
        loadMore(){
            this.getFirst('add');
        },
        //点击一级部门
        openFirst(item, index) {
            //选中事件
            this.ckdCode = item.departmentCode;
            //展开事件
            if (this.openCode == item.departmentCode) {
                this.openCode = ''
            } else {
                this.openCode = item.departmentCode
            }
            this.getRightTableList(item);
        },
        //点击二级部门
        choiceSec(first,sec) {
            this.ckdCode = first.departmentCode.toString() + sec.departmentCode.toString()
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
            this.$http.post(__URL.hr+'employee/dimission/procedure/find/detail/list', param).then(
                (res) => {
                    this.tableData = res.data.data.dataList;
                }
            );
        },
        checkEmployeeLeaveDialog(item){
            this.employeeLeave = {};
            this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                (res) => {
                    cfg.employeeLeaveCfg = res.data.data;
                    this.checkEmployeeLeaveConfig.show = true;
                }
            );
        },
        lookEmployeeLeaveDialog(item){
            this.employeeLeave = {};
            this.$http.get(__URL.hr+'employee/dimission/register/find/detail/'+item.recordId).then(
                (res) => {
                    cfg.employeeLeaveCfg = res.data.data;
                    this.lookEmployeeLeaveConfig.show = true;
                }
            );
        },
        //关闭离职登记申请内页
        closeCheckEmployeeLeave(val){
            this.checkEmployeeLeaveConfig.show = false;
            if(val != ''){
                this.tipsCfg.type='success';
                this.tipsCfg.content=val;
                this.tipsCfg.show=true;
            }
            this.getTabNumber();
            this.reset();
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
        rejectTableCfg(){
            return cfg.rejectTableCfg
        },
        processedTableCfg(){
            return cfg.processedTableCfg
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
                                {{review}}
                            </a>
                            <a href="javascript:;" @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                {{reject}}
                            </a>
                            <a href="javascript:;" @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                {{pass}}
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
                    <div v-show="activeTab == 0">
                        <vtable :config='pendingTableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                    </div>
                    <div v-show="activeTab == 1">
                        <vtable :config='rejectTableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                    </div>
                    <div v-show="activeTab == 2">
                        <vtable :config='processedTableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                    </div>
                </div>
            </div>
        </div>
    </container>

    <!-- 筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg'></filter>
    </modal>

    <!-- 进入离职登记申请内页-->
    <inner :config='checkEmployeeLeaveConfig'>
        <check-employee-leave @refresh='closeCheckEmployeeLeave'></check-employee-leave>
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
