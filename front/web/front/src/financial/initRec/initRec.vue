<script>

    export default {
        props: ['id', 'add', 'edit', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建初期应收单',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '2',
                        name: '待审核',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '已审核',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '4',
                        name: '完成',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                //当前页面状态
                isEdit: false,

                //当前页面状态
                isHold: false,

                revokeCb: true,

                //客户参照config
                customerCfg: {
                    key: 'customerName',
                    code: 'customerCode',
                    refer: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol'],
                    item: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol'],
                    del: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate']
                },

                //页面数据模型
                infoModel: {
                    "docStatus": -1,
                    "docNo": "",
                    "recordId": "",
                    "repeal": "",
                    "workflowStatus": 0
                },

                tableModel: {
                    "docNo": "",
                    "accountDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "customerCode": "",
                    "customerName": "",
                    "exchRate": 0,
                    "expireDate": "",
                    "recAgreementCode": "",
                    "recAgreementName": "",
                    "recAmount": 0,
                    "remark": "",
                },
                customerData: {
                    "customerName": "",
                    "customerCode": "",
                    "currencyCode": "",
                    "currencySymbol": "",
                    "currencyName": "",
                    "exchangeRate": "",
                },

                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },

                docDateConfig: {
                    placeholder: "请选择账款时间",
                    format: 'YYYY-MM',
                    minDate: '1970-01',
                    maxDate: new Date(),
                    clear: false
                },

                expireDateConfig: {
                    placeholder: "请选择到期日期",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                recAgreementData: '',

            }
        },
        ready(){
            this.flowCfg.data[0].flag = true
            this.getSelectList()
            if (this.id) {
                if (this.edit) {
                    this.isHold = false;
                } else {
                    this.isHold = true;
                }
                this.getInfo()
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'init/receivable/detail/' + this.id).then(
                    (res) => {
                        if (res.data.success) {
                            this.infoModel.docStatus = res.data.data.docStatus
                            this.infoModel.docNo = res.data.data.docNo
                            this.infoModel.recordId = res.data.data.recordId
                            this.infoModel.repeal = res.data.data.repeal
                            this.infoModel.workflowStatus = res.data.data.workflowStatus
                            this.customerData.currencyCode = res.data.data.currencyCode;
                            this.customerData.currencyName = res.data.data.currencyName;
                            this.customerData.currencySymbol = res.data.data.currencySymbol;
                            this.customerData.customerCode = res.data.data.customerCode;
                            this.customerData.customerName = res.data.data.customerName;
                            this.customerData.exchangeRate = res.data.data.exchRate
                            this.tableModel.accountDate = res.data.data.accountDate;
                            this.tableModel.currencyCode = res.data.data.currencyCode;
                            this.tableModel.currencyName = res.data.data.currencyName;
                            this.tableModel.currencySymbol = res.data.data.currencySymbol;
                            this.tableModel.customerCode = res.data.data.customerCode;
                            this.tableModel.customerName = res.data.data.customerName;
                            this.tableModel.exchRate = res.data.data.exchRate;
                            this.tableModel.expireDate = res.data.data.expireDate;
                            this.tableModel.recAgreementCode = res.data.data.recAgreementCode;
                            this.tableModel.recAgreementName = res.data.data.recAgreementName;
                            this.tableModel.recAmount = res.data.data.recAmount;
                            this.tableModel.remark = res.data.data.remark;
                        }
                        for (var i = 0; i <= this.infoModel.workflowStatus; i++) {
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'rec/agreement/list', 'recAgreementData')
            },
            getInitSelectData(url, val){
                this.$http.post(url).then(
                    (res) => {
                        if (res.data.success) {
                            this[val] = res.data.data
                        } else {
                            console.log('网络出错:' + res.data.errMsg)
                        }
                    }
                )
            },

            modify(){
                this.edit = true
                this.add = false
                this.isHold = false
            },

            //保存
            save(){
                //检测必填数据是否已填
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add) {
                    this.saveData(__URL.financial + 'init/receivable/add', this.tableModel)
                }
                if (this.edit) {
                    this.saveData(__URL.financial + 'init/receivable/update', this.tableModel)
                }
            },

            saveData(url, param){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.post(url, param).then(
                    (res) => {
                        if (res.data.success) {
                            //切换页面状态
                            if (this.add) {
                                this.id = res.data.data
                            }
                            this.edit = false;
                            this.add = false;
                            this.isHold = true;
                            this.$emit('refreshonly');
                            this.setWarningSuccess('success', "保存成功！");
                            this.infoModel.docStatus = 0;
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
                        this.getInfo()
                    }
                )
            },

            delete(){
                this.delCfg.show = true;
            },

            doDel(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'init/receivable/delete/' + this.id).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "删除成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true
                    }
                )
            },

            doRepeal(){
                if (this.revokeCb == false)return
                this.revokeCb = false;
                this.$http.get(__URL.financial + 'init/receivable/repeal/' + this.id).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "撤销提交审核成功，等待主管同意！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true
                    }
                )
            },

            doSubmit(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                //编辑或新增状态，先保存在提交审核
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add || this.edit) {
                    this.$http.post(__URL.financial + 'init/receivable/save/submit', this.tableModel).then(
                        (res) => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true
                        }
                    )
                } else {
                    this.$http.get(__URL.financial + 'init/receivable/submit/' + this.id).then(
                        (res) => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true
                        }
                    )
                }
            },

            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },

            //必填字段校验
            check(){
                let submit = true
                if (this.tableModel.expireDate.trim() == '') {
                    submit = false
                    this.wCfg.content = '到期日期不能为空'
                    return submit
                }
                if (this.customerData.customerCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '客户不能为空'
                    return submit
                }
                if (this.tableModel.recAmount <= 0) {
                    submit = false
                    this.wCfg.content = '应收金额必须大于0'
                    return submit
                }
                if (this.tableModel.recAmount.length > 16) {
                    submit = false
                    this.wCfg.content = '应收金额长度超过限制'
                    return submit
                }

                for (var i = 0; i < this.recAgreementData.length; i++) {
                    if (this.tableModel.recAgreementCode == this.recAgreementData[i].recAgreementCode) {
                        this.tableModel.recAgreementName = this.recAgreementData[i].recAgreementName
                    }
                }
                this.tableModel.docNo = this.id;
                this.tableModel.exchRate = this.customerData.exchangeRate;
                this.tableModel.customerCode = this.customerData.customerCode;
                this.tableModel.customerName = this.customerData.customerName;
                this.tableModel.currencyCode = this.customerData.currencyCode;
                this.tableModel.currencyName = this.customerData.currencyName;
                this.tableModel.currencySymbol = this.customerData.currencySymbol;
                return submit
            },

            //日期变更影响汇率
            changeDate(){
                if (this.customerData.currencyCode == '') {
                    return
                } else {
                    this.getExchangeRate()
                }
            },

            getExchangeRate(){
                if (this.revokeCb === false)return;
                this.revokeCb = false;
                let data = this.tableModel.accountDate;
                let param = {
                    currencyCode: this.customerData.currencyCode,
                    docDate: this.tableModel.accountDate + '-28'
                };
                if (data === ''){param.docDate = ''}
                this.$http.post(__URL.arc + 'exchangeRate/currency', param).then(
                    (res) => {
                        if (res.data.success) {
                            this.customerData.exchangeRate = res.data.data
                        } else {
                            console.log('网络出错:' + res.data.errMsg)
                        }
                        this.revokeCb = true
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
                    <label><span v-if="edit || add" class="must-point">*</span>客户名称:</label>
                    <div v-if="edit || add" class="check-input">
                        <fuzzy-customer @cb='getExchangeRate' :config="customerCfg"
                                       :data='customerData'></fuzzy-customer>
                    </div>
                    <p v-else>{{tableModel.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="customerData.currencyName">
                    </div>
                    <p v-else>{{tableModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <span v-if="edit || add">
                        <input-number  disabled placeholder="汇率"
                                :code.sync='customerData.exchangeRate'></input-number>
                    </span>
                    <p v-else>{{tableModel.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>应收金额:</label>
                    <span v-if="edit || add">
                        <input-number  placeholder="应收金额" :code.sync='tableModel.recAmount'></input-number>
                    </span>
                    <p v-else>{{tableModel.recAmount}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <select v-if="edit || add" v-model='tableModel.recAgreementCode'>
                        <option :value='item.recAgreementCode' v-for='item in recAgreementData'>
                            {{item.recAgreementName}}

                        </option>
                    </select>
                    <p v-else>{{tableModel.recAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>账款时间:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker @cb='changeDate' :config="docDateConfig"
                                    :date.sync='tableModel.accountDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.accountDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>到期日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker :config="expireDateConfig"
                                    :date.sync='tableModel.expireDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.expireDate}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <div v-if="edit || add">
                        <input type="text" v-model="tableModel.remark">
                    </div>
                    <p v-else>{{tableModel.remark}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <slot v-if="add || edit">
            <button class="btn-xl-def" @click="show.show=false">取消</button>
            <ajax-button class="btn-xl-imp" @click="save">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit">提交审核</ajax-button>
        </slot>
        <slot v-if="isHold">
            <button v-if="infoModel.docStatus!=1 && infoModel.docStatus!=0" class="btn-xl-def" @click="show.show=false">关闭</button>
            <button v-else class="btn-xl-def" @click="show.show=false">取消</button>
            <button class="btn-xl-imp" @click="modify" v-if="infoModel.docStatus==0">修改</button>
            <ajax-button class="btn-xl-danger" @click="delete" v-if="infoModel.docStatus==0">删除</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModel.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="infoModel.docStatus==1 && infoModel.repeal==0">撤销提交审核
            </ajax-button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
