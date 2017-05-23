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
            this.choiceTab(2,0)
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
                employeeDetail:{},
                listDetail:[],
                tabCount:{
                    count0:0,
                    count1:0,
                    count2:0
                },
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
                applicationStatus:2,
                rejectStatus:0,
                consoleStatus:2,
                reconsoleStatus:0,
                depCfg:{
                    show:false,
                    data:{}
                }
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
            operate (type, item) {
                this.getDetail(item)
            },
            getTabNumber(){
                this.$http.post(__URL.hr+ 'employee/refuse/application/findTabCount',{roleCode:1}).then(
                    (res)=>{
                        if(res.data.success){
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                if(res.data.data.dataList[i].tableIndex===2){
                                    this.tabCount.count2=res.data.data.dataList[i].count;
                                }else if(res.data.data.dataList[i].tableIndex===1){
                                    this.tabCount.count1=res.data.data.dataList[i].count;
                                }else if(res.data.data.dataList[i].tableIndex===0){
                                    this.tabCount.count0=res.data.data.dataList[i].count;                                this.firstTabNumber=res.data.data.dataList[i].count
                                }
                            }
                        }else{
                            this.setWarningSuccess('failure',res.data.errMsg)
                        }
                    }
                )
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
                this.choiceTab(2,0)
                this.tableData=[]
                this.checkConfig.show=false
            },
            //关闭离职内页
            closeDimissionEmployee(){
                this.choiceTab(2,0)
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
                this.choiceTab(2,0)
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
                this.getTabNumber()
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
                    "role":1
                }
                this.$http.post(__URL.hr + 'employee/refuse/application/department/list', param).then(
                    (res) => {
                        if(res.data.success){
                            if (type == 'refresh') {
                                this.listDetail.splice(0, this.listDetail.length);
                            }
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                this.listDetail.push(res.data.data.dataList[i])
                            }
                            this.totalCount=res.data.data.totalCount;
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
                this.$http.post(__URL.hr + 'employee/refuse/application/list', param).then(
                    (res) => {
                        if(res.data.success){
                            var dataList=res.data.data.dataList;
                            this.tableData=dataList
                            this.totalCount=res.data.data.totalCount;
                            this.consoleStatus = param.applicationStatus
                            this.reconsoleStatus = param.rejectStatus
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            },
            getDetail(param){
                this.$http.get(__URL.hr + 'employee/refuse/application/detail/' + param.recordId).then(
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
                            <a href="javascript:;"  @click='choiceTab(2,0)' :class="{ckd:2==applicationStatus && 0==rejectStatus}">
                                待审核({{tabCount.count0}})
                            </a>
                            <a href="javascript:;"  @click='choiceTab(2,1)' :class="{ckd:1==rejectStatus}">
                                已驳回({{tabCount.count1}})
                            </a>
                            <a href="javascript:;"  @click='choiceTab(3,0)' :class="{ckd:3==applicationStatus}">
                                已通过({{tabCount.count2}})
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
                        <i class='icon-add-index'></i>test
                    </a> -->
                </div>
                <div class="item_body">
                    <div v-if="consoleStatus == 2 && reconsoleStatus == 0">
                        <vtable  :config='tableCfg' :data='tableData' @link='href' @op="operate"></vtable>
                    </div>
                    <div v-else>
                        <vtable  :config='lookTableCfg' :data='tableData' @link='href' @op="operate"></vtable>
                    </div>

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
    <!--离职申请内页-->
    <inner :config='dimissionConfig'>
        <detail :show.sync='dimissionConfig.show' :msg-cfg="msgconfig" :detail-list.sync="detailList" :reject-status='rejectStatus' :application-status="applicationStatus" @refresh='closeDimissionEmployee'></detail>
    </inner>
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
    .list_div {
        width: 383px;
        line-height: 1;
        .leftbtn {
            display: inline-block;
            float: left;
            margin-left: 30px;
            height: 46px;
            line-height: 46px;
            position: relative;
        }
        .rightbtn {
            display: inline-block;
            float: right;
            margin-right: 15px;
            height: 46px;
            line-height: 46px;
            position: relative;
        }
        p {
            font-size: 14px;
            color: #212121;
            margin: 0;
        }
        p:hover {
            cursor: pointer;
            color: #008AF5
        }
        .list_tab {
            display: flex;
            font-size: 0;
            border-bottom: 1px solid @border-color;
            a {
                display: inline-block;
                padding: 18px 0;
                width: 50%;
                text-align: center;
                font-size: 14px;
                color: #212121;
                margin-top: -1px;
                margin-bottom: -1px;
                border-bottom: 2px solid transparent;
                text-decoration: none;
                position: relative;
                .redtips {
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    background: red;
                    border-radius: 2px;
                    position: absolute;
                    top: 22px;
                    margin-left: -8px;
                }
                &:hover {
                    color: #008af4;

                }
            }
            .ckd {
                color: #008af4;
                border-color: #008af4;
            }
        }
        .list_content {
            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                font-size: 0;
            }
            a {
                text-decoration: none;
                position: relative;
                p,
                span {
                    color: #212121;
                }
            }
            .listbox {
                position: absolute;
                width: 100%;
                top: 51px;
                bottom: 0;
                overflow: scroll;
                overflow-x: hidden;
                text-align: left;
                font-size: 0;
                .first_li {
                    position: relative;
                    width: 100%;
                    >a {
                        display: inline-block;
                        padding: 0 20px 0 32px;
                        font-size: 0;
                        border-left: 3px solid transparent;
                        border-bottom: 1px solid @border-color;
                        >i{
                            font-size: 12px;
                            position: absolute;
                            top: 18px;
                            left: 10px;
                            color: #212121;
                        }
                        .main {
                            display: inline-block;
                            max-width: 230px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                            font-size: 14px;
                            color: #212121;
                            margin: 16px 0;
                        }
                        .minor {
                            max-width: 328px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                            font-size: 12px;
                            color: #757575;
                            margin: 0 0 8px 0;
                        }
                        .tip_number {
                            position: absolute;
                            display: inline-block;
                            right: 20px;
                            top: 16px;
                            font-size: 14px;
                            color: #212121;
                            max-width: 80px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                        }
                        .mt16 {
                            margin-bottom: 16px;
                        }
                    }
                    .childchoice{
                        color: #008AF5 !important;
                    }
                    >a:hover {
                        background: #f0f9fd;
                    }
                    >.sec_ul {
                        font-size: 0;
                        >.sec_li {
                            padding: 0 20px 0 32px;
                            font-size: 0;
                            border-left: 3px solid transparent;
                            border-bottom: 1px solid @border-color;
                            background: #FAFAFA;
                            position: relative;
                            height: 100%;
                            .main {
                                display: inline-block;
                                max-width: 230px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                word-break: break-all;
                                overflow: hidden;
                                font-size: 14px;
                                color: #212121;
                                margin: 16px 0;
                            }
                            .minor {
                                max-width: 328px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                word-break: break-all;
                                overflow: hidden;
                                font-size: 12px;
                                color: #757575;
                                margin: 0 0 8px 0;
                            }
                            .tip_number {
                                position: absolute;
                                display: inline-block;
                                right: 20px;
                                top: 16px;
                                font-size: 14px;
                                color: #212121;
                                max-width: 80px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                word-break: break-all;
                                overflow: hidden;
                            }
                            .mt16 {
                                margin-bottom: 16px;
                            }
                            .number-title {
                                display: inline-block;
                                position: absolute;
                                /*height: 14px;*/
                                min-width: 15px;
                                border: 1px #212121 solid;
                                line-height: 14px;
                                border-radius: 2px;
                                text-align: center;
                                left: 35px;
                                top: 15px;
                                transition: all .2s ease;
                                color: #212121;
                                font-size: 12px;
                                transform: scale(.9)
                            }
                        }
                        >.sec_li:hover {
                            cursor: pointer;
                            background: #f0f9fd;
                        }
                        .hasnumber {
                            /*width: 300px;*/
                            padding-left: 60px;
                            .main {
                                max-width: 205px;
                            }
                            .minor {
                                max-width: 300px;
                            }
                        }
                    }
                }
            }
            .ckd {
                border-left: 3px #03a9f4 solid !important;
                background: #f0f9fd !important;
                >p {
                    color: #008AF5 !important;
                }
                >.number-title{
                    color: #008AF5 !important;
                    border-color: #008AF5 !important;
                }
                i{
                    color: #008AF5 !important;
                }
            }
        }
        .list_loadmore{
            height: 46px;
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: 0;
            font-size: 14px;
            padding: 16px 0;
            border-bottom: 1px solid @border-color;
            border-top: 1px solid @border-color;
            background: white;
        }
        .list_loadmore:hover{
            cursor: pointer;
        }

    }
</style>
