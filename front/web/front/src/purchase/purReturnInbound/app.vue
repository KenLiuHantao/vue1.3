<script>



import cfg from './cfg.js'

import viewReturnInbound from '../../warehouse/returnInbound/viewReturnInbound'

export default {
    components: {
        viewReturnInbound
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            checkedData: [],
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '退货单'
            },
            selectedData: null
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                'startDocDate': '',
                'endDocDate': '',
                'supplierCode': obj.supplierCode ? obj.supplierCode : '',
                'supplierName': obj.supplierName ? obj.supplierName : '',
                'salesOrderDocNo': '',
                'customerDocNo': '',
                'inventoryCode': '',
                'inventoryName': '',
                'inventorySpec': ''
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {

        },
        href(item, type) {
            this.selectedData = item;
            this.viewConfig.show = true;
        },
        getFilter(item, obj) {
            if(obj && obj.supplierCode) {
                item.supplierCode = obj.supplierCode;
            }
            if(obj && obj.date) {
                item.date = obj.date;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.warehouse + 'wait/return/inbound/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'wait/return/inbound/query/list';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'return/inbound/query/list';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        openAdd() {
            this.newConfig.show = true;
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.viewConfig.show = false;
                _this.warnConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
            }, 1500);
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
            this.tableData = [];
            var myCfg = cfg.waitReturnInboundTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitReturnInboundTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.returnInboundTableCfg;
                    break;
            }
            return myCfg;
        },
        tableParams() {
            let param = {
                'entCode': '',
                'params': {
                    'pageIndex': 0,
                    'pageSize': 0,
                    'docNo': '',
                    'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                    'startDocDate': '',
                    'endDocDate': '',
                    'purchaseDocNo': '',
                    'startPurchaseDocDate': '',
                    'endPurchaseDocDate': '',
                    'supplierCode': this.listObj.supplierCode,
                    'supplierName': this.listObj.supplierName,
                    'salesOrderDocNo': '',
                    'customerDocNo': '',
                    'inventoryCode': '',
                    'inventoryName': '',
                    'inventorySpec': ''
                },
                'userCode': ''
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openAdd"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>


    <!-- 查看入库内页-->
    <inner :config='viewConfig'>
        <view-return-inbound show-btn="0" :select-data="selectedData" @close="viewConfig.show = false;"></view-return-inbound>
    </inner>

</template>

