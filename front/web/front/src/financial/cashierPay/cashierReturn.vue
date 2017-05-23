<script>

    import moment from 'moment'

    export default {
        props: ['id', 'add', 'backId', 'edit', 'backInfo'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建退款单',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
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
                isHold: false,
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

                //供应商参照config
                supplierCfg: {
                    key: 'supplierName',
                    code: 'supplierCode',
                    refer: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    item: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    del: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate']
                },

                supplierData: {
                    "supplierName": "",
                    "supplierCode": "",
                    "currencyCode": "",
                    "currencySymbol": "",
                    "currencyName": "",
                    "exchangeRate": "",
                },

                //人员参照config
                employeeCfg: {
                    key: 'employeeName',
                    code: 'employeeCode',
                    refer: ['employeeName', 'employeeCode'],
                    item: ['employeeName', 'employeeCode'],
                    del: ['employeeName', 'employeeCode']
                },

                employeeData: {
                    "employeeCode": "",
                    "employeeName": "",
                },


                //页面数据模型
                infoModal: {
                    "docStatus": 0,
                    "repeal": false,
                    "workflowStatus": 0,
                },
                tableModel: {
                    "docType": 3,
                    "docNo": "",
                    "docDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "exchRate": "",
                    "exchRateTypeCode": "",
                    "exchRateTypeName": "",
                    "payerCode": "",
                    "payerName": "",
                    "employeeCode": "",
                    "employeeName": "",
                    "payerTypeCode": "",
                    "payerTypeName": "",
                    "paymentCode": "",
                    "paymentDocNo": "",
                    "paymentName": "",
                    "payReturnAmount": 0,
                    "showPayReturnAmount": 0,
                    "payTypeCode": "",
                    "payTypeName": "",
                },

                exchangeTypeListData: [
                    {
                        "exchRateTypeCode": "10001",
                        "exchRateTypeName": "固定汇率"
                    }
                    /*{
                     "exchRateTypeCode": "10002",
                     "exchRateTypeName": "浮动汇率"
                     }*/],

                payerTypeListData: [
                    {
                        "payerTypeCode": "20002",
                        "payerTypeName": "供应商"
                    }],

                returnTypeListData: [
                    {
                        "payTypeCode": "30004",
                        "payTypeName": "退应付款"
                    }, {
                        "payTypeCode": "30006",
                        "payTypeName": "退预付款"
                    }, {
                        "payTypeCode": "30010",
                        "payTypeName": "退定金"
                    }, {
                        "payTypeCode": "30012",
                        "payTypeName": "退手续费"
                    }, {
                        "payTypeCode": "30014",
                        "payTypeName": "退利息"
                    }, {
                        "payTypeCode": "30016",
                        "payTypeName": "退其他费用"
                    }],

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                paymentListData: '',

                revokeCb: true,
                //日期配置
                backDateConfig: {
                    placeholder: "请选择收款时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
            }
        },
        ready(){
            this.getSelectList();
            if (this.add) {
                this.isHold = false;
                this.getInfo();
            } else {//退款信息
                this.getBackInfo();
                this.isHold = true;
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.tableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
                this.tableModel.currencyCode = this.backInfo.currencyCode;
                this.tableModel.currencyName = this.backInfo.currencyName;
                this.tableModel.currencySymbol = this.backInfo.currencySymbol;
                this.tableModel.employeeName = this.backInfo.employeeName;
                this.tableModel.employeeCode = this.backInfo.employeeCode;
                this.tableModel.exchRate = this.backInfo.exchRate;
                this.tableModel.exchRateTypeCode = this.backInfo.exchRateTypeCode;
                this.tableModel.exchRateTypeName = this.backInfo.exchRateTypeName;
                this.tableModel.payerCode = this.backInfo.payerCode;
                this.tableModel.payerName = this.backInfo.payerName;
                this.tableModel.supplierCode = this.backInfo.payerCode;
                this.tableModel.supplierName = this.backInfo.payerName;
                this.tableModel.payerTypeCode = this.backInfo.payerTypeCode;
                this.tableModel.payerTypeName = this.backInfo.payerTypeName;
                this.tableModel.paymentCode = this.backInfo.paymentCode;
                this.tableModel.paymentName = this.backInfo.paymentName;
                this.tableModel.payReturnAmount = this.backInfo.payReturnAmount;
                this.tableModel.showPayReturnAmount = this.backInfo.showPayReturnAmount;
                this.supplierData.currencyCode = this.backInfo.currencyCode;
                this.supplierData.currencyName = this.backInfo.currencyName;
                this.supplierData.currencySymbol = this.backInfo.currencySymbol;
                this.employeeData.employeeName = this.backInfo.employeeName;
                this.employeeData.employeeCode = this.backInfo.employeeCode;
                this.supplierData.exchangeRate = this.backInfo.exchRate;
                this.supplierData.supplierCode = this.backInfo.payerCode;
                this.supplierData.supplierName = this.backInfo.payerName;
                this.tableModel.payTypeCode = this.backInfo.payTypeCode;
                this.tableModel.payTypeName = this.backInfo.payTypeName;
                this.tableModel.sourceDocNo = this.backInfo.docNo;
                this.tableModel.docType = 3;
                this.infoModal.docStatus = 0;
                this.infoModal.repeal = false;
                this.infoModal.workflowStatus = 0;
                for (var i = 0; i <= this.infoModal.workflowStatus; i++) {
                    this.flowCfg.data[i].flag = true
                }
                this.changeDate();
            },

            getBackInfo(){
                this.$http.get(__URL.financial + 'cashier/pay/detail/' + this.backId).then(
                    res => {
                        if (res.data.success) {
                            //this.tableModel = res.data.data;
                            this.tableModel.docNo = this.backId;
                            this.tableModel.docDate = res.data.data.docDate;
                            this.tableModel.currencyCode = res.data.data.currencyCode;
                            this.tableModel.currencyName = res.data.data.currencyName;
                            this.tableModel.currencySymbol = res.data.data.currencySymbol;
                            this.tableModel.employeeName = res.data.data.employeeName;
                            this.tableModel.employeeCode = res.data.data.employeeCode;
                            this.tableModel.exchRate = res.data.data.exchRate;
                            this.tableModel.exchRateTypeCode = res.data.data.exchRateTypeCode;
                            this.tableModel.exchRateTypeName = res.data.data.exchRateTypeName;
                            this.tableModel.payerCode = res.data.data.payerCode;
                            this.tableModel.payerName = res.data.data.payerName;
                            this.tableModel.supplierCode = res.data.data.payerCode;
                            this.tableModel.supplierName = res.data.data.payerName;
                            this.tableModel.payerTypeCode = res.data.data.payerTypeCode;
                            this.tableModel.payerTypeName = res.data.data.payerTypeName;
                            this.tableModel.paymentCode = res.data.data.paymentCode;
                            this.tableModel.paymentName = res.data.data.paymentName;
                            this.tableModel.payReturnAmount = res.data.data.payReturnAmount;
                            this.tableModel.payTypeCode = res.data.data.payTypeCode;
                            this.tableModel.payTypeName = res.data.data.payTypeName;
                            this.tableModel.paymentDocNo = res.data.data.paymentDocNo;
                            this.tableModel.showPayReturnAmount = res.data.data.showPayReturnAmount;
                            this.supplierData.currencyCode = res.data.data.currencyCode;
                            this.supplierData.currencyName = res.data.data.currencyName;
                            this.supplierData.currencySymbol = res.data.data.currencySymbol;
                            this.supplierData.exchangeRate = res.data.data.exchRate;
                            this.supplierData.supplierCode = res.data.data.payerCode;
                            this.supplierData.supplierName = res.data.data.payerName;
                            this.employeeData.employeeName = res.data.data.employeeName;
                            this.employeeData.employeeCode = res.data.data.employeeCode;
                            this.infoModal.docStatus = res.data.data.docStatus;
                            this.infoModal.repeal = res.data.data.repeal;
                            this.infoModal.workflowStatus = res.data.data.workflowStatus;
                            for (var i = 0; i <= this.infoModal.workflowStatus; i++) {
                                this.flowCfg.data[i].flag = true
                            }
                        }
                    }
                )
            },


            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'payment/list', 'paymentListData')
                console.log(this.paymentListData);
            },

            getInitSelectData(url, val){
                this.$http.post(url).then(
                    (res) => {
                        if (res.data.success) {
                            this[val] = res.data.data.dataList
                        } else {
                            console.log('网络出错:' + res.data.errMsg)
                        }
                    }
                )
            },

            modify(){
                this.edit = true;
                this.add = false;
                this.isHold = false;
            },

            //保存
            save(){
                //检测必填数据是否已填
                if (!this.check()) {
                    this.wCfg.show = true;
                    return false
                }
                if (this.add) {
                    this.saveData(__URL.financial + 'cashier/pay/add', this.tableModel)
                }
                if (this.edit) {
                    this.saveData(__URL.financial + 'cashier/pay/update', this.tableModel)
                }
            },

            saveData(url, param){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.post(url, param).then(
                    res => {
                        if (res.data.success) {
                            if (this.add) {
                                this.id = res.data.data
                            }
                            //切换页面状态
                            this.edit = false;
                            this.isHold = true;
                            if (this.add) {
                                this.add = false;
                                this.backId = res.data.data;
                            }
                            this.$emit('refreshonly');
                            this.setWarningSuccess("success", "保存成功！");
                            this.infoModal.docStatus = 0;
                        } else {
                            this.setWarningSuccess("failure", res.data.errMsg);
                        }
                        this.revokeCb = true;
                    }
                )
            },

            backDel(){
                this.delCfg.show = true;
            },

            doBackDel(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.get(__URL.financial + 'cashier/pay/delete/' + this.backId).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "删除成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },

            repeal(){
                this.repealCfg.show = true
            },

            doRepeal(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.get(__URL.financial + 'cashier/pay/repeal/' + this.backId).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "撤销提交审核成功，等待主管同意！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },

            submit(){
                this.submitCfg.show = true
            },

            doSubmit(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                //编辑或新增状态，先保存在提交审核
                if (!this.check()) {
                    this.wCfg.show = true;
                    return false
                }
                if (this.add) {
                    this.$http.post(__URL.financial + 'cashier/pay/submitaudit', this.tableModel).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refreshonly', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                } else if (this.edit) {
                    this.$http.post(__URL.financial + 'cashier/pay/updateaudit', this.tableModel).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refreshonly', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                } else {
                    this.$http.get(__URL.financial + 'cashier/pay/submit/' + this.backId).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refreshonly', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                }
            },

            setWarningSuccess(type, data){
                this.wCfg.show = true;
                this.wCfg.content = data;
                this.wCfg.type = type
            },

            //必填字段校验
            check(){
                let submit = true;
                if (this.tableModel.docDate == '') {
                    submit = false;
                    this.wCfg.content = '退款日期不能为空';
                    return submit
                }
                if (this.tableModel.paymentCode == '') {
                    submit = false;
                    this.wCfg.content = '结算方式不能为空';
                    return submit
                }
                if (this.tableModel.payTypeCode == '') {
                    submit = false;
                    this.wCfg.content = '退款类型不能为空';
                    return submit
                }
                if (this.tableModel.showPayReturnAmount <= 0) {
                    submit = false;
                    this.wCfg.content = '退款金额必须大于0';
                    return submit
                }
                if (this.tableModel.showPayReturnAmount.length > 16) {
                    submit = false;
                    this.wCfg.content = '退款金额长度超过限制';
                    return submit
                }
                this.tableModel.docNo = this.backId;
                this.tableModel.employeeCode = this.employeeData.employeeCode;
                this.tableModel.employeeName = this.employeeData.employeeName;
                this.tableModel.payReturnAmount = this.tableModel.showPayReturnAmount;
                return submit
            },

            changeDate(){
                if (this.tableModel.currencyCode == '') {
                    return
                } else {
                    this.getExchangeRate()
                }
            },
            getExchangeRate(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                let param = {
                    currencyCode: this.tableModel.currencyCode,
                    docDate: this.tableModel.docDate
                };
                this.$http.post(__URL.arc + 'exchangeRate/currency', param).then(
                    (res) => {
                        if (res.data.success) {
                            this.tableModel.exchRate = res.data.data
                        } else {
                            console.log('网络出错:' + res.data.errMsg)
                        }
                        this.revokeCb = true
                    }
                )
            },

            close(){
                this.$emit('refresh');
            },

        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">付款退款单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker @cb='changeDate' :config="backDateConfig"
                                     :date.sync='tableModel.docDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款人类型:</label>
                    <p>{{tableModel.payerTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款人:</label>
                    <p>{{tableModel.payerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{tableModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <p>{{tableModel.exchRateTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{tableModel.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>结算方式:</label>
                    <select v-if="edit || add" v-model='tableModel.paymentCode'>
                        <option :value='item.paymentCode' v-for='item in paymentListData'>{{item.paymentName}}
                        </option>
                    </select>
                    <p v-else>{{tableModel.paymentName}}</p>
                </div>
                <div class="form-group">
                    <label>结算单号:</label>
                    <div v-if="edit || add">
                        <input type="text" v-model="tableModel.paymentDocNo">
                    </div>
                    <p v-else>{{tableModel.paymentDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>经办人:</label>
                    <div v-if="edit || add" class="check-input">
                        <fuzzy-employee :config='employeeCfg' :data="employeeData"></fuzzy-employee>
                    </div>
                    <p v-else>{{employeeData.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款类型:</label>
                    <p>{{tableModel.payTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款金额:</label>
                    <div v-if="edit || add">
                        <input type="number" v-model="tableModel.showPayReturnAmount">
                    </div>
                    <p v-else>{{tableModel.showPayReturnAmount}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="close">取消</button>
        <slot v-if="add || edit">
            <ajax-button class="btn-xl-imp" @click="save">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit">提交审核</ajax-button>
        </slot>
        <slot v-if="isHold">
            <ajax-button class="btn-xl-imp" @click="modify" v-if="infoModal.docStatus==0">修改</ajax-button>
            <button class="btn-xl-danger" @click="backDel" v-if="infoModal.docStatus==0">删除</button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModal.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doRepeal" v-if="infoModal.docStatus==1 && !infoModal.repeal">撤销提交审核
            </ajax-button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doBackDel"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
