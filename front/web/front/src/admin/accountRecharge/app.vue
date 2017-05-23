<script>
    import tradeInfo from './tradeinfo.vue'
    import mix from './mixin'
    export default{
        components:{
            tradeInfo
        },
        mixins: [mix],
        data(){
            return {
                infoCfg: {
                    show: false,
                },
                balance: '0',
                paidList: {
                    totalFee: 0,
                    trades: []
                },
                actItem: ''
            }
        },
        ready(){
            this.getBalance()
            this.getPaidList()
        },
        methods: {
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
            getPaidList(year = new Date().getFullYear(), month = new Date().getMonth() + 1){
                let param = {
                    year: year,
                    month: month
                }
                this.$http.post(__URL.expense + 'prepaidList', param, {emulateJSON: true}).then(
                    res => {
                        if (res.data.success) {
                            this.paidList = res.data.data
                        }
                    }
                )
            },
            lookInfo(val){
                this.actItem = val
                this.infoCfg.show = true
            },

        }
    }
</script>
<template>
    <div class="container">
        <div class="new-content">
            <div class="account">
                <div class="title">
                    账户总览
                </div>
                <div class="info">
                    <div class="info-title">
                        当前账户余额
                    </div>
                    <div class="info-content">
                        <span>{{balance}}</span>
                        <button class="btn-lg-imp" v-link="{path:'accountRecharge/recharge'}">充值</button>
                    </div>
                </div>
            </div>
            <div class="history">
                <div class="history-tab">
                    <div class="tab active">
                        充值记录

                    </div>
                    <div class="tab">
                        <a v-link="{path:'accountRecharge/history'}">历史记录</a>
                    </div>
                </div>
                <div class="history-content">
                    <div class="amount">
                        <div class="date"><i
                                class="icon-date"></i><span>{{new Date().getFullYear()}}年{{new Date().getMonth() + 1}}月</span>
                        </div>
                        <div class="money">
                            <i class="icon-money"></i>
                            <span class="normal">本月充值总额:</span>
                            <span>￥{{fixedNumber(paidList.totalFee)}}</span>
                        </div>
                    </div>
                    <template v-if="paidList.trades && paidList.trades.length >0">
                        <table class="table-special">
                            <thead>
                            <tr>
                                <th width="20%">日期</th>
                                <th width="25%">支付方式</th>
                                <th width="20%">充值金额</th>
                                <th width="20%">余额</th>
                                <th width="15%"></th>
                            </tr>
                            </thead>
                        </table>
                        <div class="table-wrap">
                            <table class="table-special">
                                <tbody>
                                <tr v-for="item in paidList.trades">
                                    <td width="20%">{{item.tradeTime}}</td>
                                    <td width="25%">{{item.payType}}</td>
                                    <td width="20%">{{fixedNumber(item.tradeFee)}}</td>
                                    <td width="20%">{{fixedNumber(item.totalFee)}}</td>
                                    <td width="15%">
                                        <button class="button-default" @click="lookInfo(item)">查看详情</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <div class="no-data" v-else>
                        <div class="no-content">
                            <i class="icon icon-paid__list"></i>
                            <span>本月没有充值记录</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <trade-info :config="infoCfg" :data="actItem"></trade-info>
</template>

<style lang="less" scoped>
    @import './charge.less';

</style>
