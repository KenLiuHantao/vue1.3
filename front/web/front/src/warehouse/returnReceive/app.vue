<script>


    import cfg from './cfg.js'

    import newReturnReceive from './newReturnReceive'
    import viewReturnReceive from './viewReturnReceive'
    import viewQualityCheck from './viewQualityCheck'
    import viewPurchase from '../../purchase/purOrder/viewPurchase'
    import viewOscPurchase from '../../purchase/outsource/viewPurchase'

    export default {
        components: {
            newReturnReceive,
            viewReturnReceive,
            viewQualityCheck,
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
                    title: '采购退收单'
                },
                viewConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '采购退收单'
                },
                viewPurchaseConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '采购单'
                },
                viewOscPurchaseConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外采购单'
                },
                viewQualityCheckConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '采购'
                },
                warnConfig: {
                    show: false,
                    type: 'warning',
                    content: '请选择品质检验单！'
                },
                headerData:{},
                listObj: cfg.listParam,
                tableData: [],
                checkedData: {},
                selectedData: {},
                receiptData: []
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
                this.selectedData = item;
                var params = {
                    srcDocNo:item.docNo,
                    srcDocType:item.srcDocType,
                    warehouseCode:item.warehouseCode,
                };
                this.$http.post(__URL.warehouse + 'wait/return/receive/query/receive/one', params).then((res) => {
                    if(res.data.success){
                        this.receiptData = res.data.data;
                        this.receiptData.srcDocType = this.selectedData.srcDocType;
                        this.viewQualityCheckConfig.title = this.selectedData.srcDocType == 1?'采购单':'委外采购单';
                        this.viewQualityCheckConfig.show = true;
                    }else{
                        this.warnConfig.show = true
                        this.warnConfig.content = res.data.errMsg;
                        this.warnConfig.type = "failure"
                    }
                });
            },
            href(item, type) {
                this.selectedData = item;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        if(item.srcDocType == 1){
                            this.viewPurchaseConfig.show = true;
                        }else{
                            this.viewOscPurchaseConfig.show = true;
                        }
                        break;
                    case 'tab2':

                        this.viewConfig.show = true;
                        break;
                }
            },
            getFilter(item, obj) {
                if (obj && obj.supplierCode) {
                    item.supplierCode = obj.supplierCode;
                }
                if (obj && obj.date) {
                    item.date = obj.date;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.warehouse + 'wait/return/receive/query/list';
                switch (cfg.leftItemCfg.tabCfg.select) {
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
            senddata(docno, datalist){
                this.selectedData.docNo = docno;
                this.receiptData = datalist;
                this.receiptData.header.remark = '';
                this.$http.get(__URL.warehouse + 'wait/return/receive/query/receiver').then((res) => {
                    this.headerData = res.data.data;
                    this.headerData.srcDocType = this.selectedData.srcDocType;
                    if(this.headerData.srcDocType == 1){
                        this.newConfig.title = '采购退收单'
                    }else{
                        this.newConfig.title = '委外采购退收单'
                    }
                    this.newConfig.show = true;
                });
            },
            openDocInfo(){
                if(!this.checkedData.docNo){
                    this.warnConfig.content = "请先勾选按钮再退收";
                    this.warnConfig.type = "failure"
                    this.warnConfig.show = true
                    return;
                }



            },

            refresh() {
                let _this = this;
                setTimeout(function () {
                    _this.newConfig.show = false;
                    _this.viewConfig.show = false;
                    _this.warnConfig.show = false;
                    _this.$broadcast('_RESETLIST');
                    _this.tableData = [];
                }, 1500);
            },
            clearTable(uid, obj){
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
                switch (cfg.leftItemCfg.tabCfg.select) {
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
                   <!-- <a href="javascript:;" v-if="leftItemCfg.tabCfg.select == 'tab1'" @click="openDocInfo">
                        详情
                    </a>-->
                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData' @op='operate' @link="href"></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增退收内页-->
    <inner :config='newConfig'>
        <new-return-receive :receiptdata.sync="receiptData" :headerdata.sync="headerData" @docno.sync="selectedData.docNo" @refresh='refresh'
                            @close="newConfig.show = false;"></new-return-receive>
    </inner>

    <!-- 查看入库内页-->
    <inner :config='viewConfig'>
        <view-return-receive :docno.sync="selectedData.docNo" @close="viewConfig.show = false;" ></view-return-receive>
    </inner>

    <inner :config='viewPurchaseConfig'>
        <view-purchase  :config="viewPurchaseConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></view-purchase>
    </inner>

    <inner :config='viewOscPurchaseConfig'>
        <view-osc-purchase :config="viewOscPurchaseConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></view-osc-purchase>
    </inner>

    <!-- 查看委外/采购-->
    <inner :config='viewQualityCheckConfig'>
        <view-quality-check :docno.sync="selectedData.docNo" :receiptdata.sync="receiptData" :thiscfg.sync="viewQualityCheckConfig" :newcfg.sync="newConfig" @senddata="senddata" @close="viewQualityCheckConfig.show = false;"></view-quality-check>
    </inner>

    <warning :config="warnConfig"></warning>
</template>

