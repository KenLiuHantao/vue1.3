
<script>
    export default {
        props: ['order'],
        data() {
            return {
                tableData: {
                    header:{
                        departmentName:'',
                        pickEmployeeName:'',
                        docDate:'',
                        warehouseName:'',
                        employeeName:'',
                        productDocNo:'',

                    },
                    dataList:[]
                }
            }
        },
        ready() {
            this.$http.get( __URL.manufacture + 'prepare/orderDetail/' + this.order.pickDocNo, {}).then((res) => {
                this.tableData = res.data.data;
            });
        },
        methods: {
            cancel() {
                this.$emit('refresh');
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产领料单信息</label><label class="ft-14">生产领料单号: {{order.pickDocNo}}</label></h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>生产班组:</label>
                        <p class="orderData">{{ tableData.header.departmentName }}</p>
                    </div>
                    <div class="form-group">
                        <label>领料员:</label>
                        <p class="orderData">{{ tableData.header.pickEmployeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>领料日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">{{ tableData.header.warehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓管员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>生产订单号:</label>
                        <p class="orderData">{{ tableData.header.productDocNo }}</p>
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
                                    <th width="10%">单位</th>
                                    <th width="10%">应发数量</th>
                                    <th width="10%">实发数量</th>
                                    <th width="10%">已领数量</th>
                                    <th width="10%">备料单号</th>
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
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.shouldQty }}</td>
                                    <td>{{ item.alreadySendQty }}</td>
                                    <td>{{ item.actualSendQty }}</td>
                                    <td>{{ item.prepareDocNo }}</td>
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