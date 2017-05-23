<script>
    export default{
        props: ['invoiceCfg', 'docNo'],
        data(){
            return {
                msg: 'hello vue',
                red: false,
                isEdit: false,
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
                            "recordVersion": ""
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
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '确定删除该条记录'
                },
                flowCfg: {
                    data: [
                        {
                            no: '1',
                            name: '创建发票',
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
                submitVo: {
                    "docNo": "",
                    "recordVersion": ""
                },
                delCb: true,
                saveCb: true,
                sumbitCb: true,
                saveSubmitCb: true,
                calcCb: true,
            }
        },
        ready() {
            if (this.docNo && this.docNo != '') {
                this.showDetail();
            }
        },
        methods: {
            delRow(index) {
                if (this.orders.dataList.length == 1) {
                    this.showMsg('warning', '明细至少要有一行');
                    return;
                }
                this.orders.dataList.splice(index, 1);
            },
            showDetail(){
                //多条开票获取详情信息
                this.$http.get(__URL.financial + 'purchase/invoice/detail/' + this.docNo).then(
                    (res) => {
                        this.orders = res.data.data;
                        this.red = this.orders.header.invoiceCategoryCode == "002";
                        if (this.red) {
                            this.flowCfg.data[0].name = "创建采购退票";
                            this.invoiceCfg.title = "采购退票";
                        } else {
                            this.flowCfg.data[0].name = "创建采购收票";
                            this.invoiceCfg.title = "采购收票";
                        }

                        console.log(res);
                    }
                )
                this.flowCfg.data[0].flag = true;
            },
            toEdit(){
                this.isEdit = true;
                console.log(this.isEdit);
            },
            showMsg(type, msg){
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            save(){
                if (this.saveCb == false) return;
                this.saveCb = false;
                this.$http.post(__URL.financial + 'purchase/invoice/update', this.orders).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '保存成功');
                            this.isEdit = false
                            this.showDetail();
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.saveCb = true;
                    }
                )
            },
            showDel(){
                this.delCfg.show = true;
            },
            del(){
                if (this.delCb == false) return;
                this.delCb = false;
                this.$http.get(__URL.financial + 'purchase/invoice/delete/' + this.docNo).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '删除成功');
                            this.$emit('refresh')
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.delCb = true;
                    }
                )
            },
            submit(){
                if (this.submitCb == false) return;
                this.submitCb = false;
                this.submitVo.docNo = this.orders.header.docNo;
                this.submitVo.recordVersion = this.orders.dataList[0].recordVersion;
                console.log("&&", this.submitVo);
                this.$http.post(__URL.financial + 'purchase/invoice/submit', this.submitVo).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '提交成功');
                            this.invoiceCfg.show = false;
                            this.$emit('opencheck', this.orders.header.docNo)
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.submitCb = true;
                    }
                )
            },
            addAndSubmit(){
                if (this.saveSubmitCb == false) return;
                this.saveSubmitCb = false;
                this.$http.post(__URL.financial + 'purchase/invoice/savesubmit', this.orders).then(
                    (res) => {
                        if (res.data.success) {
                            this.showMsg('success', '提交成功');
                            this.invoiceCfg.show = false;
                            this.$emit('opencheck', this.orders.header.docNo)
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                        }
                        this.saveSubmitCb = true;
                    }
                )
            }

        },
        filters: {
            //同步计算价税总计
            setQtyTax: {
                write(val, oldval, x, index){
                    if (this.calcCb == false) return;
                    this.calcCb = false;
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
                            this.calcCb = true;
                        }
                    )
                    return val;
                }
            },
            setUnitPriceTax: {
                write(val, oldval, x, index){
                    if (this.calcCb == false) return;
                    this.calcCb = false;
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
                            this.calcCb = true;
                        }
                    )
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
                    <select v-if="isEdit" v-model='orders.header.invoiceTypeCode'>
                        <option :value='item.invoiceTypeCode' v-for='item in invoiceType'>{{item.invoiceTypeName}}
                        </option>
                    </select>
                    <p v-else class="orderData">
                        {{orders.header.invoiceTypeCode}}
                    </p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>收款日期:</label>
                    <div v-if="isEdit" class="s-input">
                        <date-picker :config="docDateConfig"
                                    :date.sync='orders.header.docDate'></date-picker>
                    </div>
                    <p v-else class="orderData">
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
                                <th width="15%">入库单号</th>
                                <th width="15%">货品信息</th>
                                <th width="10%">单位</th>
                                <th v-if="!red" width="10%">发货数量</th>
                                <th v-if="red" width="10%">退票数量</th>
                                <th width="10%">无税单价</th>
                                <th width="10%">税率(%)</th>
                                <th width="10%">税额</th>
                                <th width="10%">价税合计</th>
                                <th v-if="red && isEdit" width="30px">操作</th>
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
                                    <input-number v-if="red && isEdit" :style="red?'color:red':''" class="wd100"
                                            :code.sync="item.sourceQty | setQtyTax 'taxAmounts' $index"
                                            placeholder="退票数量"></input-number>
                                    <span v-else>
                                        {{item.sourceQty}}
                                    </span>
                                </td>
                                <td>
                                    <input-number v-if="!red && isEdit" class="wd100"
                                            :code.sync="item.unitPrice | setUnitPriceTax 'sourceQty' $index"
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
                                <td v-if="red && isEdit">
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
        <button v-if="isEdit" @click='invoiceCfg.show = false' class="btn-xl-def">取消</button>
        <button v-if='!isEdit' @click='toEdit' class="btn-xl-imp">编辑</button>
        <button v-if='isEdit' @click='save' class="btn-xl-imp">暂存到待处理</button>
        <button v-if='!isEdit' @click='showDel' class="btn-xl-danger">删除</button>
        <button @click='submit' class="btn-xl-imp" v-if="!isEdit">提交审核</button>
        <button @click='addAndSubmit' class="btn-xl-imp" v-if="isEdit">提交审核</button>
    </div>
    <warning :config="warCfg"></warning>

    <alert :config="delCfg" @cb="del"></alert>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/common.less';

</style>