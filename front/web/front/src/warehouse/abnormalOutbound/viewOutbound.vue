<script>
    import cfg from './cfg'

    import referWarehouse from '../referWarehouseForTransfer'

    export default {
        components: {
            referWarehouse
        },
        props: ['config','docno'],
        data() {
            return {
                tableData: {
                    header: {
                        'docNo': '',
                        'docDate': '',
                        'remark': '',
                        'ioCategory': '1',
                        'warehouseCode': '',
                        'warehouseName': ''
                    },
                    dataList: []
                }
            }
        },
        ready() {
            this.lock = false;
            if(this.docno){
                this.$http.get(__URL.warehouse + 'abnormal/outbound/query/one/' + this.docno, {}).then((res) => {
                    this.tableData = res.data.data;
            });
            }
        },
        methods: {

        }
    }
</script>

<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>非正常出库单</label><label class="ft-14">非正常出库单号: {{ docno }}</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>收发类型:</label>
                        {{tableData.header.ioCategory}}
                    </div>
                    <div class="form-group">
                        <label>出库日期:</label>
                        {{tableData.header.docDate}}
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        {{tableData.header.warehouseName}}
                    </div>
                </div>
                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        {{tableData.header.remark}}
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
                                    <th width="10%">出库数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
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
                                    <td>
                                        {{item.quantity}}
                                    </td>
                                    <td>{{item.unitName}}</td>
                                    <td>{{item.conversionRate}}</td>
                                    <td>{{item.byUnitName}}</td>
                                    <td>{{item.byQuantity}}</td>
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