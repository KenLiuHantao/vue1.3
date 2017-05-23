<script>



    import cashierrec from './cashierRec'
    import cashierreturn from './cashierReturn'
    import cfg from './cfg.js'

    export default {
        components: {
            cashierrec,
            cashierreturn,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                recCfg: {
                    show: false,
                    title: '收款单'
                },
                backCfg: {
                    show: false,
                    title: '退款单'
                },
                actId: '',
                backId: '',
                isAdd: false,
                isEdit: false,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
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
            addRec(){
                this.actId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.recCfg.show = true;
            },

            addBack(){
                this.backId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.backCfg.show = true;
            },

            closeRecCashier(type, tips){
                this.recCfg.show = false;
                this.isEdit = false;
                this.refresh(type, tips)
            },

            closeBackCashier(type, tips){
                this.backCfg.show = false;
                this.isEdit = false;
                this.refresh(type, tips)
            },

            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            refresh(type, tips){
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
            },

            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },

            operateData(url, param, txt){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(url + param).then(
                    res => {
                        if (res.data.success) {
                            this.refresh('success', txt)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true
                    }
                )
            },

            operate(type, item) {
                this.actId = item.docNo;
                if (type == 'modify') {
                    this.actId = item.docNo;
                    this.isAdd = false;
                    if (item.docType == 3) {
                        this.actId = '';
                        this.isBack = true;
                        this.backId = item.docNo;
                        this.backCfg.show = true;
                    } else {
                        this.isBack = false;
                        this.backId = '';
                        this.recCfg.show = true;
                    }
                    this.isEdit = true;
                } else if (type == 'delete') {
                    this.delCfg.show = true;
                } else if (type == 'submit') {
                    this.doSubmit();
                } else if (type == 'repeal') {
                    this.doRepeal();
                } else if (type == 'back') {
                    this.addBack()
                }
            },

            doDel(){
                this.operateData(__URL.financial + 'cashier/rec/delete/', this.actId, '删除成功！')
            },

            doSubmit(){
                this.operateData(__URL.financial + 'cashier/rec/submit/', this.actId, '提交审核成功！')
            },

            doRepeal(){
                this.operateData(__URL.financial + 'cashier/rec/repeal/', this.actId, '撤销提交审核成功，等待主管同意！')
            },

            href(item, type) {
                this.isAdd = false;
                this.isEdit = false;
                if (item.docType == 3) {
                    this.actId = '';
                    this.backId = item.docNo;
                    this.backCfg.show = true;
                } else {
                    this.actId = item.docNo;
                    this.recCfg.show = true;
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
                this.$http.post(__URL.financial + 'cashier/rec/list', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },

        computed: {
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addRec'></new-app>
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
    <inner :config='recCfg'>
        <cashierrec :show="recCfg" :back-cfg="backCfg" :id="actId" :add="isAdd" :edit.sync="isEdit"
                    @refresh='closeRecCashier' @refreshonly='refreshOnly'></cashierrec>
    </inner>

    <inner :config='backCfg'>
        <cashierreturn :show="backCfg" :id="actId" :back-id="backId" :add="isAdd" :edit="isEdit"
                       @refresh='closeBackCashier' @refreshonly='refreshOnly'></cashierreturn>
    </inner>

    <alert :config="delCfg" @cb="doDel"></alert>

    <warning :config="wCfg"></warning>
</template>
