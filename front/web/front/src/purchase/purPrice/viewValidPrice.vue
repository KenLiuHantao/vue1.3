<script>
    export default {
        components: {

        },
        props:['config', 'inventoryid'],
        data() {
            return {
                tableData: {
                    header: {
                        docNo: '',
                        docDate: '',
                        supplierCode: '',
                        supplierName: '',
                        employeeCode: '',
                        employeeName: '',
                        taxRate: '',
                        currencyCode: '',
                        currencyName: '',
                        images: [],
                        remark: ''
                    },
                    dataList: []
                }
            }
        },
        ready() {
            this.$http.get(__URL.purchase + 'price/query/one/'  + this.inventoryid + '/valid').then((res) => {
                this.tableData = res.data.data;
            });
        },
        methods: {

        }
    }

</script>
<template :config='config'>
    <div class="inner-wrapper">

        <div class="inner-content">
            <h2 class="tag two-tag"><label>采购价格表</label></h2>

            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label></span>货品编码:</label>
                        <p class="orderData">{{tableData.header.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label></span>货品名称:</label>
                        <p class="orderData">{{tableData.header.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label></span>规格型号:</label>
                        <p class="orderData">{{tableData.header.inventorySpec}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class="inner-table">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="17%">单号</th>
                                    <th width="12%">供应商</th>
                                    <th width="12%">采购员</th>
                                    <th width="12%">币种</th>
                                    <th width="12%">税率(%)</th>
                                    <th width="16%">单价信息</th>
                                    <th width="12%">订单量</th>
                                    <th width="20%">生/失效日期</th>
                                    <th width="10%">价格状态</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>{{item.docNo}}</td>
                                    <td>{{item.supplierName}}</td>
                                    <td>{{item.employeeName}}</td>
                                    <td>{{item.currencyName}}</td>
                                    <td>{{item.taxRate}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>单位: {{item.unitName}}</p>
                                            <p>单价: {{item.price}}</p>
                                            <p>价格来源: {{item.docTypeName}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="item.docType==1" class="show-wrap">
                                            <p>订购量(从):{{item.fromQuantity}}</p>
                                            <p>订购量(到):{{item.toQuantity}}</p>
                                        </div>
                                        <div v-else>
                                            <p>{{item.fromQuantity}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="item.docType==1" class="show-wrap">
                                            <p>生效日期：{{item.effectiveDate}}</p>
                                            <p>失效日期：{{item.expiredDate}}</p>
                                        </div>
                                    </td>
                                    <td>{{item.priceStatus == 0 ? '报价已被失效' : ''}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">关闭</button>
    </div>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
