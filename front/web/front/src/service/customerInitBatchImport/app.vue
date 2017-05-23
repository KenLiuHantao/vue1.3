<script>
import cfg from './cfg.js'
import info from './infoAndEdit.vue'
import customerDetail from './changeCustomer.vue'
import initedPage from './initedTipPage.vue'
export default {
    components: {
        info,
        customerDetail,
        initedPage
    },
    compiled() {
        //初始化判断是非出现下一步
        this.$http.get(__URL.osiu + 'get/next/3').then(
            res=>{
                if(res.data.success){
                    this.enter=res.data.data;
                }else{
                    this.enter=false;
                }
            }
        )
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            actItem:'',
            isAdd:false,
            isEdit:false,
            infoCfg:{
                show:false,
                header:'编辑修改',
                width:'576px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            importCfg:{
                show:false,
                header:'导入客户档案',
                width:'408px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确认导入',
                    emit:'sure'
                }]
            },
            // customerCfg:{
            //         show:false
            //     },
            delCfg:{
                show:false,
                type:'warning',
                msg:'是否删除此行记录'
            },
            delAllCfg:{
                show:false,
                type:'warning',
                msg:'是否删除此行记录'
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            imCfg:{
                page:'service',
                show:false,
                title:'客户档案',
                url:__URL.osiu + 'import/initCustomer',
                tmpUrl:__URL.osiu + 'download/initCustomer'
            },
            lockRepeatSubmit:false,
            checkData:[],
            importCategoryData: {
                name: '',
                code: ''
            },
            // 留存 newApp 最后一次操作
            paramSave: {},
            enter:false,
            industryFirst:[],
            industrySec:[],
            firstIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            secondIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            msgCfg:{
                show:false
            },
            tableTotal:0,
            pageCfg:{
              'pageSize': 50,
              'pageIndexName': 'pageIndex',
              'pageSizeName': 'pageSize',
              'jump':true
            },
            lastTableParam:{

            },
            importAllCfg:{
                show:false,
                msg:'请确认是否导入全部待导入数据?',
                subMsg:'',
                type:'warning',
                quite:true
            },
            deleteAllCfg:{
                show:false,
                msg:'请确认是否删除全部数据?',
                subMsg:'',
                type:'warning',
                quite:true
            },
            fromFirstIndustryCategoryCode:"",
            fromFirstIndustryCategoryName : '',
            detailConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '客户档案详情'
            },
            customerdetail:{

            },
            firstTabNumber:'',
            //是否初始化完成
            isInited:'xxx'
        }
    },
    ready(){
        this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
            res=>{
                if(res.data.success){
                    if(res.data.data.step == 0){
                        this.isInited = true
                    }else{
                        this.isInited =false
                        this.getCategoryList()
                    }
                }
            }
        )

    },
    methods: {
        //获取行业分类
        getCategoryList(){
            this.$http.get(__URL.arc + 'industry/category/first').then(
                (res) => {
                    if(res.data.success){
                        this.industryFirst=res.data.data
                    }
                }
            )
        },
        //获取tab数量
        getTabNumber(){
            this.$http.post(__URL.osiu+ 'import/init/customer/findTabCount',{}).then(
                (res)=>{
                    if(res.data.success){
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            if(res.data.data.dataList[i].tableIndex===2){
                                this.tabCfg.tabBarData[2].name='已导入('+res.data.data.dataList[i].count+')'
                            }else if(res.data.data.dataList[i].tableIndex===1){
                                this.tabCfg.tabBarData[1].name='有异常('+res.data.data.dataList[i].count+')'
                            }else if(res.data.data.dataList[i].tableIndex===0){
                                this.tabCfg.tabBarData[0].name='待正式导入('+res.data.data.dataList[i].count+')'
                                this.firstTabNumber=res.data.data.dataList[i].count
                            }
                        }
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        //获取列表
        getList(param) {
            this.fromFirstIndustryCategoryCode = param.firstIndustryCategoryCode;
            this.fromFirstIndustryCategoryName =  param.firstIndustryCategoryName;
            this.$http.post(__URL.osiu + 'import/init/customer/list',param).then(
                res=>{
                    if(res.data.success){
                        // 保存 param
                        this.lastTableParam=param;
                        this.paramSave = param;
                        this.tableData = res.data.data.dataList;
                        this.checkData = [];
                        this.tableTotal=res.data.data.totalCount;
                        //新需求不要默认选中
                        // if(res.data.data.dataList.length>0 && res.data.data.dataList[0].status==1){
                        //     this.checkData=JSON.parse(JSON.stringify(res.data.data.dataList))
                        // }
                        //添加分析通过属性
                        if(this.tabCfg.select=='tab3'){
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                res.data.data.dataList[i].status=1
                            }
                        }
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        changePage(item){
            this.lastTableParam.pageIndex=item.pageIndex;
            this.lastTableParam.pageSize=item.pageSize;
            this.$http.post(__URL.osiu + 'import/init/customer/list', this.lastTableParam).then(
                (res) => {
                    if(res.data.success){
                        this.paramSave = this.lastTableParam;
                        this.tableData = res.data.data.dataList;
                        this.checkData = [];
                        // this.tableTotal=res.data.data.totalCount;
                        //新需求不要默认选中
                        // if(res.data.data.dataList.length>0 && res.data.data.dataList[0].status==1){
                        //     this.checkData=JSON.parse(JSON.stringify(res.data.data.dataList))
                        // }
                        //添加分析通过属性
                        if(this.tabCfg.select=='tab3'){
                            for(var i=0;i<res.data.data.dataList.length;i++){
                                res.data.data.dataList[i].status=1
                            }
                        }
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        getInfo(item){
            this.$http.get(__URL.osiu+'import/init/customer/detail/'+item.id).then(
                res=>{
                    if(res.data.success){
                        this.actItem = res.data.data;
                        this.infoCfg.show = true;
                    }else{
                        console.log(res.data.errMsg);
                    }
                }
            )
        },
        //详情信息
        // openInfo(item){
        //     this.isEdit = false
        //     this.getInfo(item)
        // },
        //新增
        addOrder(){
            this.imCfg.show = true
            this.isEdit = false
        },
        // 新增批量导入
        addSuccess (param) {
            this.getTabNumber()
            this.$broadcast('_RESETLIST')
            this.tableData=[]
            this.setWarningSuccess('success','导入成功');
        },
        operating(type,item){
            if(type == 'edit'){
                this.edit(item)
            }else if(type == 'delete'){
                this.del(item)
            }
        },
        //编辑
        edit(item){
            if(this.tabCfg.select=='tab3'){
                this.$http.get(__URL.crm + 'customer/detail/' + item.id).then(
                    (res) => {
                        if(res.data.success){
                            this.customerdetail = res.data.data;
                            this.detailConfig.show = true;
                        }else{
                            this.setWarningSuccess('failure',res.data.errMsg)
                        }
                    }
                )
            }else{
                this.isEdit = true
                this.getInfo(item)
            }
        },
        //删除提示框
        del(item){
            this.actItem = item
            this.delCfg.show = true
        },
        //删除数据
        deleteData(){
            this.$http.get(__URL.osiu+'import/init/customer/delete/{id}'+this.actItem.id).then(
                res=>{
                    if(res.data.success){
                        this.getTabNumber()
                        this.tableTotal=0;
                        this.$broadcast('_RESETLIST');
                        this.setWarningSuccess('success',res.data.data);
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        deleteAll(){
            if(this.checkData.length > 0 ){
                this.delAllCfg.show = true
                this.delAllCfg.msg = '确定要删除所选的' + this.checkData.length + '条记录吗？删除后不可恢复。'
            }else{
                // this.delAllCfg.msg = '请至少选择一条记录'
                // 未选择时，新需求要删除全部
                this.deleteAllCfg.show=true;

            }
        },
        deleteAllData(){
            let idArr
            if(this.checkData.length >0){
                idArr = this.checkData.map(item=>{
                    return item.id
                })
            }else{
                idArr=[]
            }
            var type;
            if(this.tabCfg.select=='tab1'){
                type=1
            }else if(this.tabCfg.select=='tab2'){
                type=0
            }
            this.$http.post(__URL.osiu + 'import/init/customer/batchDel/'+type,idArr).then(
                res=>{
                    if(res.data.success){
                        this.getTabNumber()
                        this.tableTotal=0;
                        this.$broadcast('_RESETLIST');
                        this.setWarningSuccess('success',res.data.data);
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
        quite(){
            this.infoCfg.show =false
        },
        sure(){
            if(this.isEdit){
               if(!this.lockRepeatSubmit) this.saveData(__URL.osiu + 'import/init/customer/update',this.actItem)
            }else{
                this.infoCfg.show = false
            }
        },
        //根据行业大类选择小类
        changeIndustry(code){
            this.secondIndustryCategory.industryCategoryCode='';
            this.secondIndustryCategory.industryCategoryName='';
            this.$http.get(__URL.arc + 'industry/category/second/'+code).then(
                (res) => {
                    if(res.data.success){
                        this.industrySec=res.data.data
                    }
                }
            )
        },
        //保存数据
        saveData(url,param){
            // if(!this.check()) return 暂时不验证
            this.lockRepeatSubmit = true
            this.$http.post(url,param).then(
                res=>{
                    if(res.data.success){
                        this.infoCfg.show = false
                        this.tableTotal=0;
                        this.$broadcast('_RESETLIST')
                        this.tableData = []
                        this.getTabNumber();
                        this.setWarningSuccess('success',res.data.data)
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                    this.lockRepeatSubmit = false
                }
            )
        },
        check(){
            if(this.actItem.customerName.trim() == ''){
                this.setWarningSuccess('failure','客户名称不能为空')
                return false
            }
            if(this.actItem.industryCategoryName.trim() == ''){
                this.setWarningSuccess('failure','行业分类不能为空')
                return false
            }
            if(this.actItem.customerCategoryName == ''){
                this.setWarningSuccess('failure','客户分类不能为空')
                return false
            }
            if(this.actItem.employeeName == ''){
                this.setWarningSuccess('failure','业务员不能为空')
                return false
            }
            if(this.actItem.currencyName == ''){
                this.setWarningSuccess('failure','币种不能为空')
                return false
            }
            if(this.actItem.taxRateVal === ''){
                this.setWarningSuccess('failure','税率不能为空')
                return false
            }
            if(this.actItem.contactName == ''){
                this.setWarningSuccess('failure','联系人不能为空')
                return false
            }
            if(this.actItem.contactDuty == ''){
                this.setWarningSuccess('failure','职务不能为空')
                return false
            }
            return true
        },
        //正式导入
        importAll(){
            if(this.checkData.length < 1 ){
                /* 未选择时，新需求要导入全部 */
                // this.delAllCfg.show = true
                // this.delAllCfg.msg = '请至少选择一条记录'
                // 默认加载第一行后，不会出现导入全部数据的情况
                // if(this.fromFirstIndustryCategoryCode != ''){
                //      this.importAllCfg.msg = "请确认是否导入分类["+this.fromFirstIndustryCategoryName +"]数据?"
                // }else{
                //     this.importAllCfg.msg = "请确认是否导入全部待导入数据?"
                // }
                this.firstIndustryCategory={
                    "industryCategoryCode":this.fromFirstIndustryCategoryCode,
                    "industryCategoryName":this.fromFirstIndustryCategoryName
                },
                this.changeIndustry(this.fromFirstIndustryCategoryCode)
                this.importCfg.show=true;
            }else{
                this.firstIndustryCategory={
                    "industryCategoryCode":this.fromFirstIndustryCategoryCode,
                    "industryCategoryName":this.fromFirstIndustryCategoryName
                },
                this.changeIndustry(this.fromFirstIndustryCategoryCode)
                this.importCfg.show = true
            }
        },
        importAllData(){
            this.importCfg.show = true
        },
        //客户分类弹框
        // customerModal(){
        //     this.customerCfg.show = true
        // },
        //清除数据
        customerClear(){
            this.importCategoryData.name = this.importCategoryData.code = ''
        },
        //确认选择的客户分类
        customerSure(val){
            this.importCategoryData.name = val.customerCategoryName
            this.importCategoryData.code = val.customerCategoryCode
        },
        //确认导入
        sureImport(){
            if(this.firstTabNumber==0){
                this.msgCfg.type='warning';
                this.msgCfg.show=true
                this.msgCfg.content='没有可以导入的数据！'
                return
            }
            var importFormal={}
            var industryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            var industryCategoryName = this.firstIndustryCategory.industryCategoryName;
            if("" == industryCategoryCode || "" == industryCategoryName){
                this.msgCfg.type = 'warning';
                this.msgCfg.content = "请选择行业大类";
                this.msgCfg.show = true;
                return;
            }
            // this.importFormal.firstIndustryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            // this.importFormal.firstIndustryCategoryName = this.firstIndustryCategory.industryCategoryName;

            industryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            industryCategoryName = this.secondIndustryCategory.industryCategoryName;
            if("" == industryCategoryCode || "" == industryCategoryName){
                this.msgCfg.type = 'warning';
                this.msgCfg.content = "请选择行业小类";
                this.msgCfg.show = true;
                return;
            }
            importFormal.secondIndustryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            importFormal.secondIndustryCategoryName = this.secondIndustryCategory.industryCategoryName;
            importFormal.fromFirstIndustryCategoryCode =  this.fromFirstIndustryCategoryCode;


             let idArr = this.checkData.map(item=>{
                return item.id
             })
             importFormal.ids=idArr;
             this.$http.post(__URL.osiu + 'import/init/customer/formal',importFormal)
             .then(
                res=>{
                    if(res.data.success){
                         this.getTabNumber();
                         this.$broadcast('_RESETLIST');
                         this.tableData = [];
                         this.tableTotal=0;
                         this.importCfg.show = false;
                         this.setWarningSuccess('success',res.data.data);
                         this.enter=true;
                         // 操作完成，重新拉取数据
                         this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
             )
        },
        quiteImport(){
            this.importCfg.show = false
        },
        clearTable(uid,obj){
            this.tableData = [];
            this.checkData = [];
            this.tableTotal=0;
            this.getTabNumber();
        },
        //关闭详情页面
        closeCustomerDetail(text){
            this.detailConfig.show = false;
            this.$broadcast('_RESETLIST')
            this.tableData=[]
            if(text){
                this.setWarningSuccess('success',text);
            }
        },
    },
    computed: {
        tableCfg() {
            if(this.tabCfg.select=='tab3'){
                return cfg.tableCfg2
            }else{
                return cfg.tableCfg1
            }
        },
        tabCfg(){
            this.getTabNumber()
            return cfg.leftItemCfg.tabCfg
        },
    }
}
</script>
<template>
    <container v-if="isInited == false">
        <alert  :config='deleteAllCfg'  @cb='deleteAllData'></alert>
        <alert  :config='importAllCfg'  @cb='importAllData'></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @add="addOrder" @cb='getList'></new-app>
            </div>
            <div class="right_item have_footer">
                <div class="item_head btn-ic">
                    <a href="javascript:;" @click="importAll"  v-if="tabCfg.select=='tab1'">
                        <i class='icon-hr_files__import'></i>正式导入
                    </a>
                    <a href="javascript:;" @click="deleteAll" v-if="tabCfg.select != 'tab3'">
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox="checkData"  :config='tableCfg' @op="operating" :data='tableData' ></vtable>
                </div>
                <div class="item_footer">
                    <pagination  :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                    <button v-if='enter' class="btn-xl-imp" @click="$router.go('/init/supplierInitBatchImport')">下一步</button>
                </div>
            </div>
        </div>
        <!--详情弹框-->
        <modal :config="infoCfg" @quite="quite" @sure="sure">
            <info :data='actItem' :add="isAdd" :edit="isEdit"></info>
        </modal>
        <!--批量导入表弹框-->
        <vimport :config="imCfg" @cb='addSuccess'></vimport>
        <!--删除提示组件-->
        <alert :config="delCfg" @cb="deleteData"></alert>
        <!--批量删除提示-->
        <alert :config="delAllCfg" @cb="deleteAllData"></alert>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
        <!--确认导入分类选择弹框-->
        <modal :config="importCfg" @quite="quiteImport" @sure="sureImport">
            <div class='form-group'>
                <label><span class="must-point">*</span>行业大类:</label>
                <select v-model='firstIndustryCategory' disabled
                        @change='changeIndustry(firstIndustryCategory.industryCategoryCode)'>
                    <option :value='item' v-for='item in industryFirst'>{{item.industryCategoryName}}
                    </option>
                </select>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>行业小类:</label>
                <select v-model='secondIndustryCategory'>
                    <option :value='item' v-for='item in industrySec'>{{item.industryCategoryName}}
                    </option>
                </select>
            </div>
        </modal>
        <!--客户分类参照-->
        <!-- <customermodal :config='customerCfg' @cb='customerSure'></customermodal> -->
        <inner :config='detailConfig'>
            <customer-detail :detail='customerdetail' @refresh='closeCustomerDetail'  :edit=true></customer-detail>
        </inner>
        <warning :config='msgCfg'></warning>
    </container>
    <inited-page v-if="isInited == true"></inited-page>
</template>

<style lang="less" scoped>
.tip-msg{
    line-height: 80px;
    margin: 0 auto;
}

</style>