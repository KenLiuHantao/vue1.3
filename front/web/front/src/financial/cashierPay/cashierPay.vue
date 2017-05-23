<script>
    import moment from 'moment'
    import cashierreturn from './cashierReturn'

    export default {
        components: {
            cashierreturn,
        },
        props: ['show', 'id', 'add', 'edit'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建付款单',
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
                        name: '',
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

                backCfg: {
                    show: false,
                    title: '退款单'
                },

                payDateConfig: {
                    placeholder: "请选择收款时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
                //供应商参照config
                supplierCfg: {
                    key: 'supplierName',
                    code: 'supplierCode',
                    refer: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    item: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    del: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    supplierStatus: 3
                },
                isHold: false,

                supplierData: {
                    "supplierName": "",
                    "supplierCode": "",
                    "currencyCode": "",
                    "currencySymbol": "",
                    "currencyName": "",
                    "exchangeRate": 0,
                },
                //人员参照config
                employeeCfg: {
                    key: 'employeeName',
                    code: 'employeeCode',
                    refer: ['employeeName', 'employeeCode'],
                    item: ['employeeName', 'employeeCode'],
                    del: ['employeeName', 'employeeCode']
                },

                docStatus: 0,

                actId: '',

                //table数据模型
                tableModel: {
                    "docType": 2,
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
                    "payTypeCode": "",
                    "payTypeName": ""
                },
                //页面数据模型
                infoModal: {
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docDate": "",
                    "docNo": "",
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
                    "payTypeCode": "",
                    "payTypeName": "",
                    "repeal": "",
                    "workflowStatus": ""
                },

                employeeData: {
                    "employeeCode": "",
                    "employeeName": "",
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

                payTypeListData: [
                    {
                        "payTypeCode": "30003",
                        "payTypeName": "应付款"
                    },
                    {
                        "payTypeCode": "30007",
                        "payTypeName": "预付款"
                    }, {
                        "payTypeCode": "30009",
                        "payTypeName": "定金"
                    }, {
                        "payTypeCode": "30011",
                        "payTypeName": "手续费"
                    }, {
                        "payTypeCode": "30013",
                        "payTypeName": "利息"
                    }, {
                        "payTypeCode": "30015",
                        "payTypeName": "其他费用"
                    }],

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
                paymentListData: '',

                revokeCb: true,

                backInfo: {},
            }
        },
        ready(){
            this.getSelectList();
            this.isHold = !this.edit;
            if (this.add) {
                this.tableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
            } else {
                this.getInfo();
            }
            //默认选中第一个
            this.tableModel.payerTypeCode = this.payerTypeListData[0].payerTypeCode;
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'cashier/pay/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal = res.data.data;
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
                            this.tableModel.payerTypeCode = res.data.data.payerTypeCode;
                            this.tableModel.payerTypeName = res.data.data.payerTypeName;
                            this.tableModel.paymentCode = res.data.data.paymentCode;
                            this.tableModel.paymentDocNo = res.data.data.paymentDocNo;
                            this.tableModel.paymentName = res.data.data.paymentName;
                            this.tableModel.payReturnAmount = res.data.data.payReturnAmount;
                            this.tableModel.payTypeCode = res.data.data.payTypeCode;
                            this.tableModel.payTypeName = res.data.data.payTypeName;
                            this.supplierData.currencyCode = res.data.data.currencyCode;
                            this.supplierData.currencyName = res.data.data.currencyName;
                            this.supplierData.currencySymbol = res.data.data.currencySymbol;
                            this.employeeData.employeeName = res.data.data.employeeName;
                            this.employeeData.employeeCode = res.data.data.employeeCode;
                            this.supplierData.exchangeRate = res.data.data.exchRate;
                            this.supplierData.supplierCode = res.data.data.payerCode;
                            this.supplierData.supplierName = res.data.data.payerName;
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

            save(){
                //检测必填数据是否已填
                if (!this.check()) {
                    this.wCfg.show = true
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
                            this.add = false;
                            this.isHold = true;
                            this.$emit('refreshonly');
                            this.setWarningSuccess("success", "保存成功！");
                            this.infoModal.docStatus = 0;
                        } else {
                            this.setWarningSuccess("failure", res.data.errMsg);
                        }
                        this.revokeCb = true;
                        this.getInfo();
                    }
                )
            },

            setWarningSuccess(type, data){
                this.wCfg.show = true;
                this.wCfg.content = data;
                this.wCfg.type = type
            },
            delete(){
                this.delCfg.show = true;
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
                                this.$emit('refresh', 'success', "提交审核成功！")
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
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                } else {
                    this.$http.get(__URL.financial + 'cashier/pay/submit/' + this.id).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                }
            },

            doBack(){
                this.actId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.$http.get(__URL.financial + 'cashier/pay/querybackinfo/' + this.id).then(
                    (res) => {
                        if (res.data.success) {
                            this.backInfo = res.data.data;
                            this.backCfg.show = true;
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                );

            },

            doDel(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.get(__URL.financial + 'cashier/pay/delete/' + this.id).then(
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


            doRepeal(){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.get(__URL.financial + 'cashier/pay/repeal/' + this.id).then(
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
            //必填字段校验
            check(){
                let submit = true;

                if (this.supplierData.supplierName.trim() == '') {
                    submit = false;
                    this.wCfg.content = '供应商不能为空';
                    return submit
                }
                if (this.tableModel.docDate.trim() == '') {
                    submit = false;
                    this.wCfg.content = '付款日期不能为空';
                    return submit
                }
                if (this.tableModel.paymentCode.trim() == '') {
                    submit = false;
                    this.wCfg.content = '结算方式不能为空';
                    return submit
                }
                if (this.tableModel.payTypeCode.trim() == '') {
                    submit = false;
                    this.wCfg.content = '付款类型不能为空';
                    return submit
                }
                if (this.tableModel.payReturnAmount <= 0) {
                    submit = false;
                    this.wCfg.content = '付款金额必须大于0';
                    return submit
                }

                for (var i = 0; i < this.paymentListData.length; i++) {
                    if (this.tableModel.paymentCode == this.paymentListData[i].paymentCode) {
                        this.tableModel.paymentName = this.paymentListData[i].paymentName
                    }
                }

                for (var i = 0; i < this.payTypeListData.length; i++) {
                    if (this.tableModel.payTypeCode == this.payTypeListData[i].payTypeCode) {
                        this.tableModel.payTypeName = this.payTypeListData[i].payTypeName
                    }
                }

                for (var i = 0; i < this.exchangeTypeListData.length; i++) {
                    this.tableModel.exchRateTypeName = this.exchangeTypeListData[i].exchRateTypeName;
                    this.tableModel.exchRateTypeCode = this.exchangeTypeListData[i].exchRateTypeCode
                }

                for (var i = 0; i < this.payerTypeListData.length; i++) {
                    if (this.tableModel.payerTypeCode == this.payerTypeListData[i].payerTypeCode) {
                        this.tableModel.payerTypeName = this.payerTypeListData[i].payerTypeName
                    }
                }
                this.tableModel.currencyCode = this.supplierData.currencyCode;
                this.tableModel.currencyName = this.supplierData.currencyName;
                this.tableModel.currencySymbol = this.supplierData.currencySymbol;
                this.tableModel.employeeName = this.employeeData.employeeName;
                this.tableModel.employeeCode = this.employeeData.employeeCode;

                this.tableModel.exchRate = this.supplierData.exchangeRate;
                this.tableModel.payerCode = this.supplierData.supplierCode;
                this.tableModel.payerName = this.supplierData.supplierName;
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

            refreshOnly(type, text){
                this.backCfg.show = false;
                this.isBack = false;
                this.isEdit = false;
                this.$emit('refresh', type, text)
            },
        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 v-else class="tag">付款单信息</h2>
            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>付款日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker @cb='changeDate' :config="payDateConfig"
                                     :date.sync='tableModel.docDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>收款人类型:</label>
                    <select v-if="edit || add" v-model='tableModel.payerTypeCode'>
                        <option :value='item.payerTypeCode' v-for='item in payerTypeListData'>
                            {{item.payerTypeName}}
                        </option>
                    </select>
                    <p v-else>{{tableModel.payerTypeName}}</p>
                </div>
                <div class="form-group">
                    <label v-if="back"><span v-if="edit || add" class="must-point">*</span>退款人:</label>
                    <label v-else><span v-if="edit || add" class="must-point">*</span>收款人:</label>
                    <div v-if="edit || add" class="check-input">
                        <fuzzy-supplier :config="supplierCfg" :data='supplierData'></fuzzy-supplier>
                    </div>
                    <p v-else>{{tableModel.payerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="supplierData.currencyName">
                    </div>
                    <p v-else>{{supplierData.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <input v-if="edit || add" type="text" disabled
                           v-model="exchangeTypeListData[0].exchRateTypeName">
                    <p v-else>{{tableModel.exchRateTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <span v-if="edit || add">
                            <input-number disabled placeholder="汇率"
                                          :code.sync='supplierData.exchangeRate'></input-number>
                        </span>
                    <p v-else>{{tableModel.exchRate}}</p>
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
                    <label><span v-if="edit || add" class="must-point">*</span>付款类型:</label>
                    <select v-if="edit || add" v-model='tableModel.payTypeCode'>
                        <option :value='item.payTypeCode' v-for='item in payTypeListData'>{{item.payTypeName}}
                        </option>
                    </select>
                    <p v-else>{{tableModel.payTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>付款金额:</label>
                    <span v-if="edit || add">
                            <input-number placeholder="付款金额" :code.sync='tableModel.payReturnAmount'></input-number>
                        </span>
                    <p v-else>{{tableModel.payReturnAmount}}</p>

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
            <ajax-button class="btn-xl-danger" @click="delete" v-if="infoModal.docStatus==0">删除</ajax-button>
            <button class="btn-xl-imp" @click="modify" v-if="infoModal.docStatus==0">修改</button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModal.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="infoModal.docStatus==1 && infoModal.repeal==0">
                撤销提交审核
            </ajax-button>
            <button class="btn-xl-imp" @click="doBack" v-if="infoModal.docStatus==2">退款</button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>

    <inner :config='backCfg'>
        <cashierreturn :add="isAdd" :back-id="backId" :edit="isEdit" :back-info="backInfo"
                       @refreshonly='refreshOnly' @refresh='backCfg.show=false;'></cashierreturn>
    </inner>

</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
