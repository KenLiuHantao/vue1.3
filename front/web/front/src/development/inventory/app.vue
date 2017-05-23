<script>
import item from './item'
import cfg from './cfg.js'

export default {
    components: {
        item
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: {},
            listCfg: cfg.leftItemCfg.listCfg,
            tableData: [],
            boxGroup: [],
            importCfg: cfg.importCfg,
            innerCfg: {
                show: false,
                title: '新增'
            },
            itemEdit: 0,
            itemData: {},
            repeatSubmit: false,
            currentItem: {},
            industryFirst:[],
            industrySec:[],
            importFormal:{},
            firstIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            secondIndustryCategory:{
                "industryCategoryCode":"",
                "industryCategoryName":""
            },
            msgCfg: {
                show: false,
                content: '',
                type: 'success'
            },
            importAllCfg:{
                show:false,
                msg:'请确认是否导入全部待导入数据?',
                subMsg:'',
                type:'warning',
                quite:true
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
            deleteAllCfg:{
                show:false,
                msg:'请确认是否删除全部数据?',
                subMsg:'',
                type:'warning',
                quite:true
            },
            alertCfg: {
                show: false,
                type: 'failure',
                sAutoClose: false,
                msg: '确定删除此货品？删除后不可找回！'
            },
            type:'page',
            firstTabNumber:''
        }
    },
    ready(){
        this.$http.get(__URL.arc + 'industry/category/first').then(
            (res) => {
                if (res.data.success) {
                    this.industryFirst = res.data.data
                }
            }
        )
    },
    methods: {
        // 正式导入
        inImport(type) {
            if (this.boxGroup.length) {
                if(0 == type){
                    // this.importModCfg.show=true;
                    this.importSure()
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
            // this.importModCfg.show = true
            this.importSure()
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
            // var industryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            // var industryCategoryName = this.firstIndustryCategory.industryCategoryName;
            // if("" == industryCategoryCode || "" == industryCategoryName){
            //     this.msgCfg.type = 'warning';
            //     this.msgCfg.content = "请选择行业大类";
            //     this.msgCfg.show = true;
            //     return;
            // }
            // this.importFormal.firstIndustryCategoryCode = this.firstIndustryCategory.industryCategoryCode;
            // this.importFormal.firstIndustryCategoryName = this.firstIndustryCategory.industryCategoryName;

            // industryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            // industryCategoryName = this.secondIndustryCategory.industryCategoryName;
            // if("" == industryCategoryCode || "" == industryCategoryName){
            //     this.msgCfg.type = 'warning';
            //     this.msgCfg.content = "请选择行业小类";
            //     this.msgCfg.show = true;
            //     return;
            // }
            // this.importFormal.secondIndustryCategoryCode = this.secondIndustryCategory.industryCategoryCode;
            // this.importFormal.secondIndustryCategoryName = this.secondIndustryCategory.industryCategoryName;
            let ids
            if(this.boxGroup.length>0){
                ids=this.boxGroup.map((item)=>{
                    return item.id
                });
            }else{
                ids=[]
            }
            this.importFormal.ids = ids;
            if(this.importFormal.secondInventoryCategoryName=='(无二级分类)'){
                this.importFormal.secondInventoryCategoryName=''
            }
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            this.$http.post(__URL.osiu + 'import/inventory/formal', this.importFormal).then(
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
        /* 弹框回调 */
        sure() {
            if (0 == this.isBatch){
                this.delItem();
            }else if(1 == this.isBatch){
                this.delLot();
            }
        },
        delItem() {
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            if(this.tab=='tab3'){
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
            if(this.tab=='tab1'){
                type=1
            }else if(this.tab=='tab2'){
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
        /* 公用方法 */
        warnMod(bol, ctx, type) {
            type ? this.msgCfg.type = type : this.msgCfg.type = 'success'
            this.msgCfg.content = ctx
            this.msgCfg.show = bol
        },
        refresh(text) {
            if(text){
                this.msgCfg.type = 'success';
                this.msgCfg.content = text;
                this.msgCfg.show = true;
            }
            this.innerCfg.show = false
            this.reset()
        },
        reset() {
            this.$broadcast('_RESETLIST')
            this.tableData = []
        },
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "attributeCode": obj.attributeCode,
                "firstInventoryCategoryCode": obj.firstInventoryCategoryCode,
                "firstInventoryCategoryName": obj.firstInventoryCategoryName,
                "secondInventoryCategoryCode": obj.secondInventoryCategoryCode,
                "secondInventoryCategoryName": obj.secondInventoryCategoryName,
                "inventoryCode": obj.inventoryCode,
                "inventoryName": obj.inventoryName,
                "inventorySpec": obj.inventorySpec,
                "keyword": obj.keyword,
                "pageIndex": 0,
                "pageSize": 0,
                "tabIndex": obj.tabIndex
            }
            return init
        },
        /* 弹框操作 */
        addlist(index,item){
            if(index==0){
                this.itemEdit = 0
                this.innerCfg.title='新增货品档案'
                this.innerCfg.show = true
            }else if(index==1){
                this.importCfg.show = true
            }
        },
        // table返回的操作参数
        href(item, type) {
            if(this.tab != 'tab3'){
                this.itemEdit = 2;
            } else if(this.tab == 'tab3'){
                this.itemEdit = 1
            }
            var id = Boolean(item.inventoryId)?item.inventoryId:item.id;
            this.getItemInfo(id);
        },
        getFilter(item, obj) {
            this.listObj = this.initListObj(item);
            if (Boolean(obj)) {
                this.listObj.secondInventoryCategoryName = obj.secondInventoryCategoryName ? obj.secondInventoryCategoryName : '';
                this.listObj.secondInventoryCategoryCode = obj.secondInventoryCategoryCode ? obj.secondInventoryCategoryCode : '';
            }
            this.getList(item.tabIndex)
        },
        operate(type, item) {
            this.currentItem = Object.assign({}, item)
            if ('edit' == type) {
                console.log(item);
                var id = Boolean(item.inventoryId)?item.inventoryId:item.id;
                this.getItemInfo(id);
                this.itemEdit = 2
            }
        },
        /* 数据请求 */
        getList() {
            if(this.tab != 'tab3'){
                this.importFormal.firstInventoryCategoryName = this.tableParams.firstInventoryCategoryName;
                this.importFormal.secondInventoryCategoryName = this.tableParams.secondInventoryCategoryName;
                this.$http.post(__URL.osiu + 'import/inventory/findList', this.tableParams).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                        this.firstTabNumber = res.data.data.totalCount;
                        this.boxGroup = [];
                    }
                )
            } else if(this.tab == 'tab3'){
                this.$http.post(__URL.dev + 'inventory/findByPage', this.tableParams).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                        this.boxGroup = [];
                    }
                )
            }
        },
        getItemInfo(uid) {
            if(this.tab != 'tab3'){
                this.$http.get(__URL.osiu + 'import/inventory/get/' + uid).then(
                    (res) => {
                        if (res.data.success) {
                            this.itemData = res.data.data
                            this.innerCfg.title='货品档案'
                            this.innerCfg.show = true
                        }
                    }
                )
            } else if(this.tab == 'tab3'){
                this.$http.get(__URL.dev + 'inventory/get/' + uid).then(
                    (res) => {
                        if (res.data.success) {
                            this.itemData = res.data.data
                            this.innerCfg.title='货品档案'
                            this.innerCfg.show = true
                        }
                    }
                )
            }
        },
        clearTable(uid,obj){
            this.tableData = [];
            this.boxGroup = [];
            this.importFormal={};
            /*if(this.leftItemCfg.tabCfg.select == 'tab2'){
                this.listCfg.hasChild = false;
                this.type = 1;
            }else if(this.leftItemCfg.tabCfg.select == 'tab3'){
                this.type = 2;
                this.listCfg.hasChild = true;
            }else{
                this.type = 1;
                this.listCfg.hasChild = true;
            }*/
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            this.importFormal.firstInventoryCategoryName = '';
            this.importFormal.secondInventoryCategoryName = '';
            if(this.tab == 'tab3'){
                return cfg.tableCfg1
            } else {
                return cfg.tableCfg2
            }
        },
        tab(){
            return cfg.leftItemCfg.tabCfg.select
        },
        tableParams() {
            let obj = this.listObj
            let param = {
                "attributeCode": obj.attributeCode?obj.attributeCode:'',
                "firstInventoryCategoryCode": obj.firstInventoryCategoryCode?obj.firstInventoryCategoryCode:'',
                "firstInventoryCategoryName": obj.firstInventoryCategoryName?obj.firstInventoryCategoryName:'',
                "secondInventoryCategoryCode": obj.secondInventoryCategoryCode?obj.secondInventoryCategoryCode:'',
                "secondInventoryCategoryName": obj.secondInventoryCategoryName?obj.secondInventoryCategoryName:'',
                "inventoryCode": obj.inventoryCode?obj.inventoryCode:'',
                "inventoryName": obj.inventoryName?obj.inventoryName:'',
                "inventorySpec": obj.inventorySpec?obj.inventorySpec:'',
                "keyword": obj.keyword?obj.keyword:'',
                "pageIndex": 0,
                "pageSize": 0,
                "tabIndex": obj.tabIndex?obj.tabIndex:0
            }
            return param;
        }
    },
    watch:{
        leftItemCfg: {
            handler(val, oldVal) {
                this.tableData = new Array
                this.boxGroup = new Array
            },
            deep: true
        }
    }
}


</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getFilter' @tab='clearTable' @add='add' @addlist='addlist' @filtcb='reset'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" @click='inImport(0)' v-if="tab == 'tab1'">
                        <i class='icon-hr_files__import'></i>正式导入
                    </a>
                    <a href="javascript:;" @click='inImport(1)' v-if="tab != 'tab3'">
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                    <!-- <a @click='import' href="javascript:;">
                        <i class='icon-in'></i>导入
                    </a> -->
                    <!-- <a @click='import' href="javascript:;">
                        <i class='icon-in'></i>导入
                    </a>
                    <a href="javascript:;">
                        <i class='icon-out'></i>导出
                    </a> -->
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='boxGroup' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <!-- 新需求先干掉 5.15 -->
    <!-- <modal :config='importModCfg' @sure='importSure' @close='importClose'>
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
    </modal> -->
    <alert :config='deleteAllCfg' @cb='deleteAllData'></alert>
    <alert :config='importAllCfg' @cb='importAllData'></alert>
    <vimport :config.sync='importCfg'></vimport>
    <!-- 新增修改弹框选项 -->
    <inner :config.sync='innerCfg'>
        <item :tab="tab" :edit='itemEdit' :data='itemData' :type="type" @cb='refresh'></item>
    </inner>
    <!-- 弹框 -->
    <alert :config='alertCfg' @cb='sure'></alert>
    <warning :config='msgCfg'></warning>
</template>
