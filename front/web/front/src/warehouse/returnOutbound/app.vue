<script>



import cfg from './cfg.js'

import newReturnOutbound from './newReturnOutbound'
import viewReturnOutbound from './viewReturnOutbound'

export default {
    components: {
        newReturnOutbound,
        viewReturnOutbound
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            newConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '退货通知单'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '退货通知单'
            },
            warnConfig: {
                show: false,
                type: 'success',
                content: '退货成功'
            },
            detailDate:{},
            listObj: cfg.listParam,
            tableData: [],
            checkedData: [],
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
            switch (type) {
                case 'return':
                    this.$http.post(__URL.warehouse + 'return/inbound/update/status', item).then((res) => {
                        if(!res.data.success) {
                            this.warnConfig.show = true;
                            this.warnConfig.type = 'warning';
                            this.warnConfig.content = res.data.errMsg;
                        } else {
                            this.warnConfig.show = true;
                            this.warnConfig.type = 'success';
                            this.warnConfig.content = '退货成功';
                            this.refresh();
                        }
                    });
                    break;
            }
        },
        href(item, type) {
             this.selectedData = item;
             if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                 this.$http.get(__URL.warehouse + 'return/outbound/query/one/'+ item.docNo+'/'+item.warehouseCode).then((res) => {
                     if(!res.data.success) {
                         this.warnConfig.show = true;
                         this.warnConfig.type = 'warning';
                         this.warnConfig.content = res.data.errMsg;
                     }else{

                         this.detailDate = res.data.data
                     }
                     this.newConfig.show = true;
                 })
             } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                 this.$http.get(__URL.warehouse + 'return/outbound/query/one/returned/'+ item.srcDocNo+'/'+item.warehouseCode).then((res) => {
                     if(!res.data.success) {
                         this.warnConfig.show = true;
                         this.warnConfig.type = 'warning';
                         this.warnConfig.content = res.data.errMsg;
                     }else{
                         this.detailDate = res.data.data
                     }
                     this.viewConfig.show = true;
                 })
             }
        },
        getFilter(item, obj) {
            if(obj && obj.customerCode) {
                item.customerCode = obj.customerCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.warehouse + 'wait/return/outbound/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.sale + 'salesSuspenseInbound/findList';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'return/outbound/query/list';
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
                _this.newConfig.show = false;
                _this.viewConfig.show = false;
                _this.warnConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
            }, 1000);
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
            var myCfg = cfg.waitReturnOutboundTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitReturnOutboundTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.returnOutboundTableCfg;
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

    <!-- 新增退收内页-->
    <inner :config='newConfig'>
        <new-return-outbound @refresh='refresh' :datalist="detailDate" @close="newConfig.show = false;"></new-return-outbound>
    </inner>

    <!-- 查看入库内页-->
    <inner :config='viewConfig'>
        <view-return-outbound :docno.sync="selectedData.docNo"  :datalist="detailDate" @close="viewConfig.show = false;"></view-return-outbound>
    </inner>

    <warning :config="warnConfig"></warning>
</template>

