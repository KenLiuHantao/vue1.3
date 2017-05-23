<script>
    export default {
        props: {
            selected: Object
        },
        data() {
            return {
                uploadFileCfg: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png',
                    limit:6
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '备货成功'
                },
                tableData: {},
                lock: true
            }
        },
        ready() {
            this.$http.post(__URL.warehouse + 'outbound/query/one', this.selected).then((res) => {
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

                    this.$http.post(__URL.warehouse + 'outbound/save', this.tableData.dataList).then((res) => {
                        this.showMsg('success', '备货成功');
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
            
                <h2 class="tag two-tag"><label>发货单信息</label><label class="ft-14">发货单号: {{ tableData.header.docNo }}</label></h2>
                <div class="block">
                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label>客户:</label>
                            <p class="orderData">{{ tableData.header.customerName }}</p>
                        </div>
                        <div class="form-group">
                            <label>业务员:</label>
                            <p class="orderData">{{ tableData.header.employeeName }}</p>
                        </div>
                        <div class="form-group">
                            <label>币种:</label>
                            <p class="orderData">{{ tableData.header.currencyName }}</p>
                        </div>
                        <div class="form-group">
                            <label>收货人:</label>
                            <p class="orderData">{{ tableData.header.receiverName }}</p>
                        </div>
                        <div class="form-group">
                            <label>收货地址:</label>
                            <p class="orderData">{{ tableData.header.address }}</p>
                        </div>
                    </div>

                    <div class="inner-item form-box">
                        <div class="form-group wd-100">
                            <label>附件:</label><i></i>
                            <upfile-group :config='uploadFileCfg' :data='tableData.header.images' :edit="false"></upfile-group>
                        </div>
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
                                        <th width="12%">销售单号</th>
                                        <th width="12%">货品信息</th>
                                        <th width="5%">单位</th>
                                        <th width="13%">数量</th>
                                        <th width="10%">价格</th>
                                        <th width="13%">库存</th>
                                        <th width="10%">交期</th>
                                        <th width="10%">行备注</th>
                                        <th width="10%">客户订单号</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for='item in tableData.dataList'>
                                        <td>{{$index + 1}}</td>
                                        <td>{{ item.salesOrderDocNo }}</td>
                                        <td>
                                            <div class="show-wrap">
                                            <p><label>编码: </label><label>{{item.inventoryCode}}</label></p>
                                            <p><label>名称: </label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号: </label><label>{{item.inventorySpec}}</label></p>
                                            </div>
                                        </td>
                                        <td>{{ item.unitName }}</td>
                                        <td>
                                            <div class="show-wrap">
                                                <p><label>订单数量: </label><label>{{item.quantity}}</label></p>
                                                <p><label>未发货数量: </label><label>{{item.totalUnOutboundQuantity}}</label></p>
                                                <p><label>发货数量: </label><label>{{item.totalOutboundQuantity}}</label></p>
                                            </div>
                                        </td>
                                        <td>
                                            {{ item.price }}
                                            {{ item.amounts }}
                                        </td>
                                        <td>
                                            <p>即时库存:{{ item.stockRealQuantity }}</p>
                                            <p>可用库存:{{ item.stockAvailableQuantity }}</p>
                                        </td>
                                        <td>{{ item.deliveryDate }}</td>
                                        <td>{{ item.remark }}</td>
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
        <button @click='save' class="btn-xl-imp">确定备货</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>