<script>
import cfg from './cfg.js'

import viewReturnReceive from '../../warehouse/returnReceive/viewReturnReceive'
import viewQualityCheck from './viewQualityCheck'

export default {
    components: {
        viewReturnReceive,
        viewQualityCheck
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '采购退收单'
            },
            viewQualityCheckConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '品质检验单'
            },
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
                'purchaseDocNo': '',
                'startPurchaseDocDate': '',
                'endPurchaseDocDate': '',
                'purchaseEmployeeCode': '',
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
            if(type == 'detail') {
                this.selectedData = item;
                this.viewQualityCheckConfig.title = this.selectedData.srcDocType == 1?'采购单':'委外采购单';
                this.viewQualityCheckConfig.show = true;
            }
        },
        href(item, type) {
            this.selectedData = item;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    this.viewQualityCheckConfig.title = this.selectedData.srcDocType == 1?'采购单':'委外采购单';
                    this.viewQualityCheckConfig.show = true;
                    break;
                case 'tab2':
                    this.viewConfig.show = true;
                    break;
            }
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
            var url = __URL.warehouse + 'wait/return/receive/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'wait/return/receive/query/list';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'return/receive/query/list';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.viewConfig.show = false;
                _this.viewQualityCheckConfig.show = false;
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
            var myCfg = cfg.waitReturnReceiptTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitReturnReceiptTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.returnReceiptTableCfg;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
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

    <!-- 查看退收内页-->
    <inner :config='viewConfig'>
        <view-return-receive :docno.sync="selectedData.docNo" @close="viewConfig.show = false;"></view-return-receive>
    </inner>

    <!-- 查看品质检验内页-->
    <inner :config='viewQualityCheckConfig'>
        <view-quality-check :selected.sync="selectedData" @close="viewQualityCheckConfig.show = false;"></view-quality-check>
    </inner>

</template>

