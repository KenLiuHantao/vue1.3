<script>

    export default {
        props: {
            docno: String, receiptdata: {}, newcfg: {}, thiscfg: {}
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                tabConfig: {
                    type:'page',
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '品质检验单信息',
                        icon: 'icon-teamwork'
                    }]
                },
                tableData: {
                    header: {},
                    dataList: [],
                }
            }
        },
        ready() {
        },
        methods: {
            cancel() {
                this.$emit('close');
            },
            returnReceipt(){
                this.thiscfg.show = false;
                this.$emit('senddata', this.docno, this.receiptdata);
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag">
                <label v-if="receiptdata.srcDocType == 1">采购单</label>
                <label v-else="receiptdata.srcDocType == 2">委外采购单</label>
                <label v-if="receiptdata.srcDocType == 1" class="ft-14">采购单号: {{docno }}</label>
                <label v-else="receiptdata.srcDocType == 2" class="ft-14">委外采购单号: {{ docno }}</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商名称:</label>
                        <p class="orderData">{{ receiptdata.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购日期:</label>
                        <p class="orderData">{{ receiptdata.header.srcDocDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p class="orderData">{{ receiptdata.header.currencyName}}</p>
                    </div>
                    <div class="form-group">
                        <label>采购员:</label>
                        <p class="orderData">{{  receiptdata.header.srcEmployeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>汇率:</label>
                        <p class="orderData">{{ receiptdata.header.exchRate}}</p>
                    </div>
                    <div class="form-group">
                        <label>税率(%):</label>
                        <p class="orderData">{{  receiptdata.header.taxRate}}</p>
                    </div>
                    <div class="form-group">
                        <label>采购部门:</label>
                        <p class="orderData">{{  receiptdata.header.srcDepartmentName }}</p>
                    </div>
                    <div class="form-group">
                        <label>采购单状态:</label>
                        <p v-if="receiptdata.header.srcDocStatus == 1" class="red">{{ receiptdata.header.srcDocStatusStr }}</p>
                        <p v-if="receiptdata.header.srcDocStatus == 2" class="green">{{ receiptdata.header.srcDocStatusStr }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="orderData lh-20">{{ receiptdata.header.remark }}</p>
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
                                    <th width="10%">采购信息</th>
                                    <th width="10%">请购时间</th>
                                    <th width="10%">需求日期</th>
                                    <th width="10%">交期</th>
                                    <th width="10%">检验状况</th>
                                    <th width="10%">销售单号</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in receiptdata.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                            <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>采购数量:</label><label>{{item.srcDocQuantity}}</label></p>
                                            <p><label>单位:</label><label>{{item.unitName}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.applyTime }}</td>
                                    <td>{{ item.demandDate }}</td>
                                    <td>{{ item.deliveryDate }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>收货数量:</label><label>{{item.quantity}}</label></p>
                                            <p><label>合格允收数量:</label><label>{{item.goodQuantity}}</label></p>
                                            <p><label>不良退收数量:</label><label>{{item.badQuantity}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.salesOrderDocNo}}</td>
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
        <button @click='returnReceipt' class="btn-xl-imp">退收</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>