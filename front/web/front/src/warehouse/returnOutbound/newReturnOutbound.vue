<script>

    export default {
        components: {
        },
        props:['datalist'],
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
                uCfg:{
                    limit: 6,
                },
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
                    purchaseDocNo: '',
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
        },
        methods: {
            showMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            addImages(file) {
                if(this.datalist.header.images.length >= 8) {
                    this.showMsg('failure', '最多上传8张图片');
                } else {
                    this.datalist.header.images.push(file);
                }
            },

            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'return/outbound/save', this.datalist).then((res) => {
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
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">退货信息</h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p>{{datalist.header.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p>{{datalist.header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>退货原因:</label>
                        <p>{{datalist.header.reason}}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <p>{{datalist.header.warehouseName}}</p>
                    </div>

                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>退货附件:</label><i></i>
                        <upfile-group :config ='uCfg' :data="datalist.header.images"></upfile-group>
                    </div>
                    <div class="form-group">
                        <label>备注:</label>
                        <p>{{datalist.header.remark}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class='inner-table'>
                                <thead>
                                <tr>
                                    <th width="5%">序号</th>
                                    <th width="10%">发货单号</th>
                                    <th width="10%">销售单号</th>
                                    <th width="10%">货品信息</th>
                                    <th width="10%">单位信息</th>
                                    <th width="10%">数量</th>
                                    <th width="10%">实退数量</th>
                                    <th width="10%">发货日期</th>
                                    <th width="10%">备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in datalist.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>{{item.dispatchDocNo}}</td>
                                    <td>{{item.salesOrderDocNo}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p class="line">{{item.inventoryCode}}</p>
                                            <p class="line">{{item.inventoryName}}</p>
                                            <p class="line">{{item.inventorySpec}}</p>
                                        </div>
                                    </td>
                                    <td>{{item.unitName}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p class="line">订单数:{{item.salesOrderDocQuantity}}</p>
                                            <p class="line">已发数:{{item.dispatchDocQuantity}}</p>
                                            <p class="line">退货:{{item.srcDocQuantity}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="red"><span>*</span></div>
                                        <input-number  placeholder="请输退货数量" :value="item.quantity">
                                        </input-number>
                                    </td>
                                    <td>{{item.dispatchDocDate}}</td>
                                    <td>{{item.rowRemark}}</td>
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
        <button @click='save' class="btn-xl-imp">确认退货</button>
    </div>

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
</style>