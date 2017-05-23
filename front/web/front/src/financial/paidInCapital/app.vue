<script>

    import cfg from './cfg.js'
    import detail from './detail'
    import nonstockdetail from './nonstockdetail'

    export default {
        components: {
            detail,
            nonstockdetail,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '实收资本'
                },
                nonstackorderCfg: {
                    show: false,
                    title: '实收资本'
                },
                modalConfig: {
                    show: false,
                    width: '368px',
                    height: '250px',
                    header: '请选择资本类型'
                },
                actId: '',
                isAdd: false,
                isEdit: false,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                backData: {},
                revokeCb: true,
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
                }
            }
        },
        methods: {

            //新增按钮事件
            addNew(){
                this.actId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.modalConfig.show = true;
            },
            //关闭新增页面
            closeNew(type, text){
                this.orderCfg.show = false;
                this.nonstackorderCfg.show = false;
                this.isEdit = false;
                this.refresh(type, text)
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

            jumpAdd(obj){
                this.modalConfig.show = false;
                if(obj == '1'){
                    this.orderCfg.show = true;
                    return;
                }
                this.nonstackorderCfg.show = true;
            },
            operate(type, item) {
                if (type == 'modify') {
                    this.actId = item.docNo;
                    this.isAdd = false;
                    if (item.docType == 3) {
                        this.isBack = true;
                        this.backCfg.show = true;
                    } else {
                        this.isBack = false;
                        this.orderCfg.show = true;
                    }
                    this.isEdit = true;

                } else if (type == 'delete') {
                    this.delCfg.show = true;
                } else if (type == 'submit') {
                    this.operateData(__URL.financial + 'paidincapital/submitaudit/', item.docNo + '/' + item.recordVersion, '提交审核')
                } else if (type == 'repeal') {
                    this.operateData(__URL.financial + 'paidincapital/repeal/', item.docNo + '/' + item.recordVersion, '撤销提交')
                }
            },

            doDel(){
                this.operateData(__URL.financial + 'paidincapital/delete/', item.docNo, '删除成功')
            },
            href(item, type) {
                this.actId = item.docNo;
                this.isAdd = false;
                this.isEdit = false;
                if(item.capitalType == '2'){
                    this.nonstackorderCfg.show = true;
                    return;
                }
                this.orderCfg.show = true;
            },

            getFilter(item, obj) {

                if (obj && obj.currencyCode) {
                    item.currencyCode = obj.currencyCode;
                }
                if (obj && obj.investor) {
                    item.investor = obj.investor;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                this.$http.post(__URL.financial + 'paidincapital/table', obj).then(
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

    <!-- 弹框系列 -->
    <modal :config.sync='modalConfig' @sure='openDetail' @close='modalConfig.show = false;'>
        <div class="modal-input-wrap">
            <div class='item'>
                <img src="../../../../../public/images/cash.png" alt="以现金投资非股份公司" @click="jumpAdd('1')"/>
                <div>以现金投资非股份公司</div>
            </div>
            <div class='item'>
                <img src="../../../../../public/images/bankbalance.png" alt="以现金投资股份公司" @click="jumpAdd('2')"/>
                <div>以现金投资股份公司</div>
            </div>
        </div>
    </modal>

    <inner :config='orderCfg'>
        <detail :show="orderCfg" :id="actId" :add="isAdd" :edit.sync="isEdit"
                @refresh='closeNew' @refreshonly='refreshOnly'></detail>
    </inner>

    <inner :config='nonstackorderCfg'>
        <nonstockdetail :show="nonstackorderCfg" :id="actId" :add="isAdd" :edit.sync="isEdit"
                @refresh='closeNew' @refreshonly='refreshOnly'></nonstockdetail>
    </inner>

    <alert :config="delCfg" @cb="doDel"></alert>
    <warning :config="wCfg"></warning>
</template>
<style lang="less" scoped>
    .modal-input-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 204px;

    .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 113px;
        height: 130px;
        margin-bottom: 30px;
        background-color: #fcfeff;
        border: 1px solid #ebf7fd;
        border-radius: 5px;
        cursor: pointer;

    &:first-of-type {
         margin-right: 40px;
     }

    &:hover,
    &:active {
         border-color: #03a9f4;

    div {
        color: #03a9f4;
    }
    }

    img {
        display: block;
        width: 80px;
        height: 80px;
    }

    div {
        margin-top: 12px;
        color: #757575;
        font-size: 12px;
    }
    }
    }
</style>