<script>

    export default {
        props: {
            selectData: Object,
            showBtn: 0,
        },
        data() {
            return {
                tableData: {header:{},dataList:{}},
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                upfileGroupCfg: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png'
                },
            }
        },
        ready() {
            this.$http.get(__URL.warehouse + 'return/inbound/query/one/' + this.selectData.docNo, {}).then((res) => {
                this.tableData = res.data.data;
            });
        },
        methods: {
            cancel() {
                this.$emit('close');
            },
            save(){
                this.$http.post(__URL.warehouse + 'return/inbound/update/status', this.selectData).then((res) => {
                    if(!res.data.success) {
                        this.warnConfig.show = true;
                        this.warnConfig.type = 'warning';
                        this.warnConfig.content = res.data.errMsg;
                    } else {
                        this.warnConfig.show = true;
                        this.warnConfig.type = 'success';
                        this.warnConfig.content = '退货成功';
                        this.$emit('refresh');
                    }
                });

            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>退货单信息</label><label class="ft-14">退货单号: {{ selectData.docNo }}</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>供应商:</label>
                        <p class="orderData">{{ tableData.header.supplierName }}</p>
                    </div>
                    <div class="form-group">
                        <label>退货日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>退货人员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group wd-100 align-items__baseline">
                        <label>退货原因:</label>
                        <p class="orderData">{{ tableData.header.reason }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>退货图片:</label><i></i>
                        <!--<div class="fileGroup" v-for='img in tableData.header.images'>-->
                            <!--<a :href="img.url"><img width="32" height="32" :src="img.url" :alt="img.fileName" /></a>-->
                        <!--</div>-->
                        <upfile-group :config ='upfileGroupCfg' :edit="false" :data="tableData.header.images"></upfile-group>
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
                                    <td>{{ item.purchaseDocNo }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>单位:</label><label>{{item.unitName}}</label></p>
                                            <p><label>换算率:</label><label>{{item.conversionRate}}</label></p>
                                            <p><label>辅单位:</label><label>{{item.byUnitName}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.byQuantity }}</td>
                                    <td>{{ item.warehouseName }}</td>
                                    <td>{{ item.salesOrderDocNo }}</td>
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
        <button @click='cancel' class="btn-xl-def">关闭</button>
        <button v-if="showBtn == 1" @click='save' class="btn-xl-imp">确认退货</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>