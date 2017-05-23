<script>
    export default {
        components: {

        },
        props: ['docno', 'config'],
        data() {
            return {
                warCfg: {
                    show: false,
                    type: 'warning',
                    content: '',
                    showTime: '2000'
                },
                modalCfg: {
                    show: false,
                    width: '360px',
                    height: 'auto',
                    header: '委外采购单变更操作',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                tableData: {
                    'header': {
                        'docNo': '',
                        'docDate': '',
                        'docStatus' : '',
                        'supplierCode' : '',
                        'supplierName' : '',
                        'employeeCode' : '',
                        'employeeName' : '',
                        'departmentCode' : '',
                        'departmentName' : '',
                        'exchRate' : '',
                        'taxRate' : '',
                        'currencyCode' : '',
                        'currencyName' : '',
                        'remark' : ''
                    },
                    'dataList' : []
                },
                changeResultData: [{
                    key: 1,
                    value: '1. 同意变更'
                }, {
                    key: 2,
                    value: '2. 不同意变更(维持原订单行信息不变)'
                }],
                selectedItem: null,
                hasChange: false,
                lock: true,
            }
        },
        ready() {
            this.$http.get(__URL.purchase + 'outsource/change/query/detail/' + this.docno).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            doOpenModal(item) {
                this.selectedItem = item;
                this.modalCfg.show = true;
            },
            doSelectChange() {
                if(!this.selectedItem.changeResult || !this.selectedItem.changeRemark) {
                    this.showMsg('warning', '请填写变更详情!');
                    return;
                }
                this.modalCfg.show = false;
                this.hasChange = true;
            },
            doChange() {
                for(let index in this.tableData.dataList) {
                    if(!this.tableData.dataList[index].changeResult) {
                        this.showMsg('warning', '请先进行变更操作，才能确认变更!');
                        return;
                    }
                }

                this.$http.post(__URL.purchase + 'outsource/change/save', this.tableData).then((res) => {
                    if(res.data.success) {
                        this.showMsg('success', '保存成功');
                        this.$emit('refresh');
                    } else {
                        this.showMsg('warning', res.data.data);
                        this.lock = false;
                    }
                });
            }
        }
    }
</script>
<template>
    <div class="inner-wrapper" id="tableData">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>委外采购订单信息</label><label class="ft-14">委外采购单号: {{docno}}</label></h2>
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p class="orderData">{{tableData.header.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>委外采购日期:</label>
                    <p class="orderData">{{tableData.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p class="orderData">{{tableData.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>采购员:</label>
                    <p class="orderData">{{tableData.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p class="orderData">{{tableData.header.exchRate}}</p>
                </div>
                <div class="form-group">
                    <label>税率(%):</label>
                    <p class="orderData">{{tableData.header.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>采购部门:</label>
                    <p class="orderData">{{tableData.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>变更日期:</label>
                    <p class="orderData">{{tableData.header.changeDate}}</p>
                </div>
                <div class="form-group">
                    <label>委外采购单状态:</label>
                    <p v-if="tableData.header.docStatus == 2" class="green">已完成</p>
                    <p v-else class="red">未完成</p>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <p class="orderData lh-20">{{tableData.header.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">委外采购信息</th>
                        <th width="15%">日期信息</th>
                        <th width="8%">原单入库状况</th>
                        <th width="12%">变更信息</th>
                        <th width="10%">销售单号</th>
                        <th width="10%">变更操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in tableData.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>货品编码: {{item.inventoryCode}}</p>
                                <p>货品名称: {{item.inventoryName}}</p>
                                <p>规格型号: {{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>采购数量: {{item.quantity}}</p>
                                <p>含税单价: {{item.taxUnitPrice}}</p>
                                <p>价税合计: {{item.taxAmounts}}</p>
                                <p>单位: {{item.unitName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>需求日期: {{item.demandDate}}</p>
                                <p>交期: {{item.deliveryDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>入库数量: {{item.totalInboundQty}}</p>
                                <p>未交数量: {{item.unInboundQty}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap red">
                                <p>变更后采购数量: {{item.changeQuantity}}</p>
                                <p>已入库待退: {{item.returnQuantity}}</p>
                                <p>原单未交取消: {{item.cancelQuantity}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.saleOrderDocNo}}</p>
                            </div>
                        </td>
                        <td v-if='!hasChange'>
                            <button class="button-primary" @click='doOpenModal(item)'>变更操作</button>
                        </td>
                        <td v-if='hasChange'>
                            <div>
                                <p style='text-align:left;'>变更类型:</p>
                                <div class="s-input ic2">
                                    <input type='text' v-if="item.changeResult == 1" value="1. 同意变更" disabled>
                                    <input type='text' v-if="item.changeResult == 2" value="2. 不同意变更(维持原订单行信息不变)" disabled>
                                </div>
                                <p style='text-align:left;'>详细备注:</p>
                                <div class="s-input ic2">
                                    <textarea disabled v-model='item.changeRemark'  maxlength='140'></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='config.show = false' class="btn-xl-def">取消</button>
        <button @click='doChange' class="btn-xl-imp">确认变更</button>
    </div>

    <!-- 弹框系列 -->
    <modal :config.sync='modalCfg' @sure='doSelectChange' @close='modalCfg.show = false'>
        <div class='form-group'>
            <label><span class="must-point">*</span>选择变更处理结果:</label>
            <div class="s-input ic2">
                <select v-model='selectedItem.changeResult' class="check-input">
                    <option :value='obj.key' :selected="(selectedItem.changeResult == obj.key"
                            v-for='obj in changeResultData'>{{obj.value}}</option>
                </select>
            </div>
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>详细备注:</label>
            <div class="s-input ic2">
                <textarea v-model='selectedItem.changeRemark' style='height:100px;' maxlength='120' placeholder='请输入详细备注'></textarea>
            </div>
        </div>
    </modal>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .modal-area .form-group label:first-of-type{
        width: 95px;
    }
    .inner-table tbody tr td tetxarea[disabled] {
        color: #212121;
        background-color: #f5f5f5;
    }
    .form-group > label{
        width: 100px;
    }
</style>
