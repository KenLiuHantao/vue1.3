<script>



    import initpayaudit from './initPayAudit'
    import cfg from './cfg.js'

    export default {
        components: {
            initpayaudit,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '期初应付单'
                },
                actId: '',
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb:true,
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
                this.refresh(type,text)
            },

            operateData(url, param, txt){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(url + param).then(
                    (res) => {
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
                this.actId = item.docNo
                if (type == 'audit') {
                    this.doAudit();
                } else if (type == 'unaudit') {
                    this.doUnaudit();
                }
            },
            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
            doAudit(){
                this.operateData(__URL.financial + 'init/payable/audit/', this.actId, '审核成功！')
            },

            doUnaudit(){
                this.operateData(__URL.financial + 'init/payable/unaudit/', this.actId, '弃审成功！')
            },

            href(item, type) {
                this.actId = item.docNo;
                this.orderCfg.show = true;
            },

            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            refresh(type, tips){
                console.log(tips)
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
            },
            getFilter(item, obj) {
                if (obj && obj.supplierCode) {
                    item.supplierCode = obj.supplierCode
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                console.log(obj);
                this.$http.post(__URL.financial + 'init/payable/list', obj).then(
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
                        "yearWeek": this.listObj.yearWeek,
                        "supplierCode":this.listObj.supplierCode
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
        <initpayaudit :show="orderCfg" :id="actId" @refresh='closeNew' @refreshonly='refreshOnly'></initpayaudit>
    </inner>
    <warning :config="wCfg"></warning>
</template>
