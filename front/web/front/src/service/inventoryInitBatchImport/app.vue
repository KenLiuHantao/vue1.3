<script type="text/javascript">
import cfg from './cfg.js'
import item from './item'
import itemDev from '../../development/inventoryManager/item.vue'
import initedPage from '../customerInitBatchImport/initedTipPage.vue'
export default {
    components: {
        item,
        itemDev,
        initedPage
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listParam: {},
            tableData: [],
            boxGroup: [],
            subItem: {},
            currentItem: {},
            importFormal:{},
            // 货品编码
            innerCfg: {
                show: false,
                header: '货品详情'
            },
            innerDevCfg: {
                show: false,
                title: '货品档案详情'
            },
            imCfg: {
                page:'service',
                show: false,
                title: '货品期初存货导入',
                url: __URL.osiu + 'import/initInventory',
                tmpUrl: __URL.osiu + 'download/initInventory',
            },
            alertCfg: {
                show: false,
                type: 'warning',
                msg: ''
            },
            msgCfg: {
                show: false,
                type: 'success',
                content: ''
            },
            importModCfg:{
                show: false,
                width: '400px',
                height: 'auto',
                header: '导入货品期初存货',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确认导入',
                    emit: 'sure',
                }],
            },
            passCfg:{
                show: false,
                width: '450px',
                height: 'auto',
                header: '提示',
                btn: [{
                    name: '取消',
                    emit: 'closepass',
                }, {
                    name: '继续操作',
                    emit: 'surepass',
                }],
            },
            currentSelect: 'tab1',
            industryFirst:[],
            firstIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            secondIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            industrySec:[],
            isBatch:0,
            repeatSubmit: false,
            enter:false,
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
            itemData:{},
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
                        this.getCategory()
                        this.getNextState()
                    }
                }
            }
        )

    },
    watch: {
        leftItemCfg: {
            handler(val, oldVal) {
                if (val.tabCfg.select == 'tab1') {
                    this.tableData = new Array
                    this.boxGroup = new Array
                } else {
                    this.tableData = new Array
                    this.boxGroup = new Array
                }
            },
            deep: true
        }
    },
    methods: {
        getCategory(){
            this.$http.get(__URL.arc + 'industry/category/first').then(
                (res) => {
                    if(res.data.success){
                        this.industryFirst=res.data.data
                    }
                }
            )
        },
        //初始化判断是非出现下一步
        getNextState(){
            this.$http.get(__URL.osiu + 'get/next/5').then(
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
            this.$http.post(__URL.osiu+ 'import/init/inventory/findTabCount',{}).then(
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
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg
                        this.msgCfg.show=true
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
        // table返回的操作参数
        operate(type, item) {
            this.currentItem = Object.assign({}, item);
            if (type == 'edit') {
                if(this.tabCfg.select=='tab3'){
                    this.getItem(item.inventoryId);
                }else{
                    this.getItem(item.id);
                }
            } else {
                this.alertCfg.msg = '确定要删除该行记录吗？';
                this.alertCfg.show = true;
                this.isBatch = 0;
            }
        },
        href(item, type) {
            this.currentItem = Object.assign({}, item);
            if(this.tabCfg.select=='tab3'){
                this.getItem(this.currentItem.inventoryId);
            }else{
                this.getItem(this.currentItem.id);
            }
        },
        getFilter(param, obj) {
            param.secondInventoryCategoryName = undefined != obj && undefined != obj.secondInventoryCategoryName ? obj.secondInventoryCategoryName : "";
            param.secondInventoryCategoryCode = undefined != obj && undefined != obj.secondInventoryCategoryCode ? obj.secondInventoryCategoryCode : "";
            this.getList(param)
        },
        refreshDev(){
            this.innerDevCfg.show = false
            this.refresh()
        },
        // 刷新重置
        refresh() {
            this.getTabNumber();
            this.tableTotal=0;
            this.tableData = new Array
            this.boxGroup = new Array
            this.$broadcast('_RESETLIST')
        },
        // 正式导入
        inImport(type) {
            if (this.boxGroup.length) {
                if(0 == type){
                    this.importModCfg.show=true;
                }else{
                    this.alertCfg.msg = '确定要删除选择的行记录吗？';
                    this.alertCfg.show = true;
                    this.isBatch = 1;
                }
            } else {
                // this.msgCfg.content = '请至少选择一行记录';
                // this.msgCfg.show = true;
                // this.msgCfg.type = 'warning';
                /* 未选择时，新需求要导入全部 */
                if(0==type){
                    if(this.importFormal.firstInventoryCategoryName && this.importFormal.secondInventoryCategoryName){
                        this.importAllCfg.msg = "请确认是否导入["+this.importFormal.secondInventoryCategoryName+"]待导入数据?";
                    }else if(this.importFormal.firstInventoryCategoryName){
                        this.importAllCfg.msg = "请确认是否导入["+this.importFormal.firstInventoryCategoryName+"]待导入数据?";
                    }else{
                        this.importAllCfg.msg = "请确认是否导入全部待导入数据?";
                    }
                    this.importAllCfg.show=true;
                }else{
                    this.deleteAllCfg.show=true;
                }
            }
        },
        importAllData(){
            this.importModCfg.show = true
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
        // 新增信息
        addItem() {
            this.imCfg.show = true
        },
        // 新增批量导入
        addSuccess (param) {
            this.msgCfg.type = 'success';
            this.msgCfg.content = '导入成功';
            this.refresh();
        },
        /* 弹框回调 */
        sure() {
            if (0 == this.isBatch){
                this.delItem();
            }else if(1 == this.isBatch){
                this.delLot();
            }
        },
        /* 数据请求 */
        getList(param) {
            if(this.tabCfg.select=='tab3'){
                this.lastTableParam=param;
                this.$http.post(__URL.dev + 'inventory/findByPage', param).then(
                    (res) => {
                        //添加分析通过属性
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            res.data.data.dataList[i].status=1
                        }
                        this.tableData = res.data.data.dataList;
                        this.boxGroup = [];
                        this.tableTotal=res.data.data.totalCount;
                    }
                )
            }else{
                this.importFormal.firstInventoryCategoryName = param.firstInventoryCategoryName;
                this.importFormal.secondInventoryCategoryName = param.secondInventoryCategoryName;
                this.lastTableParam=param;
                this.$http.post(__URL.osiu + 'import/init/inventory/findList', param).then(
                    (res) => {
                        this.tableData = res.data.data.dataList;
                        this.boxGroup = [];
                        this.tableTotal=res.data.data.totalCount;
                        //新需求不要默认选中
                        // if(res.data.data.dataList.length>0 && res.data.data.dataList[0].status==1){
                        //     this.boxGroup=JSON.parse(JSON.stringify(res.data.data.dataList))
                            
                        // }
                    }
                )
            }
            
        },
        changePage(item){
            if(this.tabCfg.select=='tab3'){
                this.lastTableParam.pageIndex=item.pageIndex;
                this.lastTableParam.pageSize=item.pageSize;
                this.$http.post(__URL.dev + 'inventory/findByPage', this.lastTableParam).then(
                    (res) => {
                        //添加分析通过属性
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            res.data.data.dataList[i].status=1
                        }
                        this.tableData = res.data.data.dataList;
                        this.boxGroup = [];
                    }
                )
            }else{
                this.lastTableParam.pageIndex=item.pageIndex;
                this.lastTableParam.pageSize=item.pageSize;
                this.$http.post(__URL.osiu + 'import/init/inventory/findList', this.lastTableParam).then(
                    (res) => {
                        this.tableData = res.data.data.dataList;
                        this.boxGroup = [];
                        //新需求不要默认选中
                        // this.tableTotal=res.data.data.totalCount;
                        // if(res.data.data.dataList.length>0 && res.data.data.dataList[0].status==1){
                        //     this.boxGroup=JSON.parse(JSON.stringify(res.data.data.dataList))
                            
                        // }
                    }
                )
            }
            
        },
        getItem(id) {
            if(this.tabCfg.select=='tab3'){
                this.$http.get(__URL.dev + 'inventory/get/' + id).then(
                    (res) => {
                        if (res.data.success) {
                            this.itemData = res.data.data
                            this.innerDevCfg.show = true
                        }
                    }
                )
            }else{
                this.$http.get(__URL.osiu + 'import/init/inventory/get/' + id).then(
                    (res) => {
                        this.currentItem = res.data.data;
                        this.innerCfg.show = true
                    }
                )
            }
            
            
        },
        delItem() {
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            if(this.tabCfg.select=='tab3'){
                this.$http.get(__URL.dev + 'inventory/delete/' + this.currentItem.inventoryId).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.type = 'success';
                            this.msgCfg.content = '删除成功！';
                            this.refresh();
                        } else {this.msgCfg.type = 'success';
                            this.msgCfg.type = 'failure'
                            this.msgCfg.content = res.data.errMsg
                        }
                        this.msgCfg.show = true;
                        this.repeatSubmit = false;
                    }
                )
            }else{
                this.$http.get(__URL.osiu + 'import/init/inventory/delete/'+this.currentItem.id).then(
                    (res) => {
                        if(res.data.success){
                            this.msgCfg.type = 'success';
                            this.msgCfg.content = res.data.data;
                            this.refresh();
                        }else {
                            this.msgCfg.type = 'failure'
                            this.msgCfg.content = res.data.errMsg
                        }
                        this.msgCfg.show = true;
                        this.repeatSubmit = false;
                    }
                )
            }
        },
        // 批量删除
        deleteAllData(){
            this.delLot()
        },
        delLot() {
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            let ids 
            if(this.boxGroup.length>0){
                ids=this.boxGroup.map((item)=>{
                    return item.id
                });
            }else{
                ids=[]
            }
            var type;
            if(this.tabCfg.select=='tab1'){
                type=1
            }else if(this.tabCfg.select=='tab2'){
                type=0
            }
            this.$http.post(__URL.osiu + 'import/init/inventory/batchDelete/'+type, ids).then(
                res => {
                    if (res.data.success) {
                        this.msgCfg.type = 'success';
                        this.msgCfg.content = res.data.data;
                        this.refresh();
                    } else {
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg
                    }
                    this.msgCfg.show = true;
                    this.repeatSubmit = false;
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = [];
            this.boxGroup=[];
            this.importFormal={};
            this.getTabNumber();
        },
        importClose(){
            this.importModCfg.show = false;
        },
        importSure(){
            if(this.firstTabNumber==0){
                this.msgCfg.type='warning';
                this.msgCfg.show=true
                this.msgCfg.content='没有可以导入的数据！'
                return
            }
            var industryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            var industryCategoryName = this.firstIndustryCategory.industryCategoryName;
            if("" == industryCategoryCode || "" == industryCategoryName){
                this.msgCfg.type = 'warning';
                this.msgCfg.content = "请选择行业大类";
                this.msgCfg.show = true;
                return;
            }
            this.importFormal.firstIndustryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            this.importFormal.firstIndustryCategoryName = this.firstIndustryCategory.industryCategoryName;

            industryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            industryCategoryName = this.secondIndustryCategory.industryCategoryName;
            if("" == industryCategoryCode || "" == industryCategoryName){
                this.msgCfg.type = 'warning';
                this.msgCfg.content = "请选择行业小类";
                this.msgCfg.show = true;
                return;
            }
            this.importFormal.secondIndustryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            this.importFormal.secondIndustryCategoryName = this.secondIndustryCategory.industryCategoryName;
            let ids 
            if(this.boxGroup.length>0){
                ids=this.boxGroup.map((item)=>{
                    return item.id
                });
            }else{
                ids=[]
            }
            this.importFormal.ids = ids;
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            this.$http.post(__URL.osiu + 'import/init/inventory/formal', this.importFormal).then(
                res => {
                    if (res.data.success) {
                        this.msgCfg.type = 'success';
                        this.msgCfg.content = res.data.data;
                        this.refresh();
                        this.enter=true;
                        this.importClose();
                    } else {
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg
                    }
                    this.msgCfg.show = true;
                    this.repeatSubmit = false;
                }
            )
        },
        checkAllData(){
            var checkStatus=[];
            this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
                res => {
                    if(res.data.success) {
                        checkStatus=res.data.data.steps;
                        if(check(checkStatus)){
                            this.$router.go('/init/initRbac')
                        }else{
                            this.passCfg.show=true;
                        }
                    } else {
                        console.log(res.data.errMsg);
                    }
                }
            )
            function check(arr){
                var flag=true;
                for(let i=0;i<arr.length;i++){
                    if(arr[i].status!=1){
                        flag=false
                    }
                }
                return flag
            }
        },
        closePass(){
            this.passCfg.show=false;
        },
        surePass(){
            this.passCfg.show=false;
            this.$router.go('/init/initRbac')
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            if(this.tabCfg.select=='tab3'){
                return cfg.tableCfg2
            }else{
                return cfg.tableCfg1
            }
        },
        tabCfg(){
            this.importFormal.firstInventoryCategoryName = '';
            this.importFormal.secondInventoryCategoryName = '';
            this.getTabNumber()
            return cfg.leftItemCfg.tabCfg;
        }
    }
}




