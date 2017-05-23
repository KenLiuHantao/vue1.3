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
            lock: true,
        }
    },
    ready() {
        this.$http.get(__URL.purchase + 'outsource/query/detail/' + this.docno).then((res) => {
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
                    <label>采购订单状态:</label>
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
                        <th width="8%">价税合计</th>
                        <th width="12%">请购时间</th>
                        <th width="10%">需求日期</th>
                        <th width="10%">交期</th>
                        <th width="15%">入库状况</th>
                        <th width="10%">销售单号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in tableData.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码: {{item.inventoryCode}}</p>
                                <p>名称: {{item.inventoryName}}</p>
                                <p>型号: {{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>采购数量: {{item.quantity}}</p>
                                <p>采购单价: {{item.taxUnitPrice}}</p>
                                <p>单位: {{item.unitName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.taxAmounts}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.applyDate}}</p>
                                <p>{{item.applyTime}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.demandDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.deliveryDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>入库数量: {{item.totalInboundQty}}</p>
                                <p>未交数量: {{item.unInboundQty}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.saleOrderDocNo}}</p>
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
