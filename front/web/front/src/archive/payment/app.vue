<script>
    import cfg from './cfg.js'

    export default {
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listCfg,
                paymentModalCfg: cfg.paymentModalCfg,
                tableData: [],
                tipsCfg: {
                    show: false,
                    content: '操作成功',
                    type: 'success'
                },
                confirmCfg: {
                    show: false,
                    msg: '',
                    subMsg: '',
                    type: 'success',
                    quite: false
                },
                paymentCfg: {},
                repeatSubmit: false
            }
        },
        methods: {
            reset() {
                this.$broadcast('_RESETLIST')
                this.tableData = []
            },
            operate(type, item) {
                if (type == "delete") {
                    this.confirmCfg.show = true;
                    this.confirmCfg.msg = '确认要删除当前结算方式吗?';
                    this.paymentModalCfg.paymentCode = item.paymentCode;
                }
                if (type == "modify") {
                    this.paymentModalCfg.header = '修改结算方式';
                    this.$http.get(__URL.arc + 'payment/detail/' + item.paymentCode).then(
                        (res) => {
                            this.paymentCfg = res.data.data;
                            this.paymentModalCfg.show = true;
                        }
                    );
                }
            },
            /* table数据请求 */
            getList(item) {
                this.$http.post(__URL.arc + 'payment/list/' + item.paymentCode).then(
                    (res) => {
                        this.tableData = res.data.data.dataList;
                    }
                )
            },
            //新增按钮事件
            addPaymentDialog(){
                this.paymentModalCfg.header = '新增结算方式';
                this.paymentCfg = {};
                this.paymentModalCfg.show = true;
            },
            check(){
                if (this.paymentCfg.paymentName == undefined || this.paymentCfg.paymentName == '') {
                    this.tipsCfg.type = 'failure';
                    this.refresh("结算方式名称不能为空");
                    return false;
                }
                return true
            },
            //保存按钮事件
            doSavePayment(){
                if (this.repeatSubmit)return;
                this.repeatSubmit = true;
                //保存前校验
                if (!this.check()) {
                    return
                }
                if (undefined != this.paymentCfg.paymentCode && this.paymentCfg.paymentCode != '') {
                    this.$http.post(__URL.arc + 'payment/update', this.paymentCfg).then(
                        (res) => {
                            this.msgTips(res);
                        }
                    )
                } else {
                    this.$http.post(__URL.arc + 'payment/insert', this.paymentCfg).then(
                        (res) => {
                            this.msgTips(res);
                        }
                    )
                }
            },
            //删除结算方式
            deletePayment(){
                if (this.repeatSubmit)return;
                this.repeatSubmit = true;
                this.$http.get(__URL.arc + 'payment/delete/' + this.paymentModalCfg.paymentCode).then(
                    (res) => {
                        this.msgTips(res);
                    }
                );
            },
            msgTips(res){
                if (res.data.success) {
                    this.tipsCfg.type = 'success';
                    this.refresh(res.data.data);
                } else {
                    this.tipsCfg.type = 'failure';
                    this.refresh(res.data.errMsg);
                }
            },
            //关闭新增页面
            doClosePayment(text){
                this.paymentModalCfg.show = false;
                this.refresh(text);
            },
            //刷新外页
            refresh(text){
                if (text) {
                    this.repeatSubmit = false;
                    this.tipsCfg.content = text;
                    this.tipsCfg.show = true;
                    this.paymentModalCfg.show = false;
                    this.reset();
                }
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
                return cfg.tableCfg
            }
        }
    }


</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable'  @cb='getList' @add='addPaymentDialog'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <alert :config="confirmCfg" @cb="deletePayment"></alert>
    <warning :config="tipsCfg"></warning>

    <!-- 新增弹框系列 -->
    <modal :config.sync='paymentModalCfg' @sure='doSavePayment' @close='doClosePayment'>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>结算方式:</label>
                <input type='text' maxlength="20" v-model='paymentCfg.paymentName' placeholder='请输入结算方式'>
            </div>
            <div class='form-group wd-100'>
                <label>备注:</label>
                <input type='text' maxlength="100" v-model='paymentCfg.remark' placeholder='请输入备注'>
            </div>
    </modal>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>