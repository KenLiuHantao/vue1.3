<script>

    import moment from 'moment'

    export default {
        props: ['id', 'backCfg', 'add', 'edit', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建收款单',
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

                revokeCb: true,

                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },

                customerData: {
                    "customerName": "",
                    "customerCode": "",
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
                infoModel: {
                    "docStatus": -1,
                    "repeal": "",
                    "workflowStatus": 0,
                },
                tableModel: {
                    "docType": 1,
                    "docNo": "",
                    "docDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "exchRate": "",
                    "exchRateTypeCode": "10001",
                    "exchRateTypeName": "固定汇率",
                    "payerCode": "",
                    "payerName": "",
                    "employeeCode": "",
                    "employeeName": "",
                    "payerTypeCode": "20001",
                    "payerTypeName": "客户",
                    "paymentCode": "",
                    "paymentDocNo": "",
                    "paymentName": "",
                    "recReturnAmount": 0,
                    "recTypeCode": "",
                    "recTypeName": ""
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
                        "payerTypeCode": "20001",
                        "payerTypeName": "客户"
                    }],

                recTypeListData: [
                    {
                        "recTypeCode": "30001",
                        "recTypeName": "应收款"
                    }, {
                        "recTypeCode": "30005",
                        "recTypeName": "预收款"
                    }, {
                        "recTypeCode": "30009",
                        "recTypeName": "定金"
                    }, {
                        "recTypeCode": "30011",
                        "recTypeName": "手续费"
                    }, {
                        "recTypeCode": "30013",
                        "recTypeName": "利息"
                    }, {
                        "recTypeCode": "30015",
                        "recTypeName": "其他费用"
                    }],

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                paymentListData: '',

                //日期配置
                recDateConfig: {
                    placeholder: "请选择收款时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },

                customerCfg: {
                    key: 'customerName',
                    code: 'customerCode',
                    refer: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol', ],
                    item: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol',],
                    del: ['customerName', 'customerCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate']
                }
            }
        },
        ready(){
            this.getSelectList()
            if (this.id) {
                if (this.edit) {
                    this.isHold = false;
                } else {
                    this.isHold = true;
                }
                this.getInfo()
            } else {
                this.tableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'cashier/rec/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModel = res.data.data;
                            this.tableModel.docNo = res.data.data.docNo;
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
                            this.tableModel.customerCode = res.data.data.payerCode;
                            this.tableModel.customerName = res.data.data.payerName;
                            this.tableModel.payerTypeCode = res.data.data.payerTypeCode;
                            this.tableModel.payerTypeName = res.data.data.payerTypeName;
                            this.tableModel.paymentCode = res.data.data.paymentCode;
                            this.tableModel.paymentDocNo = res.data.data.paymentDocNo;
                            this.tableModel.paymentName = res.data.data.paymentName;
                            this.tableModel.recReturnAmount = res.data.data.recReturnAmount;
                            this.tableModel.recTypeCode = res.data.data.recTypeCode;
                            this.tableModel.recTypeName = res.data.data.recTypeName;
                            this.customerData.currencyCode = res.data.data.currencyCode;
                            this.customerData.currencyName = res.data.data.currencyName;
                            this.customerData.currencySymbol = res.data.data.currencySymbol;
                            this.employeeData.employeeName = res.data.data.employeeName;
                            this.employeeData.employeeCode = res.data.data.employeeCode;
                            this.customerData.exchangeRate = res.data.data.exchRate;
                            this.customerData.customerCode = res.data.data.payerCode;
                            this.customerData.customerName = res.data.data.payerName;
                        }
                        for (var i = 0; i <= this.infoModel.workflowStatus; i++) {
                            this.flowCfg.data[i].flag = true
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
                    this.saveData(__URL.financial + 'cashier/rec/add/rec', this.tableModel)
                }
                if (this.edit) {
                    this.saveData(__URL.financial + 'cashier/rec/update/rec', this.tableModel)
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
                            this.add = false;
                            this.isHold = true;
                            this.$emit('refreshonly');
                            this.setWarningSuccess("success", "保存成功！")
                            this.infoModel.docStatus = 0;
                        } else {
                            this.setWarningSuccess("failure", res.data.errMsg)
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
                this.$http.get(__URL.financial + 'cashier/rec/delete/' + this.id).then(
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

            doBack(){
                this.show.show = false;
                this.edit = true;
                this.back = true;
                this.backCfg.show = true;
            },
            doRepeal(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'cashier/rec/repeal/' + this.id).then(
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
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add || this.edit) {
                    this.$http.post(__URL.financial + 'cashier/rec/save/submit/rec', this.tableModel).then(
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
                    this.$http.get(__URL.financial + 'cashier/rec/submit/' + this.id).then(
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
                if (this.customerData.customerCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '付款人不能为空'
                    return submit
                }
                if (this.tableModel.payerTypeCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '付款人类型不能为空'
                    return submit
                }
                if (this.tableModel.docDate.trim() == '') {
                    submit = false
                    this.wCfg.content = '收款日期不能为空'
                    return submit
                }
                if (this.tableModel.paymentCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '结算方式不能为空'
                    return submit
                }
                if (this.tableModel.recTypeCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '收款类型不能为空'
                    return submit
                }
                if (this.tableModel.recReturnAmount <= 0) {
                    submit = false
                    this.wCfg.content = '收款金额必须大于0'
                    return submit
                }
                if (this.tableModel.recReturnAmount.length > 16) {
                    submit = false
                    this.wCfg.content = '收款金额长度超过限制'
                    return submit
                }

                for (var i = 0; i < this.paymentListData.length; i++) {
                    if (this.tableModel.paymentCode == this.paymentListData[i].paymentCode) {
                        this.tableModel.paymentName = this.paymentListData[i].paymentName
                    }
                }

                for (var i = 0; i < this.recTypeListData.length; i++) {
                    if (this.tableModel.recTypeCode == this.recTypeListData[i].recTypeCode) {
                        this.tableModel.recTypeName = this.recTypeListData[i].recTypeName
                    }
                }

                for (var i = 0; i < this.exchangeTypeListData.length; i++) {
                    if (this.tableModel.exchRateTypeCode == this.exchangeTypeListData[i].exchRateTypeCode) {
                        this.tableModel.exchRateTypeName = this.exchangeTypeListData[i].exchRateTypeName
                    }
                }

                for (var i = 0; i < this.payerTypeListData.length; i++) {
                    if (this.tableModel.payerTypeCode == this.payerTypeListData[i].payerTypeCode) {
                        this.tableModel.payerTypeName = this.payerTypeListData[i].payerTypeName
                    }
                }

                for (var i = 0; i < this.exchangeTypeListData.length; i++) {
                    if (this.tableModel.exchRateTypeCode == this.exchangeTypeListData[i].exchRateTypeCode) {
                        this.tableModel.exchRateTypeName = this.exchangeTypeListData[i].exchRateTypeName
                    }
                }

                this.tableModel.docNo = this.id;
                this.tableModel.currencyCode = this.customerData.currencyCode;
                this.tableModel.currencyName = this.customerData.currencyName;
                this.tableModel.currencySymbol = this.customerData.currencySymbol;
                this.tableModel.employeeName = this.employeeData.employeeName;
                this.tableModel.employeeCode = this.employeeData.employeeCode;
                this.tableModel.exchRate = this.customerData.exchangeRate;
                this.tableModel.payerCode = this.customerData.customerCode;
                this.tableModel.payerName = this.customerData.customerName;
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
            //选择客户影响币种从而影响汇率
            changeCustomerData(){
                if (this.tableModel.docDate == '') {
                    return
                } else {
                    this.getExchangeRate()
                }
            },
            getExchangeRate(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                let param = {
                    currencyCode: this.customerData.currencyCode,
                    docDate: this.tableModel.docDate
                };
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
        }
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">收款单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>收款日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker @cb='changeDate' :config="recDateConfig"
                                    :date.sync='tableModel.docDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>付款人类型:</label>
                    <select v-if="edit || add" v-model='tableModel.payerTypeCode'>
                        <option :value='item.payerTypeCode' v-for='item in payerTypeListData'>
                            {{item.payerTypeName}}

                        </option>
                    </select>
                    <p v-else>{{tableModel.payerTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>付款人:</label>
                    <div v-if="edit || add" class="check-input">
                        <fuzzy-customer @cb='changeCustomerData' :config="customerCfg"
                                       :data='customerData'></fuzzy-customer>
                    </div>
                    <p v-else>{{tableModel.payerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="customerData.currencyName">
                    </div>
                    <p v-else>{{customerData.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <select v-if="edit || add" v-model='tableModel.exchRateTypeCode'>
                        <option :value='item.exchRateTypeCode' v-for='item in exchangeTypeListData'>
                            {{item.exchRateTypeName}}

                        </option>
                    </select>
                    <p v-else>{{tableModel.exchRateTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <span v-if="edit || add">
                            <input-number  disabled placeholder="汇率"
                                    :code.sync='customerData.exchangeRate'></input-number>
                        </span>
                    <p v-else>{{customerData.exchangeRate}}</p>
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
                        <fuzzy-employee :config="employeeCfg" :data='employeeData'></fuzzy-employee>
                    </div>
                    <p v-else>{{employeeData.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>收款类型:</label>
                    <select v-if="edit || add" v-model='tableModel.recTypeCode'>
                        <option :value='item.recTypeCode' v-for='item in recTypeListData'>{{item.recTypeName}}

                        </option>
                    </select>
                    <p v-else>{{tableModel.recTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>收款金额:</label>
                    <span v-if="edit || add">
                            <input-number placeholder="收款金额" :code.sync='tableModel.recReturnAmount'></input-number>
                        </span>
                    <p v-else>{{tableModel.recReturnAmount}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show.show=false">取消</button>
        <slot v-if="add || edit">
            <ajax-button class="btn-xl-imp" @click="save">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit">提交审核</ajax-button>
        </slot>
        <slot v-if="isHold">
            <ajax-button class="btn-xl-danger" @click="delete" v-if="infoModel.docStatus==0">删除</ajax-button>
            <button class="btn-xl-imp" @click="modify" v-if="infoModel.docStatus==0">修改</button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModel.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="infoModel.docStatus==1 && infoModel.repeal==0">撤销提交审核
            </ajax-button>
            <ajax-button class="btn-xl-imp" @click="doBack" v-if="infoModel.docStatus==2">退款</ajax-button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
