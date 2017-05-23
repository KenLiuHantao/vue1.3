<script>
import cfg from './cfg.js'
import newEmployee from './newEmployee'
import changeEmployee from './changeEmployee'
import checkEmployee from './checkEmployee'
export default {
    components: {
        newEmployee,
        changeEmployee,
        checkEmployee,
    },
    ready() {
        this.choiceTab(1)
        //获取所有岗位  目前没筛选 暂时不要
        //var data={
        //    "departmentCode": "",
        //    "roleCode": ""
        //}
        //this.$http.post(__URL.hr+'employee/role/ref',data).then(
        //    (res) => {
        //        if(res.data.success){
        //            var _data=res.data.data.dataList
        //            for(var i=0;i<_data.length;i++){
        //                this.filterCfg[4].option.push(_data[i].roleName)
        //            }
        //        }
        //    },
        //    (err) => {
        //        console.log('初始化未能拿到tree数据')
        //    }
        //)
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            filterCfg:cfg.leftItemCfg.filterCfg,
            oldFilterConfig:'',
            tableData: [],
            radioObj: {},
            tabCount: {},
            addConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '新增员工档案',
            },
            changeConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案',
            },
            checkConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案',
            },
            leaveConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '离职人事档案',
            },
            passwordConfig:{
                show: false,
                width: '300px',
                height: 'auto',
                header: '重置密码',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '重置密码',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
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
                }],
            },
            employeeDetail:{},
            listDetail:[],
            totalCount:0,
            pageIndex:1,
            ckdCode:'',
            openCode:'',
            activeTab:1,
            depCfg:{
                show:false,
                data:{}
            },
            ajaxlock:true,
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
        initListObj(obj) {
            var filterObj=this.getFilterObject()
            let init = {
                "departmentCode": obj.departmentCode,
                "departmentName":filterObj.departmentName,
                "employeeName": filterObj.employeeName,
                "endDate": filterObj.endDate,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": filterObj.phone,
                "roleName": filterObj.roleName,
                "startDate": filterObj.startDate,
                "working": this.activeTab
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            //修改
            if(type==0){
                var filterObj=this.getFilterObject()
                // var param={
                //     "employeeName": item.name,
                //     "jobNumber": item.jobNumber,
                //     "working": this.activeTab
                // }
                this.$http.get(__URL.hr + 'employee/find/code/'+item.code).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.changeConfig.show=true
                        }else{
                            this.$warning({type: 'warning', message: res.data.errMsg})
                        }
                    }
                )
            }
            //重置密码
            else if(type==1){
                this.employeeDetail=item;
                this.passwordConfig.show=true;
            }
            //离职
            else if(type==2){
                var filterObj=this.getFilterObject()
                // var param={
                //     "employeeName": item.name,
                //     "jobNumber": item.jobNumber,
                //     "working": this.activeTab
                // }
                this.$http.get(__URL.hr + 'employee/find/code/'+item.code).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.leaveConfig.show=true
                        }else{
                            this.$warning({type: 'warning', message: res.data.errMsg})
                        }
                    }
                )
            }
        },
        href(item, type) {
            // console.log(item, type)
            if(type=='name'){
                var filterObj=this.getFilterObject();
                // var param={
                //   "employeeName": item.name,
                //   "jobNumber": item.jobNumber,
                //   "working": this.activeTab
                // }
                this.$http.get(__URL.hr + 'employee/find/code/'+item.code).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.changeConfig.show=true
                        }else{
                            this.$warning({type: 'warning', message: res.data.errMsg})
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
        //新增按钮事件
        addNew(){
            this.addConfig.show=true;
        },
        //关闭新增页面
        closeNewEmployee(text){
            this.addConfig.show=false;
            this.refresh(text)
        },
        //关闭修改页面
        closeChangeEmployee(text){
            this.changeConfig.show=false;
            this.refresh(text)
        },
        //关闭查看页面
        closeCheckEmployee(){
            this.checkConfig.show=false
        },
        //关闭修改页面
        closeLeaveEmployee(){
            this.leaveConfig.show=false
        },
        //刷新外页
        refresh(text){
            // this.tableData=[];
            // this.getList()
            if(text){
                this.$warning({type: 'success', message: text})
            }
            this.choiceTab(1)
            this.tableData=[]
        },
        //重置密码弹框
        resetSure(){
            if(!this.ajaxlock){
                return
            }
            this.ajaxlock=false;
            this.$http.get(__URL.hr+'employee/reset/password/'+this.employeeDetail.code).then(
                (res) => {
                    this.ajaxlock=true;
                    if(res.data.success){
                        this.passwordConfig.show=false;
                        this.$warning({type: 'success', message: '重置密码成功'})
                    }else{
                        this.$warning({type: 'warning', message: res.data.errMsg})
                    }
                }
            )
        },
        resetCancel(){
            this.passwordConfig.show=false;
        },
        /*
        *下面全是这个页面单独和list有关的内容
        */
        filterMod(){
            this.filterModCfg.show = true;
            this.oldFilterConfig=this.filterCfg;
        },
        filterSure(){
            this.filterModCfg.show = false
            //刷新list 清空table
            this.choiceTab(1)
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
        choiceTab(index){
            this.activeTab=index;
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
                "departmentCode": '',
                "departmentName":filterObj.departmentName,
                "employeeName": filterObj.employeeName,
                "endDate": filterObj.endDate,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": filterObj.phone,
                "roleName": filterObj.roleName,
                "startDate": filterObj.startDate,
                "working": this.activeTab
            }
            this.$http.post(__URL.hr + 'employee/find/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.listDetail.splice(0, this.listDetail.length);
                        }
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            this.listDetail.push(res.data.data.dataList[i])
                        }
                        this.totalCount=res.data.data.totalCount;
                        this.tabCount = res.data.data.header;
                        if(this.listDetail.length>0){
                            this.openFirst(this.listDetail[0])
                        }
                    }else{
                        this.$warning({type: 'warning', message: res.data.errMsg})
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
            this.$http.post(__URL.hr + 'employee/find/detail/list', param).then(
                (res) => {
                    if(res.data.success){
                        var dataList=res.data.data.dataList;
                        /*for(var i=0;i<dataList.length;i++){
                            if(dataList[i].accountStatus==0){
                                dataList[i].accountStatus='未启用'
                            }else if(dataList[i].accountStatus==1){
                                dataList[i].accountStatus='已启用'
                            }else if(dataList[i].accountStatus=='-1'){
                                dataList[i].accountStatus='已停用'
                            }
                        }*/
                        this.tableData=dataList
                    }else{
                        this.$warning({type: 'warning', message: res.data.errMsg})
                    }
                }
            )
        },
        //筛选打开参照
        openReference:function(emit){
            if(emit=='department'){
                this.depCfg.show=true;
            }
        },
        sure(item){
            this.filterCfg[3].value=item.departmentName;
            this.depCfg.data=item
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
                    <a @click='addNew'>
                        <!--<i class="icon-hp_list__add"></i>新增-->
                    </a>
                    <a href="javascript:;"  @click='filterMod'>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab' >
                            <a href="javascript:;"  @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                在职({{tabCount.oneEmployeeCount}})
                            </a>
                            <a href="javascript:;"  @click='choiceTab(0)' :class="{ckd:0==activeTab}">
                                离职({{tabCount.twoEmployeeCount}})
                            </a>
                        </div>
                        <div class='list_content'>
                            <ul class='listbox'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv.departmentCode==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <i v-show='firstLv.children.length>0 && firstLv.departmentCode!=openCode' class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length>0&& firstLv.departmentCode==openCode' class='icon-hp_list__dropdown' :class='{childchoice:firstLv.departmentCode!=ckdCode && firstLv.departmentCode==openCode}'></i>
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
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <!-- 筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg' @cb='openReference'></filter>
    </modal>
    <!-- 重置密码弹框 -->
    <modal :config='passwordConfig' @sure='resetSure' @close='resetCancel'>
        <div class='reset_password'>
            <img src="../../../../../public/images/danger.png">
            <p class='main'>将员工"<span>{{employeeDetail.name}}</span>"的用户密码重置为6位数的随机密码。</p>
            <p class='minor'>注:重置密码后用户将收到提示短信。</p>
        </div>
    </modal>
    <!-- 新增内页-->
    <inner :config='addConfig'>
        <new-employee @refresh='closeNewEmployee'></new-employee> 
    </inner>
    <!-- 修改内页-->
    <inner :config='changeConfig'>
        <change-employee :employee-detail='employeeDetail' @refresh='closeChangeEmployee'></change-employee> 
    </inner>
    <!-- 查看内页-->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee> 
    </inner>
    <!-- 离职内页-->
    <inner :config='leaveConfig'>
        <leave-employee :employee-detail='employeeDetail' @refresh='closeLeaveEmployee'></leave-employee> 
    </inner>
    <refer-department :config="depCfg" @cb="sure"></refer-department>
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
