<script>



    import initrecaudit from './initRecAudit'
    import cfg from './cfg.js'

    export default {
        components: {
            initrecaudit,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '期初应收单'
                },
                actId: '',
                revokeCb: true,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
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

            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            //关闭新增页面
            closeNew(type, tips){
                this.orderCfg.show = false;
                this.refresh(type, tips)
            },

            refresh(type, tips){
                console.log(tips)
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
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

            doAudit(){
                this.operateData(__URL.financial + 'init/receivable/audit/', this.actId, '审核成功！')
            },

            doUnaudit(){
                this.operateData(__URL.financial + 'init/receivable/unaudit/', this.actId, '弃审成功！')
            },

            operate(type, item) {
                this.actId = item.docNo
                if (type == 'audit') {
                    this.doAudit();
                } else if (type == 'unaudit') {
                    this.doUnaudit();
                }
            },

            href(item, type) {
                this.actId = item.docNo;
                this.orderCfg.show = true;
            },

            getFilter(item, obj) {
                if (obj && obj.customerCode) {
                    item.customerCode = obj.customerCode
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                console.log(obj);
                this.$http.post(__URL.financial + 'init/receivable/list', obj).then(
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
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab2':
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
        <initrecaudit :show="orderCfg" :id="actId" @refresh='closeNew'></initrecaudit>
    </inner>
    <warning :config="wCfg"></warning>
</template>
