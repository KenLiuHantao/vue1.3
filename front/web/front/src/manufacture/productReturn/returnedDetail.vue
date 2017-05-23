<script>

    export default{
        data(){
            return {
                returnInfo: {
                    "header": {
                        "docNo": "",
                        "docDate": "",
                        "demandDocNo": "",
                        "demandId": "",
                        "departmentCode": "",
                        "departmentName": "",
                        "employeeCode": "",
                        "employeeName": "",
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
                    this.returnInfo = res.data.data;
                }
            )
        },
        methods: {
            close() {
                this.$emit('refresh');
            }
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
                    <p>{{returnInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{returnInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{returnInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>仓库:</label>
                    <p>{{returnInfo.header.warehouseName}}</p>
                </div>
                <div class="form-group">
                    <label>仓管员:</label>
                    <p>{{returnInfo.header.warehouseEmployeeName}}</p>
                </div>
                <div class="form-group">
                    <label>收料日期:</label>
                    <p>{{returnInfo.header.returnCompleteTime}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{returnInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>关联单号:</label>
                    <p>{{returnInfo.header.sourceDocNo}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">生产领料单号</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">实退数量</th>
                        <th width="10%">收料数量</th>
                        <th width="10%">单位</th>
                        <th width="10%">退料原因</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in returnInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.pickDocNo}}</p>
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
