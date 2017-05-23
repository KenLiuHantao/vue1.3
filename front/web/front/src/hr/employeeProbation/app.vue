<script>



import cfg from './cfg.js'
import lookEmployee from '../employee/checkEmployee'

export default {
    components: {
        lookEmployee
    },
    ready() {
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
            tabCount:{},
            activeTab:0,
            repeatSubmit: false,
            terminationModalCfg: {
                show: false,
                width: '400px',
                height: 'auto',
                header: '试用终止',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确认终止',
                    emit: 'sure',
                }]
            },
            officialstaffModalCfg: {
                show: false,
                width: '400px',
                height: 'auto',
                header: '转正',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确认转正',
                    emit: 'sure',
                }]
            },
            employeeProbation:{},
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
            tipsCfg:{
                show:false,
                content:''
            },
            totalCount:0,
            pageIndex:1,
            tabCount:{
                pending:0,
                unaudited:0,
                audit:0
            },
            dateConfig:{
                placeholder:'请选择转正日期',
                format:'YYYY-MM-DD',
                minDate:null
            },
            ckdCode:'',
            openCode:'',
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
        // table返回的操作参数
        operate(type, item) {
            if(type == 0){
                this.$http.get(__URL.hr + 'employee/officialstaff/officialstaff/detail/'+item.recordId).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeProbation = res.data.data;
                            this.officialstaffModalCfg.show = true;
                        }else{
                            this.tipsCfg.show = true;
                            this.tipsCfg.content = res.data.errMsg;
                        }
                    }
                )
            } else if (type == 1){
                this.$http.get(__URL.hr + 'employee/officialstaff/termination/detail/'+item.recordId).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeProbation = res.data.data;
                            this.terminationModalCfg.show = true;
                        }else{
                            this.tipsCfg.show = true;
                            this.tipsCfg.content = res.data.errMsg;
                        }
                    }
                )
            }
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
        doSaveOfficialstaff(){
            if(this.repeatSubmit)return;
            this.repeatSubmit = true;
            var url = __URL.hr+'employee/officialstaff/officialstaff';
            this.$http.post(url, this.employeeProbation).then(
                (res) => {
                    this.msgTips(res, 0);
                }
            );
        },
        doSaveTermination(){
            if(this.repeatSubmit)return;
            this.repeatSubmit = true;
            var url = __URL.hr+'employee/officialstaff/termination';
            this.$http.post(url, this.employeeProbation).then(
                (res) => {
                    this.msgTips(res, 1);
                }
            );
        },
        msgTips(res, type){
            if(res.data.success){
                this.tipsCfg.type = 'success';
                this.refresh(res.data.data, type);
            }else{
                this.tipsCfg.type = 'failure';
                this.refresh(res.data.errMsg, type);
            }
        },
        //重置并刷新数据
        reset() {
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        //刷新外页
        refresh(text, type){
            if(text){
                this.repeatSubmit = false;
                this.tipsCfg.content = text;
                this.tipsCfg.show = true;
                if(0 == type){
                    this.closeOfficialstaffDialog();
                } else if (1 == type){
                    this.closeTerminationDialog();
                }
                this.reset();
            }
        },
        limitDate(item){
            this.dateConfig.minDate = this.employeeProbation.enterDate;
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
            this.$http.post(__URL.hr + 'employee/officialstaff/find/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.leftTabList.splice(0, this.leftTabList.length);
                        }
                        for(var i=0;i< res.data.data.dataList.length;i++){
                            this.leftTabList.push(res.data.data.dataList[i])
                        }
                        this.totalCount = res.data.data.totalCount;
                        this.tabCount = res.data.data.header;
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
        //点击一级
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
            this.$http.post(__URL.hr+'employee/officialstaff/find/detail/list',param).then(
                (res) => {
                    this.tableData = res.data.data.dataList;
                }
            );
        },
        //关闭转正弹窗
        closeOfficialstaffDialog(){
            this.officialstaffModalCfg.show=false;
        },
        //关闭试用终止弹窗
        closeTerminationDialog(){
            this.terminationModalCfg.show=false;
        },
        //关闭查看人员信息弹窗
        closeLookEmployee(){
            this.lookEmployeeConfig.show=false;
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        probationTableCfg(){
            return cfg.probationTableCfg
        },
        alreadyTableCfg(){
            return cfg.alreadyTableCfg
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
                                试用期({{tabCount.oneEmployeeCount}})
                            </a>
                            <a href="javascript:;" @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                待转正({{tabCount.twoEmployeeCount}})
                            </a>
                            <a href="javascript:;" @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                已转正({{tabCount.threeEmployeeCount}})
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
                    <div v-show="activeTab == 0 || activeTab == 1">
                        <vtable :config='probationTableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                    </div>
                    <div v-show="activeTab == 2">
                        <vtable :config='alreadyTableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                    </div>
                </div>
            </div>
        </div>
    </container>

    <!-- 筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg'></filter>
    </modal>

    <!-- 查看人员内页-->
    <inner :config='lookEmployeeConfig'>
        <look-employee :employee-detail='employeeDetail' @refresh='closeLookEmployee'></look-employee>
    </inner>

    <!-- 操作成功提示 -->
    <warning :config="tipsCfg"></warning>

    <!-- 试用终止弹框系列 -->
    <modal :config.sync='terminationModalCfg' @sure='doSaveTermination' @close='closeTerminationDialog'>
        <div class="pd-10">
            <div class='form-group'>
                <label>入职日期:</label>
                <div class="s-input ic2">
                <input type='text' v-model='employeeProbation.enterDate' disabled>
                </div>
            </div>
            <div class='form-group'>
                <label>终止说明:</label>
                <div class="s-input ic2">
                <input type='text' maxlength="100" v-model='employeeProbation.remark' placeholder='请输入终止说明'>
                </div>
            </div>
        </div>
    </modal>

    <!-- 转正弹框系列 -->
    <modal :config.sync='officialstaffModalCfg' @sure='doSaveOfficialstaff' @close='closeOfficialstaffDialog'>
        <div class="pd-10">
            <div class='form-group'>
                <label>入职日期:</label>
                <div class="s-input ic2">
                <input type='text' v-model='employeeProbation.enterDate' disabled>
                </div>
            </div>
            <div class='form-group'>
                <label>转正日期:</label>
                <div class="s-input ic2">
                <date-picker :date.sync='employeeProbation.confirmationDate' :config="dateConfig" @cb="limitDate"></date-picker>
                </div>
            </div>
            <div class='form-group'>
                <label>转正评价:</label>
                <div class="s-input ic2">
                <input type='text' maxlength="100" v-model='employeeProbation.remark' placeholder='请输入转正评价'>
                </div>
            </div>
        </div>
    </modal>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .pd-10 {
        padding: 10px;
    }

    .item_head:hover {
        cursor: pointer;
    }
</style>
