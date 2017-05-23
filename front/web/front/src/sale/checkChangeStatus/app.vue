<script>
import cfg from './cfg.js'
import saleDetail from './saleDetail.vue'
export default {
    components: {
        saleDetail
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            tableData: [],
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
            detailConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '新建客户对账单'
            }
        }
    },
    methods: {
        href(item, type) {
            
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
            // this.$http.post(__URL.sale + url, obj).then(
            //     (res) => {
            //         if(res.data.success){
            //             this.tableData = res.data.data.dataList
            //         }else{
            //             this.msgconfig.show=true;
            //             this.msgconfig.content=res.data.errMsg;
            //         }                    
            //     }
            // )
        },
        //刷新外页
        refresh(text){
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
    <warning :config="msgconfig"></warning>
    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <sale-detail ></sale-detail>
    </inner>
</template>
