<script>
    import bankCode from './bankcode'
    import mix from './mixin'

    export default{
        mixins: [mix],
        data(){
            return {
                //当前选中银行显示栏
                actTab: 'b2c',
                //正在充值弹框
                chargeCfg: {
                    show: false,
                    title: '提示',
                    quite: false,
                    sure: false,
                    width: 486,
                },
                //充值成功提示框
                successCfg: {
                    show: false,
                    title: '提示',
                    quite: false,
                    sure: false,
                    width: 486,
                },
                failureCfg:{
                    show:false,
                    title: '提示',
                    msg: '充值失败',
                    subMsg: '',
                    type: 'failure',
                    width: 360,
                    quite: false,
                    sure: false,
                },
                //总余额
                balance: '0',
                //充值金额
                amount: '',
                //当前选中的银行
                currentBank: {
                    key: '',
                    name: '',
                    code: ''
                },
                //打开充值链接后，获取到的单据信息
                tradeInfo: '',
                //充值成功后的信息
                trade: '',
                repeatLock:false
            }
        },
        ready(){
            this.getBalance()
        },
        methods: {
            /*
             * 切换显示银行
             * */
            changeTab(val){
                this.actTab = val
            },
            /*
             * 选择银行
             * */
            checkBank(val){
                this.currentBank = val
            },
            /*
             * 获取帐户余额
             * */
            getBalance(){
                this.$http.post(__URL.expense + 'amount').then(
                    res => {
                        if (res.data.success) {
                            this.balance = this.fixedNumber(res.data.data)
                        }
                    }
                )
            },
            /*
             * 获取充值地址
             * */
            getChargeUrl(){
                let nw = window.open('about:blank');
                let param = {
                    amount: this.amount*100,
                    frpId: this.currentBank.code
                }
                this.$http.post(__URL.expense + 'payUrl', param, {emulateJSON: true}).then(
                    res => {
                        if (res.data.success) {
                            this.chargeCfg.show = true
                            this.tradeInfo = res.data.data
                            nw.location.href = res.data.data.url
                        }
                    }
                )
            },
            /*
             * 充值完成,查询当前单的状态
             * */
            chargeDone(){
                if(this.repeatLock) return
                this.repeatLock = true
                let param = {
                    tradeNo: this.tradeInfo.tradeNo
                }
                this.$http.post(__URL.expense + 'updatePayment', param, {emulateJSON: true}).then(
                    res => {
                        this.chargeCfg.show = false
                        this.repeatLock = false
                        if (res.data.success) {
                            this.successCfg.show = true
                            this.trade = res.data.data
                        } else {
                           this.failureCfg.show = true
                           this.failureCfg.subMsg = `流水号：${this.tradeInfo.tradeNo}；失败原因：${res.data.errMsg}`
                        }
                    }
                )
            },
            /*
             * 充值遇到问题
             * */
            chargeProblem(){
                window.open('http://www.yeepay.com/customerService/question')
            },
            lookAccount(){
                this.$router.go('/a/accountRecharge')
            }
        },
        computed: {
            bankList(){
                return bankCode[this.actTab]
            }
        }
    }
</script>

