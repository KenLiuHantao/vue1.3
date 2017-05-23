<script>
    import moment from 'moment';

    export default{
        data(){
            return {
                msg: 'hello vue',
                allCurrency: [],
                allBankAccount: [],
                workflow: "",
                exchangeRateCategory: [
                    {"code": "10001", "name": "固定汇率"}, {"code": "10002", "name": "浮动汇率"}
                ],
                initBalance: {
                    dataList: [
                        {
                            "balance": "",
                            "bankAccount": "",
                            "bankNumber": "",
                            "currencyCode": "",
                            "currencyName": "",
                            "exchangeRate": "",
                            "recordId": "",
                            "recordVersion": ""
                        }
                    ],
                    header: {
                        "balanceCategoryCode": "",
                        "balanceCategoryName": "",
                        "docDate": "",
                        "docNo": "",
                        "exchangeRateCategoryCode": "",
                        "exchangeRateCategoryName": "",
                        "localCurrencyName": ""
                    }
                },
                defaultRow: {
                    "balance": 0,
                    "bankAccount": "",
                    "bankNumber": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "exchangeRate": 0,
                    "recordId": "",
                    "recordVersion": ""
                },
                docDateConfig: {
                    placeholder: "请选择制单日期",
                    format: 'YYYY-MM-DD',
                    maxDate: new Date(),
                    clear: false
                },
                warCfg: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                flowCfg: {
                    data: [
                        {
                            no: '1',
                            name: '创建现金期初余额',
                            time: '',
                            filed: '',
                            user: '',
                            flag: false,
                        },
                        {
                            no: '2',
                            name: '待审核',
                            time: '',
                            filed: '',
                            user: '',
                            flag: false,
                        },
                        {
                            no: '3',
                            name: '已审核',
                            time: '',
                            filed: '',
                            user: '',
                            flag: false,
                        },
                        {
                            no: '4',
                            name: '完成',
                            time: '',
                            filed: '',
                            user: '',
                            flag: false,
                        }
                    ]
                },
                saveCb: true,
                submitCb: true,
            }
        },
        props: ['balancecategorycode', 'detailconfig'],
        ready() {
            this.flowCfg.data[0].name = this.balancecategorycode == "001" ? "创建现金期初余额" : "创建银行存款期初余额";
            //初始化时拿到币种列表
            this.$http.post(__URL.arc + 'currency/find/ref', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allCurrency = res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
            )
            this.$http.post(__URL.arc + 'bankaccount/using/list', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allBankAccount = res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到银行账号')
                }
            )

            this.openDetail()


        },
        methods: {
            openDetail(){

                this.flowCfg.data[0].flag = true;
                this.workflow = 0;
                this.initBalance.header.balanceCategoryCode = this.balancecategorycode;
                this.initBalance.header.balanceCategoryName = this.balancecategorycode == "001" ? "现金" : "银行存款";
                this.initBalance.header.exchangeRateCategoryCode = this.exchangeRateCategory[0].code;
                this.initBalance.header.exchangeRateCategoryName = this.exchangeRateCategory[0].name;
                this.$http.post(__URL.arc + 'systemSetting/detail', null).then(
                    (res) => {
                        this.initBalance.header.docDate = moment(res.data.data.accStartDate, "YYYY-MM-DD").add(-1, "day").format("YYYY-MM-DD");
                        this.initBalance.header.localCurrencyName = res.data.data.localCurrencyName;
                    }
                )

            },
            addRow() {
                this.rowNum++;
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.initBalance.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.initBalance.dataList.length == 1) {
                    this.showMsg('warning', '明细至少要有一行');
                    return;
                }
                this.initBalance.dataList.splice(index, 1);
            },
            showMsg(type, msg){
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            currencyChange(obj, index){
                for (var i = 0; i < this.allCurrency.length; i++) {
                    if (this.allCurrency[i].currencyCode == obj) {
                        this.initBalance.dataList[index].exchangeRate = this.allCurrency[i].exchangeRate;
                    }
                }
            },
            bankAccountChange(obj, index){
                for (var i = 0; i < this.allBankAccount.length; i++) {
                    if (this.allBankAccount[i].accountNumber == obj) {
                        this.initBalance.dataList[index].bankAccount = this.allBankAccount[i].account;
                        this.initBalance.dataList[index].currencyCode = this.allBankAccount[i].currencyCode;
                        this.initBalance.dataList[index].currencyName = this.allBankAccount[i].currencyName;
                        this.currencyChange(this.allBankAccount[i].currencyCode, index);
                    }
                }
            },
            check(){
                let submit = true
                for (var i = 0; i < this.initBalance.dataList.length; i++) {
                    if (this.initBalance.dataList[i].balance <= 0) {
                        submit = false
                        this.warCfg.content = '期初余额必须大于0'
                        return submit
                    }
                    if (this.initBalance.dataList[i].balance.length > 16) {
                        submit = false
                        this.warCfg.content = '第' + (i + 1) + '行期初余额长度超过限制'
                        return submit
                    }
                }

                return submit;
            },
            saveData() {
                if (this.saveCb == false) return;
                this.saveCb = false;
                if (!this.check()) {
                    this.warCfg.show = true;
                    this.saveCb = true;
                    return false
                }
                var url = this.initBalance.header.docNo == "" ? __URL.financial + 'init/balance/insert' : __URL.financial + 'init/balance/update';
                this.$http.post(url, this.initBalance).then((res) => {
                        this.showMsg('warning', res.data.errMsg);
                        if (res.data.success) {
                            this.showMsg('success', '保存成功');
                            this.docNo = res.data.data;
                            this.detailconfig.show = false;
                            this.$emit("openeditor", res.data.data)
                        }
                        this.saveCb = true;
                    }
                )
            },
            submitData() {
                if (this.submitCb == false) return;
                this.submitCb = false;
                if (!this.check()) {
                    this.warCfg.show = true;
                    this.submitCb=true;
                    return false
                }
                this.$http.post(__URL.financial + 'init/balance/savesubmit', this.initBalance).then((res) => {
                        console.log(res.data.success);

                        this.showMsg('warning', res.data.errMsg);
                        if (res.data.success) {
                            this.showMsg('success', '提交成功');
                            this.docNo = res.data.data;
                            this.detailconfig.show = false;
                            this.$emit("openaudit", res.data.data)
                        }
                        this.sumbitCb = true;
                    }
                )
            }
        }

    }

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag"><label v-if="balancecategorycode == '001'">现金期初余额信息</label><label
                    v-if="balancecategorycode == '002'">银行存款余额信息</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>制单日期:</label>
                    <div class="s-input" v-if="workflow = 1">
                        <date-picker :config="docDateConfig"
                                    :date.sync='initBalance.header.docDate'></date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label>本位币:</label>
                    <p class="orderData">{{initBalance.header.localCurrencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率类型:</label>
                    <p class="orderData">{{initBalance.header.exchangeRateCategoryName}}</p>
                </div>
            </div>

            <div class="inner-item">
                <tab-container>
                    <tab-item>
                        <div v-if="balancecategorycode=='001'">
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="15%">币种</th>
                                <th width="15%">期初余额</th>
                                <th width="10%">汇率</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in initBalance.dataList'>
                                <td>{{$index + 1}}</td>
                                <td>
                                    <div class="max-width">
                                        <select v-model='item.currencyCode' @change="currencyChange(item.currencyCode,$index)">
                                            <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <div class="max-width">
                                        <input-number  placeholder="期初余额" :code.sync='item.balance'></input-number>
                                    </div>
                                </td>
                                <td>
                                    {{item.exchangeRate}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                            <div class="add-wrap"  v-if="workflow==0">
                                <button @click="addRow"><i class="icon icon-product__add" ></i>增加</button>
                            </div>
                        </div>

                        <div v-if="balancecategorycode=='002'">
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="15%">银行账户</th>
                                <th width="15%">银行账号</th>
                                <th width="10%">币种</th>
                                <th width="10%">汇率</th>
                                <th width="15%">期初余额</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in initBalance.dataList'>
                                <td>{{$index + 1}}</td>
                                <td>
                                    <select v-model='item.bankNumber' @change="bankAccountChange(item.bankNumber,$index)">
                                        <option :value='item2.accountNumber' v-for='item2 in allBankAccount'>{{item2.account}}</option>
                                    </select>
                                </td>
                                <td>
                                    {{item.bankNumber}}
                                </td>
                                <td>
                                    {{item.currencyName}}
                                </td>
                                <td>
                                    {{item.exchangeRate}}
                                </td>
                                <td>
                                    <input-number  placeholder="期初余额" :code.sync='item.balance'></input-number>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                            <div class="add-wrap" v-if="workflow==0">
                                <button @click="addRow"><i class="icon icon-product__add"></i>增加</button>
                            </div>
                        </div>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='detailconfig.show = false' class="btn-xl-def" v-if="workflow==0">取消</button>
        <button @click='detailconfig.show = false' class="btn-xl-def" v-else>关闭</button>
        <button @click="saveData" class="btn-xl-imp" v-if="workflow==0">暂存待处理</button>
        <button @click='submitData' class="btn-xl-imp" v-if="workflow==0">提交审核</button>
    </div>

    <warning :config="warCfg"></warning>

</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .max-width {
        max-width: 300px;
    }
</style>
