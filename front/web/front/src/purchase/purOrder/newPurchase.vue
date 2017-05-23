<script>
    import supplier from '../../archive/supplier/newSupplier.vue'
    export default {
        components:{
            supplier
        },
        props: ['docno', 'config'],
        data() {
            return {
                warCfg: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                dateCfg: {
                    placeholder: '请选择需求日期',
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
                referSupplierCfg: {
                    show: false,
                    supplierStatus: 2,
                    addNew:{
                        name:'新增供应商档案',
                        icon:'icon-hp_list__add'
                    }
                },
                referPriceCfg: {
                    show: false,
                    keyWork: ''
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
                selectedItem: {
                    'quotationId':'',
                    'quotationDocNo':'',
                    'taxUnitPrice':''
                },
                lock: true,
                newSupplierCfg:{
                    show: false,
                    title: '新增供应商档案'
                },
            }
        },
        ready() {
            let params = {'docNo': this.docno, 'supplierCode': 'test'}
            this.$http.post(__URL.purchase + 'order/await/query/selected/details', params).then((res) => {
                this.tableData = res.data.data;
                if(this.tableData.header.supplierName == '待确定供应商') {
                    this.tableData.header.supplierName = '';
                    this.tableData.header.supplierCode = '';
                }
//                if(this.tableData.dataList != null && this.tableData.dataList.length >0){
//                    for(let i=0;i<this.tableData.dataList.length;i++){
//                        console.log(this.tableData.dataList[i]);
//                    }
//                }
                this.lock = false;
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            doSelectSupplier() {
                this.referSupplierCfg.show = true;
            },
            doClearSupplier() {
                this.tableData.header.supplierCode = '';
                this.tableData.header.supplierName = '';
                this.tableData.header.currencyCode = '';
                this.tableData.header.currencyName = '';
                this.tableData.header.taxRate = '';
            },
            doFillSupplier(obj) {
                this.tableData.header.supplierCode = obj.supplierCode;
                this.tableData.header.supplierName = obj.supplierName;
                this.tableData.header.currencyCode = obj.currencyCode;
                this.tableData.header.currencyName = obj.currencyName;
                this.tableData.header.taxRate = obj.taxRate;
            },
            doSelectPrice(obj) {
                this.selectedItem = obj;
                this.referPriceCfg.show = true;
            },
            doClearPrice(obj) {
                this.selectedItem = obj;
                this.selectedItem.quotationId = '';
                this.selectedItem.quotationDocNo = '';
                this.selectedItem.taxUnitPrice = '';
            },
            doFillPrice(obj) {
                this.selectedItem.quotationId = obj.recordId;
                this.selectedItem.quotationDocNo = obj.docNo;
                this.selectedItem.taxUnitPrice = obj.price;
            },
            doChangePrice(obj) {
                console.log(JSON.stringify(obj));
                obj.taxAmounts = (obj.quantity * obj.taxUnitPrice).toFixed(2);
            },
            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.purchase + 'order/save', this.tableData).then((res) => {
                        if(!res.data.success) {
                            this.showMsg('failure', res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.showMsg('success', '保存成功');
                            this.$emit('refresh');
                        }
                    });
                }
            },
            saveOrder() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.purchase + 'order/add', this.tableData).then((res) => {
                        if(!res.data.success) {
                            this.showMsg('failure', res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.showMsg('success', '下单成功');
                            this.$emit('refresh');
                        }
                    });
                }
            },
            addNewSupplier(){
                this.newSupplierCfg.show=true
            },
            closeNewSupplier(msg,item){
                this.newSupplierCfg.show=false
                if(item){
                    this.tableData.header.supplierCode = item.supplierCode;
                    this.tableData.header.supplierName = item.supplierName;
                    this.tableData.header.currencyCode = item.currencyCode;
                    this.tableData.header.currencyName = item.currencyName;
                    this.tableData.header.taxRate = item.taxRate;
                    this.referSupplierCfg.show=false;
                }
            }
        }
    }
</script>
<template>
    <div class="inner-wrapper" id="orderdetail">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>请购单信息</label><label class="ft-14">请购单号: {{docno}}</label></h2>
            <div class="inner-item form-box">
                <div class="form-group fg-fix">
                    <label>供应商名称:</label>
                    <div class="s-input ic2">
                        <input type="text" maxlength='32' v-model="tableData.header.supplierName" placeholder="供应商" readonly>
                        <i class="icon-close__round r2" v-show='tableData.header.supplierName' @click='doClearSupplier()'></i>
                        <i class="icon-search r1" @click='doSelectSupplier()'></i>
                    </div>
                </div>
                <div class="form-group fg-fix">
                    <label>币种:</label>
                    <p class="orderData">{{tableData.header.currencyName}}</p>
                </div>
                <div class="form-group fg-fix">
                    <label>汇率:</label>
                    <p class="orderData">{{tableData.header.exchRate}}</p>
                </div>
                <div class="form-group fg-fix">
                    <label>税率(%):</label>
                    <p class="orderData">{{tableData.header.taxRate}}</p>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100 fg-fix">
                    <label>备注:</label>
                    <input type="text" maxlength='140' v-model="tableData.header.remark">
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15 it-fix">
                    <thead>
                    <tr>
                        <th width="10px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">请购信息</th>
                        <th width="10%">价税合计</th>
                        <th width="10%">请购时间</th>
                        <th width="10%">需求日期</th>
                        <th width="10%"><span class="must-point">*</span>交期</th>
                        <th width="10%">销售单号</th>
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
                                <p>请购数量: {{item.quantity}}</p>
                                <div class="show-input-group">
                                    <div class="title">*单价: </div>
                                    <input-group :data.sync="item.taxUnitPrice" @modal="doSelectPrice(item)"
                                                 @clear="doClearPrice(item)" @change="doChangePrice(item)"></input-group>
                                </div>
                                <p>单位: {{item.unitName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.taxAmounts}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.applyDate}}</p>
                                <p>{{item.applyTime}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.demandDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <date-picker :config="dateConfig" :date.sync='item.deliveryDate'></date-picker>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.saleOrderDocNo}}</p>
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
        <button @click='save' class="btn-xl-imp">保存编辑</button>
        <button @click='saveOrder' class="btn-xl-imp">确认下单</button>
    </div>

    <!-- 供应商参照 -->
    <refer-supplier :config="referSupplierCfg" @cb="doFillSupplier" @addNew='addNewSupplier'></refer-supplier>

    <!-- 货品价目参照 -->
    <refer-goods-price :config="referPriceCfg" :data="selectedItem" @cb="doFillPrice"></refer-goods-price>

    <!-- 新增供应商选项 -->
    <inner :config.sync='newSupplierCfg'>
        <supplier  @refresh='closeNewSupplier'></supplier>
    </inner>
    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>
