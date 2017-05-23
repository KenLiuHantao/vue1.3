<script>



import cfg from './cfg.js'
import checkEmployee from '../employee/checkEmployee'
import detail from './applicationDetail'
export default {
    components: {
        checkEmployee,
        detail,
    },
    ready() {
        this.getTabNumber();
        this.choiceTab(1,0)
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            filterCfg:cfg.leftItemCfg.filterCfg,
            oldFilterConfig:'',
            tableData: [],
            detailList:'',
            checkConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案',
            },
            dimissionConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工辞退申请',
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
            employeeDetail:{
            },
            listDetail:[
            ],
            totalCount:0,
            pageIndex:1,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            ckdCode:'',
            openCode:'',
            departmentCode:'',
            applicationStatus:1,
            rejectStatus:0,
            consoleStatus:1,
            depCfg:{
                show:false,
                data:{}
            },
            pending:"待审核(0)",
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
            this.$http.post(__URL.hr+ 'employee/dimission/application/findTabCount/'+ 0,{}).then(
                (res)=>{
                if(res.data.success){
                    for(var i=0;i<res.data.data.dataList.length;i++){
                        if(res.data.data.dataList[i].tableIndex===0){
                            this.pending = '待审核('+res.data.data.dataList[i].count+')'
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
        initListObj(obj) {
            var filterObj=this.getFilterObject()
            let init = {
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "jobNumber": filterObj.jobNumber,
                "employeeName": filterObj.employeeName,
                "enterDateStart": filterObj.enterDateStart,
                "enterDateEnd": filterObj.enterDateEnd,
                "applicationDateStart": filterObj.applicationDateStart,
                "applicationDateEnd": filterObj.applicationDateEnd,
                "departmentCode": obj.departmentCode,
                "applicationStatus": this.applicationStatus,
                "rejectStatus": this.rejectStatus
            }
            return init
        },
        href(item, type) {
            if(type=='employeeName'){
                this.$http.get(__URL.hr + 'employee/find/code/'+item.employeeCode).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.checkConfig.show=true
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        getFilter(item) {
            this.listObj = this.initListObj(item)
            this.getList(listObj)
        },
        /* 数据请求 */
        getList(obj) {
            this.$http.post(__URL.manu + 'iqc/list', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        //关闭查看页面
        closeCheckEmployee(){
            this.choiceTab(1,0);
            this.getTabNumber();
            this.tableData=[]
            this.checkConfig.show=false
        },
        //关闭离职内页
        closeDimissionEmployee(){
            this.choiceTab(1,0);
            this.getTabNumber();
            this.tableData=[]
            this.dimissionConfig.show=false
        },
        //下面全是这个页面单独和list有关的内容
        filterMod(){
            this.filterModCfg.show = true;
            this.oldFilterConfig=this.filterCfg;
        },
        filterSure(){
            this.filterModCfg.show = false
            //刷新list 清空table
            this.choiceTab(1,0)
            this.tableData=[]
        },
        filterClose() {
            this.filterModCfg.show = false
            this.filterCfg = this.oldFilterConfig;
        },
        getFilterObject(){
            var filterObj={}
            for(var i=0;i<this.filterCfg.length;i++){
                filterObj[this.filterCfg[i].key]=this.filterCfg[i].value
            }
            return filterObj
        },
        choiceTab(index1,index2){
            this.applicationStatus=index1;
            this.rejectStatus=index2;
            this.openCode = ''
            this.ckdCode = ''
            this.tableData=[]
            this.getFirst('refresh')
        },
        getFirst(type){
            var filterObj=this.getFilterObject()
            if(type=='add'){
                this.pageIndex++;
            }
            var param={
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "jobNumber": filterObj.jobNumber,
                "employeeName": filterObj.employeeName,
                "enterDateStart": filterObj.enterDateStart,
                "enterDateEnd": filterObj.enterDateEnd,
                "applicationDateStart": filterObj.applicationDateStart,
                "applicationDateEnd": filterObj.applicationDateEnd,
                "departmentCode": "",
                "applicationStatus": this.applicationStatus,
                "rejectStatus": this.rejectStatus,
                "role":0
            }
            this.$http.post(__URL.hr + 'employee/dimission/application/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.listDetail.splice(0, this.listDetail.length);
                        }
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            this.listDetail.push(res.data.data.dataList[i])
                        }
                        this.totalCount=res.data.data.totalCount;
                        if(this.listDetail.length>0){
                           this.openFirst(this.listDetail[0])
                        }
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        loadMore(){
            this.getFirst('add')
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
            this.getTable(item)
        },
        choiceSec(first,sec) {
            this.ckdCode = first.departmentCode.toString() + sec.departmentCode.toString();
            this.getTable(sec)
        },
        getTable(item){
            var param=this.initListObj(item)
            this.$http.post(__URL.hr + 'employee/dimission/application/list', param).then(
                (res) => {
                    if(res.data.success){
                        var dataList=res.data.data.dataList;
                        this.tableData=dataList
                        this.consoleStatus = param.applicationStatus
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        getDetail(type,param){
            this.$http.get(__URL.hr + 'employee/dimission/application/detail/' + param.recordId).then(
                (res) => {
                    if(res.data.success){
                        this.detailList=res.data.data
                        this.dimissionConfig.show=true
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.msgconfig.show = true
            this.msgconfig.content = data
            this.msgconfig.type = type
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            return cfg.tableCfg
        },
        lookTableCfg() {
            return cfg.lookTableCfg
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
                    <a></a>
                    <a href="javascript:;"  @click='filterMod'>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab' >
                            <a href="javascript:;"  @click='choiceTab(1,0)' :class="{ckd:1==applicationStatus}">
                                {{pending}}
                            </a>
                            <!--<a href="javascript:;"  @click='choiceTab(2,0)' :class="{ckd:2==applicationStatus}">
                                未复核
                            </a>-->
                            <a href="javascript:;"  @click='choiceTab(0,1)' :class="{ckd:1==rejectStatus}">
                                {{reject}}
                            </a>
                            <a href="javascript:;"  @click='choiceTab(3,0)' :class="{ckd:3==applicationStatus}">
                                {{pass}}
                            </a>
                        </div>
                        <div class='list_content'>
                            <ul class='listbox'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv.departmentCode==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <i v-show='firstLv.children.length>0 && firstLv.departmentCode!=openCode' class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length>0&& firstLv.departmentCode==openCode' class='icon-hp_list__dropdown' :class='{childchoice:firstLv.departmentCode!=ckdCode&&firstLv.departmentCode==openCode}'></i>
                                        <p :class='{childchoice:firstLv.departmentCode!=ckdCode&&firstLv.departmentCode==openCode}' class='main'>{{firstLv.departmentName}}</p>
                                        <span class='tip_number'>{{firstLv.employeeCount}}</span>
                                    </a>
                                    <ul v-if='firstLv.children.length>0' v-show='firstLv.departmentCode==openCode' class='sec_ul'>
                                        <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li' :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.departmentCode.toString()+secLv.departmentCode.toString()==ckdCode}' v-for='(index,secLv) in firstLv.children'>
                                            <!-- <div v-if='firstLv.hasNumber' class='number-title'>{{index+1}}</div> -->
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
                <div class="item_head btn-ic">
                    <!-- <a href="javascript:;">
                        <i class='icon-hp_list__add'></i>test
                    </a> -->
                </div>
                <div class="item_body">
                    <div v-if="consoleStatus == 1">
                        <vtable  :config='tableCfg' :data='tableData' @op="getDetail" @link='href'></vtable>
                    </div>
                    <div v-else>
                        <vtable  :config='lookTableCfg' :data='tableData' @op="getDetail" @link='href'></vtable>
                    </div>

                </div>
            </div>
        </div>
    </container>
    <!--筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg' @cb='openReference'></filter>
    </modal>
    <!--查看内页-->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee>
    </inner>
    <!--离职申请内页-->
    <inner :config='dimissionConfig'>
        <detail :show.sync='dimissionConfig.show' :msg-cfg="msgconfig" :detail-list="detailList" :application-status="applicationStatus" @refresh='closeDimissionEmployee'></detail>
    </inner>
    <refer-department :config="depCfg" @cb="sure"></refer-department>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.item_head:hover{
    cursor: pointer;
}
.reset_password{
    text-align: center;
    img{
        width: 50px;
        height:50px;
        margin-top: 20px;
    }
    .main{
        padding: 10px 30px;
        color: #212121;
        font-size: 12px;
    }
    .minor{
        padding:10px;
        padding-bottom: 30px;
        color: #757575;
        font-size: 12px;
    }
}
</style>
