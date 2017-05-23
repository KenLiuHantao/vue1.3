<script>
    import moment from 'moment'

    export default {
        components: {
            moment
        },
        props:['config'],
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
                        flag: false,
                    }]
                },
                referEmployeeCfg: {
                    key: 'employeeName',
                    code: 'employeeCode',
                    refer: ['employeeCode', 'employeeName'],
                    item: ['employeeCode', 'employeeName'],
                    del: ['employeeCode', 'employeeName'],
                },
                referSupplierCfg: {
                    key: 'supplierName',
                    code: 'supplierCode',
                    refer: ['supplierCode', 'supplierName', 'employeeCode', 'employeeName', 'currencyCode', 'currencyName', 'taxRate'],
                    item: ['supplierCode', 'supplierName', 'employeeCode', 'employeeName', 'currencyCode', 'currencyName', 'taxRate'],
                    del: ['supplierCode', 'supplierName', 'employeeCode', 'employeeName', 'currencyCode', 'currencyName', 'taxRate'],
                    supplierStatus: 2
                },
                referInventoryCfg: {
                    key: 'inventoryCode',
                    code: 'inventoryName',
                    refer: ['inventoryId', 'inventoryCode', 'inventoryName', 'inventorySpec', 'unitCode', 'unitName'],
                    item: ['inventoryId', 'inventoryCode', 'inventoryName', 'inventorySpec', 'unitCode', 'unitName'],
                    del: ['inventoryId','inventoryCode', 'inventoryName','inventorySpec', 'unitCode', 'unitName'],
                },
                docDateCfg: {
                    placeholder: '请选择日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                effectiveDateCfg: {
                    placeholder: '生效日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-12-31',
                    date: moment(new Date()).format('YYYY-MM-DD')
                },
                expiredDateCfg: {
                    placeholder: '失效日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-12-31',
                    date: '2100-12-31'
                },
                uploadFileCfg: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png',
                    limit:6
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
                defaultRow: {
                    inventoryId: '',
                    inventoryCode: '',
                    inventoryName: '',
                    inventorySpec: '',
                    unitCode: '',
                    unitName: '',
                    taxUnitPrice: '',
                    priceType: '',
                    fromQuantity: '',
                    toQuantity: '',
                    cycle: '',
                    minQuantity: '',
                    minPackageQuantity: '',
                    effectiveDate: moment(new Date()).format('YYYY-MM-DD'),
                    expiredDate: ''
                },
                rowNum: 0,
                currentRow: 0,
                currencyData: [],
                priceTypeData: [{
                    'type': 1,
                    'name': "采购价",
                    'selected': true
                }, {
                    'type': 2,
                    'name': '委外加工价',
                    'selected': false
                }],
                lock: true
            }
        },
        ready() {
            this.$http.post(__URL.arc + 'currency/local').then((res) => {
                this.currencyData = res.data.data;
                this.lock = false;
            });
        },
        methods: {
            addImages(file) {
                this.tableData.header.images.push(file);
            },
            addRow() {
                this.rowNum++;
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableData.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.tableData.dataList.length == 1) {
                    this.showMsg('warning', '明细至少要有一行');
                    return;
                }
                this.tableData.dataList.splice(index, 1);
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            save() {
                if(!this.lock) {
                    this.tableData.header.status = 2;

                    this.$http.post(__URL.purchase + 'supplier/quotation/save', this.tableData).then( (res) => {
                        if(res.data.success) {
                            this.showMsg('success', '保存成功');
                            this.$emit('refresh');
                        } else {
                            this.showMsg('warning', res.data.errMsg);
                            this.tableData.header.status = 2;
                            this.lock = false;
                        }
                    });
                }
            },
            submitAudit() {
                this.tableData.header.status = 0;

                if(!this.lock) {
                    this.$http.post(__URL.purchase + 'supplier/quotation/save', this.tableData).then( (res) => {
                        if(res.data.success) {
                        this.showMsg('success', '提交审核成功');
                        this.$emit('refresh')
                    } else {
                        this.tableData.header.status = 0;
                        this.showMsg('warning', res.data.errMsg);
                        this.lock = false;
                    }
                });
                }
            }
        }
    }

