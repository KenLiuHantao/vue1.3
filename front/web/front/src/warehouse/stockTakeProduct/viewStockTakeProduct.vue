<script>
    export default {
        props: ['config', 'docno'],
        data() {
        return {
            profitTypeText: {
                '1': '入库单据未及时审核盘盈',
                '2': '出库单据未及时审核盘亏',
                '3': '出库单据重复录入盘盈',
                '4': '入库单据重复录入盘亏',
                '5': '供应商备品未入账盘盈',
                '6': '实物损毁盘亏',
                '7': '其他'
            },
            tableData: {}
        }
    },
    ready() {
        this.$http.get(__URL.warehouse + 'stock/take/product/query/one/' + this.docno, {}).then((res) => {
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
<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>盘点单信息</label><label class="ft-14">盘点单号: {{ docno }}</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">{{ tableData.header.warehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓管员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>盘点日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                </div>
            </div>

            <div class="inner-item">
                <tab-container>
                    <tab-item>
                        <table class="inner-table">
                            <thead>
                            <tr>
                                <th width="4%">序号</th>
                                <th width="15%">货品信息</th>
                                <th width="7%">单位</th>
                                <th width="8%">账面数量</th>
                                <th width="12%">实盘数量</th>
                                <th width="8%">辅单位</th>
                                <th width="8%">换算率</th>
                                <th width="8%">实盘辅数量</th>
                                <th width="8%">盈亏数量</th>
                                <th width="16%">盈亏类型</th>
                                <th width="8%">备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(index,item) in tableData.dataList">
                                <td>{{ $index+1 }}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.unitName}}</td>
                                <td>{{item.bookQuantity}}</td>
                                <td>{{item.firmQuantity}}</td>
                                <td>{{item.byUnitName}}</td>
                                <td>{{item.conversionRate}}</td>
                                <td>{{item.byFirmQuantity}}</td>
                                <td>{{item.profitQuantity}}</td>
                                <td>{{ profitTypeText[item.profitType] }}</td>
                                <td>{{item.rowRemark}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">关闭</button>
    </div>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>