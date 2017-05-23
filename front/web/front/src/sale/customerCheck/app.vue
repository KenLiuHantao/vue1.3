<script>


    import Cfg from './cfg.js'
    import customercheck from './customerCheck'
    import customercheckdetail from './customerCheckDetail'
    import saleinfo from '../saleOrder/info'

    export default {
        components: {
            customercheck,
            customercheckdetail,
            saleinfo,
        },
        ready() {

        },
        data() {
            return {
                cfg: Cfg,
                leftItemCfg: Cfg.leftItemCfg,
                listObj: Cfg.listParam,
                tableData: [],
                radioObj: [],
                checkDetailCfg: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '客户对账单'
                },
                checkConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新建客户对账单'
                },
                tipsCheck: {
                    show: false,
                    type: 'warning',
                    content: '必须勾选中才能对账',
                    showTime: 500
                },
                tipsCheckSameSupplier: {
                    show: false,
                    type: 'warning',
                    content: '必须选中同一客户才能对账',
                    showTime: 500
                },
                warnCfg: {
                    show: false,
                    type: 'success',
                    content: ''
                },
                orderCfg: {
                    show: false,
                    title: '销售订单'
                },
                customerCfg: {
                    show: false
                },
                checkList: '',
                actId: '',
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
                    "pageIndex": 0,
                    "pageSize": 0,
                    "customerCode": obj.customerCode != undefined ? obj.customerCode : this.listObj.supplierCode,
                    "yearMonth": obj.yearMonth != undefined ? obj.yearMonth : this.listObj.yearMonth
                }
                return init
            },
            // table返回的操作参数
            operate(type, item) {
            },
            href(item, type) {

                if (this.cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    var param = {
                        infos: [{"inventoryCode": item.inventoryCode, "saleDocNo": item.saleDocNo}],
                        yearMonth: item.yearMonth,
                        customerCode: item.customerCode
                    };
                    this.$http.post(__URL.sale + 'customer/check/checked/checkdetail', param).then(
                        (res) => {
                            this.checkList = res.data.data;
                            this.checkDetailCfg.show = true;
                        }
                    )
                } else {
                    this.actId = item.saleDocNo;
                    this.orderCfg.show = true;
                }
            },
            getFilter(item, obj) {
                if (obj && obj.customerCode) {
                    item.customerCode = obj.customerCode;
                    item.currencyCode = obj.currencyCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                this.radioObj = [];
                this.tableData = [];
                if (this.cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    if (obj.customerCode) {
                        this.$http.post(__URL.sale + 'customer/check/uncheck/checklist', obj).then(
                            (res) => {
                                this.tableData = res.data.data.dataList;
                                this.cfg.customerUncheckTableCfg.totalShow[1][0].value = "金额:" + this.tableData[0].totalTaxAmount + '<br>' + "已对:" + this.tableData[0].totalHasCheckedTaxAmount;
                                this.cfg.customerUncheckTableCfg.totalShow[1][1].value = this.tableData[0].totalThisTimeCheckAmount;
                            }
                        )
                    }
                } else {
                    this.$http.post(__URL.sale + 'customer/check/checked/checklist', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                            this.cfg.customerCheckedTableCfg.totalShow[1][0].value = "金额:" + this.tableData[0].totalTaxAmount + '<br>' + "已对:" + this.tableData[0].totalHasCheckedTaxAmount;
                        }
                    )
                }
            },
            openRef(emit){
                if (emit == 'supplier') {
                    this.supplierCfg.show = true;
                }
            },
            check(){

                if (this.radioObj.length == 0) {
                    this.tipsCheck.show = true;
                    return;
                }
                var arr = [];
                for (var i = 0; i < this.radioObj.length; i++) {
                    if (this.radioObj[0].customerCode == this.radioObj[i].customerCode) {
                        arr.push({
                            "saleDocNo": this.radioObj[i].saleDocNo,
                            "inventoryId": this.radioObj[i].inventoryId
                        });
                    } else {
                        this.tipsCheckSameSupplier.show = true;
                        return;
                    }
                }
                var param = {
                    infos: arr,
                    customerCode: this.radioObj[0].customerCode,
                    yearMonth: this.radioObj[0].yearMonth
                };
                this.$http.post(__URL.sale + 'customer/check/uncheck/checkdetail', param).then(
                    (res) => {
                        this.checkList = res.data.data;
                        this.checkConfig.show = true;
                    }
                )

            },
            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
            //设置提示信息
            setWarningSuccess(type, data){
                this.warnCfg.show = true
                this.warnCfg.content = data
                this.warnCfg.type = type
            },
            refresh(type, tips){
                this.checkConfig.show = false;
                this.checkDetailCfg.show = false;
                this.orderCfg.show = false;
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
                this.checkData = []
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return this.cfg.table.baseParams.url
            },
            tableCfg() {
                if (this.cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    return this.cfg.customerUncheckTableCfg
                } else {
                    return this.cfg.customerCheckedTableCfg
                }
            },
            tableParams() {
                let param = {
                    "pageIndex": 0,
                    "pageSize": 0,
                    "supplierCode": this.listObj.supplierCode,
                    "yearMonth": this.listObj.yearMonth
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @reference='openRef'
                         @filtcb="fresh"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" v-if="leftItemCfg.tabCfg.select == 'tab1'" @click="check">
                        <i class='icon-watch_account'></i>对账
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <inner :config='checkConfig'>
        <customercheck :orderdetail="checkList" @refresh="refresh" @refreshonly='refreshOnly'
                       :customercheckcfg="checkConfig"></customercheck>
    </inner>
    <inner :config='checkDetailCfg'>
        <customercheckdetail :orderdetail="checkList" @refresh="refresh" @refreshonly='refreshOnly'
                             :customercheckcfg="checkConfig"></customercheckdetail>
    </inner>

    <inner :config="orderCfg">
        <saleinfo @refresh="refresh" :show="orderCfg" :docNo="actId"></saleinfo>
    </inner>

    <warning :config="warnCfg"></warning>
    <warning :config="tipsCheck"></warning>
    <warning :config="tipsCheckSameSupplier"></warning>
</template>