</script>
<template :config='config'>
    <div class="inner-wrapper">
        <workflow :config='flowCfg'></workflow>

        <div class="inner-content">
            <h2 class="tag">供应商报价单</h2>
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>供应商:</label>
                        <fuzzy-supplier :data="tableData.header" :config="referSupplierCfg"></fuzzy-supplier>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>报价日期:</label>
                        <date-picker :config="docDateCfg" :date.sync="tableData.header.docDate"></date-picker>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>采购员:</label>
                        <fuzzy-employee :data='tableData.header' :config="referEmployeeCfg"></fuzzy-employee>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>币种:</label>
                        <select v-model='tableData.header.currencyCode'>
                            <option value="" disabled selected style="display: none;">请选择币种</option>
                            <option :value='item.currencyCode' v-for='item in currencyData'>{{ item.currencyName }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>税率(%):</label>
                        <input-number :code.sync='tableData.header.taxRate' placeholder="请输入税率" ></input-number>
                    </div>
                </div>
                <div class="inner-item form-box">
                    <div class="form-group wd-100">
                        <label>附件:</label><i></i>
                        <upfile-group :config='uploadFileCfg' :data='tableData.header.images' :edit="true"></upfile-group>
                    </div>
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='140' v-model="tableData.header.remark">
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class="inner-table">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="18%"><span class="must-point">*</span>货品信息</th>
                                    <th width="12%"><span class="must-point">*</span>单价信息</th>
                                    <th width="12%">订购量</th>
                                    <th width="12%"><span class="must-point">*</span>交货周期</th>
                                    <th width="12%">最小订购量</th>
                                    <th width="12%">最小包装量</th>
                                    <th width="18%"><span class="must-point">*</span>生/失效日期</th>
                                    <th width="7%">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <div class="check-input">
                                                <fuzzy-inventory :config="referInventoryCfg" :data="item"></fuzzy-inventory>
                                            </div>
                                            <input type="text" class="check-input" v-model="item.inventoryName" placeholder="货品名称" disabled/>
                                            <input type="text" class="check-input" v-model="item.inventorySpec" placeholder="规格型号" disabled/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <input type="text" class="check-input" v-model="item.unitName" disabled/>
                                            <div class="check-input">
                                                <input-number :code.sync='item.taxUnitPrice' placeholder="含税单价"></input-number>
                                            </div>
                                            <select v-model='item.priceType' class="check-input">
                                                <option :value='obj.type' :selected="item.selected" v-for='obj in priceTypeData'>{{obj.name}}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <div class="check-input">
                                                <input-number :code.sync='item.fromQuantity' placeholder="订购量(从)"></input-number>
                                            </div>
                                            <input-number :code.sync='item.toQuantity' placeholder="订购量(到)"></input-number>
                                        </div>
                                    </td>
                                    <td><input-number :code.sync='item.cycle' placeholder="交货周期"></input-number></td>
                                    <td><input-number :code.sync='item.minQuantity' placeholder="最小订购量"></input-number></td>
                                    <td><input-number :code.sync='item.minPackageQuantity' placeholder="最小包装量"></input-number></td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <div class="check-input">
                                                <date-picker :config="effectiveDateCfg" :date.sync="item.effectiveDate"></date-picker>
                                            </div>
                                            <date-picker :config="expiredDateCfg" :date.sync="item.expiredDate"></date-picker>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="button-danger" @click='delRow($index)'>删除</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="add-wrap">
                                <button @click="addRow"><i class="icon icon-product__add"></i> 加入货品</button>
                            </div>
                        </tab-item>
                    </tab-container>
                </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
        <ajax-button class="btn-xl-imp" @click="save">保存</ajax-button>
        <ajax-button class="btn-xl-imp" @click="submitAudit">提交审核</ajax-button>
    </div>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
