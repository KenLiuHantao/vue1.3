<script>
    import moment from 'moment'

    export default {
        components: {},
        props: ['id', 'backcfg', 'add', 'back', 'edit', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [
                        {
                        no: '2',
                        name: '待审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '已审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '4',
                        name: '完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                //当前页面状态
                isEdit: false,
                capitalTypeListData: [
                    {capitalType: 1, capitalName: "现金投资--非股份公司"},
                ],
                currencyListData: '',

                dateCfg: {
                    placeholder: "请选择制单时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
                isHold: false,

                docStatus: 0,

                infoModel:{},
                //table数据模型
                tableModel: {
                    "docType": 2,
                    "docNo": "",
                    "docDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",

                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },
                submitCfg: {
                    show: false,
                    msg: '确认要提交审核该数据吗',
                    type: 'failure'
                },
                repealCfg: {
                    show: false,
                    msg: '确认要撤销审核该数据吗',
                    type: 'failure'
                },

                revokeCb: true,

            }
        },
        ready(){
            if (this.id) {
                if (this.edit) {
                    this.isHold = false;
                } else {
                    this.isHold = true;
                }
                this.getInfo()
            }
            if (this.add) {
                this.tableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
            }
            //默认选中第一个
            this.tableModel.capitalType = this.capitalTypeListData[0].capitalType;
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'paidincapital/querydetail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModel = res.data.data;
                            this.tableModel = res.data.data;
                            for (var i = 0; i < this.infoModel.workflowStatus; i++) {
                                this.flowCfg.data[i].flag = true;
                            }
                        }
                    }
                )
            },

            doRepeal(){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(__URL.financial + 'paidincapital/confirmrepeal/' + this.id+"/"+this.tableModel.recordVersion).then(
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
                this.$http.get(__URL.financial + 'paidincapital/audit/' + this.id+"/"+this.tableModel.recordVersion).then(
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
                this.$http.get(__URL.financial + 'paidincapital/unaudit/' +this.id+"/"+this.tableModel.recordVersion).then(
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

            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },

        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <Workflow :config="flowCfg"></Workflow>
        <div class="inner-content">

            <h2 class="tag">实收资本信息</h2>


            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>制单日期:</label>
                    <p>{{tableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>投资类型:</label>
                    <p>现金投资--非股份公司</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>投资人:</label>
                    <p>{{tableModel.investor}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>币种:</label>
                    <p>{{tableModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label v-if="tableModel.capitalType == 1">投资金额:</label>
                    <label v-else>股本:</label>
                    <p v-if="tableModel.capitalType == 1">{{tableModel.investmentAmount}}</p>
                    <p v-else>{{tableModel.equity}}</p>
                </div>
                <div class="form-group">
                    <label v-if="tableModel.capitalType == 1">其中:实收资本:</label>
                    <label v-else>股本溢价:</label>

                    <p v-if="tableModel.capitalType == 1">{{tableModel.paidInCapital}}</p>
                    <p v-else>{{tableModel.equityPremium}}</p>
                </div>
                <div v-if="tableModel.capitalType == 1" class="form-group">
                    <label>其中:资本公积:</label>
                    <p>{{tableModel.capitalReserve}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <p>{{tableModel.remark}}</p>
                </div>

            </div>
        </div>
    </div>

    <div class="inner-footer">
        <ajax-button class="btn-xl-imp" @click="doRepeal" v-if="infoModel.repeal">同意撤销提交</ajax-button>
        <ajax-button class="btn-xl-imp" @click="doAudit" v-if="!infoModel.repeal && infoModel.docStatus==1">审核</ajax-button>
        <ajax-button class="btn-xl-danger" @click="doUnaudit" v-if="infoModel.docStatus==2">弃审</ajax-button>
    </div>

    <warning :config="wCfg"></warning>



</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
