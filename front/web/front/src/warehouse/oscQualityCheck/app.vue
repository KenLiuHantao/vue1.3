<script>

import cfg from './cfg.js'
import numberInput from 'nc/input/app'
import newQualityCheck from './newQualityCheck'
import viewQualityCheck from './viewQualityCheck'
import viewWaitReturnReceiveQualityCheck from './viewWaitReturnReceiveQualityCheck'
import viewPurchase from './viewOscPurchase.vue'

export default {
    components: {
        newQualityCheck,
        viewQualityCheck,
        viewWaitReturnReceiveQualityCheck,
        viewPurchase
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
                title: '新建委外品质检验单'
            },
            viewConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '委外品质检验单'
            },
            viewWaitReturnReceiveConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '委外品质检验单'
            },
            viewPurchaseConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '委外采购单'
            },
            warnConfig: {
                show: false,
                type: 'success',
                content: '操作成功'
            },
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            selectedData: {},
            newData: {
                header:{
                    'oscOrderDocNo': ''
                },
                dataList: []
            },
            lock: false
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'purchaseDocNo': '',
                'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                'startDocDate': '',
                'endDocDate': '',
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

        forword(){
            this.newConfig.show = true;
        },

        // table返回的操作参数
        operate(type, item) {
            if(type == 'check') {
                this.selectedData = item;
                this.newConfig.show = true;
            }
        },
        href(item, type) {
            this.selectedData = item;
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.viewPurchaseConfig.show = true;
                this.showbutn = 0;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.selectedData.docNo = item.purchaseDocNo;
                this.showbutn = 1;
                this.viewPurchaseConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.viewConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab4') {
                this.viewWaitReturnReceiveConfig.show = true;
            }
        },
        getFilter(item, obj) {
            if(obj && obj.purchaseDate) {
                item.purchaseDate = obj.purchaseDate;
            }
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
            var url = __URL.purchase + 'outsource/receive/orderList';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'wait/receive/query/list/for/osc';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'receive/query/list/for/osc';
                    break;
                case 'tab3':
                    url = __URL.warehouse + 'osc/quality/check/query/list';
                    break;
                case 'tab4':
                    url = __URL.warehouse + 'wait/return/receive/query/list/for/osc';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.newConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
                _this.newData = {
                    header:{
                        'oscOrderDocNo': ''
                    },
                    dataList: []
                }
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
            var myCfg = cfg.waitReceiveTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitReceiveTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.waitQualityCheckTableCfg;
                    break;
                case 'tab3':
                    myCfg =  cfg.qualityCheckTableCfg;
                    break;
                case 'tab4':
                    myCfg =  cfg.waitReturnReceiveTableCfg;
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
                    'purchaseDocNo': '',
                    'docDate': this.listObj.docDate,
                    'startDocDate': '',
                    'endDocDate': '',
                    'purchaseEmployeeCode': '',
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
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增品质检验内页-->
    <inner :config='newConfig'>
        <new-quality-check :docno.sync="selectedData.purchaseDocNo" @refresh='refresh' @close="newConfig.show = false;"></new-quality-check>
    </inner>

    <!-- 查看"已通过"品质检验内页-->
    <inner :config='viewConfig'>
        <view-quality-check :docno.sync="selectedData.docNo" @close="viewConfig.show = false;"></view-quality-check>
    </inner>

    <!-- 查看"判退收"品质检验内页-->
    <inner :config='viewWaitReturnReceiveConfig'>
        <view-wait-return-receive-quality-check :docno.sync="selectedData.docNo" @close="viewWaitReturnReceiveConfig.show = false;"></view-wait-return-receive-quality-check>
    </inner>

    <!-- 查看采购单内页-->
    <inner :config='viewPurchaseConfig'>
        <view-purchase :docno="selectedData.docNo" @forword="forword" :showbutn="showbutn" @refresh='viewPurchaseConfig.show = false;' :config="viewPurchaseConfig"></view-purchase>
    </inner>

    <warning :config="warnConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

