<script>
    import moment from 'moment'
    export default {
        components: {},
        props: {
            selectedData: Object
        },
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
                        remark: "",
                        srcType: 1
                    },
                    dataList: []
                },
                lock: true
            }
        },
        ready() {
            this.$http.get(__URL.manufacture + 'production/material/add/inner/detail/' + this.selectedData.docNo).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            save() {
                if (!this.lock) {
                    this.lock = true;
                    let newData = {
                        header: {
                            docDate: null,
                            processCode: this.tableData.header.processCode,
                            processName: this.tableData.header.processName,
                            warehouseCode: this.tableData.header.warehouseCode,
                            warehouseName: this.tableData.header.warehouseName,
                            employeeCode: this.tableData.header.warehouseEmployeeCode,
                            employeeName: this.tableData.header.warehouseEmployeeName,
                            departmentCode: this.tableData.header.departmentCode,
                            departmentName: this.tableData.header.departmentName,
                            remark: null,
                            srcType: 1
                        },
                        dataList: []
                    }
                    newData.header.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
                    for (let index in this.tableData.dataList) {
                        let obj = {
                            srcId: this.tableData.dataList[index].recordId,
                            inventoryId: this.tableData.dataList[index].inventoryId,
                            quantity: this.tableData.dataList[index].quantity,
                            recordVersion: this.tableData.dataList[index].recordVersion
                        }
                        newData.dataList.push(obj);
                    }
                    this.$http.post(__URL.warehouse + 'material/prepare/save', newData).then((res) => {
                        if (!res.data.success) {
                            this.showMsg('failure', /^库存不足/.test(res.data.errMsg) ? '库存不足无法领料' : res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.showMsg('success', '保存成功');
                            this.$emit('refresh');
                        }
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
            <h2 class="tag two-tag"><label>生产补料单信息</label><label class="ft-14">补料单号: {{ selectedData.docNo }}</label></h2>
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
                                    <th width="10%">生产用量</th>
                                    <th width="10%">申请数量</th>
                                    <th width="10%">已备/补数量</th>
                                    <th width="10%">备料数量</th>
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
                                    <td>{{ item.sourceDocNo }}</td>
                                    <td>{{ item.productQuantity }}</td>
                                    <td>{{ item.applyQuantity }}</td>
                                    <td>{{ item.supplyQuantity }}</td>
                                    <td>
                                        <input-number :code.sync='item.quantity' placeholder="请输入备料数量"></input-number>
                                    </td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.reasonDesc }}</td>
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
        <button @click='save' class="btn-xl-imp">确定备料</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>