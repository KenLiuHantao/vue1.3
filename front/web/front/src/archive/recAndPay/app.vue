<script>

    import cfg from './cfg.js'

    export default {

        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                recModalCfg: cfg.recModalCfg,
                payModalCfg: cfg.payModalCfg,
                recSaveCfg: cfg.recSaveCfg,
                paySaveCfg: cfg.paySaveCfg,
                recInitialDay: cfg.recInitialDayCfg,
                payInitialDay: cfg.payInitialDayCfg,
                tableData: [],
                tipsCfg: {
                    show: false,
                    content: '操作成功',
                    type: 'success'
                },
            }
        },
        methods: {
            reset() {
                this.$broadcast('_RESETLIST')
                this.tableData = []
            },
            operate(type, item) {
                console.log(type, item);
                if (type == 'delete') {
                    if (item && item.recAgreementCode != undefined) {
                        this.$http.get(__URL.arc + 'rec/agreement/delete/' + item.recAgreementCode).then(
                            (res) => {

                                this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                                this.refresh(res.data.success ?res.data.data:res.data.errMsg);
                            }
                        )
                    }
                    if (item && item.payAgreementCode != undefined) {
                        this.$http.get(__URL.arc + 'pay/agreement/delete/' + item.payAgreementCode).then(
                            (res) => {
                                this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                                this.refresh(res.data.success ? res.data.data:res.data.errMsg);
                            }
                        )
                    }
                }
                if (type == 'modify') {
                    if (item && item.recAgreementCode != undefined) {
                        this.recSaveCfg = item;
                        this.recModalCfg.show = true;
                    }
                    if (item && item.payAgreementCode != undefined) {
                        this.paySaveCfg = item;
                        this.payModalCfg.show = true;
                    }
                }
            },

            getFilter(item, obj) {
                this.tableData = [];
                if (obj && obj.recAgreementCode != undefined) {
                    this.$http.get(__URL.arc + 'rec/agreement/detail/' + obj.recAgreementCode).then(
                        (res) => {
                            this.tableData = res.data.data.dataList;
                            console.log(this.tableData);
                        }
                    )
                    return;
                }
                if (obj && obj.payAgreementCode != undefined) {
                    this.$http.get(__URL.arc + 'pay/agreement/detail/' + obj.payAgreementCode).then(
                        (res) => {
                            this.tableData = res.data.data.dataList;
                            console.log(this.tableData);
                        }
                    )
                    return;
                }
            },
            //新增按钮事件
            addDialog(){
                this.recSaveCfg = '';
                this.paySaveCfg = '';
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        this.recModalCfg.show = true;
                        break;
                    case 'tab2':
                        this.payModalCfg.show = true;
                        break;
                }
            },
            doSaveRec(){
                if (undefined != this.recSaveCfg.recAgreementCode && this.recSaveCfg.recAgreementCode != '') {
                    this.$http.post(__URL.arc + 'rec/agreement/update', this.recSaveCfg).then(
                        (res) => {
                            this.recModalCfg.show = false;
                            this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                            this.refresh(res.data.success ? res.data.data:res.data.errMsg);
                        }
                    )
                } else {
                    this.$http.post(__URL.arc + 'rec/agreement/insert', this.recSaveCfg).then(
                        (res) => {
                            this.recModalCfg.show = false;
                            this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                            this.refresh(res.data.success ? res.data.data:res.data.errMsg);
                        }
                    )
                }
            },
            doSavePay(){
                if (undefined != this.paySaveCfg.payAgreementCode && this.paySaveCfg.payAgreementCode != '') {
                    this.$http.post(__URL.arc + 'pay/agreement/update', this.paySaveCfg).then(
                        (res) => {
                            this.payModalCfg.show = false;
                            this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                            this.refresh(res.data.success ? res.data.data:res.data.errMsg);
                        }
                    )
                } else {
                    this.$http.post(__URL.arc + 'pay/agreement/insert', this.paySaveCfg).then(
                        (res) => {
                            this.payModalCfg.show = false;
                            this.tipsCfg.type = res.data.success ? 'success' : 'failure';
                            this.refresh(res.data.success ? res.data.data:res.data.errMsg);
                        }
                    )
                }
            },
            //关闭新增页面
            doCloseRec(text){
                this.recModalCfg.show = false;
                this.refresh(text);
            },
            doClosePay(text){
                this.payModalCfg.show = false;
                this.refresh(text);
            },
            refresh(text){
                if (text) {
                    this.tipsCfg.content = text;
                    this.tipsCfg.show = true;
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
                var myCfg = cfg.recAgreementCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.recAgreementCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.payAgreementCfg;
                        break;
                }
                return myCfg;
            },
        }
    }
</script>
<template>
    <alert :config="dCfg"></alert>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addDialog'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <warning :config="tipsCfg"></warning>

    <!-- 新增弹框系列 -->
    <modal :config.sync='recModalCfg' @sure='doSaveRec' @close='doCloseRec'>
            <div class='form-group wd-100'>
                    <label>协议类型:</label>
                    <P>收款协议</P>
            </div>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>名称:</label>
                <div class="s-input">
                <input type='text' maxlength="20" v-model='recSaveCfg.recAgreementName' placeholder='请输入名称'>
                </div>
            </div>
            <div class='form-group wd-100'>
                <label>起算日:</label>
                <div class="s-input">
                <select v-model='recSaveCfg.initialDay'>
                    <option :value='item' v-for='item in recInitialDay'>{{item}}</option>
                </select>
                </div>
            </div>
            <div class='form-group wd-100'>
                <label>账期:</label>
                <div class="s-input">
                <input type='text' maxlength="20" v-model='recSaveCfg.deviationDay' placeholder='请输入账期'>
                </div>
            </div>
            <div class='form-group wd-100' >
                <label>备注:</label>
                <div class="s-input">
                <input type='text' maxlength="100" v-model='recSaveCfg.remark' placeholder='请输入备注'>
                </div>
            </div>
    </modal>

    <modal :config.sync='payModalCfg' @sure='doSavePay' @close='doClosePay'>
            <div class='form-group wd-100'>
                    <label>协议类型:</label>
                    <p>付款协议</p>
            </div>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>名称:</label>
                <input type='text' maxlength="20" v-model='paySaveCfg.payAgreementName' placeholder='请输入名称'>
            </div>
            <div class='form-group wd-100'>
                <label>起算日:</label>
                <select v-model='paySaveCfg.initialDay'>
                    <option :value='item' v-for='item in payInitialDay'>{{item}}</option>
                </select>
            </div>
            <div class='form-group wd-100'>
                <label>账期:</label>
                <input type='text' maxlength="20" v-model='paySaveCfg.deviationDay' placeholder='请输入账期'>
            </div>
            <div class='form-group wd-100'>
                <label>备注:</label>
                <input type='text' maxlength="100" v-model='paySaveCfg.remark' placeholder='请输入备注'>
            </div>
    </modal>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

