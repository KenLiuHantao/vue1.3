<script>
    import cfg from './cfg'
    import notCooparete from './notCooperate'
    import cooperating from './cooperating'
    import freezed from './freezed'
    import suspend from './suspend'
    export default {
        components: {
            cfg,
            notCooparete,
            cooperating,
            freezed,
            suspend,
        },
        ready() {
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            tableData: [],
            radioObj: {},
            detailConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'供应商档案'
            },
            notCooperateConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'供应商档案'
            },
            cooperatingConfig:{
                show:false,
                width:'100%',
                    height:'100%',
                    title:'供应商档案'
            },
            freezedConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'供应商档案'
            },
            suspendConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'供应商档案'
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
            let init = {
                "supplierCategoryCode": item.supplierCategoryCode?item.supplierCategoryCode:'',
                "supplierName": item.supplierName?item.supplierName:'',
                "employeeCode": item.employeeCode?item.employeeCode:'',
                "employeeName": item.employeeName?item.employeeName:'',
                "firstIndustryCategoryCode":item.firstIndustryCategoryCode?item.firstIndustryCategoryCode:'',
                "supplierStatus":'',
                "keyWord": item.keyWord?item.keyWord:'',
                "pageIndex": 1,
                "pageSize": this.pageCfg.pageSize
            }
            return init
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
                        if(this.tabIndex == 'tab1'){

                            this.notCooperateConfig.show=true;
                        }
                        if(this.tabIndex == 'tab2'){
                            this.cooperatingConfig.show = true;
                        }
                        if(this.tabIndex == 'tab3'){
                            this.freezedConfig.show = true;
                        }
                        if(this.tabIndex == 'tab4'){
                            this.suspendConfig.show=true;
                        }

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
            if(this.tabIndex == 'tab1'){
                this.listObj.supplierStatus = 'A'
            }
            if(this.tabIndex == 'tab2'){
                this.listObj.supplierStatus = 'B'
            }
            if(this.tabIndex == 'tab3'){
                this.listObj.supplierStatus = 'C'
            }
            if(this.tabIndex == 'tab4'){
                this.listObj.supplierStatus = 'D'
            }

            this.getList()
        },
        /* 数据请求 */
        getList() {
            this.getData();
        },
        getData(){
            this.$http.post(__URL.arc + 'supplier/supplierList', this.tableParams).then(
                    (res) => {
                this.tableData = res.data.data.dataList;
                this.total= res.data.data.totalCount;
            }
        )
        },
        //关闭详情页面
        closeNotCooparete(text){
            this.notCooperateConfig.show=false;
            this.refresh(text)
        },
        //关闭详情页面
        closeCooperating(text){
            this.cooperatingConfig.show=false;
            this.refresh(text)
        },
        //关闭详情页面
        closeFreezed(text){
            this.freezedConfig.show=false;
            this.refresh(text)
        },
        //关闭详情页面
        closeSuspend(text){
            this.suspendConfig.show=false;
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
        inputcb(val){
            if(val.ok==true){
                this.$warning({type: 'success', message: '导入成功'})
            }
        },
        clearTable(uid,obj){
            this.tabIndex = uid;
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
        tabIndex(){
            return cfg.leftItemCfg.tabCfg.select
        },
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
                "firstIndustryCategoryCode":this.listObj.firstIndustryCategoryCode,
                "supplierStatus":this.listObj.supplierStatus,
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
            </div>
            <div :class="{'have_footer': total > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">
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

    <!-- 未合作内页-->
    <inner :config='notCooperateConfig'>
        <not-cooparete :detail='supplierdetail' @refresh='closeNotCooparete'></not-cooparete>
    </inner>
    <!-- 合作中内页-->
    <inner :config='cooperatingConfig'>
        <cooperating :detail='supplierdetail' @refresh='closeCooperating'></cooperating>
    </inner>
    <!-- 冻结中内页-->
    <inner :config='freezedConfig'>
        <freezed :detail='supplierdetail' @refresh='closeFreezed'></freezed>
    </inner>
    <!-- 已终止内页-->
    <inner :config='suspendConfig'>
        <suspend :detail='supplierdetail' @refresh='closeSuspend'></suspend>
    </inner>
    <vimport :config="importCfg" @cb="inputcb"></vimport>
    <warning :config="msgconfig" ></warning>
</template>
