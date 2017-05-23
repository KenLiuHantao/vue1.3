<script>
import cfg from './cfg.js'
import item from './item'
export default {
    components: {
        item,
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
            imCfg: {
                show: false,
                title: '货品档案导入',
                url: __URL.osiu + 'import/inventory',
                tmpUrl: __URL.osiu + 'download/inventory',
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
                header: '导入货品档案',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确认导入',
                    emit: 'sure',
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
            }
        }
    },
    ready(){
        this.$http.get(__URL.arc + 'industry/category/first').then(
            (res) => {
                if(res.data.success){
                    this.industryFirst=res.data.data
                }
            }
        );
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
                this.getItem(item.id);
            } else {
                this.alertCfg.msg = '确定要删除该行记录吗？';
                this.alertCfg.show = true;
                this.isBatch = 0;
            }
        },
        href(item, type) {
            this.currentItem = Object.assign({}, item);
            this.getItem(this.currentItem.id);
        },
        getFilter(param, obj) {
            param.secondInventoryCategoryName = undefined != obj && undefined != obj.secondInventoryCategoryName ? obj.secondInventoryCategoryName : "";
            this.getList(param)
        },
        // 刷新重置
        refresh() {
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
            this.importFormal.firstInventoryCategoryName = param.firstInventoryCategoryName;
            this.importFormal.secondInventoryCategoryName = param.secondInventoryCategoryName;
            this.lastTableParam=param;
            this.$http.post(__URL.osiu + 'import/inventory/findList', param).then(
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
        },
        changePage(item){
            this.lastTableParam.pageIndex=item.pageIndex;
            this.lastTableParam.pageSize=item.pageSize;
            this.$http.post(__URL.osiu + 'import/inventory/findList', this.lastTableParam).then(
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
        },
        getItem(id) {
            this.$http.get(__URL.osiu + 'import/inventory/get/' + id).then(
                (res) => {
                    this.currentItem = res.data.data;
                    this.innerCfg.show = true
                }
            )
        },
        delItem() {
            if (this.repeatSubmit)return;
            this.repeatSubmit = true;
            this.$http.get(__URL.osiu + 'import/inventory/delete/'+this.currentItem.id).then(
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
            this.$http.post(__URL.osiu + 'import/inventory/batchDelete/'+type, ids).then(
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
        },
        importClose(){
            this.importModCfg.show = false;
        },
        importSure(){
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
        tabCfg(){
            this.importFormal.firstInventoryCategoryName = '';
            this.importFormal.secondInventoryCategoryName = '';
            return cfg.leftItemCfg.tabCfg;
        }
    }
}
</script>
<template>
    <container>
        <alert  :config='deleteAllCfg'  @cb='deleteAllData'></alert>
        <alert  :config='importAllCfg'  @cb='importAllData'></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addItem'></new-app>
            </div>
            <div :class="{'have_footer': tableTotal > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" @click='inImport(0)' v-if="tabCfg.select == currentSelect">
                        <i class='icon-hr_files__import'></i>正式导入
                    </a>
                    <a href="javascript:;" @click='inImport(1)'>
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :checkbox.sync='boxGroup' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
                <div v-if="tableTotal > pageCfg.pageSize" class="item_footer">
                    <pagination  :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                </div>
            </div>
        </div>
    </container>

    <modal :config='importModCfg' @sure='importSure' @close='importClose'>
        <p class='tip-msg'>即将正式导入货品档案...</p>
        <!-- <div class='form-group'>
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
        </div> -->
    </modal>

    <item :config='innerCfg' :data='currentItem'></item>
    <!-- 导入模块 -->
    <vimport :config='imCfg' @cb='addSuccess'></vimport>
    <!-- 弹框 -->
    <alert :config='alertCfg' @cb='sure'></alert>
    <warning :config='msgCfg'></warning>
</template>
<style lang='less' scoped>
    .item_head a {
        width: auto !important;
    }
    .tip-msg{
        line-height: 80px;
        margin: 0 auto;
        text-align:center;
    }
</style>
