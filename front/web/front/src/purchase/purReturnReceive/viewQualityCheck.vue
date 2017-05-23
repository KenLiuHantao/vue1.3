<script>

    export default {
        props: {
            selected: Object
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                tableData: {
                    header: {},
                    dataList: [],
                }
            }
        },
        ready() {
            var params = {srcDocNo: this.selected.docNo, warehouseCode: this.selected.warehouseCode};
            this.$http.post(__URL.warehouse + 'wait/return/receive/query/receive/one', params).then((res) => {
                if(res.data.success){
                    this.tableData = res.data.data;
                } else {
                    this.warnConfig.show = true
                    this.warnConfig.content = res.data.errMsg;
                    this.warnConfig.type = "failure"
                }
            });
        },
        methods: {
            cancel() {
                this.$emit('close');
            }
        }
    }
</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag">
                <label v-if="selected.srcDocType == 1">采购单</label>
                <label v-else="selected.srcDocType == 2">委外采购单</label>
                <label v-if="selected.srcDocType == 1" class="ft-14">采购单号: {{selected.docNo }}</label>
                <label v-else="selected.srcDocType == 2" class="ft-14">委外采购单号: {{ selected.docNo }}</label></h2>
            </h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商名称:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购日期:</label>
                        <p class="orderData">{{ tableData.header.srcDocDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p class="orderData">{{ tableData.header.currencyName}}</p>
                    </div>
                    <div class="form-group">
                        <label>采购员:</label>
                        <p class="orderData">{{ tableData.header.srcEmployeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>汇率:</label>
                        <p class="orderData">{{ tableData.header.exchRate}}</p>
                    </div>
                    <div class="form-group">
                        <label>税率(%):</label>
                        <p class="orderData">{{ tableData.header.taxRate}}</p>
                    </div>
                    <div class="form-group">
                        <label>采购部门:</label>
                        <p class="orderData">{{ tableData.header.srcDepartmentName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购单状态:</label>
                        <p v-if="tableData.header.srcDocStatus == 1" class="red">{{ tableData.header.srcDocStatusStr }}</p>
                        <p v-if="tableData.header.srcDocStatus == 2" class="green">{{ tableData.header.srcDocStatusStr }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="orderData lh-20">{{ tableData.header.remark }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class='inner-table'>
                                <thead>
                                <tr>
                                    <th width="5%">序号</th>
                                    <th width="15%">货品信息</th>
                                    <th width="10%">采购信息</th>
                                    <th width="10%">请购时间</th>
                                    <th width="10%">需求日期</th>
                                    <th width="10%">交期</th>
                                    <th width="10%">检验状况</th>
                                    <th width="10%">销售单号</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                            <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>采购数量:</label><label>{{item.srcDocQuantity}}</label></p>
                                            <p><label>单位:</label><label>{{item.unitName}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.applyTime }}</td>
                                    <td>{{ item.demandDate }}</td>
                                    <td>{{ item.deliveryDate }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>收货数量:</label><label>{{item.quantity}}</label></p>
                                            <p><label>合格允收数量:</label><label>{{item.goodQuantity}}</label></p>
                                            <p><label>不良退收数量:</label><label>{{item.badQuantity}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.salesOrderDocNo}}</td>
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
        <button @click='cancel' class="btn-xl-def">关闭</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>