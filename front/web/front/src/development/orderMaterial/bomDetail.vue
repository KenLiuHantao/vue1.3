<script>
import cfg from './cfg'
import bom from 'nb/treeTable/app'
export default {
    components: {
        bom
    },
    props:['bomdetail','type','show'],
    data() {
        return {
            valiVal: '',
            flowCfg:{
                data:[{
                    no:'1',
                    name:'新增销售订单',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'2',
                    name:'BOM配置',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'3',
                    name:'BOM完善',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'4',
                    name:'审核销售订单',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false,
                },{
                    no:'5',
                    name:'完成',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false,
                }]
            },
            bomDetail:this.bomdetail,
            ajaxlock:true,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            tType:this.type,
            orderTaxCost:'',
            unitTaxCost:'',
            oldstatus:''
        }
    },
    methods: {
        cancel:function(){
            this.show.show = false
        },
        //保存草稿和审核的区别在于isAudit
        save:function(){
            var url;
            if(this.bomDetail.recordId=='' && this.bomDetail.docNo=='' && this.bomDetail.inventoryId==''){
                url='order/bom/add'
            }else{
                url='order/bom/update'
            }
            let param=this.bomDetail;
            this.oldstatus=this.bomDetail.workFlowStatus;
            param.workFlowStatus = 10;
            this.$http.post(__URL.dev+url,param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','保存成功')
                    }else{
                        this.bomDetail.workFlowStatus=this.oldstatus;
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        },
        submitAudit:function(){
            var url;
            if(this.bomDetail.recordId=='' && this.bomDetail.docNo=='' && this.bomDetail.inventoryId==''){
                url='order/bom/add'
            }else{
                url='order/bom/update'
            }
            let param=this.bomDetail;
            this.oldstatus=this.bomDetail.workFlowStatus;
            param.workFlowStatus = 20;
            this.$http.post(__URL.dev+url,param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','提交审核成功')
                    }else{
                        this.bomDetail.workFlowStatus=this.oldstatus;
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        },
        getTaxCost:function(docNo){

        }
    },
    ready(){
        this.getTaxCost(this.bomdetail.docNo)
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag">BOM信息</h2>
            <p class='bomNo ft-14'>订单BOM单号:<span>{{bomDetail.docNo}}</span></p>
            <div class="block">
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
                    <div class="form-group">
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
                    </div>
                </div>
                <div class=" inner-item">
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class='annexBox'>
                            <upfile-group :data='bomDetail.orderFiles' :edit="type==2"></upfile-group>
                        </div>

                    </div>
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <input type='text' v-show='type==2' maxlength=120 v-model='bomDetail.orderRemark'>
                        <p v-else class="lh-20">{{bomDetail.orderRemark}}</p>
                    </div>
                </div>
                <div class='bomTree'>
                    <bom :data.sync='bomDetail' :type='tType'></bom>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" v-if='type==2' @click='cancel'>取消</button>
        <button class="btn-xl-def" v-else @click='cancel'>关闭</button>
        <ajax-button class="btn-xl-imp" v-if='type==2' @click='save'>暂存</ajax-button>
        <ajax-button class="btn-xl-imp" v-if='type==2' @click='submitAudit'>提交审核</ajax-button>
    </div>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
/* 此处为自己定义的样式 */
@import '../../../../../public/css/variable.less';
.searchBox {
    display: flex;
    flex-wrap: wrap;
}
.bomTree{
    margin-top: 20px;
}
.inner-cont{
    position: relative;
}
.bomNo{
    display: inline-block;
    position: absolute;
    top: 16px;
    right: 15px;
}
.wait{
    width: 100%;
    height:300px;
    text-align: center;
    img{
        width: 140px;
        margin-top: 80px;
    }
}
.bomBottom{
    label,p{
        float: right;
        line-height: 28px;
        color:#757575;
        margin: 20px;
    }
    p{
        margin-left: 0;
    }
    label{
        margin-right: 10px;
    }
}
</style>
