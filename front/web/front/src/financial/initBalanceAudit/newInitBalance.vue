<script>


    export default{
        data(){
            return{
                msg:'hello vue',
                allCurrency:[],
                allBankAccount:[],
                workflow:"",
                repeal:"",
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
                    minDate: new Date(),
                    maxDate:'2100-12-31',
                    clear: false
                },
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                flowCfg:{
                    data:[
                        {
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
                        }
                    ]
                },
                agreeCb:true,
                auditCb:true,
                unauditCb:true,
            }
        },
        props:['balancecategorycode','docno','detailconfig'],
        ready() {
            this.flowCfg.data[0].name=this.balancecategorycode=="001"?"创建现金期初余额":"创建银行存款期初余额";
            this.$http.get(__URL.financial + 'init/balance/detail/' + this.docno).then(
                (res) => {
                    this.initBalance = res.data.data;
                    var wf = this.initBalance.dataList[0].workFlowStatus;
                    this.workflow = wf;
                    this.setFlow();
                    this.repeal = this.initBalance.dataList[0].repeal
                }
            )


        },
        methods:{
            addRow() {
                this.rowNum++;
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.initBalance.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.initBalance.dataList.length == 1) {
                    this.showMsg("warning",'明细至少要有一行');
                    return;
                }
                this.initBalance.dataList.splice(index, 1);
            },
            setFlow(){
                var index= this.workflow == null?0:this.workflow;
                for(var i=0;i<this.flowCfg.data.length;i++){
                    if(i<=index){
                        this.flowCfg.data[i].flag = true;
                    }
                }
            },
            showMsg(type,msg){
                this.warCfg.show = true;
                this.warCfg.type=type;
                this.warCfg.content=msg;
            },

            agreeRevoke(){
                if(this.agreeCb ==  false) return;
                this.agreeCb = false;
                this.$http.post(__URL.financial + 'init/balance/revoke', {"docNo":this.initBalance.header.docNo,"recordVersion":this.initBalance.dataList[0].recordVersion}).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','同意撤销提交成功');
                            this.$emit('refresh')
                        }
                        this.agreeCb = true;
                    }
                )
            },
            audit(){
                if(this.auditCb == false) return;
                this.auditCb = false;
                this.$http.post(__URL.financial + 'init/balance/audit', {"docNo":this.initBalance.header.docNo,"recordVersion":this.initBalance.dataList[0].recordVersion}).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','审核成功');
                            this.$emit('refresh')
                        }
                        this.auditCb = true;
                    }
                )
            },
            unAudit(){
                if(this.unauditCb == false) return;
                this.unauditCb = false;
                this.$http.post(__URL.financial + 'init/balance/unaudit', {"docNo":this.initBalance.header.docNo,"recordVersion":this.initBalance.dataList[0].recordVersion}).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','弃审成功');
                            this.$emit('refresh')
                        }
                        this.unauditCb = true;
                    }
                )
            },
            close () {
                this.$emit('refresh')
            },
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
                    <label>收款日期:</label>
                    <p class="orderData">{{initBalance.header.docDate}}</p>
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
                        <table class="inner-table mt-15" v-if="balancecategorycode=='001'">
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
                                    <p>{{item.currencyName}}</p>
                                </td>
                                <td>
                                    <p>{{item.balance}}</p>
                                </td>
                                <td>
                                    <p>{{item.exchangeRate}}</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        
                        <table class="inner-table mt-15" v-if="balancecategorycode=='002'">
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
                                    <p>{{item.bankAccount}}</p>
                                </td>
                                <td>
                                    <p>{{item.bankNumber}}</p>
                                </td>
                                <td>
                                    <p>{{item.currencyName}}</p>
                                </td>
                                <td>
                                    <p>{{item.exchangeRate}}</p>
                                </td>
                                <td>
                                    <p>{{item.balance}}</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='close' class="btn-xl-def" v-if="repeal==1 || (!repeal && workflow==1) || workflow==3">取消</button>
        <button @click='close' class="btn-xl-def" v-else>关闭</button>
        <button @click='agreeRevoke' class="btn-xl-imp" v-if="repeal==1">同意撤销提交</button>
        <button @click="audit" class="btn-xl-imp"  v-if="!repeal && workflow==1">审核</button>
        <button @click="unAudit" class="btn-xl-danger"  v-if="workflow==3">弃审</button>
    </div>

    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>