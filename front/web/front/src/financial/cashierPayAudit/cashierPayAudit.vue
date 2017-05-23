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
                infoModal: {
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docDate": "",
                    "docNo": "",
                    "docStatus":"",
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
                    "payReturnAmount": "",
                    "showPayReturnAmount": "",
                    "payTypeCode": "",
                    "payTypeName": "",
                    "repeal": "",
                    "workflowStatus": "",
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb : true,
            }
        },
        ready(){
            if (this.id) this.getInfo()
            if (this.back) this.show.title = '付款退款单'
        },
        methods: {
            doRepeal(){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(__URL.financial + 'cashier/pay/pending/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "撤销成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            doAudit(){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(__URL.financial + 'cashier/pay/audit/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "审核成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            doUnaudit(){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(__URL.financial + 'cashier/pay/unaudit/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "弃审成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'cashier/pay/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal = res.data.data
                        }
                        for (var i = 0; i < this.infoModal.workflowStatus; i++){
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },
        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 v-if="back" class="tag">付款退款单信息</h2>
            <h2 v-else class="tag">付款单信息</h2>

                <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款日期:</label>
                        <label v-else><span v-if="edit || add" class="must-point">*</span>付款日期:</label>
                        <p>{{infoModal.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款人类型:</label>
                        <label v-else><span v-if="edit || add" class="must-point">*</span>付款人类型:</label>
                        <p>{{infoModal.payerTypeName}}</p>
                    </div>
                    <div class="form-group">
                        <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款人:</label>
                        <label v-else><span v-if="edit || add" class="must-point">*</span>付款人:</label>
                        <p>{{infoModal.payerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p>{{infoModal.currencyName}}</p>
                    </div>
                    <div class="form-group">
                        <label>汇率类型:</label>
                        <p>{{infoModal.exchRateTypeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>汇率:</label>
                        <p>{{infoModal.exchRate}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit || add" class="must-point">*</span>结算方式:</label>
                        <p>{{infoModal.paymentName}}</p>
                    </div>
                    <div class="form-group">
                        <label>结算单号:</label>
                        <p>{{infoModal.paymentDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>经办人:</label>
                        <p>{{infoModal.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款类型:</label>
                        <label v-else><span v-if="edit || add" class="must-point">*</span>付款类型:</label>
                        <p>{{infoModal.payTypeName}}</p>
                    </div>
                    <div class="form-group">
                        <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款金额:</label>
                        <label v-else><span v-if="edit || add" class="must-point">*</span>付款金额:</label>
                        <p v-else>{{infoModal.showPayReturnAmount}}</p>
                    </div>
                </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show.show = false">取消</button>
        <ajax-button class="btn-xl-imp" @click="doRepeal" v-if="infoModal.repeal">同意撤销提交</ajax-button>
        <ajax-button class="btn-xl-imp" @click="doAudit" v-if="!infoModal.repeal && infoModal.docStatus==1">审核</ajax-button>
        <ajax-button class="btn-xl-danger" @click="doUnaudit" v-if="infoModal.docStatus==2">弃审</ajax-button>
    </div>

    <!--&lt;!&ndash;提示&ndash;&gt;-->
    <warning :config="wCfg"></warning>

    <!--&lt;!&ndash;Bom设置&ndash;&gt;-->
    <!--<inner :config='detailCfg'>
        <bomsetting :act="activeItem" :show="detailCfg"></bomsetting>
    </inner>-->
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
