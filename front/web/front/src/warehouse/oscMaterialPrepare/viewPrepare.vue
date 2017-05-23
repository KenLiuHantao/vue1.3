<script>
    export default {
        props: {
            docno: String
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'warning',
                    content: '确认发料成功！'
                },
                tableData: {header:{},dataList:{}},
                lock: true
            }
        },
        ready() {
            this.$http.get(__URL.warehouse + 'osc/material/prepare/query/one/' + this.docno, {}).then((res) => {
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
            cancel() {
                this.$emit('close');
            },
            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.get(__URL.warehouse + 'osc/material/issue/save/' + this.docno, {}).then((res) => {
                        this.showMsg('success', '确认发料成功！');
                        if(!res.data.success) {
                            this.showMsg('failure', res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.$emit('refresh');
                        }
                    });
                }
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>委外备料单信息</label><label class="ft-14">委外备料单号: {{ docno }}</label></h2>
            <div class="block">
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>委外备料日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">{{ tableData.header.warehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label>备料员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>备料部门:</label>
                        <p class="orderData">{{ tableData.header.departmentName }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="orderData lh-20">{{ tableData.header.remark }}</p>
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
                                    <th width="10%">单位</th>
                                    <th width="10%">应发数量</th>
                                    <th width="10%">已发数量</th>
                                    <th width="10%">备料数量</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                    <th width="10%">委外订单号</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                        <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.issueQuantity }}</td>
                                    <td>{{ item.issuedQuantity }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>{{ item.conversionRate }}</td>
                                    <td>{{ item.byUnitName }}</td>
                                    <td>{{ item.byQuantity }}</td>
                                    <td>{{ item.oscOrderDocNo }}</td>
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
        <button @click='save' class="btn-xl-imp">确定发料</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>