</script>
<template>
    <container v-if="isInited == false">
        <alert :config='deleteAllCfg' @cb='deleteAllData'></alert>
        <alert :config='importAllCfg' @cb='importAllData'></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addItem'></new-app>
            </div>
            <div class="right_item have_footer">
                <div class="item_head btn-ic">
                    <a href="javascript:;" @click='inImport(0)' v-if="tabCfg.select == currentSelect">
                        <i class='icon-hr_files__import'></i>正式导入
                    </a>
                    <a href="javascript:;" @click='inImport(1)' v-if="tabCfg.select != 'tab3'">
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :checkbox.sync='boxGroup' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
                <div class="item_footer">
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                    <button v-if='enter' class="btn-xl-imp" @click="checkAllData">下一步</button>
                </div>
            </div>
        </div>

        <modal :config='importModCfg' @sure='importSure' @close='importClose'>
            <div class='form-group'>
                <label><span class="must-point">*</span>行业大类:</label>
                <select v-model='firstIndustryCategory'
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
        <modal :config='passCfg' @surepass='surePass' @closepass='closePass'>
            <p style='padding:30px;'>
                前边的导入步骤中还有未导入系统的数据,建议将期初数据导入完整再继续操作。
            </p>
        </modal>
        </alert>
        <inner :config.sync='innerDevCfg'>
            <item-dev :edit='2' :data='itemData' :type="1" @cb='refreshDev'></item-dev>
        </inner>
        <item :config='innerCfg' :data='currentItem'></item>
        <!-- 导入模块 -->
        <vimport :config='imCfg' @cb='addSuccess'></vimport>
        <!-- 弹框 -->
        <alert :config='alertCfg' @cb='sure'></alert>
        <warning :config='msgCfg'></warning>
    </container>
    <inited-page v-if="isInited == true"></inited-page>

</template>
<style lang='less' scoped>
    .item_head a {
        width: auto !important;
    }
</style>
