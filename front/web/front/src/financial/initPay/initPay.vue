<script>

    export default {
        props: ['id', 'add', 'edit', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建初期应付单',
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
                isEdit: false,
                revokeCb:true,
                //当前页面状态
                isHold: false,

                //页面数据模型
                infoModal: {
                    "accountDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "docStatus": "",
                    "supplierCode": "",
                    "supplierName": "",
                    "docNo": "",
                    "exchangeRate": "",
                    "expireDate": "",
                    "payAgreementCode": "",
                    "payAgreementName": "",
                    "payAmount": "",
                    "recordId": "",
                    "remark": "",
                    "repeal": "",
                    "workflowStatus": ""
                },
                supplierData: {
                    "supplierName": "",
                    "supplierCode": "",
                    "currencyCode": "",
                    "currencySymbol": "",
                    "currencyName": "",
                    "exchangeRate": "",
                },
                supplierCfg: {
                    key: 'supplierName',
                    code: 'supplierCode',
                    refer: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    item: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate'],
                    del: ['supplierName', 'supplierCode', 'currencyCode', 'currencyName', 'currencySymbol', 'exchangeRate']
                },
                docDateConfig:{
                    placeholder:"请选择账款时间",
                    format: 'YYYY-MM',
                    minDate: '1970-01',
                    maxDate:new Date(),
                    clear: false
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
                exprieDateConfig:{
                    placeholder:"请选择到期日期",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate:'2100-12-31',
                    clear: false
                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                //保存后返回的数据
                //pushedBackData: '',

                payAgreementData: [],

                /*//日期配置
                 dateCfg: {
                 format: 'YYYY-MM-DD'
                 },
                 activeItem: ''*/

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
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'init/payable/detail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModel = res.data.data
                            this.supplierData.currencyCode = res.data.data.currencyCode;
                            this.supplierData.currencyName = res.data.data.currencyName;
                            this.supplierData.currencySymbol = res.data.data.currencySymbol;
                            this.supplierData.exchangeRate = res.data.data.exchangeRate;
                            this.supplierData.supplierCode = res.data.data.supplierCode;
                            this.supplierData.supplierName = res.data.data.supplierName;
                            this.infoModal.accountDate = res.data.data.accountDate;
                            this.infoModal.docStatus = res.data.data.docStatus;
                            this.infoModal.currencyCode = res.data.data.currencyCode;
                            this.infoModal.currencyName = res.data.data.currencyName;
                            this.infoModal.currencySymbol = res.data.data.currencySymbol;
                            this.infoModal.supplierCode = res.data.data.supplierCode;
                            this.infoModal.supplierName = res.data.data.supplierName;
                            this.infoModal.exchangeRate = res.data.data.exchangeRate;
                            this.infoModal.expireDate = res.data.data.expireDate;
                            this.infoModal.payAgreementCode = res.data.data.payAgreementCode;
                            this.infoModal.payAgreementName = res.data.data.payAgreementName;
                            this.infoModal.payAmount = res.data.data.payAmount;
                            this.infoModal.remark = res.data.data.remark;
                        }
                    }
                )
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'pay/agreement/list', 'payAgreementData')
                console.log(this.payAgreementData);
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

            //保存
            save(push){
                //检测必填数据是否已填
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                //新增 | push为true则同时提交审核
                if (this.add) {
                    this.saveData(__URL.financial + 'init/payable/add', this.infoModal, push)
                } else if (this.edit) {
                    //编辑 | push为true则同时提交审核
                    this.saveData(__URL.financial + 'init/payable/update', this.infoModal, push)
                } else if (push) {
                    //只提交审核
                    this.pushAudit()
                }
            },
            showMsg(type,content){
                this.wCfg.show = true
                this.wCfg.type = type;
                this.wCfg.content = content;
                this.show.show = false
            },

            pushAudit(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'init/payable/submit/' + this.actId).then(
                    res => {
                    if (res.data.success) {
                        this.showMsg("success","提交成功!");
                    } else {
                        this.showMsg("failure",res.data.errMsg);
                    }
                    this.revokeCb = true;
                }
            )
            },

            saveData(url, param, push){
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.post(url, param).then(
                    (res) => {
                        if (res.data.success) {
                            //切换页面状态
                            if (this.add) {
                                this.id = res.data.data
                            }
                            this.edit = false
                            this.add = false
                            this.isHold = true
                            this.setWarningSuccess('success', "保存成功！")
                            this.infoModal.docStatus = 0;
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true
                        this.getInfo();
                    }
                )
            },

            modify(){
                this.edit = true
                this.add = false
                this.isHold = false
            },
            payAgreementSelect(item){
                for(var i=0;i<this.payAgreementData.length;i++){
                    if(this.payAgreementData[i].payAgreementCode==item){
                        this.infoModal.payAgreementName = this.payAgreementData[i].payAgreementName;
                    }
                }
            },

            delete(){
                this.delCfg.show = true;
            },

            doDel(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'init/receivable/delete/' + this.id).then(
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
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'init/payable/repeal/' + this.id).then(
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


            doSubmit(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                //编辑或新增状态，先保存在提交审核
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add) {
                    this.$http.post(__URL.financial + 'init/payable/submitaudit', this.infoModal).then(
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
                    this.$http.post(__URL.financial + 'init/payable/updateaudit', this.infoModal).then(
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
                    this.$http.get(__URL.financial + 'init/payable/submit/' + this.id).then(
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
            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },

            //必填字段校验
            check(){
                this.infoModal.docNo = this.id;
                this.infoModal.supplierCode = this.supplierData.supplierCode;
                this.infoModal.supplierName = this.supplierData.supplierName;
                this.infoModal.currencyCode = this.supplierData.currencyCode;
                this.infoModal.currencyName = this.supplierData.currencyName;
                this.infoModal.currencySymbol = this.supplierData.currencySymbol;
                this.infoModal.exchangeRate = this.supplierData.exchangeRate;

                let submit = true

                if (this.infoModal.expireDate.trim() == '') {
                    submit = false
                    this.wCfg.content = '到期日期不能为空'
                    return submit
                }
                if (this.infoModal.supplierName.trim() == '' && this.infoModal.supplierCode.trim() == '') {
                    submit = false
                    this.wCfg.content = '供应商不能为空'
                    return submit
                }
                if (this.infoModal.payAmount == 0) {
                    submit = false
                    this.wCfg.content = '应付金额不能为0'
                    return submit
                }
                if (this.infoModal.payAmount.length > 16) {
                    submit = false
                    this.wCfg.content = '应付金额长度超过限制'
                    return submit
                }

                for (var i = 0; i < this.payAgreementData.length; i++) {
                    if (this.infoModal.payAgreementCode == this.payAgreementData[i].payAgreementCode) {
                        this.infoModal.payAgreementName = this.payAgreementData[i].payAgreementName
                    }
                }

                return submit
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
                    <label><span v-if="edit || add" class="must-point">*</span>供应商名称:</label>
                    <div v-if="edit || add" class="check-input">
                        <!--<input  type="text" disabled v-model="infoModal.header.supplierName">
                        <i class="icon icon-reference" @click="checkCustomer"></i>-->
                        <fuzzy-supplier :config="supplierCfg" :data='supplierData'></fuzzy-supplier>
                    </div>
                    <p v-else>{{infoModal.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{supplierData.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{supplierData.exchangeRate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>应付金额:</label>
                    <div v-if="edit || add">
                        <input type="number" v-model="infoModal.payAmount">
                    </div>
                    <p v-else>{{infoModal.payAmount}}</p>
                </div>
                <div class="form-group">
                    <label>付款协议:</label>
                    <select v-if="edit || add" v-model='infoModal.payAgreementCode'
                            :change="payAgreementSelect(infoModal.payAgreementCode)">
                        <option :value='item.payAgreementCode' v-for='item in payAgreementData'>
                            {{item.payAgreementName}}
                        </option>
                    </select>
                    <p v-else>{{infoModal.payAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>账款时间:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker :config="docDateConfig"
                                    :date.sync='infoModal.accountDate'></date-picker>
                    </div>
                    <p v-else>{{infoModal.accountDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>到期日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker :config="exprieDateConfig"
                                    :date.sync='infoModal.expireDate'></date-picker>
                    </div>
                    <p v-else>{{infoModal.expireDate}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <div v-if="edit || add">
                        <input type="text" v-model="infoModal.remark">
                    </div>
                    <p v-else>{{infoModal.remark}}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="infoModal.docStatus ==0 || infoModal.docStatus == 1" class="btn-xl-def" @click="show.show=false">取消</button>
        <button v-else class="btn-xl-def" @click="show.show=false">关闭</button>
        <slot v-if="add || edit">
            <ajax-button class="btn-xl-imp" @click="save">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit">提交审核</ajax-button>
        </slot>
        <slot v-if="isHold">
            <ajax-button class="btn-xl-danger" @click="delete" v-if="infoModal.docStatus==0">删除</ajax-button>
            <button class="btn-xl-imp" @click="modify" v-if="infoModal.docStatus==0">编辑</button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModal.docStatus==0">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="infoModal.docStatus==1 && infoModal.repeal==0">撤销提交审核</ajax-button>
        </slot>
    </div>

    <alert :config="delCfg" @cb="doDel"></alert>

    <alert :config="submitCfg" @cb="doSubmit"></alert>

    <warning :config="wCfg"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
