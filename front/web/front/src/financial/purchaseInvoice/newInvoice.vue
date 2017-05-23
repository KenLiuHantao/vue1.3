<script>
    export default{
        props: ['invoiceCfg', 'docNos', 'docNo', 'invoiceCategoryCode'],
        data(){
            return {
                msg: 'hello vue',
                red: false,
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
                            "unitPrice": 0
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
                        "supplierCode": "",
                        "supplierName": ""
                    }
                },
                docDateConfig: {
                    placeholder: "请选择收款日期",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
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
                            name: '创建采购发票',
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
                calculateCb: true,
                submitCb: true,
                saveCb: true
            }
        },
        ready() {
            if (this.docNos && this.docNos.length > 0) {
                this.showDetail();
                if (this.invoiceCategoryCode == "002") {
                    this.invoiceCfg.title = "采购退票";
                    this.flowCfg.data[0].name = "创建采购退票";
                    this.red = true;
                }
            }
            if (this.invoiceCategoryCode == "002" && this.docNo.length > 0) {
                this.invoiceCfg.title = "采购退票";
                this.flowCfg.data[0].name = "创建采购退票";
                this.red = true;
                this.$http.get(__URL.financial + 'purchase/invoice/red/' + this.docNo).then(
                    (res) => {
                        this.orders = res.data.data;
                        console.log(res);
                    }
                )
            }
            this.flowCfg.data[0].flag = true;
        },
        methods: {
            delRow(index) {
                if (this.orders.dataList.length == 1) {
                    this.showMsg('warning', '明细至少要有一行');
                    return;
                }
                this.orders.dataList.splice(index, 1);
            },
            showMsg(type, msg){
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            showDetail(){
                //多条开票获取详情信息
                this.$http.post(__URL.financial + 'purchase/invoice/wait/detail/multi', this.docNos).then(
                    (res) => {
                        this.orders = res.data.data;
                        console.log(res);
                    }
                )

            },
            add(){
                if (this.saveCb == false) return;
                this.saveCb = false;
                if (this.red){
                    this.orders.header.invoiceCategoryCode = this.invoiceCategoryCode;
                }
                this.$http.post(__URL.financial + 'purchase/invoice/insert', this.orders).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '新增成功');
                            this.invoiceCfg.show = false;
                            this.$emit("openeditor", res.data.data)
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.saveCb = true;
                    }
                )
            },
            addAndSubmit(){
                if (this.submitCb == false) return;
                this.submitCb = false;
                if (this.red){
                    this.check();
                    this.orders.header.invoiceCategoryCode = this.invoiceCategoryCode;
                }
                this.$http.post(__URL.financial + 'purchase/invoice/savesubmit', this.orders).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '提交成功');
                            this.invoiceCfg.show = false;
                            this.$emit("opencheck", res.data.data)
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.submitCb = true;
                    }
                )
            }
        },
        filters: {
            //同步计算价税总计
            setQtyTax: {
                write(val, oldval, x, index){
                    if (this.calculateCb == false) return;
                    this.calculateCb = false;
                    let d = this.orders.dataList[index]
                    let taxRate = d.taxRate
                    var data = {
                        "taxCategory": d.taxPriceCategory == 'BU0110001' ? "TAXABLE_PLUS" : "TAXABLE_CONTAINING",
                        "taxUnitPrice": d.taxPriceCategory == 'BU0110001' ? d.unitPrice * (1 + d.taxRate / 100) : d.unitPrice * (1 - d.taxRate / 100),
                        "quantity": val,
                        "taxRate": d.taxRate,
                        "exchangeRate": this.orders.header.exchangeRate,
                        "ts": new Date().getTime()
                    };
                    this.$http.post(__URL.financial + 'priceTaxCombined/updateQuantityAndTaxUnitPrice', data).then(
                        (res) => {
                            d.taxAmounts = res.data.taxAmounts;
                            d.tax = res.data.tax;
                            this.calculateCb = true;
                        }
                    )
                    return val;
                }
            },
            setUnitPriceTax: {
                write(val, oldval, x, index){
                    if (this.calculateCb == false) return;
                    this.calculateCb = false;
                    let d = this.orders.dataList[index]
                    let taxRate = d.taxRate
                    var data = {
                        "taxCategory": d.taxPriceCategory == 'BU0110001' ? "TAXABLE_PLUS" : "TAXABLE_CONTAINING",
                        "unitPrice": val,
                        "quantity": d.sourceQty,
                        "taxRate": d.taxRate,
                        "exchangeRate": this.orders.header.exchangeRate,
                        "ts": new Date().getTime()
                    };
                    this.$http.post(__URL.financial + 'priceTaxCombined/updateUnitPrice', data).then(
                        (res) => {
                            d.taxAmounts = res.data.taxAmounts;
                            d.tax = res.data.tax;
                            this.calculateCb = true;
                        }
                    );
                    return val;
                }
            }
        }

    }

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag"><label>采购收票信息</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p class="orderData">{{orders.header.supplierName}}</p>
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
                    <select v-model='orders.header.invoiceTypeCode'>
                        <option :value='item.invoiceTypeCode' v-for='item in invoiceType'>{{item.invoiceTypeName}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>收款日期:</label>
                    <div class="s-input">
                        <date-picker :config="docDateConfig"
                                     :date.sync='orders.header.docDate'></date-picker>
                    </div>
                </div>
            </div>

            <div class="inner-item">
                <tab-container>
                    <tab-item>
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="15%">入库单号</th>
                                <th width="15%">货品信息</th>
                                <th width="10%">单位</th>
                                <th v-if="!red" width="10%">发货数量</th>
                                <th v-if="red" width="10%">退票数量</th>
                                <th width="10%">无税单价</th>
                                <th width="10%">税率(%)</th>
                                <th width="10%">税额</th>
                                <th width="10%">价税合计</th>
                                <th v-if="red" width="70px">操作</th>
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
                                <td>
                                    <input-number v-if="red" class="wd100"
                                                  :code.sync="item.sourceQty | setQtyTax 'taxAmounts' $index"
                                                  :style="red?'color:red':''" placeholder="退票数量"></input-number>
                                    <span v-else>
                                        {{item.sourceQty}}
                                    </span>
                                </td>
                                <td>
                                    <input-number v-if="!red" class="wd100" :style="red?'color:red':''"
                                                  :code.sync="item.unitPrice | setUnitPriceTax 'taxAmounts' $index"
                                                  placeholder="无税单价"></input-number>
                                    <span v-else>
                                        {{item.unitPrice}}
                                    </span>
                                </td>
                                <td>
                                    {{item.taxRate}}
                                </td>
                                <td :style="red?'color:red':''">
                                    {{item.tax}}
                                </td>
                                <td :style="red?'color:red':''">
                                    {{item.taxAmounts}}
                                </td>
                                <td v-if="red">
                                    <button class="button-danger" @click='delRow($index)'>删除</button>
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
        <button @click='add' class="btn-xl-imp">暂存待处理</button>
        <button @click='addAndSubmit' class="btn-xl-imp">提交审核</button>
    </div>
    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/common.less';

</style>