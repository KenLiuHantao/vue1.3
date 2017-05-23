<script>
    import cfg from './cfg'
    export default {
        props: [
            "bankDetail",
            "detail",
        ],
        data() {
            return {
                allBank: [],
                allCurrency: [],
                msgConfig: {
                    show: false,
                    content: '提交成功',
                    type: 'success'
                },
                newBank: '',
            }
        },
        watch: {
            bankDetail: {
                handler(val){
                    this.newBank = val
                },
                deep: true
            }
        },
        methods: {
            sure(){
                for (var i = 0; i < this.allBank.length; i++) {
                    var b = this.allBank[i];
                    if (b.bankCode == this.newBank.bankCode) {
                        this.newBank.bankName = b.bankName;
                        break;
                    }
                }
                for (var i = 0; i < this.allCurrency.length; i++) {
                    var c = this.allCurrency[i];
                    if (c.currencyCode == this.newBank.currencyCode) {
                        this.newBank.currencyName = c.currencyName;
                        break;
                    }
                }

                this.$http.post(__URL.arc + 'bankaccount/update', this.newBank).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "保存成功！")
                            this.close();
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )

            },
            setWarningSuccess(type, data){
                this.msgConfig.show = true
                this.msgConfig.content = data
                this.msgConfig.type = type
            },

            close(){//关闭
                this.detail.show = false;
            }
        },
        ready(){
            this.$http.post(__URL.arc + 'bankaccount/dictionary', {}).then(
                (res) => {
                    if (res.data.success) {
                        var d = res.data.data;
                        for (var i = 0; i < d.length; i++) {
                            this.allBank.push({"bankCode": d[i].dicCode, "bankName": d[i].dicName});
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到银行数据')
                }
            );

            this.$http.post(__URL.arc + 'currency/local', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allCurrency = res.data.data;
                        for (var i = 0; i < this.allCurrency.length; i++) {
                            if (this.allCurrency[i].localCurrency == '是') {
                                this.allCurrency[i].localCurrency = 'true'
                            }
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
            );
            this.newBank = this.bankDetail;
        }
    }


</script>
<template>
    <modal :config="detail" @sure='sure' @close='close' @quite="close">
        <div class="form-group wd-100">
            <label>账户名:</label>
            <input v-model="newBank.account" maxlength="32" placeholder="请输入" type="text">
        </div>

        <div class="form-group wd-100">
            <label>银行:</label>
            <select v-model="newBank.bankCode">
                <option :value='item.bankCode' v-for='item in allBank'>{{item.bankName}}</option>
            </select>
        </div>

        <div class="form-group wd-100">
            <label>结算币种:</label>
            <select v-model='newBank.currencyCode'>
                <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
            </select>
        </div>

        <div class="form-group wd-100">
            <label>开户网点:</label>
            <input v-model="newBank.accountBranch" maxlength="32" placeholder="请输入" type="text">
        </div>

        <div class="form-group wd-100">
            <label>开户账号:</label>
            <input v-model="newBank.accountNumber" maxlength="32" placeholder="请输入" type="text">
        </div>
    </modal>


    <warning :config="msgConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>