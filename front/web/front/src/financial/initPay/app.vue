<script>



    import initpay from './initPay'
    import cfg from './cfg.js'

    export default {
        components: {
            initpay,
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
                isAdd: false,
                isEdit: false,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb:true,
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
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
                    "yearMonth": obj.yearMonth != undefined ? obj.yearMonth : this.listObj.yearMonth
                }
                return init
            },

            addNew(){
                this.actId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.orderCfg.show = true;
            },
            //关闭新增页面
            closeNew(type, tips){
                this.orderCfg.show = false;
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

            operateData(url, param, txt) {
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(url + param).then(
                    (res) => {
                    if (res.data.success) {
                    this.refresh('success', txt)
                } else {
                    this.setWarningSuccess('failure', res.data.errMsg)
                }
                this.revokeCb=true
            }
            )
            },

            operate(type, item) {
                console.log(type);
                this.actId = item.docNo;
                if (type == 'modify') {
                    this.actId = item.docNo;
                    this.isAdd = false;
                    this.isEdit = true;
                    this.orderCfg.show = true;
                } else if (type == 'delete') {
                    this.delCfg.show = true;
                } else if (type == 'submit') {
                    this.doSubmit();
                } else if (type == 'repeal') {
                    this.doRepeal();
                }
            },

            doDel(){
                this.operateData(__URL.financial + 'init/payable/delete/', this.actId, '删除成功！')
            },

            doSubmit(){
                this.operateData(__URL.financial + 'init/payable/submit/', this.actId, '提交审核成功！')
            },

            doRepeal(){
                this.operateData(__URL.financial + 'init/payable/repeal/', this.actId, '撤销提交审核成功，等待主管同意！')
            },

            href(item, type) {
                this.actId = item.docNo;
                this.isAdd = false;
                this.isEdit = false;
                this.orderCfg.show = true;
            },

            refreshOnly(){
                this.$broadcast('_RESETLIST');
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
                var myCfg = cfg.waitSubmitTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitSubmitTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
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
                        "yearMonth": this.listObj.yearMonth,
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
        <initpay :show="orderCfg" :id="actId" :add="isAdd" :edit="isEdit"
                 @refresh='closeNew'  @refreshonly='refreshOnly'></initpay>
    </inner>
    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>
</template>
