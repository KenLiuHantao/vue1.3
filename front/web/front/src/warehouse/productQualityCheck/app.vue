<script>



    import cfg from './cfg.js'

    import newQualityCheck from './newQualityCheck'
    import viewQualityCheck from './viewQualityCheck'
    import viewWaitReturnReceiveQualityCheck from './viewWaitReturnReceiveQualityCheck'
    import viewPurchase from './viewPurchase'
    import viewOscPurchase from './viewOscPurchase'

    export default {
        components: {
            newQualityCheck,
            viewQualityCheck,
            viewWaitReturnReceiveQualityCheck,
            viewPurchase,
            viewOscPurchase
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
                    title: '新建品质检验单'
                },
                viewConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '品质检验单'
                },
                viewWaitReturnReceiveConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '品质检验单'
                },
                viewPurchaseConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '采购单'
                },
                viewOscPurchaseConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '采购单'
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                listObj: cfg.listParam,
                tableData: [],
                radioObj: {},
                showbutn:0,
                selectedData: {},
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
                    if(item.docType == 2){
                        this.viewOscPurchaseConfig.show = true;
                    }else{
                        this.viewPurchaseConfig.show = true;
                    }
                    this.showbutn = 0;
                } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.selectedData.docNo = item.purchaseDocNo;
                    if(item.docType == 2){
                        this.viewOscPurchaseConfig.show = true;
                    }else{
                        this.viewPurchaseConfig.show = true;
                    }
                    this.showbutn = 1;
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
                var url = __URL.purchase + 'order/arrival/orderList';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        url = __URL.warehouse + 'wait/receive/query/list/for/product';
                        break;
                    case 'tab2':
                        url = __URL.warehouse + 'receive/query/list/for/product';
                        break;
                    case 'tab3':
                        url = __URL.warehouse + 'product/quality/check/query/list';
                        break;
                    case 'tab4':
                        url = __URL.warehouse + 'wait/return/receive/query/list/for/product';
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
        <new-quality-check :docno.sync="selectedData.purchaseDocNo"  @refresh='refresh' @close="newConfig.show = false;"></new-quality-check>
    </inner>

    <!-- 查看"已通过"品质检验内页-->
    <inner :config='viewConfig'>
        <view-quality-check :docno.sync="selectedData.docNo" @close="viewConfig.show = false;"></view-quality-check>
    </inner>

    <!-- 查看"判退收"品质检验内页-->
    <inner :config='viewWaitReturnReceiveConfig'>
        <view-wait-return-receive-quality-check :docno.sync="selectedData.docNo" @close="viewWaitReturnReceiveConfig.show = false;"></view-wait-return-receive-quality-check>
    </inner>

    <inner :config='viewPurchaseConfig'>
        <view-purchase :docno="selectedData.docNo" :showbutn="showbutn" @refresh='viewPurchaseConfig.show = false;' @forword="forword" :config="viewPurchaseConfig"></view-purchase>
    </inner>

    <inner :config='viewOscPurchaseConfig'>
        <view-osc-purchase :docno="selectedData.docNo" :showbutn="showbutn" @refresh='viewOscPurchaseConfig.show = false;' @forword="forword" :config="viewOscPurchaseConfig"></view-osc-purchase>
    </inner>

    <warning :config="warnConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

