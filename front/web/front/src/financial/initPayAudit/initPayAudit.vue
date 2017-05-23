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
                infoModal: {
                    "accountDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docStatus": 0,
                    "supplierCode": "",
                    "supplierName": "",
                    "docNo": "",
                    "exchRate": 0,
                    "expireDate": "",
                    "recAgreementCode": "",
                    "recAgreementName": "",
                    "payAmount": 0,
                    "recordId": "",
                    "remark": "",
                    "repeal": false,
                    "workflowStatus": 0
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                auditCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定审核该数据'
                },
                unauditCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定弃审该数据'
                },
                repealCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定撤销该数据'
                },

                revokeCb : true,

                /*//日期配置
                 dateCfg: {
                 format: 'YYYY-MM-DD'
                 },
                 activeItem: ''*/

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
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', txt)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
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

            doRepeal(){
                this.repealCfg.show = true
            },

            doAudit(){
                this.auditCfg.show = true
            },

            doUnaudit(){
                this.unauditCfg.show = true
            },

            repeal(){
                this.operateData(__URL.financial + 'init/payable/pending/', this.id, '撤销审核成功！', 0)
            },

            audit(){
                this.operateData(__URL.financial + 'init/payable/audit/', this.id, '审核成功！', 2)
            },

            unaudit(){
                this.operateData(__URL.financial + 'init/payable/unaudit/', this.id, '弃审成功', 1)
            },

            getInfo(){
                this.$http.get(__URL.financial + 'init/payable/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal = res.data.data
                            for (var i = 0; i < this.infoModal.workflowStatus; i++){
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

            <h2 class="tag">期初应付单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p>{{infoModal.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModal.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{infoModal.exchangeRate}}</p>
                </div>
                <div class="form-group">
                    <label>应付金额:</label>
                    <p>{{infoModal.payAmount}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <p>{{infoModal.payAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>账款时间:</label>
                    <p>{{infoModal.accountDate}}</p>
                </div>
                <div class="form-group">
                    <label>到期日期:</label>
                    <p>{{infoModal.expireDate}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <p>{{infoModal.remark}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show.show = false">取消</button>
        <ajax-button class="btn-xl-imp" @click="repeal" v-if="infoModal.repeal">同意撤销提交</ajax-button>
        <ajax-button class="btn-xl-imp" @click="audit" v-if="!infoModal.repeal && infoModal.docStatus==1">审核</ajax-button>
        <ajax-button class="btn-xl-danger" @click="unaudit" v-if="infoModal.docStatus==2">弃审</ajax-button>
    </div>
    <warning :config="wCfg"></warning>

    <alert :config="repealCfg" @cb="repeal"></alert>

    <alert :config="auditCfg" @cb="audit"></alert>

    <alert :config="unauditCfg" @cb="unaudit"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
