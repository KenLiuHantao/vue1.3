<script>
    import cfg from './cfg.js'

    export default {
        props: ['config','selected'],
        data() {
            return {
                receiveModalCfg: cfg.receiveModalCfg,
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                newData:null,
                lock: true,
                tableData: {
                    "header" : {
                      "srcDocNo" : "",
                      "srcDocType" : 0,
                      "srcDepartmentName" : "",
                      "srcEmployeeName" : "",
                      "srcDocDate" : "",
                      "remark" : ""
                    },
                    "dataList" : []
                },
                lock: true,
                hasUpdate: false,
            }
        },
        ready() {
            this.refresh();
        },
        methods: {
            refresh() {
                this.$http.get(__URL.warehouse + 'wait/receive/query/production/one/' +this.selected.srcDocNo+'/'+this.selected.docType+'/'+this.selected.warehouseCode, {}).then((res) => {
                    this.tableData = res.data.data;
                    this.lock = false;
                    if(this.hasUpdate) {
                        this.$emit('refresh');
                    }
                    if(this.tableData.dataList.length == null || this.tableData.dataList.length == 0){
                        this.$emit('refresh');
                        this.config.show = false;
                    }
                });
            },
            doReceive() {
                if(!this.lock && this.newData) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'receive/save', [this.newData]).then((res) => {
                        if(res.data.success) {
                            this.hasUpdate = true;
                            this.doCloseReceive();
                            this.refresh();
                            this.warnConfig.content = '点收成功';
                            this.warnConfig.type = 'success';
                            this.warnConfig.show = true;
                        } else {
                            this.warnConfig.content = res.data.errMsg;
                            this.warnConfig.type = 'failure';
                            this.warnConfig.show = true;
                            this.lock = false;
                        }
                    });
                }
            },
            doCloseReceive() {
                this.receiveModalCfg.show = false;
                this.newData = null;
            },
            receive(index){
                let selectRow = this.tableData.dataList[index];
                let obj ={
                    'quantity': selectRow.totalWaitReceiveQuantity,
                    'recordId': selectRow.recordId,
                    'inventoryName': selectRow.inventoryName,
                    'purQuantity': selectRow.quantity,
                    'docType': selectRow.srcDocType,
                    'inventoryType': selectRow.inventoryType
                }

                this.newData = obj;
                this.receiveModalCfg.show = true;
            }
        }
    }

</script>
<template :config='config'>

    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产单信息</label><label class="ft-14">生产单号: {{ selected.srcDocNo }}</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>生产部门:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>下单日期:</label>
                        <p class="orderData">{{tableData.header.srcDocDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>班组负责人:</label>
                        <p class="orderData">{{ tableData.header.srcEmployeeName }}</p>
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
                                <th width="15%">订单信息</th>
                                <th width="15%">客户交期</th>
                                <th width="15%">收货状况</th>
                                <th width="15%">销售单号</th>
                                <td width="15%">操作</td>
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
                                        <p><label>生产数量:</label><label>{{item.quantity}}</label></p>
                                        <p><label>单位:</label><label>{{item.unitName}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.deliveryDate}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p><label>收货数量:</label><label>{{item.totalReceiveQuantity}}</label></p>
                                        <p><label>待收数量:</label><label>{{item.totalWaitReceiveQuantity}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.salesOrderDocNo}}</td>
                                <td>
                                    <button class="button-primary" @click="receive($index)">点收</button>
                                </td>
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

    <!-- 弹框系列 -->
    <modal :config.sync='receiveModalCfg' @sure='doReceive' @close='doCloseReceive'>
        <div class="modal-content">
            <table class='modal-table'>
                <thead>
                <tr>
                    <th width="15%">货品信息</th>
                    <th width="10%">生产数量</th>
                    <th width="10%">本次收货数量</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{ newData.inventoryName }}</td>
                    <td>{{ newData.purQuantity }}</td>
                    <td>
                        <input-number :code.sync='newData.quantity' placeholder="请输入本次收货数量"></input-number>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </modal>


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