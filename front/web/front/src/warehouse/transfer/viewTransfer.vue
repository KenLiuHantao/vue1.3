<script>

    export default {
        props: ['config', 'docno'],
        data() {
            return {
                tableData: { },
            }
        },
        ready() {
            this.$http.get(__URL.warehouse + 'transfer/query/one/' + this.docno, {}).then((res) => {
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
            <h2 class="tag two-tag"><label>调拨单</label><label class="ft-14">调拨单单号: {{ docno }}</label></h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>调拨日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>调出仓库:</label>
                        <p class="orderData">{{ tableData.header.outWarehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>调入仓库:</label>
                        <p class="orderData">{{ tableData.header.inWarehouseName }}</p>
                    </div>
                </div>
                <div class="inner-item form-box">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <p class="orderData">{{ tableData.header.remark }}</p>
                    </div>
                </div>
                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class="inner-table">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="20%">货品信息</th>
                                    <th width="20%">调拨数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label><span class="must-point">*</span>编码:</label><label>{{item.inventoryCode}}</label></p>
                                            <p><label><span class="must-point">*</span>名称:</label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.quantity }}</td>
                                    <td>{{item.unitName}}</td>
                                    <td>{{item.conversionRate}}</td>
                                    <td>{{item.byUnitName}}</td>
                                    <td>{{item.byQuantity}}</td>
                                    <td></td>
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
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
    </div>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
    .form-group {
        width: 100%;
    }
</style>
