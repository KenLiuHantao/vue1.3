<script>


    import cfg from './cfg.js'
    import info from './infoAndEdit.vue'
    import rec from './cashierRec.vue'

    export default {
        components: {
            info,
            rec
        },
        ready() {
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '销售收款核销单'
                },
                recCfg: {
                    show: false,
                    title: '收款单详情'
                },
                verifyAllCfg: {
                    show: false,
                    type: 'warning',
                    msg: '请选择至少一条记录'
                },
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
                },
                warnCfg: {
                    show: false,
                    type: 'success',
                    content: ''
                },
                actItem: '',
                actId: '',
                isAdd: false,
                showTable: false,
                isBack: false,
                checkData: [],
                //区分进核销界面时，是待核销，还是待审核等
                pageType: '',
            }
        },
        methods: {
            getList(param, subParam) {
                this.checkData = [];
                this.tableData = [];
                let url = '';
                if (subParam && subParam.customerCode) {
                    param.customerCode = subParam.customerCode;
                    url = 'verify/receivable/wait/cashier/list'
                }
                switch (this.leftItemCfg.tabCfg.select) {
                    case 'wait':
                        url = 'verify/receivable/wait/list';
                        break;
                    case 'no':
                        url = 'verify/receivable/unaudit/list';
                        break;
                    case 'yes':
                        url = 'verify/receivable/audit/list';
                        break;
                }
                if (url != '') {
                    this.$http.post(__URL.financial + url, param).then(
                        res => {
                            if (res.data.success) {
                                this.tableData = res.data.data.dataList
                            }
                        }
                    )
                }
            },
            // 打开待核销详情界面
            openInfo(item){
                this.actId = item.cashierDocNo
                this.isEdit = false
                this.isAdd = false
                if (item.cashierDocType == '3') {
                    this.isBack = true
                }
                this.recCfg.show = true
            },
            //待核销的核销
            verify(type, item){
                this.pageType = 'draft'
                this.actItem = [item]
                this.isAdd = true
                this.isEdit = false
                this.orderCfg.show = true
            },
            //核销多个
            verifyAll(){
                this.pageType = 'draft'
                if (this.checkData.length < 1) {
                    this.verifyAllCfg.show = true
                    this.verifyAllCfg.msg = '请至少选择一条数据'
                } else {
                    this.actItem = this.checkData
                    this.isAdd = true
                    this.orderCfg.show = true
                }
            },
            //打开待处理，待审核，已审核详情界面
            openInfoOthers(item){
                this.pageType = 'others'
                this.actItem = [item]
                this.isAdd = false
                this.isEdit = false
                this.orderCfg.show = true
            },
            //编辑待处理
            editOpt(type, item){
                this.pageType = 'others'
                if (type == 'edit') {
                    this.actItem = [item]
                    this.isAdd = false
                    this.isEdit = true
                    this.orderCfg.show = true
                }
                if (type == 'delete') {
                    this.delCfg.show = true
                    this.actItem = item
                }

                if (type == 'push') {
                    this.sendData('verify/receivable/submit/', '提交审核成功', item.docNo)
                }
            },
            delData(){
                this.sendData('verify/receivable/delete/', '删除成功', this.actItem.docNo)
            },
            sendData(url, tips, id){
                this.$http.get(__URL.financial + url + id).then(
                    res => {
                        if (res.data.success) {
                            this.refresh('success', tips)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },
            doGiveUp(type, item){
                this.$http.get(__URL.financial + 'verify/receivable/repeal/' + item.docNo).then(
                    res => {
                        if (res.data.success) {
                            this.refresh('success', '撤销提交成功，等待主管同意')
                        } else {
                            this.setWarningSuccess('failure', '撤销提交失败')
                        }
                    }
                )
            },
            //设置提示信息
            setWarningSuccess(type, data){
                this.warnCfg.show = true
                this.warnCfg.content = data
                this.warnCfg.type = type
            },
            refresh(type, tips){
                this.orderCfg.show = false
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
                this.checkData = []
            },
            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },
        computed: {
            tableCfg() {
                return cfg.tableCfg
            },
            tableCfg2(){
                return cfg.tableCfg2
            },
            tableCfg3(){
                return cfg.tableCfg3
            },
            tableCfg4(){
                return cfg.tableCfg4
            }
        },
        watch: {
            leftItemCfg: {
                handler(val, oldval){
                    if (val.tabCfg.select == 'waitVerify') {
                        this.showTable = 1
                        this.tableData = []
                        this.checkData = []
                    }
                    if (val.tabCfg.select == 'wait') {
                        this.showTable = 2
                        this.tableData = []
                    }
                    if (val.tabCfg.select == 'no') {
                        this.showTable = 3
                        this.tableData = []
                    }
                    if (val.tabCfg.select == 'yes') {
                        this.showTable = 4
                        this.tableData = []
                    }
                },
                deep: true
            }
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getList'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a v-if="leftItemCfg.tabCfg.select == 'waitVerify'" href="javascript:;" @click="verifyAll">
                        <i class='icon-cancel__batch'></i>批量核销
                    </a>
                </div>
                <div v-if="showTable == 1" class="item_body">
                    <vtable :checkbox="checkData" :config='tableCfg' :data='tableData' @op="verify"
                            @link="openInfo"></vtable>
                </div>
                <div v-if="showTable == 2" class="item_body">
                    <vtable :config='tableCfg2' @op="editOpt" :data='tableData' @link="openInfoOthers"></vtable>
                </div>
                <div v-if="showTable == 3" class="item_body">
                    <vtable :config='tableCfg3' @op="doGiveUp" :data='tableData' @link="openInfoOthers"></vtable>
                </div>
                <div v-if="showTable == 4" class="item_body">
                    <vtable :config='tableCfg4' :data='tableData' @link="openInfoOthers"></vtable>
                </div>
            </div>
        </div>
        <!--审核内页-->
        <inner :config="orderCfg">
            <info :show="orderCfg" @refresh="refresh" @refreshonly="refreshOnly" :item-arr="actItem" :type="pageType"
                  :add="isAdd" :edit="isEdit"></info>
        </inner>

        <inner :config='recCfg'>
            <rec :show="recCfg" :id="actId" :back="isBack"></rec>
        </inner>

        <!--批量核销提示-->
        <alert :config="verifyAllCfg"></alert>
        <!--删除提示-->
        <alert :config="delCfg" @cb="delData"></alert>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
    </container>
</template>
