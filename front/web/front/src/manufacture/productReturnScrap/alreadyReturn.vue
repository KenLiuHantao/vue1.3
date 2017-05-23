<script>

    export default{
        data(){
            return {
                alreadyInfo: {
                    "header": {
                        "docNo": "",
                        "docDate": "",
                        "departmentName": "",
                        "employeeName": "",
                        "demandDocNo": "",
                        "sourceDocNo": "",
                        "warehouseName": "",
                        "warehouseEmployeeName": "",
                        "returnCompleteTime": ""
                    },
                    "dataList": []
                },
            }
        },

        props: ['docNo'],

        components: {},

        ready() {
            this.$http.get(__URL.manufacture + 'production/material/return/inner/detail/' + this.docNo).then(
                (res) => {
                    this.alreadyInfo = res.data.data;
                }
            )
        },

        methods: {

            close() {
                this.$emit('refresh');
            },
        },
    }


</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产退料信息</label><label class="ft-14">生产退料单号: {{docNo}}</label></h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{alreadyInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{alreadyInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>退料日期:</label>
                    <p>{{alreadyInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>仓库:</label>
                    <p>{{alreadyInfo.header.warehouseName}}</p>
                </div>
                <div class="form-group">
                    <label>仓管员:</label>
                    <p>{{alreadyInfo.header.warehouseEmployeeName}}</p>
                </div>
                <div class="form-group">
                    <label>收料日期:</label>
                    <p>{{alreadyInfo.header.returnCompleteTime}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{alreadyInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>生产补料单号:</label>
                    <p>{{alreadyInfo.header.sourceDocNo}}</p>
                </div>

            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">退料数量</th>
                        <th width="10%">收料数量</th>
                        <th width="10%">单位</th>
                        <th width="10%">退料原因</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in alreadyInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.quantity}}</p>
                        </td>
                        <td>
                            <p>{{item.returnedQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.receivedQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <p>{{item.reasonName}}</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='close'>关闭</button>
    </div>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
