<script>

    import referInbound from '../goodsInbound/refer'
    import moment from 'moment'

    export default {
        components: {
            referInbound
        },
        data() {
            return {
                tabConfig: {
                    type:'page',
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '退货单信息',
                        icon: 'icon-teamwork'
                    }]
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                docDateConfig: {
                    placeholder: '请选择退货日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                uploadFileConfig: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png'
                },
                upfileGroupCfg: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png'
                },
                upData:[],
                validShow: {
                    docDate: false,
                    warehouseName: false
                },
                referSupplierConfig: {
                    show: false
                },
                referEmployeeConfig: {
                    show: false
                },
                referInventoryConfig: {
                    show: false
                },
                referInboundConfig: {
                    show: false
                },
                tableData: {
                    header:{
                        'docNo': '',
                        'docDate': '',
                        'supplierCode': '',
                        'supplierName': '',
                        'employeeCode': '',
                        'employeeName': '',
                        'reason': '',
                        'images': []
                    },
                    dataList: []
                },
                defaultRow: {
                    inventoryId: '',
                    inventoryCode: '',
                    inventoryName: '',
                    inventorySpec: '',
                    srcDocNo: '',
                    unitCode: '',
                    unitName: '',
                    byUnitCode: '',
                    byUnitName: '',
                    quantity: '',
                    conversionRate: '',
                    byQuantity: '',
                    warehouseCode: '',
                    warehouseName: '',
                    salesOrderId: '',
                    salesOrderDocNo: ''
                },
                currentRow: 0,
                lock: true
            }
        },
        ready() {
            this.lock = false;
            this.tableData.header.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
        },
        methods: {
            showMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            addImages(file) {
                if(this.tableData.header.images.length >= 8) {
                    this.showMsg('failure', '最多上传8张图片');
                } else {
                    this.tableData.header.images.push(file);
                }
            },
            addImagesGroup(files) {
                if(this.tableData.header.images.length >= 8) {
                    this.showMsg('failure', '最多上传8张图片');
                } else {
                    this.tableData.header.images = files;
                    console.log(files)
                }
            },
            addRow() {
                this.rowNum++;
                var newRow = Object.assign({}, this.defaultRow);
                this.tableData.dataList.push(newRow);
            },
            delRow(index) {
                if (this.tableData.dataList.length == 1) {
                    this.showMsg('warning', '明细至少要有一行');
                } else {
                    this.tableData.dataList.splice(index, 1);
                }
            },
            doSelectSupplier() {
                this.referSupplierConfig.show = true;
            },
            doClearSupplier() {
                this.tableData.header.supplierCode = '';
                this.tableData.header.supplierName = '';

                for (let index in this.tableData.dataList) {
                    this.doClearInbound(index);
                }
            },
            doFillSupplier(obj) {
                if(this.tableData.header.supplierCode != obj.supplierCode) {
                    this.tableData.header.supplierCode = obj.supplierCode;
                    this.tableData.header.supplierName = obj.supplierName;

                    for (let index in this.tableData.dataList) {
                        this.doClearInbound(index);
                    }
                }
            },
            doSelectEmployee() {
                this.referEmployeeConfig.show = true;
            },
            doClearEmployee() {
                this.tableData.header.employeeCode = '';
                this.tableData.header.employeeName = '';
            },
            doFillEmployee(obj) {
                this.tableData.header.employeeCode = obj.employeeCode;
                this.tableData.header.employeeName = obj.employeeName;
                this.referEmployeeConfig.show = false;
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
            doFillInventory(obj) {
                Object.assign(this.tableData.dataList[this.currentRow], obj);
                if(obj.conversionRate == 0) {
                    this.tableData.dataList[this.currentRow].conversionRate = '';
                }
            },
            doSelectInbound(index) {
                this.referInboundConfig.show = true;
                this.currentRow = index;
            },
            doClearInbound(index) {
                let tk = Object.keys(this.defaultRow);
                for (let i in tk) {
                    var key = tk[i];
                    this.tableData.dataList[index][key] = '';
                }
            },
            doFillInbound(obj) {
                Object.assign(this.tableData.dataList[this.currentRow], obj);
                if(obj.conversionRate == 0) {
                    this.tableData.dataList[this.currentRow].conversionRate = '';
                }

                if(this.tableData.header.supplierCode != obj.supplierCode) {
                    this.tableData.header.supplierCode = obj.supplierCode;
                    this.tableData.header.supplierName = obj.supplierName;
                }
                if(this.tableData.header.srcDocType != obj .srcDocType){
                    this.tableData.header.srcDocType = obj .srcDocType;
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
                }
                if(!this.tableData.dataList[index].byUnitCode){
                    if(val != null) {
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcByQtyVo).then( (res) => {
                            this.tableData.dataList[index].byQuantity = res.data.data;
                        });
                    }
                    if(byVal != null){
                        this.$http.post(__URL.arc + 'parameter/digital/calculation', calcQtyVo).then( (res) => {
                            this.tableData.dataList[index].quantity = res.data.data;
                        });
                    }
                }
            },
            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'return/inbound/save', this.tableData).then((res) => {
                        if(!res.data.success) {
                            this.showMsg('failure', res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.showMsg('success', '保存成功');
                            this.$emit('refresh');
                        }
                    }, function(err) {
                        this.showMsg('failure', res.data.errMsg);
                        this.lock = false;
                    });
                }
            },
            cancel() {
                this.$emit('close');
            }
        },
        watch:{
            upData:{
                handler(val){
                    this.addImagesGroup(val)
                },
                deep:true
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">退货单信息</h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>供应商:</label>
                        <div class="s-input ic2">
                            <input type="text" maxlength='32' v-model="tableData.header.supplierName" placeholder="供应商">
                            <i class="icon-close__round r2" v-show='tableData.header.supplierName' @click='doClearSupplier()'></i>
                            <i class="icon-search r1" @click='doSelectSupplier()'></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>退货日期:</label>
                        <date-picker :config="docDateConfig" :date.sync='tableData.header.docDate'></date-picker>
                        <i class="error" v-show='validShow.docDate'>退收日期不能为空</i>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>退货人员:</label>
                        <div class="s-input ic2">
                            <input type="text" maxlength='32' v-model="tableData.header.employeeName" placeholder="退货人员">
                            <i class="icon-close__round r2" v-show='tableData.header.employeeName' @click='doClearEmployee()'></i>
                            <i class="icon-search r1" @click='doSelectEmployee()'></i>
                        </div>
                    </div>
                    <div class="form-group wd-100">
                        <label>退货原因:</label>
                        <input type="text" maxlength='120' v-model='tableData.header.reason'>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>退货图片:</label><i></i>
                        <!--<div class="fileGroup" v-for='img in tableData.header.images'>-->
                            <!--<a href="javascript:;"><img width="32" height="32" :src="img.baseUrl" :alt="img.fileName"/></a>-->
                        <!--</div>-->
                        <!--<upfile :config='uploadFileConfig' @cb='addImages'></upfile>-->
                        <upfile-group :config ='upfileGroupCfg' :edit="true" :data="upData"></upfile-group>
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
                                    <th width="20%">采购单号</th>
                                    <th width="10%">退货数量</th>
                                    <th width="20%">单位信息</th>
                                    <!-- <th width="10%">换算率</th> -->
                                    <!-- <th width="10%">辅单位</th> -->
                                    <th width="10%">辅数量</th>
                                    <th width="10%">仓库</th>
                                    <th width="10%">销售单号</th>
                                    <th width=80px>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <div class="s-input ic2">
                                                <div class="red"><span>*</span></div>
                                                <input type="text" maxlength='32' v-model="item.inventoryCode" placeholder="编码">
                                                <i class="icon-close__round r2" v-show='item.inventoryCode' @click='doClearInventory($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInventory($index)'></i>
                                            </div>
                                            <div class="s-input ic2">
                                                <div class="red"><span>*</span></div>
                                                <input type="text" maxlength='64' v-model="item.inventoryName" placeholder="名称" disabled>
                                            </div>
                                            <div class="s-input">
                                                <input type="text" maxlength='120' v-model="item.inventorySpec" placeholder="规格型号" disabled>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div class="s-input ic2">
                                                <div class="red"><span>*</span></div>
                                                <input type="text" maxlength='20' v-model="item.srcDocNo" placeholder="采购单号">
                                                <i class="icon-close__round r2" v-show='item.srcDocNo' @click='doClearInbound($index)'></i>
                                                <i class="icon-search r1" @click='doSelectInbound($index)'></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="red"><span>*</span></div>
                                        <input-number  placeholder="请输退货数量"
                                                      @change="calc($index, item.quantity, null)" :code.sync='item.quantity'>
                                        </input-number>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><div class="red"><span>*</span></div>单位: {{item.unitName}}</p>
                                            <p>换算率: {{item.conversionRate}}</p>
                                            <p>辅单位: {{item.byUnitName}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <input-number v-if="item.byUnitCode && item.byUnitCode.length" key="quantity" placeholder="请输入辅数量"
                                             @change="calc($index, null, item.byQuantity)" :code.sync='item.byQuantity'></input-number>
                                    </td>
                                    <td><div v-if="!!item.warehouseName" class="red"><span>*</span></div> {{ item.warehouseName }}</td>
                                    <td>{{ item.salesOrderDocNo }}</td>
                                    <td>
                                        <button class="button-danger" @click='delRow($index)'>删除</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="add-wrap">
                                <button @click="addRow"><i class="icon icon-product__add" ></i>&nbsp;加入货品</button>
                            </div>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button @click='cancel' class="btn-xl-def">取消</button>
        <button @click='save' class="btn-xl-imp">保存</button>
    </div>

    <!-- 供应商参照 -->
    <refer-supplier :config="referSupplierConfig" @cb="doFillSupplier"></refer-supplier>

    <!-- 人员参照 -->
    <refer-employee :config="referEmployeeConfig" @cb="doFillEmployee"></refer-employee>

    <!-- 存货参照 -->
    <refer-inventory :config="referInventoryConfig" @cb="doFillInventory"></refer-inventory>

    <!-- 入库单参照 -->
    <refer-inbound :config="referInboundConfig" :supplier-code.sync="tableData.header.supplierCode" @cb="doFillInbound"></refer-inbound>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .red {
        position: relative;
        > span {
            position: absolute;
            top: 2px;
            left: -10px;
        }
    }
    .show-wrap {
        .s-input {
            margin-bottom: 10px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
</style>