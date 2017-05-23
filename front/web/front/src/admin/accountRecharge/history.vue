<script>
    import tradeInfo from './tradeinfo.vue'
    import mix from './mixin'
    export default{
        mixins: [mix],
        components: {
            tradeInfo
        },
        data(){
            return {
                infoCfg: {
                    show: false
                },
                yearList: [],
                monthList: [],
                //选择的年份与月份
                checkedYear: '0',
                checkedMonth: '0',
                //显示的年份与月份
                showYear: '',
                showMonth: '',
                paidList: {
                    totalFee: 0,
                    trades: []
                },
                actItem: ''
            }
        },
        ready(){
            this.getSelect()
            this.getPaidList()
        },
        methods: {
            getSelect(){
                for (let i = 2015, l = new Date().getFullYear() + 1; i < l; i++) {
                    this.yearList.push(i)
                }
                this.yearList.reverse()
                for (let i = 1, l = 13; i < l; i++) {
                    this.monthList.push(i)
                }
            },
            searchList(){
                this.getPaidList(this.checkedYear, this.checkedMonth)
            },
            getPaidList(year = new Date().getFullYear(), month = new Date().getMonth() + 1){
                this.showYear = year
                this.showMonth = month
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

        },

    }
</script>

<template>
    <div class="container">
        <div class="new-content">
            <div class="account h-100">
                <div class="title">
                    历史记录

                </div>
                <div class="select-date">
                    <span>时间:</span>
                    <select v-model="checkedYear">
                        <option :value="0">请选择年份</option>
                        <option v-for="item in yearList" :value="item">{{item}}年</option>
                    </select>
                    <span>—</span>
                    <select v-model="checkedMonth">
                        <option :value="0">请选择月份</option>
                        <option v-for="item in monthList" :value="item">{{item}}月</option>
                    </select>
                    <button class="btn-md-imp" @click="searchList" :disabled="checkedYear == 0 || checkedMonth == 0">
                        查询
                    </button>
                </div>
                <div class="history-content history-wrap">
                    <div class="amount">
                        <div class="date"><i class="icon-date"></i>
                            <span>{{showYear}}年{{showMonth}}月</span>
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
    @import '../../../../../public/css/variable.less';

    .history-wrap {
        height: calc(~"100% - 145px");
        border: 1px solid @border-color;
    }
</style>