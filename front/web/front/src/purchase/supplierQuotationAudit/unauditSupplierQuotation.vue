<script>
    export default {
        components: {

        },
        props: ['config', 'docno'],
        data() {
            return {uploadFileCfg: {
                extensions: 'bmp, gif, jpg, jpeg, pic, png',
                limit:6
            },
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
                warnConfig: {
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
                lock: true
            }
        },
        ready() {
            this.$http.get(__URL.purchase + 'supplier/quotation/query/one/' + this.docno).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
        },
        methods: {
            showMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            reject() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.purchase + 'supplier/quotation/reject', this.buildData()).then( (res) => {
                        if(res.data.success) {
                            this.$warning({'type':'success','message':'驳回成功'});
                            this.$emit('refresh')
                        } else {
                            this.$warning({'type':'warning','message':res.data.errMsg});
                        }
                        this.lock = false;
                    });
                }
            },
            audit() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.purchase + 'supplier/quotation/audit', this.buildData()).then( (res) => {
                        if(res.data.success) {
                            this.$warning({'type':'success','message':'审核成功'});
                            this.$emit('refresh')
                        } else {
                            this.$warning({'type':'warning','message':res.data.errMsg});
                        }
                        this.lock = false;
                    });
                }
            },
            buildData() {
                let reqData = {
                    docNo: this.tableData.header.docNo,
                    recordVersions: []
                }
                for(let i = 0; i < this.tableData.dataList.length; i++) {
                    let obj = this.tableData.dataList[i];
                    reqData.recordVersions.push({
                        recordId: obj.recordId,
                        recordVersion: obj.recordVersion
                    });
                }
                return reqData;
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
                                    <th width="5%">操作</th>
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
                                    <td></td>
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
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
        <ajax-button class="btn-xl-danger" @click="reject">驳回</ajax-button>
        <ajax-button class="btn-xl-imp" @click="audit">审核</ajax-button>
    </div>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
