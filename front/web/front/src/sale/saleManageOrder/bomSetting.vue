<script>
import cfg from './cfg'
import bom from 'nb/treeTable/app'
export default {
    components: {
        bom
    },
    props: ['act','show','workflow'],
    data() {
        return {
            valiVal: '',
            flowCfg: {
                data: [{
                    no: '1',
                    name: '新增销售订单',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true,
                }, {
                    no: '2',
                    name: 'BOM配置',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true,
                }, {
                    no: '3',
                    name: 'BOM完善',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true,
                }, {
                    no: '4',
                    name: '审核销售订单',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true,
                }, {
                    no: '5',
                    name: '完成',
                    time: '',
                    filed: '',
                    user: '',
                    flag: false,
                }]
            },
            bomDetail: {},
            ajaxlock: true,
            msgconfig: {
                show: false,
                content: ''
            },
            tType: 1,

        }
    },
    methods: {
        cancel: function() {
            this.show.show = false
            this.$emit('refresh')
        },
        getData() {
            this.$http.get(__URL.dev + 'order/bom/get/header/' + this.act.recordId + '/30').then(
                (res) => {
                    if (res.data.success) {
                        let obj = res.data.data
                        if (!obj.children.length) {
                            obj.children.push(cfg.childrenItem)
                        }
                        this.bomDetail = obj;
                        this.flowCfg.data[this.workflow].flag = true;
                    }
                }
            )
        },
        edit(){
            this.tType = 2
        },
        save() {
            let param = this.bomDetail;
            let url = 'order/material/draft/add'
            if(param.docNo != null && param.docNo != ''){
                url = 'order/material/draft/update'
            }
            this.$http.post(__URL.dev + url, param).then(
                (res) => {
                    if (res.data.success) {
                        this.$emit('refresh', '保存成功')
                        this.bomDetail.docNo = res.data.data
                        this.tType = 1
                        this.msgconfig.show = true;
                        this.msgconfig.content = '保存成功';
                    } else {
                        this.msgconfig.show = true;
                        this.msgconfig.content = res.data.errMsg;
                    }
                }
            )
        },
    },
    ready() {
        this.getData();
    }
}

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">BOM信息</h2>

            <p class='bomNo ft-14' v-show="bomDetail.docNo != null && bomDetail.docNo != ''">
                订单BOM单号:<span>{{bomDetail.docNo}}</span></p>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>货品编码:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <p>{{bomDetail.inventoryCode}}</p>
                </div>
                <div class="form-group">
                    <label>货品名称:</label>
                    <p>{{bomDetail.inventoryName}}</p>
                </div>
                <div class="form-group">
                    <label>规格型号:</label>
                    <p>{{bomDetail.inventorySpec}}</p>
                </div>
                <!-- <div class="form-group">
                    <label>客户名称:</label>
                    <p>{{bomDetail.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>订单数量:</label>
                    <p>{{bomDetail.orderQuantity}}</p>
                </div>
                <div class="form-group">
                    <label>开发工程师:</label>
                    <p>{{bomDetail.developmentEmployeeName}}</p>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <p>{{bomDetail.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>订单编号:</label>
                    <p>{{bomDetail.saleDocNo}}</p>
                </div>-->
            </div>

            <!--<div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>附件:</label>
                    <div class='annexBox'>
                        <a class='img_item' v-for='imgitem in bomDetail.orderFiles' :href="imgitem.url?imgitem.url:'javascript:;'">
                            {{imgitem.fileName}}
                            &lt;!&ndash; <i @click='deleteImg($index)' class="icon-modal__close ml-5"></i> &ndash;&gt;
                        </a>
                        &lt;!&ndash; <upload @cb='success' :config="upfileCfg"></upload> &ndash;&gt;
                    </div>

                </div>
                <div class="form-group wd-100">
                    <label>备注:</label>
                    &lt;!&ndash; <input type="text" maxlength='120' v-model='newCustomer.remark'> &ndash;&gt;
                    <p class="lh-20">{{bomDetail.remark}}</p>
                </div>
            </div>-->

            <div class='mt-15'>
                <bom :data.sync='bomDetail' :type='tType'></bom>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>关闭</button>
        <!--<button class="btn-xl-imp"  @click='save' v-if="tType == 2">保存</button>
        <button class="btn-xl-imp"  @click='edit'  v-if="tType == 1">编辑</button>-->
    </div>
    <message :config="msgconfig"></message>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .bomNo {
        display: inline-block;
        position: absolute;
        top: 16px;
        right: 15px;
    }
</style>
