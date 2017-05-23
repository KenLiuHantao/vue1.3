<script>
import cfg from './cfg'
import bom from 'nb/treeTable/app'
export default {
    components: {
        bom
    },
    props: ['act','show','docstatus'],
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
                    flag: false,
                }, {
                    no: '4',
                    name: '审核销售订单',
                    time: '',
                    filed: '',
                    user: '',
                    flag: false,
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
                content: '',
                type:'failure'
            },
            tType: 0,

        }
    },
    methods: {
        cancel: function() {
            this.show.show = false
        },
        getData() {
            this.$http.get(__URL.dev + 'order/bom/get/header/' + this.act.recordId + '/10', {}).then(
                (res) => {
                    if (res.data.success) {
                        let obj = res.data.data;
                        this.bomDetail = obj;
                        if(this.bomDetail.workFlowStatus > 10){
                            this.tType = 1
                        }
                    }else{
                        this.msgconfig.show = true;
                        this.msgconfig.content = res.data.errMsg;
                    }
                }
            )
        },
        edit(){
            this.tType = 2
        },
        save() {
            let param = this.bomDetail;
            let url = 'order/bom/draft/add'
            if(param.docNo != null && param.docNo != ''){
                url = 'order/bom/draft/update'
            }
            this.$http.post(__URL.dev + url, param).then(
                (res) => {
                    if (res.data.success) {
                        this.$emit('refresh', '保存成功')
                        this.bomDetail.docNo = res.data.data
                        this.tType = 1
                    } else {
                        this.msgconfig.show = true;
                        this.msgconfig.content = res.data.errMsg;
                    }
                }
            )
        },
        audit:function(){
            var url;
            if(this.bomDetail.recordId=='' && this.bomDetail.docNo=='' && this.bomDetail.inventoryId==''){
                url='order/bom/add'
            }else{
                url='order/bom/update'
            }
            let param=this.bomDetail;
            this.oldstatus=this.bomDetail.workFlowStatus;
            param.workFlowStatus = 30;
            this.$http.post(__URL.dev+url,param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','审核成功')
                    }else{
                        this.bomDetail.workFlowStatus=this.oldstatus;
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        }
    },
    ready() {
        this.getData();
    }
}

</script>
<template>
    <div class="inner-wrapper">
        <!-- <workflow :config="flowCfg"></workflow> -->
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
            </div>
            <div class='bomTree'>
                <bom :data.sync='bomDetail' :type='tType' fromsale='true' :docstatus='docstatus'></bom>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" v-show='(bomDetail.workFlowStatus == 10 && docstatus != -1) || bomDetail.workFlowStatus == 20' @click='cancel'>取消</button>
        <button class="btn-xl-def" v-show='docstatus == -1' @click='cancel'>关闭</button>
        <ajax-button class="btn-xl-imp" @click='save' v-show="bomDetail.workFlowStatus == 10 && docstatus != -1">保存</ajax-button>
        <ajax-button class="btn-xl-imp" @click='audit' v-show="bomDetail.workFlowStatus == 20">审核</ajax-button>
    </div>
    <warning :config="msgconfig"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';

    .bomTree {
        margin-top: 20px;
    }

    .bomNo {
        display: inline-block;
        position: absolute;
        top: 16px;
        right: 15px;
    }

    .wait {
        width: 100%;
        height: 300px;
        text-align: center;
        img {
            width: 140px;
            margin-top: 80px;
        }
    }
</style>
