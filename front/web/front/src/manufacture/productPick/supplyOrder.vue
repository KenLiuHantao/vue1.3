<script>
    export default {
        components: {},
        props: ['order', 'tabIndex'],
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                validShow: {
                    docDate: false
                },
                tableData: {
                    header: {
                        docDate: "",
                        processCode: "",
                        processName: "",
                        warehouseCode: "",
                        warehouseName: "",
                        employeeCode: "",
                        employeeName: "",
                        warehouseEmployeeCode: "",
                        warehouseEmployeeName: "",
                        departmentCode: "",
                        departmentName: "",
                    },
                    dataList: []
                },

                lock: true
            }
        },
        ready() {
            if (this.tabIndex == 1) {
                this.$http.get(__URL.manufacture + 'production/material/add/inner/detail/' + this.order.srcDocNo).then((res) => {
                    this.tableData = res.data.data;
                    this.lock = false;
                });
            }
            if (this.tabIndex == 3) {
                this.$http.get(__URL.manufacture + 'production/material/add/picked/supply/detail/' + this.order.pickDocNo).then((res) => {
                    this.tableData = res.data.data;
                    this.lock = false;
                });
            }

        },
        methods: {
            cancel() {
                this.$emit('refresh','');
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">生产补料单信息</h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>生产班组:</label>
                        <p class="orderData">{{ tableData.header.departmentName }}</p>
                    </div>
                    <div class="form-group">
                        <label>申请人:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>申请日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">{{ tableData.header.warehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓管员:</label>
                        <p class="orderData">{{ tableData.header.warehouseEmployeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>生产订单号:</label>
                        <p class="orderData">{{ tableData.header.demandDocNo }}</p>
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
                                    <th width="10%">生产领料单号</th>
                                    <th width="10%">申请数量</th>
                                    <th width="10%">备料数量</th>
                                    <th width="10%">实补数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">补料原因</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>{{item.inventoryCode}}</label></p>
                                            <p><label>{{item.inventoryName}}</label></p>
                                            <p><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.sourceDocNo}}</td>
                                    <td>{{ item.applyQuantity}}</td>
                                    <td>
                                        <p v-if="tabIndex==1">{{item.perQuantity}}</p>
                                        <p v-if="tabIndex==3">{{item.currentPrepareQuantity}}</p>
                                    </td>
                                    <td>
                                        <p v-if="tabIndex==1">{{item.supplyQuantity}}</p>
                                        <p v-if="tabIndex==3">{{item.currentSupplyQuantity}}</p>
                                    </td>

                                    <td>{{ item.unitName}}</td>
                                    <td>{{ item.reasonDesc}}</td>
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