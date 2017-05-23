<script>
    import mix from './mixin'

    export default{
        mixins: [mix],
        props: ['config', 'data'],
        methods:{
            close(){
                this.config.show = false
            }
        },
        computed: {
            infoCfg(){
                let c = {
                    show: this.config.show,
                    title: '充值详情',
                    quite: false,
                    sure: false,
                    width: 486,
                }
                return c
            }
        }
    }
</script>

<template>
    <alert :config="infoCfg" @close="close">
        <ul class="info-list">
            <li>
                <div class="title">流水号：</div>
                <div class="info">{{data.code}}</div>
            </li>
            <li>
                <div class="title">支付金额：</div>
                <div class="info">{{fixedNumber(data.tradeFee)}}元</div>
            </li>
            <li>
                <div class="title">类型：</div>
                <div class="info">{{getType(data.type)}}</div>
            </li>
            <li>
                <div class="title">支付方式：</div>
                <div class="info">{{data.payType}}</div>
            </li>
            <li>
                <div class="title">时间：</div>
                <div class="info">{{data.tradeTime}}</div>
            </li>
            <li>
                <div class="title">账户余额：</div>
                <div class="info">{{fixedNumber(data.totalFee)}}元</div>
            </li>
        </ul>
    </alert>
</template>

<style lang="less" scoped>
    @import './charge.less';
</style>