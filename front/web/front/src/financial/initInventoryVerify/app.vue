<script>
    import cfg from './cfg.js'
    import inventory from '../../development/inventoryManager/item.vue'

    export default {
        components: {
            inventory
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                itemData: {},
                itemEdit: 1,
                innerCfg: {
                    show: false,
                    title: '货品档案'
                },
                actId: '',
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


            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            refresh(type, tips){
                this.setWarningSuccess(type, tips)
                this.reset()
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
                switch (type) {
                    case 'draftModify':

                        break;
                    case 'draftDelete':
                        this.delCfg.show = true;
                        break;
                    case 'draftSubmit':
                        this.draftSubmit()
                        break;
                    case 'waitModify':

                        break;
                    case 'waitDelete':
                        this.delCfg.show = true;
                        break;
                    case 'waitSubmit':
                        this.submit()
                        break;
                    case 'repeal':
                        this.repeal()
                        break;
                    default:
                        break;
                }
            },

            doDel(){
                this.operateData(__URL.financial + 'init/inventory/verify/delete/', this.actId, '删除成功！')
            },

            draftSubmit(){
                this.operateData(__URL.financial + 'init/inventory/verify/draft/submit/', this.actId, '提交成功！')
            },

            submit(){
                this.operateData(__URL.financial + 'init/inventory/verify/submit/', this.actId, '提交审核成功！')
            },

            repeal(){
                this.operateData(__URL.financial + 'init/inventory/verify/repeal/', this.actId, '撤销提交审核成功，等待主管同意！')
            },

            href(item, type) {
                this.$http.get(__URL.dev + 'inventory/get/' + item.recordId).then(
                    (res) => {
                        if (res.data.success) {
                            this.itemData = res.data.data
                            this.innerCfg.show = true
                        }
                    }
                )
            },

            fresh() {
                this.innerCfg.show = false
                this.reset()
            },
            reset() {
                this.$broadcast('_RESETLIST')
                this.tableData = []
            },

            getFilter(item, obj) {
                if (obj && obj.warehouseCode) {
                    item.warehouseCode = obj.warehouseCode;
                    item.warehouseName = obj.warehouseName;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                let param = {
                    "pageIndex": 0,
                    "pageSize": 0,
                    "warehouseCode": "",
                    "warehouseName": "",
                    "docStatus": -1,
                }
                param.warehouseCode = obj.warehouseCode
                param.warehouseName = obj.warehouseName
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        param.docStatus = -2;
                        break;
                    case 'tab2':
                        param.docStatus = 0;
                        break;
                    case 'tab3':
                        param.docStatus = 1;
                        break;
                    case 'tab4':
                        param.docStatus = 2;
                        this.$http.post(__URL.financial + 'init/inventory/verify/audit/list', param).then(
                            (res) => {
                                this.tableData = res.data.data.dataList
                            }
                        )
                        break;
                }
                /*this.$http.post(__URL.financial + 'init/inventory/verify/list', param).then(
                 (res) => {
                 this.tableData = res.data.data.dataList
                 }
                 )*/
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.draftTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.draftTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.waitTableCfg;
                        break;
                    case 'tab3':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab4':
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

    <inner :config='innerCfg'>
        <inventory :edit='itemEdit' :data='itemData' :other="true" @cb='fresh'></inventory>
    </inner>

    <alert :config="delCfg" @cb="doDel"></alert>

    <warning :config="wCfg"></warning>
</template>
