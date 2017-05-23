<script>

    export default{
        data() {
            return{
                msg: 'hello vue',
                details: {
                    header: {
                        'docNo': '',
                        'warehouseCode': '',
                        'warehouseName': '',
                        'docDate': '',
                        'remark': ''
                    },
                    dataList: []
                },
            }
        },
        props: ['docno', 'config'],
        ready() {
            this.$http.get(__URL.warehouse + 'initial/inbound/get/'+this.docno).then((res) => {
                this.details = res.data.data;
            });
        },
        methods: {

        }
    }

</script>
<template :config="detailconfig">
    <div class="inner-wrapper" id="details">
        <div class="inner-content">
            <div class="cont">
                <h2 class="tag two-tag"><label>结存单信息</label><label class="ft-14">结存单号: {{ docno }}</label></h2>
                <div class="block">
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label>仓库:</label>
                            <p>{{details.header.warehouseName}}</p>
                        </div>
                        <div class="form-group">
                            <label>单据日期:</label>
                            <p>{{details.header.docDate}}</p>
                        </div>
                    </div>

                    <div class="inner-item">
                        <div class="form-group wd-100 align-items__baseline">
                            <label>备注:</label>
                            <p class="lh-20">{{details.header.remark}}</p>
                        </div>
                    </div>

                    <div class="inner-item">
                        <tab-container>
                            <tab-item>
                                <table class="inner-table">
                                    <thead>
                                    <tr>
                                        <th width="30px">序号</th>
                                        <th width="15%">货品信息</th>
                                        <th width="10%">数量</th>
                                        <th width="10%">单位</th>
                                        <th width="10%">换算率</th>
                                        <th width="10%">辅单位</th>
                                        <th width="15%">件数</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for='item in details.dataList'>
                                        <td>{{$index + 1}}</td>
                                        <td>
                                            <input type='hidden' v-model='item.inventoryId'>
                                            <div class="show-wrap">
                                                <p><label>货品编码:</label><label>{{item.inventoryCode}}</label></p>
                                                <p><label>货品名称:</label><label>{{item.inventoryName}}</label></p>
                                                <p><label>规格型号:</label><label>{{item.inventorySpec}}</label></p>
                                            </div>
                                        </td>
                                        <td>{{item.quantity}}</td>
                                        <td>{{item.unitName}}</td>
                                        <td>{{item.conversionRate == 0 ? '' : item.conversionRate}}</td>
                                        <td>{{item.byUnitName}}</td>
                                        <td>{{item.byQuantity == 0 ? '' : item.byQuantity}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </tab-item>
                        </tab-container>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
    </div>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>