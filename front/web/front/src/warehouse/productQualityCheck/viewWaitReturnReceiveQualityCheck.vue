<script>

    export default {
        props: {
            docno: String
        },
        data() {
            return {
            tableData: {header:{},dataList:{}},
            uploadFileConfig: {
                extensions: 'bmp, gif, jpg, jpeg, pic, png',
                limit:6
            }
        }
    },
    ready() {
        this.$http.get(__URL.warehouse +  'quality/check/query/one/'+this.docno+'/for/return/receive', {}).then((res) => {
            this.tableData = res.data.data;
    });
        },
        methods: {
            cancel() {
                this.$emit('close');
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>品质检验单信息</label><label class="ft-14">品质检验单号: {{ docno }}</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>采购单号:</label>
                        <p class="orderData">{{ tableData.header.purchaseDocNo }}</p>
                    </div>
                    <div class="form-group">
                        <label>品检日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                    <div class="form-group">
                        <label>品检员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
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
                                    <th width="5%">单位</th>
                                    <th width="10%">检验数量</th>
                                    <th width="10%">不良退收数量</th>
                                    <th width="10%">不良原因</th>
                                    <th width="15%">不良图片</th>
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
                                    <td>{{ item.quantity }}</td>
                                    <td>{{ item.badQuantity }}</td>
                                    <td>{{ item.reason }}</td>
                                    <td>
                                        <upfile-group :config='uploadFileConfig' :data="item.images" :edit="false"></upfile-group>
                                    </td>
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
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>