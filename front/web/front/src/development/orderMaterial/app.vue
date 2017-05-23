<script>



import cfg from './cfg.js'
import bomDetail from './bomDetail.vue'

export default {
    components: {
        bomDetail
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            detailConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'订单BOM详情'
            },
            bomDetail:{},
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            type:1
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
            console.log('app', type)
        },
        href(item, type) {
            if(type=='docNo'){
                if(item.bomDocNo.length>0){
                    this.$http.get(__URL.dev+'order/bom/get/'+item.bomDocNo,{}).then(
                        (res) =>{
                            if(res.data.success){
                                this.bomDetail=res.data.data;
                                if(cfg.leftItemCfg.tabCfg.select=='tab1' || cfg.leftItemCfg.tabCfg.select=='tab2'){
                                    this.type=2
                                }else if(cfg.leftItemCfg.tabCfg.select=='tab3' || cfg.leftItemCfg.tabCfg.select=='tab4'){
                                    this.type=1
                                }
                                if(this.bomDetail.processVo){
                                    this.bomDetail.processVo.manuQuantity=this.bomDetail.manuQuantity;
                                }
                                this.detailConfig.show=true;
                            }else{
                                this.msgconfig.show=true;
                                this.msgconfig.content=res.data.errMsg;
                                // this.detailConfig.show=true;
                            }
                        }
                    )
                }else{
                    this.$http.get(__URL.dev+'order/bom/get/header/'+item.recordId + '/10',{}).then(
                        (res) =>{
                            if(res.data.success){
                                this.bomDetail=res.data.data;
                                if(cfg.leftItemCfg.tabCfg.select=='tab1' || cfg.leftItemCfg.tabCfg.select=='tab2'){
                                    this.type=2
                                }else if(cfg.leftItemCfg.tabCfg.select=='tab3' || cfg.leftItemCfg.tabCfg.select=='tab4'){
                                    this.type=1
                                }
                                if(this.bomDetail.processVo){
                                    this.bomDetail.processVo.manuQuantity=this.bomDetail.manuQuantity;
                                }
                                this.detailConfig.show=true;
                            }else{
                                this.msgconfig.show=true;
                                this.msgconfig.content=res.data.errMsg;
                            }
                        }
                    )
                }
                
            }
        },
        getFilter(item,obj) {
            if(item && obj){
                item.customerCode=obj.customerCode;
                item.customerName=obj.customerName;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            //根据不同的tab请求不同的地址
            var url=''
            switch (cfg.leftItemCfg.tabCfg.select) {
                case 'tab1': url='salesOrderBom/findWaitOperatorList'
                             break;
                case 'tab2': url='salesOrderBom/findTempStorageList'
                             break;
                case 'tab3': url='salesOrderBom/findUnauditList'
                             break;
                case 'tab4': url='salesOrderBom/findDoneAuditList'
                             break;
                default : url=''
            }
            this.$http.post(__URL.sale + url, obj).then(
                (res) => {
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                    }else{
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }                    
                }
            )
        },
        closeBomDetail(text){
            this.detailConfig.show=false;
            this.refresh(text)
        },
        //刷新外页
        refresh(text){
            // this.tableData=[];
            // this.getList()
            if(text){
                this.dCfg.msg=text;
                this.dCfg.show=true;
            }
            this.$broadcast('_RESETLIST')
            this.tableData=[]
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            return cfg.tableCfg
        }
    }
}

</script>
<template>
    <container>
        <alert :config="dCfg"></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
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
    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <bom-detail :bomdetail='bomDetail' :type='type' @refresh='closeBomDetail' :show='detailConfig'></bom-detail>
    </inner>
    <warning :config="msgconfig"></warning>
</template>
