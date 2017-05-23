<script>
    export default {
        components: {},
        props: ['order', 'pickConfig', 'tabIndex'],
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

                saveData: [],

                lock: true
            }
        },
        ready() {
            this.$http.get(__URL.manufacture + 'production/material/add/prepare/supply/detail/' + this.order.docNo).then((res) => {
                this.tableData = res.data.data;
                //this.lock = false;
                this.getPrepareData();
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },

            getPrepareData(){
                for (var i = 0; i < this.tableData.dataList.length; i++) {
                    let pickSaveData = {
                        supplyId: "",
                        rowNum: "",
                        currentSupplyQuantity: "",
                        currentPrepareQuantity: "",
                        currentPickQuantity: "",
                        prepareDocNo: "",
                        materialPrepareRecordId: "",
                        materialPrepareRecordVersion: "",
                        prepareDate: ""
                    };
                    pickSaveData.supplyId = this.tableData.dataList[i].recordId;
                    pickSaveData.rowNum = i + 1;
                    pickSaveData.currentSupplyQuantity = this.tableData.dataList[i].currentSupplyQuantity;
                    pickSaveData.currentPrepareQuantity = this.tableData.dataList[i].currentPrepareQuantity;
                    pickSaveData.prepareDocNo = this.tableData.dataList[i].prepareDocNo;
                    pickSaveData.materialPrepareRecordId = this.tableData.dataList[i].materialPrepareRecordId;
                    pickSaveData.materialPrepareRecordVersion = this.tableData.dataList[i].materialPrepareRecordVersion;
                    pickSaveData.prepareDate = this.tableData.dataList[i].prepareDate;
                    this.saveData.push(pickSaveData);
                }

            },

            confirmSupply() {
                if (this.lock) {
                    this.lock = false;
                } else {
                    return;
                }
                for (let i = 0; i < this.tableData.dataList.length; i++) {
                    if (this.tableData.dataList[i].currentPickQuantity == undefined
                        || this.tableData.dataList[i].currentPickQuantity < 0) {
                        this.showMsg("warnnig", "第" + this.tableData.dataList[i].rowNum + "行此次领料数量小于0");
                        this.lock = true;
                        return;
                    }
                    this.saveData[i].currentPickQuantity = this.tableData.dataList[i].currentPickQuantity;
                }

                this.$http.post(__URL.manufacture + 'production/material/add/confirm/supply', this.saveData).then(
                    (res) => {
                        if (res.data.success) {
                            this.cancelOrder("领料成功");
                            this.lock = true;
                        } else {
                            this.showMsg("failure", res.data.errMsg);
                            this.lock = true;
                        }
                    }
                );
            },

            cancelOrder(tips) {
                this.$emit('refresh', tips);
            },
            close(){
                this.pickConfig.show = false;
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
                                    <th width="10%">已补数量</th>
                                    <th width="10%">此次补料</th>
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
                                        {{item.currentPrepareQuantity}}
                                    </td>
                                    <td>
                                        {{item.supplyQuantity}}
                                    </td>
                                    <td>
                                        <input-number :code.sync='item.currentPickQuantity'
                                                      placeholder="数量"></input-number>
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
        <button @click='close' class="btn-xl-def">取消</button>
        <ajax-button class="btn-xl-imp" @click='confirmSupply'>确认领料</ajax-button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>