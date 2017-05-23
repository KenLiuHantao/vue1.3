<script>
    import referWarehouse from '../referWarehouseForTransfer'

    export default {
        components: {
            referWarehouse,
        },
        props: {
            checks: Object
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                docDateConfig: {
                    placeholder: '请选择生产备料日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                warhouseConfig: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                },
                validShow: {
                    docDate: false
                },
                tableData: {header:{},dataList:{}},
                lock: true
            }
        },
        ready() {
            this.$http.get(__URL.warehouse + '/material/return/query/one/'+this.checks.docNo).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
        },
        methods: {
            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'material/return/save', this.tableData).then((res) => {
                        this.warnConfig.show = true;
                        this.warnConfig.type = 'success';
                        this.warnConfig.content = '保存成功';
                        if(!res.data.success) {
                            this.warnConfig.type = 'failure';
                            this.warnConfig.content = res.data.errMsg;
                        } else {
                            this.$emit('refresh');
                        }
                        this.lock = false;
                    });
                }
            },
            cancel() {
                this.$emit('close');
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">生产退料单信息</h2>
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
                        <label>退料日期:</label>
                        <p class="orderData">{{ tableData.header.materialReturnDate }}</p>
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
                        <label>收料日期:</label>
                        <p class="orderData">{{ tableData.header.materialRecieveDate }}</p>
                    </div>

                    <div class="form-group">
                        <label>生产单号:</label>
                        <p class="orderData">{{ tableData.header.demandDocNo }}</p>
                    </div>
                    <div class="form-group">
                        <label>关联单号:</label>
                        <p class="orderData">{{ tableData.header.pickDocNo }}</p>
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
                                    <th width="10%">应退数量</th>
                                    <th width="10%">退料数量</th>
                                    <th width="10%">收料数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">退料原因</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                        <p><label>编码: </label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称: </label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号: </label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.quantity }}</td>
                                    <td>{{ item.returnedQuantity }}</td>
                                    <td><input-number  :code.sync='item.recieveQuantity' placeholder="请输入收料数量"></input-number></td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.reasonName }}</td>
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
        <button @click='cancel' class="btn-xl-def">取消</button>
        <button @click='save' class="btn-xl-imp">确定退料</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>