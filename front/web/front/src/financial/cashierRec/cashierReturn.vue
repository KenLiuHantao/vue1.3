<script>
    import moment from 'moment'

    export default {
        props: ['id', 'backId', 'add', 'edit', 'show'],
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

                revokeCb: true,

                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
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
                tableModel: {},

                saveTableModel: {
                    "docNo": "",
                    "sourceDocNo": "",
                    "docDate": "",
                    "paymentCode": "",
                    "paymentName": "",
                    "paymentDocNo": "",
                    "employeeCode": "",
                    "employeeName": "",
                    "returnAmount": 0,
                },

                returnTypeListData: [
                    {
                        "recTypeCode": "30002",
                        "recTypeName": "退应收款"
                    }, {
                        "recTypeCode": "30006",
                        "recTypeName": "退预收款"
                    }, {
                        "recTypeCode": "30010",
                        "recTypeName": "退定金"
                    }, {
                        "recTypeCode": "30012",
                        "recTypeName": "退手续费"
                    }, {
                        "recTypeCode": "30014",
                        "recTypeName": "退利息"
                    }, {
                        "recTypeCode": "30016",
                        "recTypeName": "退其他费用"
                    }],

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                paymentListData: '',

                //日期配置
                backDateConfig: {
                    placeholder: "请选择退款时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },

            }
        },
        ready(){
            this.getSelectList();
            if (this.backId) {
                if (this.edit) {
                    this.isHold = false;
                } else {
                    this.isHold = true;
                }
                this.getInfo()
            } else {
                this.add = true;
                this.getRecInfo()
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'cashier/rec/detail/' + this.backId).then(
                    res => {
                        if (res.data.success) {
                            this.tableModel = res.data.data;
                            this.saveTableModel.docNo = this.backId;
                            this.saveTableModel.sourceDocNo = res.data.data.sourceDocNo;
                            this.saveTableModel.paymentCode = res.data.data.paymentCode;
                            this.saveTableModel.paymentName = res.data.data.paymentName;
                            this.saveTableModel.paymentDocNo = res.data.data.paymentDocNo;
                            this.saveTableModel.employeeCode = res.data.data.employeeCode;
                            this.saveTableModel.employeeName = res.data.data.employeeName;
                            this.employeeData.employeeCode = res.data.data.employeeCode;
                            this.employeeData.employeeName = res.data.data.employeeName;
                            this.saveTableModel.returnAmount = res.data.data.showRecReturnAmount;
                            this.saveTableModel.docDate = res.data.data.docDate;
                        }
                        for (var i = 0; i <= this.tableModel.workflowStatus; i++) {
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },

            //获取收款单详情信息
            getRecInfo(){
                this.$http.get(__URL.financial + 'cashier/rec/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.tableModel = res.data.data;
                            this.saveTableModel.docNo = this.backId;
                            this.saveTableModel.sourceDocNo = this.id;
                            this.saveTableModel.paymentCode = res.data.data.paymentCode;
                            this.saveTableModel.paymentName = res.data.data.paymentName;
                            this.saveTableModel.employeeCode = res.data.data.employeeCode;
                            this.saveTableModel.employeeName = res.data.data.employeeName;
                            this.employeeData.employeeCode = res.data.data.employeeCode;
                            this.employeeData.employeeName = res.data.data.employeeName;
                            this.saveTableModel.returnAmount = res.data.data.availableAmount;
                            this.saveTableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
                            this.tableModel.recTypeCode = parseInt(res.data.data.recTypeCode) + 1;
                            for (var i = 0; i < this.returnTypeListData.length; i++) {
                                if (this.tableModel.recTypeCode == this.returnTypeListData[i].recTypeCode) {
                                    this.tableModel.recTypeName = this.returnTypeListData[i].recTypeName
                                }
                            }
                            this.getExchangeRate()
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
                    this.saveData(__URL.financial + 'cashier/rec/add/return', this.saveTableModel)
                }
                if (this.edit) {
                    this.saveData(__URL.financial + 'cashier/rec/update/return', this.saveTableModel)
                }
            },

            saveData(url, param){
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                this.$http.post(url, param).then(
                    (res) => {
                        if (res.data.success) {
                            if (this.add) {
                                this.backId = res.data.data
                            }
                            //切换页面状态
                            this.edit = false;
                            this.add = false;
                            this.isHold = true;
                            this.$emit('refreshonly');
                            this.setWarningSuccess("success", "保存成功！")
                            this.tableModel.docStatus = 0;
                        } else {
                            this.setWarningSuccess("failure", res.data.errMsg)
                        }
                        this.revokeCb = true;
                        this.getInfo()
                    }
                )
            },

            backDel(){
                this.delCfg.show = true;
            },

            doBackDel(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'cashier/rec/delete/' + this.backId).then(
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
                this.revokeCb = false
                this.$http.get(__URL.financial + 'cashier/rec/repeal/' + this.backId).then(
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
                if (this.revokeCb == false)return;
                this.revokeCb = false;
                //编辑或新增状态，先保存在提交审核
                if (!this.check()) {
                    this.wCfg.show = true;
                    return false
                }
                if (this.add || this.edit) {
                    this.$http.post(__URL.financial + 'cashier/rec/save/submit/return', this.saveTableModel).then(
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
                    this.$http.get(__URL.financial + 'cashier/rec/submit/' + this.backId).then(
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
                this.wCfg.show = true;
                this.wCfg.content = data;
                this.wCfg.type = type
            },

            //必填字段校验
            check(){
                let submit = true
                if (this.saveTableModel.sourceDocNo.trim() == '') {
                    submit = false
                    this.wCfg.content = '收款单号不能为空'
                    return submit
                }
                if (this.saveTableModel.docDate.trim() == '') {
                    submit = false
                    this.wCfg.content = '退款日期不能为空'
                    return submit
                }
                if (this.saveTableModel.paymentCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '结算方式不能为空'
                    return submit
                }
                if (this.saveTableModel.returnAmount <= 0) {
                    submit = false
                    this.wCfg.content = '退款金额必须大于0'
                    return submit
                }
                if (this.saveTableModel.returnAmount.length > 16) {
                    submit = false
                    this.wCfg.content = '退款金额长度超过限制'
                    return submit
                }

                this.saveTableModel.employeeName = this.employeeData.employeeName;
                this.saveTableModel.employeeCode = this.employeeData.employeeCode;
                return submit
            },

            //日期变更影响汇率
            changeDate(){
                if (this.saveTableModel.currencyCode == '') {
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
                    docDate: this.saveTableModel.docDate
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
            }
        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">收款退款单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker @cb='changeDate' :config="backDateConfig"
                                    :date.sync='saveTableModel.docDate'></date-picker>
                    </div>
                    <p v-else>{{saveTableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款人类型:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.payerTypeName">
                    </div>
                    <p v-else>{{tableModel.payerTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款人:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.payerName">
                    </div>
                    <p v-else>{{tableModel.payerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.currencyName">
                    </div>
                    <p v-else>{{tableModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.exchRateTypeName">
                    </div>
                    <p v-else>{{tableModel.exchRateTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.exchRate">
                    </div>
                    <p v-else>{{tableModel.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>结算方式:</label>
                    <select v-if="edit || add" v-model='saveTableModel.paymentCode'>
                        <option :value='item.paymentCode' v-for='item in paymentListData'>{{item.paymentName}}
                        </option>
                    </select>
                    <p v-else>{{saveTableModel.paymentName}}</p>
                </div>
                <div class="form-group">
                    <label>结算单号:</label>
                    <div v-if="edit || add">
                        <input type="text" v-model="saveTableModel.paymentDocNo">
                    </div>
                    <p v-else>{{saveTableModel.paymentDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>经办人:</label>
                    <div v-if="edit || add" class="check-input">
                        <fuzzy-employee :config="employeeCfg" :data='employeeData'></fuzzy-employee>
                    </div>
                    <p v-else>{{saveTableModel.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款类型:</label>
                    <div v-if="edit || add">
                        <input type="text" disabled v-model="tableModel.recTypeName">
                    </div>
                    <p v-else>{{tableModel.recTypeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>退款金额:</label>
                    <span v-if="edit || add">
                            <input-number  placeholder='退款金额'
                                    :code.sync='saveTableModel.returnAmount'></input-number>
                        </span>
                    <p v-else>{{saveTableModel.returnAmount}}</p>
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
            <ajax-button class="btn-xl-danger" @click="backDel" v-if="tableModel.docStatus==0">删除</ajax-button>
            <button class="btn-xl-imp" @click="modify" v-if="tableModel.docStatus==0">修改</button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="tableModel.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="tableModel.docStatus==1 && tableModel.repeal==0">撤销提交审核</ajax-button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doBackDel"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
