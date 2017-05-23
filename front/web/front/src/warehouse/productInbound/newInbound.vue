<script>

    import referWarehouse from '../referWarehouse'

    export default {
        components: {
            referWarehouse
        },
        props: {
            checks: Array
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                docDateConfig: {
                    placeholder: '请选择入库日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                referMaterialEmployeeConfig: {
                    show: false
                },
                validShow: {
                    docDate: false,
                    warehouseName: false
                },
                tableData: {header:{},dataList:{}},
                lock: true
            }
        },
        ready() {
            let docNos = [];
            for (let i in this.checks) {
                docNos.push(this.checks[i]['docNo']);
            }
            this.$http.post(__URL.warehouse + 'product/receipt/query/selected', docNos).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
            });
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
            doSelectMaterialEmployee() {
                this.referMaterialEmployeeConfig.show = true;
            },
            doClearMaterialEmployee() {
                this.tableData.header.materialEmployeeCode = '';
                this.tableData.header.materialEmployeeName = '';
            },
            doFillMaterialEmployee(obj) {
                this.tableData.header.materialEmployeeCode = obj.employeeCode;
                this.tableData.header.materialEmployeeName = obj.employeeName;
                this.referMaterialEmployeeConfig.show = false;
            },
            save() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'product/inbound/save', this.tableData).then((res) => {
                        this.warnConfig.show = true;
                        this.warnConfig.type = 'success';
                        this.warnConfig.content = '保存成功';
                        if(!res.data.success) {
                            this.warnConfig.type = 'failure';
                            this.warnConfig.content = res.data.errMsg;
                        } else {
                            this.$emit('refresh');
                        }
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
            <h2 class="tag">成品入库单信息</h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>入库日期:</label>
                        <date-picker :config="docDateConfig" :date.sync='tableData.header.docDate'></date-picker>
                        <i class="error" v-show='validShow.docDate'>入库日期不能为空</i>
                    </div>
                    <div class="form-group">
                        <label>物料员:</label>
                        <div class="s-input ic2">
                            <input type="text" maxlength='32' v-model="tableData.header.materialEmployeeName" placeholder="物料员">
                            <i class="icon-close__round r2" v-show='tableData.header.materialEmployeeName' @click='doClearMaterialEmployee()'></i>
                            <i class="icon-search r1" @click='doSelectMaterialEmployee()'></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>仓库员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓库:</label>
                        <refer-warehouse :data='tableData.header'></refer-warehouse>
                        <i class="error" v-show='validShow.warehouseName'>仓库不能为空</i>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='120' v-model='tableData.header.remark'>
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
                                    <th width="10%">来源单号</th>
                                    <th width="10%">入库数量</th>
                                    <th width="10%">单位</th>
                                    <th width="10%">换算率</th>
                                    <th width="10%">辅单位</th>
                                    <th width="10%">辅数量</th>
                                    <th width="10%">销售单号</th>
                                    <th width="10%">客户单号</th>
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
                                    <td>{{ item.srcDocNo }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.conversionRate }}</td>
                                    <td>{{ item.byUnitName }}</td>
                                    <td>{{ item.byQuantity }}</td>
                                    <td>{{ item.salesOrderDocNo }}</td>
                                    <td>{{ item.customerDocNo }}</td>
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
        <button @click='save' class="btn-xl-imp">确定入库</button>
    </div>

    <!-- 物料员参照 -->
    <refer-employee :config="referMaterialEmployeeConfig" @cb="doFillMaterialEmployee"></refer-employee>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .text-left {
        text-align: left;
    }
</style>