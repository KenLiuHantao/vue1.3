<script>
    export default {
        components: {

        },
        props: ['docno', 'config'],
        data() {
            return {
                tableData: {
                    'header': {
                        'docNo': '',
                        'docDate': '',
                        'docStatus' : '',
                        'supplierCode' : '',
                        'supplierName' : '',
                        'employeeCode' : '',
                        'employeeName' : '',
                        'departmentCode' : '',
                        'departmentName' : '',
                        'exchRate' : '',
                        'taxRate' : '',
                        'currencyCode' : '',
                        'currencyName' : '',
                        'remark' : ''
                    },
                    'dataList' : []
                },
                changeResultData: [{
                    key: 1,
                    value: '1. 同意变更'
                }, {
                    key: 2,
                    value: '2. 不同意变更(维持原订单行信息不变)'
                }],
                lock: true,
            }
        },
        ready() {
            this.$http.get(__URL.purchase + 'order/change/query/detail/' + this.docno).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
        },
        methods: {

        }
    }
</script>
<template>
    <div class="inner-wrapper" id="tableData">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>采购订单信息</label><label class="ft-14">采购单号: {{docno}}</label></h2>
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p class="orderData">{{tableData.header.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>采购日期:</label>
                    <p class="orderData">{{tableData.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p class="orderData">{{tableData.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>采购员:</label>
                    <p class="orderData">{{tableData.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p class="orderData">{{tableData.header.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label>税率(%):</label>
                    <p class="orderData">{{tableData.header.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>采购部门:</label>
                    <p class="orderData">{{tableData.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>变更日期:</label>
                    <p class="orderData">{{tableData.header.changeDate}}</p>
                </div>
                <div class="form-group">
                    <label>采购单状态:</label>
                    <p v-if="tableData.header.docStatus == 2" class="green">已完成</p>
                    <p v-else class="red">未完成</p>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <p class="orderData lh-20">{{tableData.header.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">采购信息</th>
                        <th width="15%">日期信息</th>
                        <th width="8%">原单入库状况</th>
                        <th width="12%">变更信息</th>
                        <th width="10%">销售单号</th>
                        <th width="10%">变更说明</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in tableData.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>货品编码: {{item.inventoryCode}}</p>
                                <p>货品名称: {{item.inventoryName}}</p>
                                <p>规格型号: {{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>采购数量: {{item.quantity}}</p>
                                <p>含税单价: {{item.taxUnitPrice}}</p>
                                <p>价税合计: {{item.taxAmounts}}</p>
                                <p>单位: {{item.unitName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>需求日期: {{item.demandDate}}</p>
                                <p>交期: {{item.deliveryDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>入库数量: {{item.totalInboundQty}}</p>
                                <p>未交数量: {{item.unInboundQty}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap red">
                                <p>变更后采购数量: {{item.changeQuantity}}</p>
                                <p>已入库待退: {{item.returnQuantity}}</p>
                                <p>原单未交取消: {{item.cancelQuantity}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.saleOrderDocNo}}</p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p style='text-align:left;'>变更类型:</p>
                                <div class="s-input ic2">
                                    <input type='text' v-if="item.changeResult == 1" value="1. 同意变更" disabled>
                                    <input type='text' v-if="item.changeResult == 2" value="2. 不同意变更(维持原订单行信息不变)" disabled>
                                </div>
                                <p style='text-align:left;'>详细备注:</p>
                                <div class="s-input ic2">
                                    <textarea disabled v-model='item.changeRemark' maxlength='140'></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='config.show = false' class="btn-xl-def">关闭</button>
    </div>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>
