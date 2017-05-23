<script>



    import cashierrec from './cashierRecAudit'
    import cfg from './cfg.js'

    export default {
        components: {
            cashierrec,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '收款单'
                },
                actId: '',
                isBack: false,
                auditCfg: {
                    show: false,
                    msg: '确认是否审核',
                    type: 'failure'
                },

                unauditCfg: {
                    show: false,
                    msg: '确认是否弃审',
                    type: 'failure'
                },
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

            closeNew(type, tips){
                this.orderCfg.show = false;
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

            operateData(url, param, txt){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(url + param).then(
                    res => {
                        if (res.data.success) {
                            this.refresh('success', txt)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            doAudit(){
                this.operateData(__URL.financial + 'cashier/rec/audit/', this.actId, '审核成功！')
            },

            doUnaudit(){
                this.operateData(__URL.financial + 'cashier/rec/unaudit/', this.actId, '弃审成功！')
            },

            operate(type, item) {
                this.actId = item.docNo;
                if (type == 'audit') {
                    this.doAudit()
                } else if (type == 'unaudit'){
                    this.doUnaudit()
                }else if(type == "repeal"){
                    if(this.revokeCb==false)return
                    this.revokeCb=false
                    this.$http.get(__URL.financial + 'cashier/rec/pending/' + item.docNo).then(
                        res => {
                            if (res.data.success) {
                                this.refresh("success", "撤销审核成功")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb=true
                        }
                    )
                }
            },

            href(item, type) {
                this.actId = item.docNo;
                if (item.docType == 3) {
                    this.isBack = true;
                } else {
                    this.isBack = false;
                }
                this.orderCfg.show = true;
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
            clearTable(uid,obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.unauditTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab2':
                        myCfg =  cfg.auditTableCfg;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
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
        <cashierrec :show="orderCfg" :id="actId" :back="isBack" @refresh='closeNew'></cashierrec>
    </inner>

    <warning :config="wCfg"></warning>
</template>
