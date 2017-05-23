<script>
    import cfg from './cfg.js'

    import referWarehouse from '../referWarehouseForTransfer'

    export default {
        components: {
            referWarehouse,
        },
        props: ['config', 'selected'],
        data() {
            return {
                receiveModalCfg: cfg.receiveModalCfg,
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
                warhouseConfig: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                },
                tableData: {
                    header:{
                        'warehouseCode':'',
                        'warehouseName':''
                    },
                    dataList:[]
                },
                hasUpdate:false
            }
        },
        ready() {
            this.lock = false;
            this.$http.post(__URL.warehouse + 'wait/inbound/query/inbound', this.selected).then((res) => {
                this.tableData = res.data.data;
                this.tableData.header.warehouseCode = this.selected.warehouseCode;
                this.tableData.header.warehouseName = this.selected.warehouseName;
                this.hasUpdate = true;
            });

        },
        methods: {
            sureInbound(){
                if(this.tableData.header.warehouseCode == '' ||  this.tableData.header.warehouseName == ''){
                    this.warnConfig.content = '仓库不能为空';
                    this.warnConfig.type = 'failure';
                    this.warnConfig.show = true;
                    return;
                }
                this.$http.post(__URL.warehouse + 'inbound/save', this.tableData).then((res) => {
                    if(res.data.success) {
                        if(this.hasUpdate){
                            this.$emit('refresh');
                        }
                        this.config.show = false;
                        this.$warning({'type':'success','message':'入库成功'})
                        /*this.warnConfig.content = '入库成功';
                        this.warnConfig.type = 'success';
                        this.warnConfig.show = true;*/
                    } else {
                        this.$warning({'type':'success','message':res.data.errMsg})
                    }
                });
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            }
        }
    }

</script>
<template :config='config'>


    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>入库单信息</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>入库单位:</label>
                        <p class="orderData">{{tableData.header.supplierName}}</p>
                    </div>
                    <div class="form-group">
                        <label>入库日期:</label>
                        <p class="orderData"><date-picker :config="docDateConfig" :date.sync="tableData.header.docDate"></date-picker></p>
                    </div>
                    <div class="form-group">
                        <label>入库人员:</label>
                        <p class="orderData">{{tableData.header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">
                            <refer-warehouse :data='tableData.header' :config="warhouseConfig"></refer-warehouse>
                        </p>
                    </div>
                </div>

                <div class="inner-item" style="border-bottom: none">
                    <div class="form-group">
                        <label>备注:</label>
                        <p class="orderData"><input type="text" maxlength='120' v-model="tableData.header.remark"></p>
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
                                <td>{{ $index+1 }}</td>
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
                                <td>{{item.byUnitName}}</td>
                                <td>{{item.byQuantity}}</td>
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
        <button class="btn-xl-def" @click="config.show = false;">取消</button>
        <ajax-button class="btn-xl-imp" @click="sureInbound">确认入库</ajax-button>
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