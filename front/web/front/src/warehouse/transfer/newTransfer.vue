<script>
    import cfg from './cfg'

    import referWarehouse from '../referWarehouseForTransfer'

    export default {
        components: {
            referWarehouse,
        },
        props: ['config'],
        data() {
            return {
                referInventoryConfig: {
                    show: false
                },
                docDateConfig: {
                    placeholder: '请选择单据日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                outWarhouseConfig: {
                    code: 'outWarehouseCode',
                    name: 'outWarehouseName'
                },
                inWarhouseConfig: {
                    code: 'inWarehouseCode',
                    name: 'inWarehouseName'
                },
                warnConfig: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                tableData: {
                    header: {
                        'docDate': '',
                        'outWarehouseCode': '',
                        'outWarehouseName': '',
                        'inWarehouseCode': '',
                        'inWarehouseName': '',
                        'remark': ''
                    },
                    dataList: []
                },
                defaultRow: {
                    inventoryId: '',
                    inventoryCode: '',
                    inventoryName: '',
                    inventorySpec: '',
                    quantity: '',
                    unitCode: '',
                    unitName: '',
                    conversionRate: '',
                    byQuantity: '',
                    byUnitCode: '',
                    byUnitName: ''
                },
                currentRow: 0,
            }
        },
        ready() {

        },
        methods: {
            copyParam(base, target) {
                let tk = Object.keys(target)
                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },
            calc(index, val, byVal) {
                if(!this.tableData.dataList[index].conversionRate) {
                    return;
                }

                var calcByQtyVo = {
                    code: 'quantity',
                    ident: 'multiply',
                    v1: val,
                    v2: this.tableData.dataList[index].conversionRate
                }
                var calcQtyVo = {
                    code: 'quantity',
                    ident: 'divide',
                    v1: byVal,
                    v2: this.tableData.dataList[index].conversionRate
                };
                if(this.tableData.dataList[index].byUnitCode != ''){
                    if(val != null){
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcByQtyVo).then( (res) => {
                            this.tableData.dataList[index].byQuantity = res.data.data;
                        });
                    }
                    if(byVal !=null){
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcQtyVo).then( (res) => {
                            this.tableData.dataList[index].quantity = res.data.data;
                        });
                    }
                }
            },
            addRow() {
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableData.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.tableData.dataList.length == 1) {
                    this.showWarnMsg('warning', '明细至少要有一行');
                } else {
                    this.tableData.dataList.splice(index, 1);
                }
            },
            doSelectInventory(index) {
                this.referInventoryConfig.show = true;
                this.currentRow = index;
            },
            doClearInventory(index) {
                let tk = Object.keys(this.defaultRow);
                for (let i in tk) {
                    var key = tk[i];
                    this.tableData.dataList[index][key] = '';
                }
            },
            doFillInventory(val) {
                this.copyParam(val, this.tableData.dataList[this.currentRow]);
                if(val.conversionRate == 0) {
                    this.tableData.dataList[this.currentRow].conversionRate = '';
                }
            },
            showWarnMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            save() {
                if(this.tableData.header.outWarehouseCode == this.tableData.header.inWarehouseCode) {
                    this.showWarnMsg('warning', '调出仓库不能与调入仓库相同');
                    return;
                }
                if(!this.lock) {
                    this.$http.post(__URL.warehouse + 'transfer/save', this.tableData).then( (res) => {
                        if(res.data.success) {
                            this.showWarnMsg('success', '保存成功');
                            this.$emit('refresh')
                        } else {
                            this.tableData.header.status = 2;
                            this.showWarnMsg('warning', res.data.errMsg);
                        }
                        this.lock = false;
                    });
                }
            },
            submitAudit() {
                this.tableData.header.status = 0;
                this.save();
            }
        }
    }
</script>
<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">调拨单</h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>调拨日期:</label>
                        <date-picker :config="docDateConfig" :date.sync="tableData.header.docDate"></date-picker>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>调出仓库:</label>
                        <refer-warehouse :data='tableData.header' :config="outWarhouseConfig"></refer-warehouse>

                        <label><span class="must-point">*</span>调入仓库:</label>
                        <refer-warehouse :data='tableData.header' :config="inWarhouseConfig"></refer-warehouse>
                    </div>
                </div>
                <div class="inner-item form-box">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='120' v-model="tableData.header.remark">
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
                                    <th width="20%">调拨数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='32' v-model="item.inventoryCode" placeholder="编码">
                                                <i class="icon-close__round r2" v-show='item.inventoryCode'
                                                   @click='doClearInventory($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                            </div>
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='64' v-model="item.inventoryName" placeholder="名称">
                                                <i class="icon-close__round r2" v-show='item.inventoryName'
                                                   @click='doClearInventory($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                            </div>
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='120' v-model="item.inventorySpec" placeholder="规格型号">
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="form-group">
                                            <input-number  @change="calc($index, item.quantity, null)"
                                                          :code.sync='item.quantity' placeholder="请输入数量"></input-number>
                </div>
                                    </td>
                                    <td>{{item.unitName}}</td>
                                    <td>{{item.conversionRate}}</td>
                                    <td>{{item.byUnitName}}</td>
                                    <td>{{item.byQuantity}}</td>
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
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
        <ajax-button class="btn-xl-imp" @click="save">保存</ajax-button>
        <ajax-button class="btn-xl-imp" @click="submitAudit">提交审核</ajax-button>
    </div>

    <!-- 参照货品 -->
    <refer-inventory :config="referInventoryConfig" @cb="doFillInventory"></refer-inventory>

    <!--警告-->
    <warning :config="warnConfig"></warning>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
    .form-group {
        width: 100%;
    }
</style>
