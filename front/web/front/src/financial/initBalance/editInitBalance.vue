<script>
    import moment from 'moment';

    export default{
        data(){
            return{
                msg:'hello vue',
                allCurrency:[],
                allBankAccount:[],
                workflow:"",
                isEdit:false,
                exchangeRateCategory:[
                    {"code":"10001","name":"固定汇率"},{"code":"10002","name":"浮动汇率"}
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
                    "recordVersion": 0
                },
                docDateConfig:{
                    placeholder:"请选择制单日期",
                    format: 'YYYY-MM-DD',
                    maxDate: new Date(),
                    clear: false
                },
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
                },
                flowCfg:{
                    data:[
                        {
                            no:'1',
                            name:'创建现金期初余额',
                            time:'',
                            filed:'',
                            user:'',
                            flag:false,
                        },
                        {
                            no:'2',
                            name:'待审核',
                            time:'',
                            filed:'',
                            user:'',
                            flag:false,
                        },
                        {
                            no:'3',
                            name:'已审核',
                            time:'',
                            filed:'',
                            user:'',
                            flag:false,
                        },
                        {
                            no:'4',
                            name:'完成',
                            time:'',
                            filed:'',
                            user:'',
                            flag:false,
                        }
                    ]
                },
                saveCb:true,
                submitCb:true,
                saveSubmitCb:true,
                delCb:true,
            }
        },
        props:['balancecategorycode','docno','detailconfig'],

        ready() {
            this.flowCfg.data[0].name=this.balancecategorycode=="001"?"创建现金期初余额":"创建银行存款期初余额";
            //初始化时拿到币种列表
            this.$http.post(__URL.arc+'currency/find/ref',{}).then(
                (res) => {
                    if(res.data.success){
                        this.allCurrency=res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
            )
            this.$http.post(__URL.arc+'bankaccount/using/list',{}).then(
                (res) => {
                    if(res.data.success){
                        this.allBankAccount=res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到银行账号')
                }
            )

            this.openDetail()


        },
        methods:{
            openDetail(){
                this.$http.get(__URL.financial + 'init/balance/detail/' + this.docno).then(
                    (res) => {
                        this.initBalance = res.data.data;
                        var wf = this.initBalance.dataList[0].workFlowStatus;
                        this.workflow = wf;
                        this.setFlow();
                    }
                )

            },
            setFlow(){
                var index= this.workflow == null?0:this.workflow;
                for(var i=0;i<this.flowCfg.data.length;i++){
                    if(i<=index){
                        this.flowCfg.data[i].flag = true;
                    }
                }
            },
            addRow() {
                this.rowNum++;
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.initBalance.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.initBalance.dataList.length == 1) {
                    this.showMsg('warning','明细至少要有一行');
                    return;
                }
                this.initBalance.dataList.splice(index, 1);
            },
            showDel(){
                this.delCfg.show = true;
            },
            del(){
                if(this.delCb == false) return;
                this.delCb = false;
                this.$http.get(__URL.financial + 'init/balance/delete/'+ this.docno).then(
                    (res) => {
                        if(res.data.success){
                            this.showMsg('success','删除成功');
                            this.$emit('refresh')
                        }else {
                            this.showMsg('warning',res.data.errMsg);
                        }
                        this.delCb = true;
                    }
                )
            },
            showMsg(type,msg){
                this.warCfg.show = true;
                this.warCfg.type=type;
                this.warCfg.content=msg;
            },
            toEdit(){
                this.isEdit = true;
                console.log(this.isEdit);
            },
            currencyChange(obj,index){
                for(var i=0;i<this.allCurrency.length;i++){
                    if(this.allCurrency[i].currencyCode==obj){
                        this.initBalance.dataList[index].exchangeRate = this.allCurrency[i].exchangeRate;
                    }
                }
            },
            bankAccountChange(obj,index){
                for(var i=0;i<this.allBankAccount.length;i++){
                    if(this.allBankAccount[i].accountNumber==obj){
                        this.initBalance.dataList[index].bankAccount = this.allBankAccount[i].account;
                        this.initBalance.dataList[index].currencyCode = this.allBankAccount[i].currencyCode;
                        this.initBalance.dataList[index].currencyName = this.allBankAccount[i].currencyName;
                        this.currencyChange(this.allBankAccount[i].currencyCode,index);
                    }
                }
            },
            saveData() {
                if(this.saveCb == false) return;
                this.saveCb = false;
                if (!this.check()) {
                    this.warCfg.show = true;
                    this.saveCb = true;
                    return false
                }
                var url = this.initBalance.header.docNo=="" ? __URL.financial + 'init/balance/insert':__URL.financial + 'init/balance/update';
                this.$http.post(url, this.initBalance).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','保存成功');
                            this.isEdit=false;
                            this.openDetail();
                        }
                        this.saveCb = true;
                    }
                )
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
            submit() {
                if(this.submitCb == false) return;
                this.submitCb = false;
                if (!this.check()) {
                    this.warCfg.show = true;
                    this.submitCb=true;
                    return false
                }
                this.$http.post(__URL.financial + 'init/balance/submit', {"docNo":this.initBalance.header.docNo,"recordVersion":this.initBalance.dataList[0].recordVersion}).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','提交成功');
                            this.detailconfig.show =false;
                            this.$emit("openaudit",this.initBalance.header.docNo)
                        }
                        this.submitCb = true;
                    }
                )
            },
            addAndSubmit(){
                if(this.saveSubmitCb == false) return;
                this.saveSubmitCb = false;
                this.$http.post(__URL.financial + 'init/balance/savesubmit', this.initBalance).then(
                    (res) => {
                        if(res.data.success){
                            this.showMsg('success','提交成功');
                            this.detailconfig.show =false;
                            this.$emit("openaudit",res.data.data)
                        }else {
                            this.showMsg('warning',res.data.errMsg);
                        }
                        this.saveSubmitCb = true;
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

            <h2 class="tag"><label v-if="balancecategorycode == '001'">现金期初余额信息</label><label v-if="balancecategorycode == '002'">银行存款余额信息</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point" v-if="isEdit">*</span>制单日期:</label>
                    <div class="s-input" v-if="isEdit">
                        <date-picker :config="docDateConfig"
                                    :date.sync='initBalance.header.docDate'></date-picker>
                    </div>
                    <p v-else>
                        {{initBalance.header.docDate}}
                    </p>
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
                                    <select v-if="isEdit  && workflow==0" v-model='item.currencyCode' @change="currencyChange(item.currencyCode,$index)">
                                        <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                                    </select>
                                    <span v-else>{{item.currencyName}}</span>
                                </td>
                                <td>
                                    <span v-if="isEdit  && workflow==0">
                                        <input-number  placeholder="期初余额" :code.sync='item.balance'></input-number>
                                    </span>
                                    <span v-else>{{item.balance}}</span>
                                </td>
                                <td>
                                    {{item.exchangeRate}}
                                </td>
                            </tr>
                            </tbody>
                        </table>

                            <div class="add-wrap" v-if="isEdit && workflow==0">
                                <button @click="addRow"><i class="icon icon-add-data" ></i> 增加</button>
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
                                    <select v-if="isEdit && workflow==0" v-model='item.bankNumber' @change="bankAccountChange(item.bankNumber,$index)">
                                        <option :value='item2.accountNumber' v-for='item2 in allBankAccount'>{{item2.account}}</option>
                                    </select>
                                    <span v-else>{{item.bankAccount}}</span>
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
                                    <span v-if="isEdit && workflow ==0">
                                        <input-number  placeholder="期初余额" :code.sync='item.balance'></input-number>
                                    </span>
                                    <span v-else>{{item.balance}}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <div class="add-wrap"  v-if="isEdit && workflow ==0">
                            <button @click="addRow"><i class="icon icon-add" ></i> 增加</button>
                        </div>
                        </div>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='detailconfig.show = false' class="btn-xl-def">取消</button>
        <button v-if='!isEdit' @click='showDel' class="btn-xl-danger" >删除</button>
        <button v-if='!isEdit' @click='toEdit' class="btn-xl-imp" >编辑</button>
        <button v-if='isEdit' @click='saveData' class="btn-xl-imp" >暂存待处理</button>
        <button @click='submit' class="btn-xl-imp" v-if="!isEdit">提交审核</button>
        <button @click='addAndSubmit' class="btn-xl-imp" v-if="isEdit">提交审核</button>
    </div>

    <warning :config="warCfg"></warning>

    <alert :config="delCfg" @cb="del"></alert>

</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