<template>
    <div class="container">
        <div class="new-content">
            <div class="account h-100">
                <div class="title">
                    充值

                </div>
                <div class="info">
                    <div class="info-title">
                        当前账户余额(元):￥{{balance}}

                    </div>
                    <div class="info-charge">
                        充值金额：<input
                            onKeyUp="this.value=this.value.replace(/[^\d]/g,'')"
                            onblur="this.value=this.value.replace(/[^\d]/g,'')"
                            type="text" maxlength="8" v-model="amount"> <span
                            class="gray">元</span>
                    </div>
                </div>
                <div class="recharge">
                    <div class="page-bar">
                        <a href="javascript:;" @click="changeTab('b2c')" :class="{'active':actTab == 'b2c'}">
                            个人网银充值
                        </a>
                        <a href="javascript:;" @click="changeTab('b2b')" :class="{'active':actTab == 'b2b'}">
                            企业网银充值
                        </a>
                    </div>
                    <div class="page-content">
                        <div :class="['bank',item.key,{'active':item.code == currentBank.code}]"
                             @click="checkBank(item)" v-for="item in bankList"></div>
                    </div>
                </div>
                <button class="btn-lg-imp" @click="getChargeUrl" :disabled="amount == ''||currentBank.code==''">下一步
                </button>
            </div>
        </div>
    </div>
    <alert :config="chargeCfg">
        <div class="charge-info">
            <span>流水号：{{tradeInfo.tradeNo}}</span>
        </div>
        <div class="charging">
            <div class="icon-wrap"><i class="icon-funnel icon"></i></div>
            <div class="main-title">请在新打开的{{currentBank.name}}界面完成支付</div>
            <div class="sub-title">支付完成前请不要关闭窗口</div>
            <div>
                <button class="btn-lg-imp" @click="chargeDone">已完成支付</button>
                <button class="btn-lg-def" @click="chargeProblem">支付遇到问题</button>
            </div>
        </div>
    </alert>
    <alert :config="failureCfg"></alert>
    <alert :config="successCfg">
        <div class="charging">
            <div class="success-tips">
                <i class="icon-success"></i>
                <span>恭喜您,您已充值成功</span>
            </div>
            <ul class="info-list">
                <li>
                    <div class="title">流水号：</div>
                    <div class="info">{{trade.code}}</div>
                </li>
                <li>
                    <div class="title">支付金额：</div>
                    <div class="info">{{fixedNumber(trade.tradeFee)}}元</div>
                </li>
                <li>
                    <div class="title">类型：</div>
                    <div class="info">{{getType(trade.type)}}</div>
                </li>
                <li>
                    <div class="title">支付方式：</div>
                    <div class="info">{{trade.payType}}</div>
                </li>
                <li>
                    <div class="title">时间：</div>
                    <div class="info">{{trade.tradeTime}}</div>
                </li>
                <li>
                    <div class="title">账户余额：</div>
                    <div class="info">{{fixedNumber(trade.totalFee)}}元</div>
                </li>
            </ul>
            <div class="look-account">
                <button class="btn-lg-imp" @click="lookAccount">查看账户总览</button>
            </div>
        </div>
    </alert>
</template>

<style lang="less">
    @import '../../../../../public/css/variable.less';
    @import './charge.less';
    @import './bank.less';

    .recharge {
        margin-top: 15px;
        margin-bottom: 20px;
    }
    .charge-info{
        width: 100%;
        display: flex;
        margin-top: -12px;
        margin-left: -4px;
        margin-bottom: 20px;

        span{
            display: flex;
            height: 18px;
            align-items: center;
            background-color: #f7f8fc;
            border-radius: 9px;
            padding: 0 10px;
            font-size: 12px;
        }
    }
    .charging {
        width: 100%;
        padding: 0 40px;
        .icon-wrap {
            width: 60px;
            height: 60px;
            background-color: #F5A623;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;

            .icon {
                font-size: 40px;
                color: white;
                margin-right: 0;
            }
        }
        .main-title {
            margin: 25px 0 20px 0;
            font-size: 20px;
        }
        .sub-title {
            color: #757575;
            margin-bottom: 50px;
        }
        .success-tips {
            color: #7ED321;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;

            i {
                font-size: 60px;
                margin-right: 10px;
            }
        }
        .look-account{
            margin-top: 10px;
        }
    }

    .page-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .bank {
            display: flex;
            flex-shrink: 0;
            width: 165px;
            height: 46px;
            margin-right: 20px;
            margin-top: 20px;
            border: 1px solid @border-color;
            background-repeat: no-repeat;
            background-position: center center;
            position: relative;
            cursor: pointer;

            &.active {
                border: 2px solid #FF7E00;
            }
            &.active:after {
                display: flex;
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                background-image: url('../../../../../public/images/choose.png');
                width: 16px;
                height: 16px;
            }
        }
    }

</style>