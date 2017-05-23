<script>
import cfg from './cfg.js'
import newSupplier from './newSupplier'
import supplierDetail from './supplierDetail'
export default {
    components: {
        newSupplier,
        supplierDetail,
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            tableData: [],
            radioObj: {},
            addConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '新增供应商档案',
            },
            detailConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'供应商档案详情'
            },
            supplierdetail:{},
            importCfg:{
                show:false,
                title:'供应商档案',
                url:__URL.arc +'supplier/upload',
                tmpUrl:__URL.arc+'supplier/download',
            },
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            total:0,
            pageCfg:{
              'pageSize': 50,
              'pageIndexName': 'pageIndex',
              'pageSizeName': 'pageSize',
              'jump':true
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
        initListObj(item,obj) {
            if(cfg.leftItemCfg.tabCfg.select=='tab1'){
                if(obj){
                    let init = {
                        "supplierCategoryCode": item.supplierCategoryCode?item.supplierCategoryCode:'',
                        "supplierName": item.supplierName?item.supplierName:'',
                        "employeeCode": obj.employeeCode?obj.employeeCode:'',
                        "employeeName": obj.employeeName?obj.employeeName:'',
                        "keyWord": item.keyWord?item.keyWord:'',
                        "pageIndex": 1,
                        "pageSize": this.pageCfg.pageSize
                    }
                    return init
                }else{
                    let init = {
                        "supplierCategoryCode": item.supplierCategoryCode?item.supplierCategoryCode:'',
                        "supplierName": item.supplierName?item.supplierName:'',
                        "employeeCode": item.employeeCode?item.employeeCode:'',
                        "employeeName": item.employeeName?item.employeeName:'',
                        "keyWord": item.keyWord?item.keyWord:'',
                        "pageIndex": 1,
                        "pageSize": this.pageCfg.pageSize
                    }
                    return init
                }
                
            }else if(cfg.leftItemCfg.tabCfg.select=='tab2'){
                if(obj){
                    let init = {
                        "supplierCategoryCode": obj.supplierCategoryCode?obj.supplierCategoryCode:'',
                        "supplierName": item.supplierName?item.supplierName:'',
                        "employeeCode": item.employeeCode?item.employeeCode:'',
                        "employeeName": item.employeeName?item.employeeName:'',
                        "keyWord": item.keyWord?item.keyWord:'',
                        "pageIndex": 1,
                        "pageSize": this.pageCfg.pageSize
                    }
                    return init
                }else{
                    let init = {
                        "supplierCategoryCode": item.supplierCategoryCode?item.supplierCategoryCode:'',
                        "supplierName": item.supplierName?item.supplierName:'',
                        "employeeCode": item.employeeCode?item.employeeCode:'',
                        "employeeName": item.employeeName?item.employeeName:'',
                        "keyWord": item.keyWord?item.keyWord:'',
                        "pageIndex": 1,
                        "pageSize": this.pageCfg.pageSize
                    }
                    return init
                }
                
            }
        },
        // table返回的操作参数
        operate(type, item) {
        },
        href(item, type) {
            if(type=='supplierName'){
                this.$http.get(__URL.arc+'supplier/detail/'+item.supplierCode).then(
                    (res) => {
                        if(res.data.success){
                            this.supplierdetail=res.data.data;
                            this.detailConfig.show=true;
                        }else{
                            this.msgconfig.show=true;
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        getFilter(item,obj) {
            this.listObj = this.initListObj(item,obj)
            this.getList()
        },
        /* 数据请求 */
        getList() {
            this.getData();
        },
        getData(){
            this.$http.post(__URL.arc + 'supplier/list', this.tableParams).then(
                (res) => {
                    this.tableData = res.data.data.dataList;
                    this.total= res.data.data.totalCount;
                }
            )
        },
        //新增按钮事件
        addNew(){
            this.addConfig.show=true;
        },
        //关闭新增页面
        closeNewSupplier(text){
            this.addConfig.show=false;
            this.refresh(text)
        },
        //关闭详情页面
        closeSupplierDetail(text){
            this.detailConfig.show=false;
            this.refresh(text)
        },
        //刷新外页
        refresh(text){
            // this.tableData=[];
            // this.getList()
            if(text){
                this.$warning({type: 'success', message: text})
            }
            this.$broadcast('_RESETLIST')
            this.tableData=[]
        },
        //导入导出
        inputData(){
            this.importCfg.show=true
        },
        outputData(){
            if(this.listObj){
                this.$exportData(__URL.arc + 'supplier/download/list',this.tableParams)
            }
        },
        inputcb(val){
            if(val.ok==true){
                this.$warning({type: 'success', message: '导入成功'})
            }
        },
        clearTable(uid,obj){
            this.total = 0;
            this.tableData = []
        },
        showCb(item){
            this.tableParams.pageIndex = item.pageIndex;
            this.getData();
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
                "employeeCode": this.listObj.employeeCode,
                "employeeName": this.listObj.employeeName,
                "keyWord": this.listObj.keyWord,
                "supplierCategoryCode": this.listObj.supplierCategoryCode,
                "supplierName": this.listObj.supplierName,
                "pageIndex": 1,
                "pageSize": this.pageCfg.pageSize
            }

            return param
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew' ></new-app>
            </div>
            <div :class="{'have_footer': total > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">
                    <!--<a @click='inputData' href="javascript:;">
                        <i class='icon-in'></i>导入
                    </a>
                    <a @click='outputData' href="javascript:;">
                        <i class='icon-out'></i>导出
                    </a>-->
                </div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>

                    </vtable>

                </div>
                <div v-if="total > pageCfg.pageSize" class="item_footer">
                    <pagination :total='total' :config='pageCfg' @cb='showCb'></pagination>
                </div>
            </div>
        </div>

    </container>
    <!-- 新增内页-->
    <inner :config='addConfig'>
        <new-supplier @refresh='closeNewSupplier'></new-supplier>
    </inner>
    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <supplier-detail :detail='supplierdetail' @refresh='closeSupplierDetail'></supplier-detail>
    </inner>
    <vimport :config="importCfg" @cb="inputcb"></vimport>
    <warning :config="msgconfig" ></warning>
</template>
