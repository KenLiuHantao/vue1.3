<script>
import cfg from './cfg.js'
import checkEmployee from './checkEmployee'
import detail from './detail'
export default {
    components: {
        checkEmployee,
        detail
    },
    ready() {
        this.choiceTab(0)
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            filterCfg:cfg.leftItemCfg.filterCfg,
            oldFilterConfig:'',
            tableData: [],
            radioObj: {},
            tabCount:{},
            checkConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案',
            },
            filterModCfg:{
                show: false,
                width: '370px',
                height: 'auto',
                header: '筛选',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            },
            employeeDetail:{

            },
            listDetail:[
            ],
            totalCount:0,
            pageIndex:1,
            msgconfig:{
                show:false,
                content:''
            },
            ckdCode:'',
            openCode:'',
            activeTab:1,
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            renewalDetail:{},
            renewalCfg:{
                show: false,
                width: '575px',
                height: 'auto',
                header: '编辑',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            },
            detailType:0//0 是续约 1是编辑
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
                "beginDateEnd": filterObj.beginDateEnd,
                "beginDateStart": filterObj.beginDateStart,
                "departmentCode": obj.departmentCode,
                "employeeName": filterObj.employeeName,
                "endDateEnd": filterObj.endDateEnd,
                "endDateStart": filterObj.endDateStart,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "type": this.activeTab
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            if(type=='续约'){
                this.$http.get(__URL.hr + 'employee/contract/renew/detail/'+item.recordId).then(
                    (res) => {
                        if(res.data.success){
                            this.renewalDetail=res.data.data
                            this.detailType=0
                            this.renewalCfg.show=true
                            // this.employeeDetail=res.data.data
                            // this.checkConfig.show=true
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(type=='编辑'){
                this.$http.get(__URL.hr + 'employee/contract/edit/detail/'+item.recordId).then(
                    (res) => {
                        if(res.data.success){
                            this.renewalDetail=res.data.data
                            this.detailType=1
                            this.renewalCfg.show=true
                            // this.employeeDetail=res.data.data
                            // this.checkConfig.show=true
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        href(item, type) {
            if(type=='name'){
                var filterObj=this.getFilterObject();
                this.$http.get(__URL.hr + 'employee/find/code/'+item.employeeCode).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.checkConfig.show=true
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        // getFilter(item) {
        //     this.listObj = this.initListObj(item)
        //     this.getList(listObj)
        // },
        // /* 数据请求 */
        // getList(obj) {
        //     this.$http.post(__URL.manu + 'iqc/list', obj).then(
        //         (res) => {
        //             this.tableData = res.data.data.dataList
        //         }
        //     )
        // },
        //关闭查看页面
        closeCheckEmployee(){
            this.checkConfig.show=false
        },
        //刷新外页
        refresh(text){
            // this.tableData=[];
            // this.getList()
            if(text){
                this.dCfg.content=text;
                this.dCfg.show=true;
            }
            this.choiceTab(1)
            this.tableData=[]
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
                "beginDateEnd": filterObj.beginDateEnd,
                "beginDateStart": filterObj.beginDateStart,
                "departmentCode": '',
                "employeeName": filterObj.employeeName,
                "endDateEnd": filterObj.endDateEnd,
                "endDateStart": filterObj.endDateStart,
                "jobNumber": filterObj.jobNumber,
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "type": this.activeTab
            }
            this.$http.post(__URL.hr + 'employee/contract/find/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.listDetail.splice(0, this.listDetail.length);
                        }
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            this.listDetail.push(res.data.data.dataList[i])
                        }
                        this.tabCount = res.data.data.header;
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
            this.$http.post(__URL.hr + 'employee/contract/find/detail/list', param).then(
                (res) => {
                    if(res.data.success){
                        var dataList=res.data.data.dataList;
                        this.tableData=dataList
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            if(this.activeTab==0){
                return cfg.tableCfg0
            }else if(this.activeTab==1){
                return cfg.tableCfg1
            }else if(this.activeTab==2){
                return cfg.tableCfg2
            }
            
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
        <warning  :config="dCfg"></warning>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a>
                        
                    </a>
                    <a href="javascript:;"  @click='filterMod'>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab' >
                            <a href="javascript:;"  @click='choiceTab(0)' :class="{ckd:0==activeTab}">
                                待续约({{tabCount.oneEmployeeCount}})
                            </a>
                            <a href="javascript:;"  @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                生效中({{tabCount.twoEmployeeCount}})
                            </a>
                            <a href="javascript:;"  @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                已终止({{tabCount.threeEmployeeCount}})
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
        <filter :config.sync='filterCfg' ></filter>
    </modal>
    <!-- 续约弹框 -->
    
    <detail :type='detailType' :config='renewalCfg' :detail='renewalDetail' @cb='refresh'></detail>
   
    <!-- 查看内页 -->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee> 
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

</style>
