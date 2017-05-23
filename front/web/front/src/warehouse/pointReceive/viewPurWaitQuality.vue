<script>
    import cfg from './cfg.js'

    export default {
        props: ['config','selected'],
        data() {
            return {
                newData: {
                    header:{
                        'docNo': ''
                    },
                    dataList: []
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                tableData: {
                    header:{
                        'supplierName':'',
                        'srcDocDate':'',
                        'currencyName':'',
                        'srcEmployeeName':'',
                        'exchRate':'',
                        'taxRate':'',
                        'srcDepartmentName':'',
                        'srcDocType':0,
                        'srcDocStatusStr':'',
                        'remark':''
                    },
                    dataList:[]
                }
            }
        },
        ready() {
            this.lock = false;;
            this.$http.get(__URL.warehouse + 'receive/query/purchase/one/' + this.selected.srcDocNo+'/'+this.selected.docType+'/'+this.selected.warehouseCode, {}).then((res) => {
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
            <h2 class="tag two-tag">
                <label v-if="this.tableData.header.srcDocType == 1">采购单信息</label>
                <label v-if="this.tableData.header.srcDocType ==2">委外采购单信息</label>
                <label v-if="this.tableData.header.srcDocType == 1" class="ft-14">采购单号: {{selected.srcDocNo }}</label>
                <label v-if="this.tableData.header.srcDocType == 2" class="ft-14">委外采购单号: {{selected.srcDocNo }}</label>
            </h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商名称:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购日期:</label>
                        <p class="orderData">{{ tableData.header.srcDocDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p class="orderData">{{ tableData.header.currencyName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购员:</label>
                        <p class="orderData">{{ tableData.header.srcEmployeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>汇率:</label>
                        <p class="orderData">{{ tableData.header.exchRate }}</p>
                    </div>
                    <div class="form-group">
                        <label>税率(%):</label>
                        <p class="orderData">{{ tableData.header.taxRate }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购部门:</label>
                        <p class="orderData">{{ tableData.header.srcDepartmentName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购状态:</label>
                        <p v-if="tableData.header.srcDocStatus == 1" class="red">{{ tableData.header.srcDocStatusStr }}</p>
                        <p v-if="tableData.header.srcDocStatus == 2" class="green">{{ tableData.header.srcDocStatusStr }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group">
                        <label>备注:</label>
                        <p class="orderData">{{ tableData.header.remark }}</p>
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
                                <th width="15%">采购信息</th>
                                <th width="15%">请购时间</th>
                                <th width="15%">需求日期</th>
                                <th width="15%">交期</th>
                                <th width="15%">检验状况</th>
                                <th width="15%">销售单号</th>
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
                                    <div class="show-wrap">
                                        <p><label>采购数量:</label><label>{{item.quantity}}</label></p>
                                        <p><label>单位:</label><label>{{item.unitName}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.applyTime}}</td>
                                <td>{{item.demandDate}}</td>
                                <td>{{item.deliveryDate}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p><label>收货数量:</label><label>{{item.totalReceiveQuantity}}</label></p>
                                        <p><label>待检数量:</label><label>{{item.totalWaitQualityQuantity}}</label></p>
                                    </div>
                                </td>
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
        <button class="btn-xl-def" @click="this.config.show = false;">关闭</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>



<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .modal-content{
        max-height: 400px;
        overflow: auto;
        margin-bottom: 10px;
    }
    .modal-table{
        width: 100%;
        font-size: 12px;
        color: @gray;
        text-align: center;
    thead{
        border: 1px solid @border-color;

    tr th {
        padding: 14px 7px;
        position: relative;
        font-weight: normal;
        color: #37474F;
    }
    }
    tbody tr{
    &:nth-child(odd) td{
         background-color: #FAFAFA;
     }
    td{
        position: relative;
        border-bottom: 1px solid @border-color;
        font-size: 12px;
        padding: 5px 7px;
    }
    }
    }
</style>