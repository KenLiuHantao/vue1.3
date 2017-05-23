<script>

    export default {
        props: ['id', 'show'],
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
                    "accountDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docStatus": 0,
                    "customerCode": "",
                    "customerName": "",
                    "docNo": "",
                    "exchRate": 0,
                    "expireDate": "",
                    "recAgreementCode": "",
                    "recAgreementName": "",
                    "recAmount": 0,
                    "recordId": "",
                    "remark": "",
                    "repeal": false,
                    "workflowStatus": 1
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                revokeCb: true,
            }
        },

        ready(){
            this.getInfo()
        },

        methods: {
            operateData(url, param, txt){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(url + param).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', txt)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            refresh(type, tips){
                console.log(tips)
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
            },

            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },

            repeal(){
                this.operateData(__URL.financial + 'init/receivable/pending/', this.id, '撤销审核成功！', 0)
            },

            audit(){
                this.operateData(__URL.financial + 'init/receivable/audit/', this.id, '审核成功！', 2)
            },

            unaudit(){
                this.operateData(__URL.financial + 'init/receivable/unaudit/', this.id, '弃审成功', 1)
            },

            getInfo(){
                this.$http.get(__URL.financial + 'init/receivable/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModel = res.data.data
                            console.log(this.infoModel)
                            for (var i = 0; i < this.infoModel.workflowStatus; i++){
                                this.flowCfg.data[i].flag = true
                            }
                        }
                    }
                )
            }
        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">期初应收单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p>{{infoModel.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{infoModel.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label>应收金额:</label>
                    <p>{{infoModel.recAmount}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <p>{{infoModel.recAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>账款时间:</label>
                    <p>{{infoModel.accountDate}}</p>
                </div>
                <div class="form-group">
                    <label>到期日期:</label>
                    <p>{{infoModel.expireDate}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <p>{{infoModel.remark}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='show.show = false' class="btn-xl-def">取消</button>
        <ajax-button class="btn-xl-imp" @click="repeal" v-if="infoModel.repeal">同意撤销提交</ajax-button>
        <ajax-button class="btn-xl-imp" @click="audit" v-if="!infoModel.repeal && infoModel.docStatus==1">审核</ajax-button>
        <ajax-button class="btn-xl-danger" @click="unaudit" v-if="infoModel.docStatus==2">弃审</ajax-button>
    </div>
    <warning :config="wCfg"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
