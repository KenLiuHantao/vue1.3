<script>


    import cfg from './cfg.js'
    import newInvoice from './newInvoice'
    import editInvoice from './editInvoice'
    import checkInvoice from './checkInvoice'
    import viewInbound from './viewInbound'
    import viewReturnInbound from './viewReturnInbound'


    export default {
        components: {
            newInvoice,
            editInvoice,
            checkInvoice,
            viewInbound,
            viewReturnInbound
        },
        ready() {
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                checkboxArray: [],
                docNos: [],
                invoiceDocNo: "",
                sourceDocNo: "",
                invoiceCategoryCode: "001",
                isShowInvoice: false,
                workflow: {no: 0},
                inventoryCfg: {
                    show: false
                },
                newInvoiceCfg: {
                    show: false,
                    title: "采购收票",
                },
                editInvoiceCfg: {
                    show: false,
                    title: "采购收票",
                },
                checkInvoiceCfg: {
                    show: false,
                    title: "采购收票",
                },
                warCfg: {
                    show: false,
                    type: "warning",
                    showtime: 2000,
                    content: '提示消息'
                },
                alertCfg: {
                    show: false,
                    type: "warning",
                    msg: '提示消息',
                    sure: true,
                    quite: false
                },
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
                },
                viewInboundConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库单'
                },
                viewReturnInboundConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库退货单'
                },
            }
        },
        methods: {
            showMsg(type, msg){
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
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
                    "productDocNo": '',
                    "inventoryCode": "",
                    "beginDeliveryDate": "",
                    "endDeliveryDate": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                    "processCode": obj.processCode,
                    "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
                };
                return init
            },

            href(item, type) {
                if (type == 'docNo' && cfg.leftItemCfg.tabCfg.select != 'tab1') {
                    this.invoiceDocNo = item.docNo;
                    if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                        this.workflow.no = 1
                    }
                    if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                        this.workflow.no = 2;
                        this.openEditInvoice();
                    }
                    if (cfg.leftItemCfg.tabCfg.select == 'tab3') {
                        this.workflow.no = 3;
                        this.openCheckInvoice();
                    }
                    if (cfg.leftItemCfg.tabCfg.select == 'tab4') {
                        this.workflow.no = 4;
                        this.openCheckInvoice();
                    }
                } else if (type == "docNo" && cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.sourceDocNo = item.docNo;
                    if (item.inbound) {
                        this.viewInboundConfig.show = true;
                    } else {
                        this.viewReturnInboundConfig.show = true;
                    }
                }
            },

            getFilter(item, obj) {
                if (obj && obj.supplierCode) {
                    item.supplierCode = obj.supplierCode;
                    //切换供应商清空之前勾选的内容
                    if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                        this.checkboxArray = [];
                    }
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                this.tableData = [];
                this.checkboxArray = [];
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.$http.post(__URL.financial + 'purchase/invoice/wait/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        }
                    )
                } else {
                    this.$http.post(__URL.financial + 'purchase/invoice/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList

                        }
                    )
                }
            },
            // table返回的操作参数
            operate(type, item) {
                this.docNos = [];
                let docNo = item.docNo;
                let recordVersion = item.recordVersion;
                //开票
                if (type == 'createTicket') {
                    this.docNos.push(docNo);
                    this.openNewInvoice();
                }

                //修改
                if (type == 'modify') {
                    this.invoiceDocNo = item.docNo;
                    this.openEditInvoice();
                }

                //删除
                if (type == 'delete') {
                    this.invoiceDocNo = item.docNo;
                    this.delCfg.show = true;
                }

                //提交
                if (type == 'submit') {
                    this.submitDocNo(docNo, recordVersion);
                    this.refresh();
                }

                //撤销提交
                if (type == 'cancelSubmit') {
                    this.cancelSubmitDocNo(docNo, recordVersion);
                    this.refresh();
                }

                //退票
                if (type == 'returnTicket') {
                    this.invoiceDocNo = item.docNo;
                    this.invoiceCategoryCode = "002";
                    this.openNewInvoice();
                }


            },
            deleteDocNo(){
                this.$http.get(__URL.financial + 'purchase/invoice/delete/' + this.invoiceDocNo).then(
                    (res) => {
                        console.log(res);
                        if (res.data.success) {
                            this.showMsg('success', '删除成功');
                            this.refresh();
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                    }
                )
            },
            submitDocNo(docNo, recordVersion){
                this.$http.post(__URL.financial + 'purchase/invoice/submit', {
                    "docNo": docNo,
                    "recordVersion": recordVersion
                }).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '提交成功');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                    }
                )
            },
            cancelSubmitDocNo(docNo, recordVersion){
                this.$http.post(__URL.financial + 'purchase/invoice/applyRevoke', {
                    "docNo": docNo,
                    "recordVersion": recordVersion
                }).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '撤销提交审核成功');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                    }
                )
            },
            /*下单操作*/
            openNewInvoice(){
                this.newInvoiceCfg.show = true;
            },
            closeNewInvoice(){
                this.newInvoiceCfg.show = false;
            },
            openEditInvoice(){
                this.editInvoiceCfg.show = true;
            },
            openEditWithDocNo(item){
                this.invoiceDocNo = item;
                this.editInvoiceCfg.show = true;
                this.refresh();
            },
            closeEditInvoice(){
                this.editInvoiceCfg.show = false;
            },
            openCheckInvoice(){
                this.checkInvoiceCfg.show = true;
            },
            openCheckWithDocNo(item){
                this.invoiceDocNo = item;
                this.checkInvoiceCfg.show = true;
                this.refresh();
            },
            closeCheckInvoice(){
                this.checkInvoiceCfg.show = false;
            },
            //打开新增页
            addInvoice(){
                //检验供应商
                if (this.checkboxArray.length <= 0) {
                    this.warCfg.show = true;
                    this.warCfg.content = "没有选中行";
                    return;
                }
                let supplierName = this.checkboxArray[0].supplierName;
                let docNoList = [];
                let isSame = true;
                let invoiceCode = "002";
                this.checkboxArray.forEach((item) => {
                    if (supplierName != '' && supplierName != item.supplierName) {
                        isSame = false;
                    }
                    if (item.inbound){
                        invoiceCode = "001";
                    }
                    supplierName = item.supplierName;
                    docNoList.push(item.docNo);
                });
                this.invoiceCategoryCode = invoiceCode;

                if (!isSame) {
                    this.alertCfg.show = true;
                    this.alertCfg.msg = "选择行的供应商不同,不能合并开票,请选择相同供应商下单";
                    this.alertCfg.item = docNoList;
                    return;
                }
                this.docNos = docNoList;
                this.openNewInvoice();
            },
            alertCb(){
                this.alertCfg.show = false;
            },
            closeNew(){
                this.newInvoiceCfg.show = false;
                this.refresh()
            },
            closeEdit(){
                this.editInvoiceCfg.show = false;
                this.refresh()
            },
            closeCheck(){
                this.checkInvoiceCfg.show = false;
                this.refresh()
            },
            refresh(){
                this.$broadcast('_RESETLIST');
                this.tableData = []
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
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.isShowInvoice = true;
                    return cfg.tab1TableCfg
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.isShowInvoice = false;
                    return cfg.tab2TableCfg
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab3') {
                    this.isShowInvoice = false;
                    return cfg.tab3TableCfg
                } else {
                    this.isShowInvoice = false;
                    return cfg.tab4TableCfg
                }

            },
            tableParams() {
                let param = {
                    "pageIndex": 0,
                    "pageSize": 0,
                    "recordStatus": 2,
                    "supplierCode": this.listObj.supplierCode,
                    "yearMonth": this.listObj.yearWeek
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @reference='openRef'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:" @click='addInvoice' v-if="isShowInvoice">
                        <i class='icon-hp_list__add'></i>开票
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxArray' :config='tableCfg' :data='tableData' @op='operate'
                            @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <alert :config="delCfg" @cb="deleteDocNo"></alert>

    <!--警告-->
    <warning :config="warCfg"></warning>

    <!--弹出-->
    <alert :config="alertCfg" @cb="alertCb"></alert>

    <!-- 详情内页-->
    <inner :config='newInvoiceCfg'>
        <new-invoice :invoice-cfg="newInvoiceCfg" :invoice-category-code="invoiceCategoryCode"
                     @openeditor="openEditWithDocNo" @opencheck="openCheckWithDocNo" :doc-no="invoiceDocNo"
                     :doc-nos="docNos"></new-invoice>
    </inner>

    <!-- 详情内页-->
    <inner :config='editInvoiceCfg'>
        <edit-invoice :invoice-cfg="editInvoiceCfg" :doc-no="invoiceDocNo" @opencheck="openCheckWithDocNo"
                      @refresh="closeEdit"></edit-invoice>
    </inner>


    <!-- 详情内页-->
    <inner :config='checkInvoiceCfg'>
        <check-invoice :invoice-cfg="checkInvoiceCfg" :doc-no="invoiceDocNo" @refresh='closeCheck'></check-invoice>
    </inner>


    <!-- 查看入库内页-->
    <inner :config='viewInboundConfig'>
        <view-inbound :doc-no.sync="sourceDocNo" @close="viewInboundConfig.show = false;"></view-inbound>
    </inner>

    <inner :config='viewReturnInboundConfig'>
        <view-return-inbound :doc-no.sync="sourceDocNo"
                             @close="viewReturnInboundConfig.show = false;"></view-return-inbound>
    </inner>
</template>
