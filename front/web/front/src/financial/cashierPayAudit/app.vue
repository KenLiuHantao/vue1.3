<script>



    import cashieraudit from './cashierPayAudit'
    import cfg from './cfg.js'

    export default {
        components: {
            cashieraudit,
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
                actId: '',
                isBack: false,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb : true,
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
                    "audit": obj.audit,
                    "beginCreateTime": "",
                    "docNo": "",
                    "endCreateTime": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                    "supplierCode": obj.supplierCode,
                    "supplierName": obj.supplierName,
                    "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
                }
                return init
            },

            //关闭新增页面
            closeNew(type,text){
                console.log(text);
                this.orderCfg.show = false;
                this.isBack = false;
                this.refresh(type,text)
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
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(url + param).then(
                    res => {
                        if (res.data.success) {
                            this.wCfg.show = true
                            this.wCfg.content = txt + "成功！"
                            this.wCfg.type = "success"
                        } else {
                            this.wCfg.show = true
                            this.wCfg.content = res.data.errMsg
                            this.wCfg.type = "failure"
                        }
                        this.revokeCb = true;
                    }
                )
            },

            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
            operate(type, item) {
                console.log(type);
                if (type == 'audit') {
                    this.operateData(__URL.financial + 'cashier/pay/audit/', item.docNo, '审核')
                } else if (type == 'unaudit'){
                    this.operateData(__URL.financial + 'cashier/pay/unaudit/', item.docNo, '弃审')
                }else if(type == "repeal"){
                    if(this.revokeCb==false)return
                    this.revokeCb=false
                    this.$http.get(__URL.financial + 'cashier/pay/pending/' + item.docNo).then(
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
                console.log(obj);
                this.$http.post(__URL.financial + 'cashier/pay/list', obj).then(
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
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
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
            tableParams() {
                let param = {
                    "entCode": "",
                    "params": {
                        "docStatus": this.listObj.docStatus,
                        "pageIndex": 0,
                        "pageSize": 0,
                        "yearWeek": this.listObj.yearWeek
                    },
                    "userCode": ""
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
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <inner :config='orderCfg'>
        <cashieraudit :show="orderCfg" :id="actId" :back="isBack" @refresh='closeNew'  @refreshonly='refreshOnly'></cashieraudit>
    </inner>
    <warning :config="wCfg"></warning>
</template>
