<script>
    import cfg from './cfg'
    export default {
        props: ['config', 'warehouse'],
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
                        'docNo':'',
                        'docDate': '',
                        'warehouseCode': '',
                        'warehouseName': '',
                        'employeeCode': '',
                        'employeeName': '',
                        'status': 2
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
                currentRow: 0,
                lock: true
            }
        },
        ready() {
            this.lock = false;
            if(this.warehouse){
                this.$http.post(__URL.warehouse + 'stock/take/material/create', {warehouseCode: this.warehouse}).then((res) => {
                    this.tableData = res.data.data;
                });
            }
        },
        methods: {
            calc(index, qty, byQty) {
                this.tableData.dataList[index].profitQuantity =  (qty*100000 - parseFloat(this.tableData.dataList[index].bookQuantity)*100000)/100000;
                this.tableData.dataList[index].takeStatus = 1;

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
                            this.tableData.dataList[index].byFirmQuantity = res.data.data;
                        });
                    }
                    if(byQty != null){
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcQtyVo).then( (res) => {
                            this.tableData.dataList[index].firmQuantity = res.data.data;
                        });
                    }
                }
            },
            addRow() {
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableData.dataList.push(tmpDefaultRow);
            },
            doClearInventory(index) {
                let tk = Object.keys(this.defaultRow);
                for (let i in tk) {
                    var key = tk[i];
                    this.tableData.dataList[index][key] = '';
                }
            },
            doFillInventory(item) {
                for(let i = 0; i < this.tableData.dataList.length; i++) {
                    if(this.tableData.dataList[i].inventoryId == item.inventoryId) {
                        this.showMsg('warning', '序号' + (i + 1) + '已存在该货品')
                        return;
                    }
                }
                Object.assign(this.tableData.dataList[this.currentRow], item);
                this.tableData.dataList[this.currentRow].bookQuantity = 0;
                this.tableData.dataList[this.currentRow].firmQuantity = "";
                this.tableData.dataList[this.currentRow].takeStatus = 0;
                if(item.conversionRate == 0) {
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
                    this.$http.post(__URL.warehouse + 'stock/take/material/save', this.tableData).then( (res) => {
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
                    if(rowArr[i].firmQuantity == ''){
                        this.showMsg('warning', '盘点项未完成');
                        return false;
                    }
                }

                this.tableData.header.status = 0;
                if(!this.lock) {
                    this.$http.post(__URL.warehouse + 'stock/take/material/save', this.tableData).then( (res) => {
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
                <h2 class="tag two-tag"><label>盘点单信息</label><label></label></h2>

                <div class="block">
                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label>仓库:</label>
                            <p class="orderData">{{ tableData.header.warehouseName }}</p>
                        </div>
                        <div class="form-group">
                            <label>仓管员:</label>
                            <p class="orderData">{{ tableData.header.employeeName }}</p>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>盘点日期:</label>
                            <date-picker :config="docDateConfig" :date.sync="tableData.header.docDate"></date-picker>
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
                                        <th width="7%">单位</th>
                                        <th width="8%">账面数量</th>
                                        <th width="12%"><span class="must-point">*</span>实盘数量</th>
                                        <th width="8%">辅单位</th>
                                        <th width="8%">换算率</th>
                                        <th width="8%">实盘辅数量</th>
                                        <th width="8%">盈亏数量</th>
                                        <th width="16%"><span class="must-point">*</span>盈亏类型</th>
                                        <th width="8%">备注</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(index,item) in tableData.dataList">
                                        <td>{{ $index+1 }}</td>
                                        <td>
                                            <div class="edit-check-wrap">
                                                <div class="s-input ic2 check-input">
                                                    <input type="text" maxlength='32' v-model="item.inventoryCode" placeholder="编码" readonly>
                                                    <i class="icon-close__round r2" v-show='item.inventoryCode'
                                                       @click='doClearInventory($index)'></i>
                                                    <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                                </div>
                                                <div class="s-input ic2 check-input">
                                                    <input type="text" maxlength='64' v-model="item.inventoryName" placeholder="名称" readonly>
                                                    <i class="icon-close__round r2" v-show='item.inventoryName'
                                                       @click='doClearInventory($index)'></i>
                                                    <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                                </div>
                                                <div class="s-input ic2 check-input">
                                                    <input type="text" maxlength='120' v-model="item.inventorySpec" placeholder="规格型号" readonly>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{{item.unitName}}</td>
                                        <td>{{item.bookQuantity}}</td>
                                        <td>
                                            <input-number  :code.sync='item.firmQuantity' @change="calc($index, item.firmQuantity, null)"
                                                           placeholder="请输实盘数量"></input-number>
                                        </td>
                                        <td>{{item.byUnitName}}</td>
                                        <td>{{item.conversionRate}}</td>
                                        <td>{{item.byFirmQuantity}}</td>
                                        <td>{{item.profitQuantity}}</td>
                                        <td>
                                            <select v-model='item.profitType'>
                                                <option :value='1'>入库单据未及时审核盘盈</option>
                                                <option :value='2'>出库单据未及时审核盘亏</option>
                                                <option :value='3'>出库单据重复录入盘盈</option>
                                                <option :value='4'>入库单据重复录入盘亏</option>
                                                <option :value='5'>供应商备品未入账盘盈</option>
                                                <option :value='6'>实物损毁盘亏</option>
                                                <option :value='7'>其他</option>
                                            </select>
                                        </td>
                                        <td>
                                            <textarea v-model='item.rowRemark' maxlength='120'></textarea>
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

<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>