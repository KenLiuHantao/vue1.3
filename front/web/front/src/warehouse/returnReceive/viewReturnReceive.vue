<script>
    export default {
        props: {
            docno: String
        },
        data() {
            return {
                tableData: {}
            }
        },
        ready() {
            this.$http.get(__URL.warehouse + 'return/receive/query/one/' + this.docno, {}).then((res) => {
                this.tableData = res.data.data;
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
            
                <h2 class="tag two-tag"><label>退收单信息</label><label class="ft-14">退收单号: {{ docno }}</label></h2>
                <div class="block">
                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label>供应商:</label>
                            <p class="orderData">{{ tableData.header.supplierName }}</p>
                        </div>
                        <div class="form-group">
                            <label>退收日期:</label>
                            <p class="orderData">{{ tableData.header.docDate }}</p>
                        </div>
                        <div class="form-group">
                            <label>退收人员:</label>
                            <p class="orderData">{{ tableData.header.employeeName }}</p>
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
                                        <th width="10%">采购单号</th>
                                        <th width="10%">退收数量</th>
                                        <th width="10%">单位</th>
                                        <th width="10%">换算率</th>
                                        <th width="10%">辅单位</th>
                                        <th width="10%">辅数量</th>
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
                                        <td>{{ item.srcDocNo }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td>{{ item.unitName }}</td>
                                        <td>{{ item.conversionRate }}</td>
                                        <td>{{ item.byUnitName }}</td>
                                        <td>{{ item.byQuantity }}</td>
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
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>