<script>
    import cfg from './cfg'
    export default {
        props:['docno','show'],
        data() {
            return {
               modalCfg: {
                    show: true,
                    title: '发货单'
                },
                tabConfig: {
                    select: 'contactsTab',
                    tabBarData: []
                },
                ugCfgTwo:{
                    limit:6,
                },
                //table数据模型
                tableModal:{
                    "salesOrderDocNo":"",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "unitName": "",
                    "salesOrderQuantity": 0,
                    "salesOrderQuantity": 0,
                    "quantity": 0,
                    "taxUnitPrice": 0,
                    "taxAmounts": 0,
                    "stockQuantity": 0,
                    "abledStockQty": 0,
                    "salesOrderDeliveryDate": "",
                    "rowRemark": "",
                    "customerOrderDocNo":"",
                },
                //页面数据模型
                infoModal:{
                    "dataList": [],
                    "header": {
                        "customerName": "",
                        "docNo": "",
                        "employeeName": "",
                        "currencyName": "",
                        "shippingUser": "",
                        "shippingAddress": "",
                        "attachmentVos":[],
                        "remark": "",
                    },
                }
            }
        },
        ready(){
            if(this.docno)this.getInfo()
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.sale + 'salesDispatch/findOne/'+this.docno).then(
                    res=>{
                        if(res.data.success){
                            this.infoModal = res.data.data
                        }
                    }
                )
            }

        }
    }

</script>
<template  :config='modalCfg'>
    <!--<button class="btn-lg-imp" @click='modal'>内页弹窗按钮</button>-->
    <!-- 弹框内置dom结构 -->
    <!--<inner :config='modalCfg'>-->
        <div class="inner-wrapper">
            <div class="inner-content">

                <h2 class="tag two-tag"><label>发货单信息</label><label class="ft-14">发货单号:{{infoModal.header.docNo}}</label></h2>

                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group fg-fix">
                        <label>客户:</label>
                        <p>
                            {{infoModal.header.customerName}}
                        </p>
                    </div>
                    <div class="form-group fg-fix">
                        <label>业务员:</label>
                        <p>
                        {{infoModal.header.employeeName}}
                        </p>
                    </div>
                    <div class="form-group fg-fix">
                        <label>币种:</label>
                        <p>
                        {{infoModal.header.currencyName}}
                        </p>
                    </div>
                    <div class="form-group fg-fix">
                        <label>收货人:</label>
                        <p>
                         {{infoModal.header.shippingUser}}
                        </p>
                    </div>
                    <div class="form-group fg-fix">
                        <label>收货地址:</label>
                        <p>
                            {{infoModal.header.shippingAddress}}
                        </p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100 fg-fix">
                        <label>发货附件:</label>
                        <upfile-group :config="ugCfgTwo" :data='infoModal.header.attachmentVos'></upfile-group>
                    </div>
                    <div class="form-group wd-100 fg-fix">
                        <label>备注:</label>
                        <p class="lh-20">{{infoModal.header.remark}}</p>
                    </div>
                </div>
                <div class="inner-item">
                    <!--<tabbar :config.sync='tabConfig'></tabbar>-->
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='contactsTab'>
                            <table class="inner-table mt-15 it-fix">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="10%">销售单号</th>
                                    <th width="20%">货品信息</th>
                                    <th width="5%">单位</th>
                                    <th width="15%">数量</th>
                                    <th width="10%">价格</th>
                                    <th width="10%">库存</th>
                                    <th width="10%">交期</th>
                                    <th width="20%">行备注</th>
                                    <th width="10%">客户订单</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in infoModal.dataList">
                                    <td>{{ $index+1 }}</td>
                                    <td>{{ item.salesOrderDocNo }}</td>
                                    <td class="text-left">
                                        <p>编码:  {{item.inventoryCode}}</p>
                                        <p>名称:  {{item.inventoryName}}</p>
                                        <p>规格型号:    {{item.inventorySpec}}</p>
                                    </td>
                                    <td>
                                        {{ item.unitName }}
                                    </td>
                                    <td class="text-left">
                                        <p>订单数量:     {{ item.salesOrderQuantity }}</p>
                                        <p>未发货:     {{ item.salesOrderQuantity - item.quantity}} </p>
                                        <p>发货数量:     {{ item.quantity }}</p>
                                    </td>
                                    <td class="text-left">
                                        <p>{{ item.taxUnitPrice }}</p>
                                        <p>{{ item.taxAmounts }}</p>
                                    </td>
                                    <td class="text-left">
                                        <p> 即时库存:   {{ item.stockQuantity }}</p>
                                        <p> 可用库存:   {{ item.abledStockQty }}</p>
                                    </td>
                                    <td>
                                        <p>{{ item.salesOrderDeliveryDate }}</p>
                                    </td>
                                    <td class="text-left">
                                        <p class="lh-20">{{ item.rowRemark }}</p>
                                    </td>
                                    <td>
                                        <p>{{ item.customerOrderDocNo }}</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>

        <div class="inner-footer">
            <button class="btn-xl-def" @click="this.show=false">关闭</button>
        </div>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
