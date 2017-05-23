<script>
    import cfg from './cfg'

    import referWarehouse from '../referWarehouseForTransfer'
    import moment from 'moment'

    export default {
        components: {
            referWarehouse
        },
        props: ['config'],
        data() {
            return {
                docDateConfig: {
                    placeholder: '请选择单据日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                referInventoryConfig: {
                    show: false
                },
                tableData: {
                    header: {
                        'docNo': '',
                        'docDate': '',
                        'remark': '',
                        'ioCategory': '1',
                        'warehouseCode': '',
                        'warehouseName': ''
                    },
                    dataList: []
                },
                warCfg: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                defaultRow: {
                    'inventoryId': '',
                    'inventoryCode': '',
                    'inventoryName': '',
                    'inventorySpec': '',
                    'unitCode': '',
                    'unitName': '',
                    'bookQuantity': '',
                    'firmQuantity': '',
                    'byUnitCode': '',
                    'byUnitName': '',
                    'conversionRate': '',
                    'byFirmQuantity': '',
                    'profitQuantity': '',
                    'profitType': 1,
                    'rowRemark': ''
                },
                warhouseConfig: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                },
                TypeListData:[{
                    name:"其他出库",
                    code:1
                }],
                currentRow: 0,
                lock: true
            }
        },
        ready() {
            this.lock = false;
            this.tableData.header.ioCategory = this.TypeListData[0].name;
            this.tableData.header.docDate =  moment(Date.parse(new Date)).format('YYYY-MM-DD');
        },
        methods: {
            calc(index, qty, byQty) {

                if(!this.tableData.dataList[index].conversionRate) {
                    return;
                }

                var calcByQtyVo = {
                    code: 'quantity',
                    ident: 'multiply',
                    v1: qty,
                    v2: this.tableData.dataList[index].conversionRate
                }
                var calcQtyVo = {
                    code: 'quantity',
                    ident: 'divide',
                    v1: byQty,
                    v2: this.tableData.dataList[index].conversionRate
                };
                if(this.tableData.dataList[index].byUnitCode != ''){
                    if(qty != null){
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcByQtyVo).then( (res) => {
                            this.tableData.dataList[index].byQuantity = res.data.data;
                    });
                    }
                    if(byQty != null){
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
                    this.showMsg('warning', '明细至少要有一行');
                } else {
                    this.tableData.dataList.splice(index, 1);
                }
            },
            doClearInventory(index) {
                let tk = Object.keys(this.defaultRow);
                for (let i in tk) {
                    var key = tk[i];
                    this.tableData.dataList[index][key] = '';
                }
            },
            doFillInventory(item) {
                for (let i = 0; i < this.tableData.dataList.length; i++) {
                    if (this.tableData.dataList[i].inventoryId == item.inventoryId) {
                        this.showMsg('warning', '序号' + (i + 1) + '已存在该货品')
                        return;
                    }
                }
                Object.assign(this.tableData.dataList[this.currentRow], item);
                this.tableData.dataList[this.currentRow].bookQuantity = 0;
                this.tableData.dataList[this.currentRow].firmQuantity = "";
                this.tableData.dataList[this.currentRow].takeStatus = 0;
                if (item.conversionRate == 0) {
                    this.tableData.dataList[this.currentRow].conversionRate = '';
                }
            },
            doSelectInventory(index) {
                this.referInventoryConfig.show = true;
                this.currentRow = index;
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            save() {
                this.tableData.header.status = 2;
                if(!this.lock) {
                    this.lock=true;
                    this.$http.post(__URL.warehouse + 'abnormal/outbound/save', this.tableData).then( (res) => {
                     if(res.data.success) {
                        this.showMsg('success', '保存成功');
                        this.$emit('refresh');
                    } else {
                        this.tableData.header.status = 2;
                        this.showMsg('warning', res.data.errMsg);
                        this.lock = false;
                    }
                });
                }
            },
            submitAudit() {
                let rowArr=this.tableData.dataList;
                for(var i=0;i<rowArr.length;i++){
                    if(rowArr[i].quality == ''){
                        this.showMsg('warning', '出库数量未完成');
                        return false;
                    }
                }

                this.tableData.header.status = 0;
                if(!this.lock) {
                    this.$http.post(__URL.warehouse + 'abnormal/outbound/save', this.tableData).then( (res) => {
                        if(res.data.success) {
                        this.showMsg('success', '已提交审核');
                        this.$emit('refresh')
                    } else {
                        this.tableData.header.status = 2;
                        this.showMsg('warning', res.data.errMsg);
                    }
                    this.lock = false;
                });
                }
            }
        }
    }
</script>

<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>新增非正常出库单</label><label></label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>收发类型:</label>
                        <select v-model='tableData.header.ioCategory'>
                            <option :value='item.name' v-for='item in TypeListData'>{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>出库日期:</label>
                        <date-picker :config="docDateConfig" :date.sync="tableData.header.docDate"></date-picker>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>仓库:</label>
                        <refer-warehouse :data='tableData.header' :config="warhouseConfig"></refer-warehouse>
                    </div>
                </div>
                <div class="inner-item">
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
                                    <th width="20%"><span class="must-point">*</span>货品信息</th>
                                    <th width="10%"><span class="must-point">*</span>出库数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                    <th width="90px">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableData.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="edit-check-wrap">
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='32' v-model="item.inventoryCode"
                                                       placeholder="编码" readonly>
                                                <i class="icon-close__round r2" v-show='item.inventoryCode'
                                                   @click='doClearInventory($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                            </div>
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='64' v-model="item.inventoryName"
                                                       placeholder="名称" readonly>
                                                <i class="icon-close__round r2" v-show='item.inventoryName'
                                                   @click='doClearInventory($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                            </div>
                                            <div class="s-input ic2 check-input">
                                                <input type="text" maxlength='120' v-model="item.inventorySpec"
                                                       placeholder="规格型号" readonly>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <input-number @change="calc($index, item.quantity, null)"
                                                      :code.sync='item.quantity' placeholder="请输入数量"></input-number>
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
    <warning :config="warCfg"></warning>

</template>