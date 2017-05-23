<script>
    export default{
        props: ['invoiceCfg', 'docNo'],
        data(){
            return {
                msg: 'hello vue',
                red: false,
                repeal: "",
                workflow: "",
                invoiceType: [
                    {invoiceTypeCode: "BU0070001", invoiceTypeName: "销售专用发票"},
                    {invoiceTypeCode: "BU0070002", invoiceTypeName: "销售普通发票"},
                ],
                orders: {
                    dataList: [
                        {
                            "inventoryCode": "",
                            "inventoryId": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "recordId": "",
                            "recordVersion": "",
                            "sourceDocDate": "",
                            "sourceDocNo": "",
                            "sourceDocType": "",
                            "sourceId": "",
                            "sourceQty": 0,
                            "tax": 0,
                            "taxAmounts": 0,
                            "taxPriceCategory": "",
                            "taxRate": 0,
                            "unitCode": "",
                            "unitName": "",
                            "unitPrice": 0,
                        }
                    ],
                    header: {
                        "currencyCode": "",
                        "currencyName": "",
                        "docDate": "",
                        "docNo": "",
                        "exchangeRate": 0,
                        "invoiceCategoryCode": "",
                        "invoiceTypeCode": "",
                        "customerCode": "",
                        "customerName": ""
                    }
                },
                warCfg: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                docDateConfig: {
                    placeholder: "请选择收款日期",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
                flowCfg: {
                    data: [
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
                submitVo: {
                    "docNo": "",
                    "recordVersion": ""
                },
                agreeCb: true,
                auditCb: true,
                unauditCb: true,
                invoiceTypeName: ''
            }
        },
        ready() {
            if (this.docNo && this.docNo != '') {
                this.showDetail();
            }
        },
        methods: {
            showMsg(type, msg){
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            setFlow(){
                var index = this.workflow == null ? 0 : this.workflow;
                for (var i = 0; i < this.flowCfg.data.length; i++) {
                    if (i <= index) {
                        this.flowCfg.data[i].flag = true;
                    }
                }
            },
            showDetail(){
                this.$http.get(__URL.financial + 'sales/invoice/detail/' + this.docNo).then(
                    (res) => {
                        this.orders = res.data.data;
                        console.log(res);
                        this.repeal = this.orders.dataList[0].repeal;
                        var wf = this.orders.dataList[0].workFlowStatus;
                        this.workflow = wf;
                        this.setFlow();
                        this.red = this.orders.header.invoiceCategoryCode == "002";
                        if (this.red) {
                            this.flowCfg.data[0].name = "创建采购退票";
                            this.invoiceCfg.title = "采购退票";
                        }
                        this.invoiceTypeName = this.getInvoiceTypeName(this.orders.header.invoiceTypeCode);
                    }
                )
            },
            audit(){
                if (this.auditCb == false) return;
                this.auditCb = false;
                this.submitVo.docNo = this.orders.header.docNo;
                this.submitVo.recordVersion = this.orders.dataList[0].recordVersion;
                console.log("&&", this.submitVo);
                this.$http.post(__URL.financial + 'sales/invoice/audit', this.submitVo).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '审核成功');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.auditCb = true;
                    }
                )
            },
            unAudit(){
                if (this.unauditCb == false) return;
                this.unauditCb = false;
                this.submitVo.docNo = this.orders.header.docNo;
                this.submitVo.recordVersion = this.orders.dataList[0].recordVersion;
                console.log("&&", this.submitVo);
                this.$http.post(__URL.financial + 'sales/invoice/unaudit', this.submitVo).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '弃审成功');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.unauditCb = true;
                    }
                )
            },
            agreeRevoke(){
                if (this.agreeCb == false) return;
                this.agreeCb = false;
                this.submitVo.docNo = this.orders.header.docNo;
                this.submitVo.recordVersion = this.orders.dataList[0].recordVersion;
                this.$http.post(__URL.financial + 'sales/invoice/revoke', this.submitVo).then((res) => {
                        if (res.data.success) {
                            this.showMsg('success', '同意撤销提交');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.agreeCb = true;
                    }
                )
            },
            getInvoiceTypeName(code){
                let item = _.find(this.invoiceType, item => {
                    return item['invoiceTypeCode'] == code
                });
                return item.invoiceTypeName
            }
        },

    }

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag"><label>销售收票信息</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p class="orderData">{{orders.header.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p class="orderData">{{orders.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p class="orderData">{{orders.header.exchangeRate}}</p>
                </div>
                <div class="form-group">
                    <label>发票类型:</label>
                    <p class="orderData">
                        {{invoiceTypeName}}
                    </p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>收款日期:</label>
                    <p class="orderData">
                        {{orders.header.docDate}}
                    </p>
                </div>
            </div>

            <div class="inner-item">
                <tab-container>
                    <tab-item>
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="15%">发货单号</th>
                                <th width="15%">货品信息</th>
                                <th width="10%">单位</th>
                                <th v-if="!red" width="10%">发货数量</th>
                                <th v-if="red" width="10%">退票数量</th>
                                <th width="10%">无税单价</th>
                                <th width="10%">税率(%)</th>
                                <th width="10%">税额</th>
                                <th width="10%">价税合计</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in orders.dataList'>
                                <td>{{$index + 1}}</td>
                                <td>{{item.sourceDocNo}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.inventoryCode}}</p>
                                        <p>{{item.inventoryName}}</p>
                                        <p>{{item.inventorySpec}}</p>
                                    </div>
                                </td>
                                <td>
                                    {{item.unitName}}

                                </td>
                                <td :style="red?'color:red':''">
                                    {{item.sourceQty}}

                                </td>
                                <td>
                                    {{item.unitPrice}}

                                </td>
                                <td>
                                    {{item.taxRate}}

                                </td>
                                <td>
                                    {{item.tax}}

                                </td>
                                <td :style="red?'color:red':''">
                                    {{item.taxAmounts}}

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
        <button @click='invoiceCfg.show = false' class="btn-xl-def">取消</button>
        <button @click='agreeRevoke' class="btn-xl-imp" v-if="repeal==1">同意撤销提交</button>
        <button @click='audit' class="btn-xl-imp" v-if="!repeal && workflow==1">审核</button>
        <button @click='unAudit' class="btn-xl-danger" v-if="workflow==3">弃审</button>
    </div>
    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>