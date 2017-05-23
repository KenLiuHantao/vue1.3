<script>
    import cfg from './cfg'
    import referWarehouse from '../referWarehouse'

    export default {
        components: {
            referWarehouse,
        },
        props:['config'],
        data() {
            return {
                referWarsehouseConfig: {
                    'pageIndex': 0,
                    'pageSize': 0,
                    'warehouseCategoryCode': '',
                    'warehouseCode': '',
                    'warehouseName': ''
                },
                referInventoryConfig: {
                    show: false
                },
                modalCfg: {
                    show: true,
                    title: '新增期初库存结存单'
                },
                docDateConfig: {
                    placeholder: '请选择单据日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                msgConfig: {
                    show: false,
                    content: ''
                },
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                validShow: {
                    warehouseName: false,
                    docDate: false
                },
                errMsg:{
                    warehouse: ['仓库不能为空', '仓库不存在'],
                    docDate: '单据日期不能为空',
                    dataList: '明细不能为空',
                    inventory: '货品信息不完整',
                    quantity: ['数量不能为空', '数量必须大于0'],
                    byQuantity: ['辅数量不能为空', '辅数量必须大于0']
                },
                tableData: {
                    header: {
                        'docNo': '',
                        'warehouseCode': '',
                        'warehouseName': '',
                        'docDate': '',
                        'remark': ''
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
                    byUnitCode: '',
                    byUnitName: '',
                    quantity: '',
                    conversionRate: '',
                    byQuantity: ''
                },
                rowNum: 0,
                currentRow: 0,
            }
        },
        ready(){

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
                this.rowNum++;
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableData.dataList.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.tableData.dataList.length == 1) {
                    this.showMsg('warning','明细至少要有一行');
                    return;
                }
                this.tableData.dataList.splice(index, 1);
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
                    this.tableData.dataList[this.currentRow].conversionRate='';
                }
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            verifyParams() {
                if(this.tableData.header.warehouseName == '') {
                    this.showMsg('failure', this.errMsg.warehouse[0]);
                    return false;
                }
                if(this.tableData.header.warehouseCode == ''
                    && this.tableData.header.warehouseName != '') {
                        this.showMsg('failure', this.errMsg.warehouse[1]);
                    return false;
                }
                if(this.tableData.header.docDate == '') {
                    this.showMsg('failure', this.errMsg.docDate);
                    return false;
                }
                if(this.tableData.dataList.length == 0) {
                    this.showMsg('failure', this.errMsg.dataList);
                    return false;
                }
                for(var index in this.tableData.dataList){
                    let rowNum = parseInt(index)+1;
                    if(this.tableData.dataList[index].inventoryId == ''
                        || this.tableData.dataList[index].inventoryCode == ''
                        || this.tableData.dataList[index].inventoryName == '') {
                            this.showMsg('failure', '第' + rowNum + '行' + this.errMsg.inventory);
                        return false;
                    }
                    if(this.tableData.dataList[index].quantity == '') {
                        this.showMsg('failure', '第' + rowNum + '行' + this.errMsg.quantity[0]);
                        return false;
                    }
                    if(this.tableData.dataList[index].quantity <= 0) {
                        this.showMsg('failure', '第' + rowNum + '行' + this.errMsg.quantity[1]);
                        return false;
                    }
                    if(this.tableData.dataList[index].conversionRate > 0) {
                        if(this.tableData.dataList[index].byQuantity == '') {
                            this.showMsg('failure', '第' + rowNum + '行' + this.errMsg.byQuantity[0]);
                            return false;
                        }
                        if(this.tableData.dataList[index].byQuantity <= 0) {
                            this.showMsg('failure', '第' + rowNum + '行' + this.errMsg.byQuantity[1]);
                            return false;
                        }
                    }
                }
                return true;
            },
            saveData() {
                if(!this.verifyParams()){
                    return;
                }
                this.$http.post(__URL.warehouse + 'initial/inbound/save', this.tableData).then( (res) => {
                    this.msgConfig.content = res.data.errMsg;
                    this.msgConfig.show = true;
                    if(res.data.success) {
                        this.msgConfig.content='保存成功';
                        this.msgConfig.show=true;
                        this.$emit('refresh')
                    }
                });
            }
        }
    }

</script>
<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">期初库存结存单</h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>仓库:</label>
                        <refer-warehouse :data='tableData.header'></refer-warehouse>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>单据日期:</label>
                        <date-picker :config="docDateConfig" :date.sync="tableData.header.docDate"></date-picker>
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
                                    <th width="25%">货品信息</th>
                                    <th width="15%"><span class="must-point">*</span>数量</th>
                                    <th width="12%">单位</th>
                                    <th width="12%">换算率</th>
                                    <th width="12%">辅单位</th>
                                    <th width="15%">辅数量</th>
                                    <th></th>
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
                                        </div>
                                        <input type="text" maxlength='120' v-model="item.inventorySpec" placeholder="规格型号">
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
                                    <td>
                                        <div class="form-group">
                                            <input-number v-if="item.byUnitCode.length > 0"
                                                          @change="calc($index, null, item.byQuantity)"
                                                          :code.sync='item.byQuantity' placeholder="请输入件数"></input-number>
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
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
        <ajax-button class="btn-xl-imp" @click="saveData">保存</ajax-button>
    </div>

    <!-- 参照货品 -->
    <refer-inventory :config="referInventoryConfig" @cb="doFillInventory"></refer-inventory>

    <!--</inner>-->
    <message :config="msgConfig"></message>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
    .form-group {
        width: 100%;
    }
</style>
