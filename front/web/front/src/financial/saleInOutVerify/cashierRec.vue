<script>

    export default {
        props: ['id', 'back', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '待审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '已审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                //页面数据模型
                infoModel: {
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docDate": "",
                    "docNo": "",
                    "docStatus": "",
                    "employeeCode": "",
                    "employeeName": "",
                    "exchRate": "",
                    "exchRateTypeCode": "",
                    "exchRateTypeName": "",
                    "payerCode": "",
                    "payerName": "",
                    "payerTypeCode": "",
                    "payerTypeName": "",
                    "paymentCode": "",
                    "paymentDocNo": "",
                    "paymentName": "",
                    "recReturnAmount": "",
                    "showRecReturnAmount": "",
                    "recTypeCode": "",
                    "recTypeName": "",
                    "repeal": "",
                    "workflowStatus": 1,
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
            }
        },
        ready(){
            if (this.id) this.getInfo()
            if (this.back) this.show.title = '收款退款单详情'
        },
        methods: {

            /*verify(){

            },*/

            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'cashier/rec/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModel = res.data.data
                        }
                        for (var i = 0; i < this.infoModel.workflowStatus; i++){
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },
        }
    }
</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 v-if="back" class="tag">收款退款单信息</h2>
            <h2 v-else class="tag">收款单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label v-if="back">退款日期:</label>
                    <label v-else>收款日期:</label>
                    <p>{{infoModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label v-if="back">退款人类型:</label>
                    <label v-else>收款人类型:</label>
                    <p>{{infoModel.payerTypeName}}</p>
                </div>
                <div class="form-group">
                    <label v-if="back">退款人:</label>
                    <label v-else>收款人:</label>
                    <p>{{infoModel.payerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <p>{{infoModel.exchRateTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{infoModel.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <p>{{infoModel.paymentName}}</p>
                </div>
                <div class="form-group">
                    <label>结算单号:</label>
                    <p>{{infoModel.paymentDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>经办人:</label>
                    <p>{{infoModel.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label v-if="back">退款类型:</label>
                    <label v-else>收款类型:</label>
                    <p>{{infoModel.recTypeName}}</p>
                </div>
                <div class="form-group">
                    <label v-if="back">退款金额:</label>
                    <label v-else>收款金额:</label>
                    <p v-else>{{infoModel.showRecReturnAmount}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show.show = false">关闭</button>
        <!--<button class="btn-xl-imp" @click="verify">核销</button>-->
    </div>

    <warning :config="wCfg"></warning>

</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
