<script>
    import moment from 'moment';

    export default{
        data(){
            return{
                msg:'hello vue',
                workflow:"",
                repeal:"",
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
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
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
                revokeCb:true,
            }
        },
        props:['balancecategorycode','docno','detailconfig'],

        ready() {
            this.flowCfg.data[0].name=this.balancecategorycode=="001"?"创建现金期初余额":"创建银行存款期初余额";
            this.openDetail()
        },
        methods:{
            openDetail(){
                if(this.docno != ""){
                    this.$http.get(__URL.financial + 'init/balance/detail/' + this.docno).then(
                        (res) => {
                            this.initBalance = res.data.data;
                            var wf = this.initBalance.dataList[0].workFlowStatus;
                            this.workflow = wf;
                            this.repeal = this.initBalance.dataList[0].repeal;
                            this.setFlow();
                        }
                    )
                }
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
            toEdit(){
                this.isEdit = true;
                console.log(this.isEdit);
            },
            applyRevoke(){
                if(this.revokeCb == false) return;
                this.revokeCb = false;
                this.$http.post(__URL.financial + 'init/balance/applyRevoke', {"docNo":this.initBalance.header.docNo,"recordVersion":this.initBalance.dataList[0].recordVersion}).then( (res) => {
                        console.log(res.data.success);

                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','撤销提交审核成功');
                            this.$emit('refresh')
                        }
                        this.revokeCb = true;
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
                    <label>制单日期:</label>
                    <p>{{initBalance.header.docDate}}</p>
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
                                    {{item.currencyName}}
                                </td>
                                <td>
                                    {{item.balance}}
                                </td>
                                <td>
                                    {{item.exchangeRate}}
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
                                    {{item.bankAccount}}
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
                                    {{item.balance}}
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
        <button v-if="repeal==0" @click='detailconfig.show = false' class="btn-xl-def">取消</button>
        <button v-else @click='detailconfig.show = false' class="btn-xl-def">关闭</button>
        <button @click='applyRevoke' class="btn-xl-danger" v-if="repeal==0">撤销提交审核</button>
    </div>

    <warning :config="warCfg"></warning>

</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
