<script>

import cfg from './cfg.js'
import orderDetail from './orderDetail'

export default {
    components: {
        orderDetail
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            // 货品编码
            detailConfig: {
                show: false,
                title: '生产订单'
            },
            tableShow: false,
            status:0,
            recordId:"",
        }
    },
    watch: {

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
        href(item, type) {
            if(type == 'demandDocNo'){
               this.recordId =  item.recordId;
               this.detailConfig.show = true;
            }
        },
        getFilter(item, obj) {
            if (obj !== undefined) {
                item.changeType = obj.changeType;
            }
            this.getList(item)
        },
        close() {
            this.innerCfg.show = false
        },
        /* 数据请求 */
        getList(obj) {
            this.$http.post(__URL.manufacture + 'change/deal/list', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = []
        },
        closeOrderDetail(){
            this.detailConfig.show = false;
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
         if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
            this.status = 0
           return cfg.tableCfg
         }
          if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
            this.status = 1
           return cfg.tableCfg2
         }
        },
        tableParams() {
            let param = {
                "entCode": "",
                "params": {
                    "docDate": this.listObj.docDate,
                    "pageIndex": 0,
                    "pageSize": 50,
                    "status": 0,
                    "changeType": this.listObj.changeType
                },
                "userCode": ""
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
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <inner :config='detailConfig'>
        <order-detail :record-id='recordId' :status='status' @refresh='closeOrderDetail'></order-detail>
    </inner>


</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/referCommon.less';

</style>