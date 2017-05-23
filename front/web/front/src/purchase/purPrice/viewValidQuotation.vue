<script>
    export default {
        components: {

        },
        props:['config', 'docno'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '新增',
                        time: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '审核',
                        time: '',
                        flag: true,
                    }]
                },
                modalCfg: {
                    show: false,
                    width: '320px',
                    height: 'auto',
                    header: '报价失效提示',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                warCfg: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                tableData: {
                    header: {
                        docNo: '',
                        docDate: '',
                        supplierCode: '',
                        supplierName: '',
                        employeeCode: '',
                        employeeName: '',
                        taxRate: '',
                        currencyCode: '',
                        currencyName: '',
                        images: [],
                        remark: ''
                    },
                    dataList: []
                },
                quotationData: ''
            }
        },
        ready() {
            this.$http.get(__URL.purchase + 'price/query/one/'  + this.docno + '/valid/quotation').then((res) => {
                this.tableData = res.data.data;
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            doModal(item) {
                this.quotationData = item;
                this.modalCfg.show = true;
            },
            doSure() {
                let params = {
                    recordId: this.quotationData.recordId,
                    recordVersion: this.quotationData.recordVersion
                }
                this.$http.post(__URL.purchase + 'price/invalid', params).then((res) => {
                    if(res.data.success) {
                        this.showMsg('success', '失效成功');
                        this.quotationData.status = false;
                        this.modalCfg.show = false;
                    } else {
                        this.showMsg('warning', res.data.errMsg);
                    }
                });
            }
        }
    }

</script>
<template :config='config'>
    <div class="inner-wrapper">
        <workflow :config='flowCfg'></workflow>

        <div class="inner-content">
            <h2 class="tag two-tag"><label>供应商报价单</label><label class="ft-14">报价单号: {{docno}}</label></h2>

            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>供应商:</label>
                        <p class="orderData">{{tableData.header.supplierName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>报价日期:</label>
                        <p class="orderData">{{tableData.header.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>采购员:</label>
                        <p class="orderData">{{tableData.header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>币种:</label>
                        <p class="orderData">{{tableData.header.currencyName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>税率(%):</label>
                        <p class="orderData">{{tableData.header.taxRate}}</p>
                    </div>
                </div>
                <div class="inner-item form-box">
                    <div class="form-group wd-100">
                        <label>附件:</label><i></i>
                        <upfile-group :config='uploadFileCfg' :data='tableData.header.images' :edit="false"></upfile-group>
                    </div>
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <p class="orderData">{{tableData.header.remark}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class="inner-table">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="20%">货品信息</th>
                                    <th width="12%">单价信息</th>
                                    <th width="12%">订购量</th>
                                    <th width="12%"><span class="must-point">*</span>交货周期</th>
                                    <th width="12%">最小订购量</th>
                                    <th width="12%">最小包装量</th>
                                    <th width="12%">生/失效日期</th>
                                    <th width="10%">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>编码: {{item.inventoryCode}}</p>
                                            <p>名称: {{item.inventoryName}}</p>
                                            <p>型号: {{item.inventorySpec}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>单位: {{item.unitName}}</p>
                                            <p>单价: {{item.taxUnitPrice}}</p>
                                            <p>单价类型: {{item.priceType == 1 ? '采购价' : '委外加工价'}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>订购量(从):{{item.fromQuantity}}</p>
                                            <p>订购量(到):{{item.toQuantity}}</p>
                                        </div>
                                    </td>
                                    <td><p>{{item.cycle}}</p></td>
                                    <td><p>{{item.minQuantity}}</p></td>
                                    <td><p>{{item.minPackageQuantity}}</p></td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>{{item.effectiveDate}}</p>
                                            <p>{{item.expiredDate}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <button v-if="item.status == 1"  class="button-danger" @click='doModal(item)'>失效此报价</button>
                                        <p v-if="item.status == 0" >报价已失效</p>
                                    </td>
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
        <button class="btn-xl-def" @click="this.config.show = false;">关闭</button>
    </div>

    <!-- 弹框系列 -->
    <modal :config.sync='modalCfg' @sure='doSure' @close='modalCfg.show = false'>
        <div class="modal-content">
            <div style="margin: 12px;">
                确定要失效处理此行的报价信息吗？<br/>
                确定后此报价信息将不能使用！
            </div>
        </div>
    </modal>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
