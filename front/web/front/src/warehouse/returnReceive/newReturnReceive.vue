<script>

    export default {
        props: {
            receiptdata: {header:{},dataList:[]}, docno: String,headerdata:{}
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                docDateConfig: {
                    placeholder: '请选择退收日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                validShow: {
                    docDate: false,
                    warehouseName: false
                },
                lock: true,
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
            save() {
                this.receiptdata.header.docDate = this.headerdata.docDate;
                this.receiptdata.header.employeeName = this.headerdata.employeeName;
                this.receiptdata.header.employeeCode =  this.headerdata.employeeCode;
                for(var i = 0;i< this.receiptdata.dataList.length;i++){
                    this.receiptdata.dataList[i].quantity = this.receiptdata.dataList[i].badQuantity;
                }

                this.$http.post(__URL.warehouse + 'return/receive/save', this.receiptdata).then((res) => {
                    this.warnConfig.show = true;
                    this.warnConfig.type = 'success';
                    this.warnConfig.content = '保存成功';
                    if (!res.data.success) {
                        this.warnConfig.type = 'failure';
                        this.warnConfig.content = res.data.errMsg;
                    } else {
                        this.$emit('refresh');
                    }
                    this.lock = false;
                });
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
            <h2 v-if="headerdata.srcDocType == 1" class="tag">采购退收单信息</h2>
            <h2 v-else class="tag">委外采购退收单信息</h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商:</label>
                        <p class="orderData">{{ receiptdata.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>退收日期:</label>
                        <date-picker :config="docDateConfig" :date.sync='headerdata.docDate'></date-picker>
                        <i class="error" v-show='validShow.docDate'>退收日期不能为空</i>
                    </div>
                    <div class="form-group">
                        <label>退收人员:</label>
                        <p class="orderData">{{ headerdata.employeeName }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='120' v-model='receiptdata.header.remark'>
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
                                    <th width="10%">采购单号</th>
                                    <th width="10%">退收数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in receiptdata.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                            <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ receiptdata.header.srcDocNo }}</td>
                                    <td>{{ item.badQuantity }}</td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.conversionRate }}</td>
                                    <td>{{ item.byUnitName }}</td>
                                    <td>{{ item.byQuantity }}</td>
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
        <button @click='save' class="btn-xl-imp">确认退收</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>