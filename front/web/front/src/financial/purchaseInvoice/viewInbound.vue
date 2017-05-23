<script>
    export default {
        props: ['docNo'],
        data() {
            return {
                newData: {
                    header: {
                        'docNo': ''
                    },
                    dataList: []
                },
                tableData: {
                    "header": {
                        "srcDocNo": "",
                        "srcDocType": 1,
                        "supplierName": "",
                        "srcDocDate": "",
                        "currencyName": "",
                        "srcEmployeeName": "",
                        "exchRate": "",
                        "taxRate": "",
                        "srcDepartmentName": "",
                        "srcDocStatusStr": "",
                        "srcDocStatus": 1,
                        "remark": ""
                    },
                    "dataList": []
                },
                wareData: []
            }
        },
        ready() {
            this.lock = false;
            let param = {
                "docNo":''
            };
            param.docNo = this.docNo;
            this.$http.post(__URL.warehouse + 'inbound/query/one', param).then((res) => {
                this.tableData = res.data.data;
            });
        },
        methods: {
            close(){
                this.$emit("close");
            }
        }
    }

</script>
<template :config='config'>

    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>入库单信息</label><label class="ft-14">入库单号: {{ tableData.header.docNo}}</label>
            </h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>入库单位:</label>
                        <p class="orderData">{{tableData.header.warehouseUnitStr}}</p>
                    </div>
                    <div class="form-group">
                        <label>入库日期:</label>{{tableData.header.docDate}}
                    </div>
                    <div class="form-group">
                        <label>入库人员:</label>
                        <p class="orderData">{{tableData.header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>{{tableData.header.warehouseName}}
                    </div>
                </div>

                <div class="inner-item" style="border-bottom: none">
                    <div class="form-group">
                        <label>备注:</label>{{tableData.header.remark}}
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
                                <th width="15%">入库数量</th>
                                <th width="15%">单位</th>
                                <th width="15%">换算率</th>
                                <th width="15%">辅单位</th>
                                <th width="15%">辅数量</th>
                                <th width="15%">销售单号</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(index,item) in tableData.dataList">
                                <td>{{ $index + 1 }}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.quantity}}</td>
                                <td>{{item.unitName}}</td>
                                <td>{{item.conversionRate}}</td>
                                <td>{{item.byUnitCode}}</td>
                                <td>{{item.byUnitName}}</td>
                                <td>{{item.salesOrderDocNo}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="close">关闭</button>
    </div>
</template>


<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .modal-content {
        max-height: 400px;
        overflow: auto;
        margin-bottom: 10px;
    }

    .modal-table {
        width: 100%;
        font-size: 12px;
        color: @gray;
        text-align: center;
        thead {
            border: 1px solid @border-color;

            tr th {
                padding: 14px 7px;
                position: relative;
                font-weight: normal;
                color: #37474F;
            }
        }
        tbody tr {
            &:nth-child(odd) td {
                background-color: #FAFAFA;
            }
            td {
                position: relative;
                border-bottom: 1px solid @border-color;
                font-size: 12px;
                padding: 5px 7px;
            }
        }
    }
</style>