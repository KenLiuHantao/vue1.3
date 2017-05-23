<script>

    import cashier from './cashierPay'
    import cashierreturn from './cashierReturn'
    import cfg from './cfg.js'

    export default {
        components: {
            cashier,
            cashierreturn,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '付款单'
                },
                backCfg: {
                    show: false,
                    title: '退款单'
                },
                actId: '',
                backId: '',
                isAdd: false,
                isBack: false,
                isEdit: false,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb: true,
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

            //新增按钮事件
            addNew(){
                this.actId = '';
                this.isAdd = true;
                this.isBack = false;
                this.isEdit = false;
                this.orderCfg.show = true;
            },
            //关闭新增页面
            closeNewCashier(type, text){
                this.orderCfg.show = false;
                this.isBack = false;
                this.isEdit = false;
                this.refresh(type, text)
            },
            closeBackCashier(type, text){
                this.backCfg.show = false;
                this.isEdit = false;
                this.refresh(type, text)
            },
            setWarningSuccess(type, tips){
                this.wCfg.show = true;
                this.wCfg.content = tips;
                this.wCfg.type = type;
            },

            refresh(type, tips){

                if (tips !== undefined && tips !== '') {
                    this.setWarningSuccess(type, tips);
                }
                this.orderCfg.show = false;
                this.backCfg.show = false;
                this.$broadcast('_RESETLIST');
                this.tableData = []
            },

            operate(type, item) {

            },

            href(item, type) {
                this.isAdd = false;
                this.isEdit = false;
                if (item.docType == 3) {
                    this.backId = item.docNo;
                    this.backCfg.show = true;
                } else {
                    this.actId = item.docNo;
                    this.orderCfg.show = true;
                }
            },

            getFilter(item, obj) {
                if (obj && obj.currencyCode) {
                    item.currencyCode = obj.currencyCode;
                }
                if (obj && obj.paymentCode) {
                    item.paymentCode = obj.paymentCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                this.$http.post(__URL.financial + 'cashier/pay/list', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
            },
            clearTable(uid, obj){
                this.tableData = []
            },
            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
        },

        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitSubmitTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitSubmitTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
                        myCfg = cfg.auditTableCfg;
                        break;
                }
                return myCfg;
            },
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <inner :config='orderCfg'>
        <cashier :show.sync="orderCfg" :id="actId" :add="isAdd" :edit.sync="isEdit"
                 @refresh='closeNewCashier' @refreshonly='refreshOnly'></cashier>
    </inner>

    <inner :config='backCfg'>
        <cashierreturn :id="actId" :add="isAdd" :back-id="backId" :edit="isEdit"
                       @refresh='closeBackCashier' @refreshonly='refreshOnly'></cashierreturn>
    </inner>

    <warning :config="wCfg"></warning>
</template>
